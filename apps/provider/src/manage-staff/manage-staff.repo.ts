import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { GetStaffsQueryType } from "libs/common/src/request-response-type/provider/manage-staff/manage-staff.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageStaffRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async getAvailableStaff({ limit, orderBy, page, sortBy, categories, name }: GetStaffsQueryType, providerId: number) {
        const caculatedOrderBy: Prisma.StaffOrderByWithRelationInput = {
            [sortBy]: orderBy,

        }
        const skip = (page - 1) * limit
        const take = limit
        const where: Prisma.StaffWhereInput = {
            providerId: providerId,
            OR: [
                {
                    booking: {
                        every: {
                            status: {
                                in: ['COMPLETED', 'CANCELLED'],
                            },
                        }




                    },

                    workLogs: {
                        none: {
                            checkOut: null,
                        },
                    },
                },
                {
                    booking: {
                        none: {}
                    }
                }
            ]

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
        const [data, totalItems] = await Promise.all([this.prismaService.staff.findMany({
            where,
            select: {
                id: true,
                providerId: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
            },
            skip, take, orderBy: caculatedOrderBy
        }), this.prismaService.staff.count({
            where
        })])
        return {
            data,
            totalItems,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
        }
    }
}