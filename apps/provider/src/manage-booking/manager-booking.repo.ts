import { Injectable } from "@nestjs/common"
import { BookingStatus, Prisma, RequestStatus } from "@prisma/client"
import { OrderByType, SortByServiceRequestType } from "libs/common/src/constants/others.constant"
import { AssignStaffToBookingBodySchemaType } from "libs/common/src/request-response-type/bookings/booking.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageBookingsRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async getListRequestService({ status, location, limit, page, orderBy, sortBy, categories, providerId }: { status?: RequestStatus, sortBy: SortByServiceRequestType, orderBy: OrderByType, location?: string, limit: number, page: number, categories?: number[], providerId: number }) {
        const skip = (page - 1) * limit
        const take = limit
        const where: Prisma.ServiceRequestWhereInput = {
            providerId
        }
        if (status) {
            where.status = status
        } else if (location) {
            where.location = {
                contains: location
            }
        } else if (categories && categories.length > 0) {
            where.categoryId = {
                in: categories
            }
        }
        console.log(where);

        const [rawData, totalItems] = await Promise.all([this.prismaService.serviceRequest.findMany({
            where,
            orderBy: {
                [sortBy]: orderBy
            }, include: {
                Category: {
                    select: {
                        logo: true,
                        name: true,

                    },

                },
                CustomerProfile: {
                    select: {
                        address: true,
                        gender: true,
                        user: {
                            select: {
                                avatar: true,
                                name: true,
                                phone: true,
                                email: true,
                            }
                        }
                    },

                }
            }
            , skip,
            take
        }), this.prismaService.serviceRequest.count({
            where,
        })])
        const data = rawData.map(({ CustomerProfile: { user, ...restUser }, ...rest }) => {
            return {
                ...rest,
                customer: {
                    ...restUser,
                    ...user
                }
            }
        })
        return {
            data,
            totalItems,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
        }
    }
    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType, providerId: number) {
        await Promise.all([this.prismaService.serviceRequest.update({
            where: {
                id: body.serviceRequestId
            },
            data: {
                status: RequestStatus.IN_PROGRESS
            }
        }), this.prismaService.booking.create({
            data: {
                ...body,
                providerId,
                status: BookingStatus.PENDING
            }
        })])
    }
}