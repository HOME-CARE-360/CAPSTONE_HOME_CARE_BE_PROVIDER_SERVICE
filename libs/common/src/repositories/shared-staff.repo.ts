import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { CreateStaffBodyType, GetStaffsQueryType } from "../request-response-type/provider/manage-staff/manage-staff.model";
import { SharedUserRepository } from "./shared-user.repo";

import { SharedRoleRepository } from "./shared-role.repo";
import { Prisma } from "@prisma/client";
import { HashingService } from "../services/hashing.service";
@Injectable()
export class ShareStaffRepository {
    constructor(private readonly prismaService: PrismaService, private readonly shareUser: SharedUserRepository, private readonly rolesService: SharedRoleRepository, private readonly hashingService: HashingService) { }
    async findUniqueStaffAndBelongToProvider(id: number, providerId: number) {
        return await this.prismaService.staff.findUnique({
            where: {
                id: id,
                providerId
            }
        })
    }
    async createStaff(providerID: number, body: Omit<CreateStaffBodyType, "confirmPassword">) {
        const { categoryIds, ...staff } = body
        const staffRole = await this.rolesService.getStaffRoleId()
        const hashedPassword = await this.hashingService.hash(body.password)

        const user = await this.shareUser.createUserIncludeRole({
            ...staff, roles: [staffRole], password: hashedPassword
        })

        await this.prismaService.$transaction(async (tx) => {


            const staffDb = await tx.staff.create({
                data: {
                    userId: user.id,
                    providerId: providerID,
                },

            })
            await tx.staffCategory.createMany({
                data: categoryIds.map((categoryId) => ({
                    staffId: staffDb.id,
                    categoryId,
                })),
            })
        })
        console.log("hi");

        return {
            message: "Create staff successfully"
        }

    }
    async listStaff({
        limit,
        page,
        name,
        categories,
        isActive,
        orderBy,
    }: GetStaffsQueryType, providerID: number) {
        const skip = (page - 1) * limit
        const take = limit
        const where: Prisma.StaffWhereInput = {
            providerId: providerID
        }
        if (isActive) {
            where.isActive = isActive
        }
        if (name) {
            where.user!.name = {
                contains: name,
                mode: 'insensitive',
            }
        }

        if (categories && categories.length > 0) {
            where.staffCategories = {
                some: {
                    categoryId: {
                        in: categories,
                    },
                },
            }
        }


        const caculatedOrderBy: Prisma.StaffOrderByWithRelationInput = {
            createdAt: orderBy,

        }
        console.log(where);

        const [totalItems, data] = await Promise.all([
            this.prismaService.staff.count({
                where,
            }),
            this.prismaService.staff.findMany({
                where,

                include: {
                    // translations: {
                    //     where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
                    // },
                    staffCategories: {
                        include: {
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            avatar: true,
                            email: true,
                            phone: true,
                            createdAt: true,
                            name: true,
                        }
                    }
                },
                orderBy: caculatedOrderBy,
                skip,
                take,
            }),
        ])
        return {
            data,
            totalItems,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
        }
    }

}