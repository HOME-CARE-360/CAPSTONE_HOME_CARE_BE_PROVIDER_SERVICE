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
import { CreateServiceItemType, GetServiceItemsQueryType } from "libs/common/src/request-response-type/service-item/service-item.model"
import { UpdateServiceBodyType } from "libs/common/src/request-response-type/service/services.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageServicesRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async createServiceItem(data: CreateServiceItemType, providerID: number) {
        return await this.prismaService.serviceItem.create({
            data: {
                ...data,

                providerId: providerID
            }
        })
    }
    async createService(service: ServiceType & { categoryId: number } & { serviceItemsId?: number[] }, userId: number, providerId: number) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { serviceItemsId, ...rest } = service
        const createdService = await this.prismaService.service.create({
            data: {
                ...rest,
                providerId: providerId,
                createdById: userId,
                updatedById: userId,


            }
        })
        console.log(service.serviceItemsId);

        console.log(createdService);

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
                    category: {
                        select: {
                            id: true,
                            name: true,

                        }
                    },
                    attachedItems: {
                        include: {
                            serviceItem: true
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

    async getListServiceItem({
        limit,
        page,
        name,
        isActive,
        minPrice,
        maxPrice,

        orderBy,
        sortBy,
    }: GetServiceItemsQueryType, providerId: number) {
        const skip = (page - 1) * limit
        const take = limit
        const where: Prisma.ServiceItemWhereInput = {
            deletedAt: null,
            providerId
        }
        if (isActive === true) {
            where.isActive = true
        } else if (isActive === false) {
            where.isActive = false
        }
        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            }
        }


        if (minPrice !== undefined || maxPrice !== undefined) {
            where.unitPrice = {
                gte: minPrice,
                lte: maxPrice,
            }
        }

        let caculatedOrderBy: Prisma.ServiceItemOrderByWithRelationInput | Prisma.ServiceItemOrderByWithRelationInput[] = {
            createdAt: orderBy,

        }
        if (sortBy === SortBy.Price) {
            caculatedOrderBy = {
                unitPrice: orderBy,
            }
        }
        const [totalItems, data] = await Promise.all([
            this.prismaService.serviceItem.count({
                where,
            }),
            this.prismaService.serviceItem.findMany({
                where

                ,
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
                    attachedItems: {
                        select: {
                            serviceItem: true
                        }
                    },
                    category: {
                        select: {
                            logo: true,
                            name: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true


                }
            })
            return data
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw ServiceNotFoundException
            }
            return error
        }

    }
}