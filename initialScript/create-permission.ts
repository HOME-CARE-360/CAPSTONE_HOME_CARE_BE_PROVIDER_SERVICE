import { NestFactory } from '@nestjs/core'

import { ProviderModule } from 'apps/provider/src/providers.module'
import { HTTPMethod, RoleName } from 'libs/common/src/constants/role.constant'
import { PrismaService } from 'libs/common/src/services/prisma.service'


async function bootstrap() {
    const app = await NestFactory.create(ProviderModule)
    await app.listen(0)     // chỉ cần khởi để đọc router, port nào cũng được

    const prisma = new PrismaService()

    // 1) Đọc tất cả route của Nest
    const server = app.getHttpAdapter().getInstance()
    type RouteInfo = { path: string; method: keyof typeof HTTPMethod; module: string; name: string }
    const routes: RouteInfo[] = server.router.stack
        .map((layer: any) => {
            if (!layer.route) return
            const path = layer.route.path
            const method = layer.route.stack[0].method.toUpperCase() as keyof typeof HTTPMethod
            const moduleName = (path.split('/')[1] || '').toUpperCase()
            return { path, method, module: moduleName, name: `${method} ${path}` }
        })
        .filter(Boolean) as RouteInfo[]

    // 2) Sync lên bảng permission
    const existing = await prisma.permission.findMany({ where: { deletedAt: null } })
    const key = (r: { method: string; path: string }) => `${r.method}-${r.path}`
    const existMap = new Map(existing.map(p => [key(p), p]))
    const routeMap = new Map(routes.map(r => [key(r), r]))

    // xóa những permission không còn route
    const toDelete = existing.filter(p => !routeMap.has(key(p)))
    if (toDelete.length) {
        await prisma.permission.deleteMany({ where: { id: { in: toDelete.map(p => p.id) } } })
        console.log(`🗑 Deleted permissions: ${toDelete.length}`)
    }

    // thêm route mới vào permission
    const toAdd = routes.filter(r => !existMap.has(key(r)))
    if (toAdd.length) {
        await prisma.permission.createMany({
            data: toAdd.map(r => ({
                method: r.method,
                path: r.path,
                name: r.name,
                module: r.module,
            })),
            skipDuplicates: true,
        })
        console.log(`✅ Added permissions: ${toAdd.length}`)
    }

    // 3) Lấy lại tất cả permission sau sync
    const allPerms = await prisma.permission.findMany({ where: { deletedAt: null } })

    // 4) Định nghĩa module cho từng role
    const AdminModules: string[] = []  // mảng rỗng = cấp hết
    const CustomerModules = [
        'AUTH', 'SERVICES', 'SERVICEPACKAGES',
        'BOOKINGS', 'CHATMESSAGES', 'REWARDS',
        'PACKAGERECOMMENDATIONS', 'CUSTOMERPROFILE'
    ]
    const ServiceProviderModules = [
        'AUTH', 'SERVICES', 'BOOKINGS',
        'SCHEDULE', 'STAFFSCHEDULECATEGORY',
        'CHATMESSAGES', 'REWARDS', "WORK_SHIFT_TEMPLATE"
    ]
    const StaffModules = [
        'AUTH', 'SCHEDULE', 'STAFF',
        'CHATMESSAGES'
    ]

    // helper lọc permission theo module list
    function pick(mods: string[]) {
        if (mods.length === 0) {
            return allPerms.map(p => ({ id: p.id }))
        }
        return allPerms
            .filter(p => mods.includes(p.module as string))
            .map(p => ({ id: p.id }))
    }

    // 5) Cập nhật từng role
    await Promise.all([
        updateRole(RoleName.Admin, pick(AdminModules), prisma),
        updateRole(RoleName.Customer, pick(CustomerModules), prisma),
        updateRole(RoleName.ServiceProvider, pick(ServiceProviderModules), prisma),
        updateRole(RoleName.Staff, pick(StaffModules), prisma),
    ])

    console.log('🔐 Permissions have been assigned to all roles.')
    process.exit(0)
}

async function updateRole(
    roleName: string,
    perms: { id: number }[],
    prisma: PrismaService
) {
    const role = await prisma.role.findFirstOrThrow({
        where: { name: roleName, deletedAt: null },
    })
    await prisma.role.update({
        where: { id: role.id },
        data: { permissions: { set: perms } },
    })
    console.log(`  - Role ${roleName}: ${perms.length} permissions`)
}

bootstrap()
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
