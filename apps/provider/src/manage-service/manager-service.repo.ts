import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { isNotFoundPrismaError } from "libs/common/helpers"
import { OrderByType, SortBy, SortByType } from "libs/common/src/constants/others.constant"
import { RoleName } from "libs/common/src/constants/role.constant"
import { UnauthorizedAccessException } from "libs/common/src/errors/share-auth.error"
import { ServiceProviderNotFoundException } from "libs/common/src/errors/share-provider.error"
import { ServiceNotFoundException } from "libs/common/src/errors/share-service.error"
import { RoleType } from "libs/common/src/models/shared-role.model"
import { ServiceType } from "libs/common/src/models/shared-services.model"
import { UpdateServiceBodyType } from "libs/common/src/request-response-type/service/services.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageServicesRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async createServiceItem() {

    }
    async createService(service: ServiceType & { categoryId: number } & { serviceItemsId?: number[] }, userId: number, providerId: number) {

        const createdService = await this.prismaService.service.create({
            data: {
                ...service,
                providerId: providerId,
                createdById: userId,
                updatedById: userId,

            }
        })
        if (service.serviceItemsId && service.serviceItemsId.length > 0) {
            await this.prismaService.service_ServiceItems.createMany({
                data: service.serviceItemsId.map((itemId) => ({
                    serviceId: createdService.id,
                    serviceItemId: itemId,
                })),
            });
        }
        return
    }
    async listForProvider({
        limit,
        page,
        name,
        categories,
        minPrice,
        maxPrice,
        isPublic,
        orderBy,
        sortBy,
        providerId
    }: {
        limit: number
        page: number
        name?: string
        categories?: number[]
        minPrice?: number
        maxPrice?: number
        isPublic?: boolean
        orderBy: OrderByType
        sortBy: SortByType, providerId: number
    }) {
        const skip = (page - 1) * limit
        const take = limit
        let where: Prisma.ServiceWhereInput = {
            deletedAt: null,
            providerId
        }
        if (isPublic === true) {
            where.publishedAt = {
                lte: new Date(),
                not: null,
            }
        } else if (isPublic === false) {
            where = {
                ...where,
                OR: [{ publishedAt: null }, { publishedAt: { gt: new Date() } }],
            }
        }
        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            }
        }

        if (categories && categories.length > 0) {
            where.categoryId = {
                in: categories
            }
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.virtualPrice = {
                gte: minPrice,
                lte: maxPrice,
            }
        }

        let caculatedOrderBy: Prisma.ServiceOrderByWithRelationInput | Prisma.ServiceOrderByWithRelationInput[] = {
            createdAt: orderBy,

        }
        if (sortBy === SortBy.Price) {
            caculatedOrderBy = {
                basePrice: orderBy,
            }
        } else if (sortBy === SortBy.Discount) {
            caculatedOrderBy = {

                virtualPrice: orderBy
            }
        }
        const [totalItems, data] = await Promise.all([
            this.prismaService.service.count({
                where,
            }),
            this.prismaService.service.findMany({
                where,

                include: {
                    // translations: {
                    //     where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
                    // },
                    Category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }, Service_ServiceItems: {
                        include: {
                            ServiceItem: true

                        }
                    }
                },
                orderBy: caculatedOrderBy,
                skip,
                take,
            }),
        ])
        const newData = data.map(({ Category, ...rest }) => ({
            ...rest, Category: {
                ...Category,
                items: rest.Service_ServiceItems.map(({ ServiceItem }) => ({ ...ServiceItem }))
            }
        }))

        return {
            data: newData,
            totalItems,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
        }
    }


    async updateServices(data: UpdateServiceBodyType, userId: number) {
        const { categoryId, id, serviceItemsId, ...rest } = data;

        return await this.prismaService.$transaction(async (tx) => {
            const updatedService = await tx.service.update({
                where: { id },
                data: {
                    ...rest,
                    updatedById: userId,
                    categoryId,
                },
            });

            await tx.service_ServiceItems.deleteMany({
                where: { serviceId: id },
            });

            if (serviceItemsId && serviceItemsId.length > 0) {
                await tx.service_ServiceItems.createMany({
                    data: serviceItemsId.map((itemId) => ({
                        serviceId: id,
                        serviceItemId: itemId,
                    })),
                });
            }

            return updatedService;
        });
    }
    async serviceBelongProvider(serviceId: number, providerId: number, roleName: Pick<RoleType, "id" | "name">[]) {
        const service = await this.prismaService.service.findUnique({
            where: { id: serviceId },
            select: { providerId: true },
        });

        if (!service) {
            throw ServiceProviderNotFoundException;
        }

        if (service.providerId !== providerId && roleName.every((item) => item.name !== RoleName.Admin)) {

            throw UnauthorizedAccessException
        }
    }
    async deleteService(serviceId: number, userId: number) {
        return await this.prismaService.service.update({
            where: {
                id: serviceId
            },
            data: {
                deletedAt: new Date(),
                deletedById: userId
            }
        })
    }

    async getServiceDetailForProvider(serviceId: number): Promise<ServiceType> {
        try {
            const data = await this.prismaService.service.findFirstOrThrow({
                where: {
                    id: serviceId,
                    deletedAt: null
                },
                select: {
                    name: true,
                    basePrice: true,
                    virtualPrice: true,
                    images: true,
                    durationMinutes: true,
                    publishedAt: true,
                    Service_ServiceItems: {
                        select: {
                            ServiceItem: true
                        }
                    },
                    Category: {
                        select: {
                            logo: true,
                            name: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true


                }
            })
            const { Category, ...rest } = data
            const newData = {
                ...rest, category: {
                    ...Category
                }, items: rest.Service_ServiceItems.map(({ ServiceItem }) => ({ ...ServiceItem }))
            }
            return newData as ServiceType
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw ServiceNotFoundException
            }
            return error
        }

    }
}