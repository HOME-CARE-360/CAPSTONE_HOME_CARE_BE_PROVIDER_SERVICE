import { Injectable } from "@nestjs/common"
import { Prisma, RequestStatus } from "@prisma/client"
import { OrderByType, SortByServiceRequestType } from "libs/common/src/constants/others.constant"
import { SharedBookingRepository } from "libs/common/src/repositories/shared-booking.repo"
import { AssignStaffToBookingBodySchemaType } from "libs/common/src/request-response-type/bookings/booking.model"
import { CreateProposedServiceType } from "libs/common/src/request-response-type/proposed/proposed.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageBookingsRepository {
    constructor(private readonly prismaService: PrismaService, private readonly sharedBookingRepository: SharedBookingRepository) { }
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

                category: {
                    select: {
                        logo: true,
                        name: true,

                    },

                },

                customer: {
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
        const data = rawData.map(({ customer: { user, ...restUser }, ...rest }) => {
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
    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType) {
        try {
            return await this.prismaService.serviceRequest.update({
                where: {
                    id: body.serviceRequestId
                },
                data: {
                    status: RequestStatus.IN_PROGRESS
                }
            })
        } catch (error) {
            console.log(error);

        }

    }
    async createProposed(body: CreateProposedServiceType) {
        return await this.prismaService.$transaction(async (tx) => {
            await tx.booking.update({
                where: {

                    id: body.bookingId
                },
                data: {
                    serviceRequest: {
                        update: {
                            status: RequestStatus.ESTIMATED
                        }
                    }

                }
            })
            await tx.proposal.create({
                data: {
                    notes: body.notes,
                    bookingId: body.bookingId,

                    ProposalItem: {
                        create: body.services.map((item) => ({
                            serviceId: item.serviceId,
                            quantity: item.quantity,
                            price: item.price,

                        })),
                    }

                }
            })
        })

    }
}