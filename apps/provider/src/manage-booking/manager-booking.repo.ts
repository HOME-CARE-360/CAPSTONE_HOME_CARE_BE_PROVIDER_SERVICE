import { Injectable } from "@nestjs/common"
import { BookingStatus, Prisma, ProposalStatus, RequestStatus } from "@prisma/client"
import { OrderByType, SortByServiceRequestType } from "libs/common/src/constants/others.constant"
import { ServiceRequestNotFoundException } from "libs/common/src/errors/share-provider.error"
import { SharedBookingRepository } from "libs/common/src/repositories/shared-booking.repo"
import { AssignStaffToBookingBodySchemaType } from "libs/common/src/request-response-type/bookings/booking.model"
import { CreateProposedServiceType, EditProposedServiceType } from "libs/common/src/request-response-type/proposed/proposed.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageBookingsRepository {
    constructor(private readonly prismaService: PrismaService, private readonly sharedBookingRepository: SharedBookingRepository) { }
    async getListRequestService({
        status,
        location,
        limit = 10,
        page = 2,
        orderBy,
        sortBy,
        categories,
        providerId
    }: {
        status?: RequestStatus,
        sortBy: SortByServiceRequestType,
        orderBy: OrderByType,
        location?: string,
        limit: number,
        page: number,
        categories?: number[],
        providerId: number
    }) {
        const skip = (page - 1) * limit;
        const take = limit;
        const where: Prisma.ServiceRequestWhereInput = { providerId };

        if (status) {
            where.status = status;
        } else if (location) {
            where.location = { contains: location };
        } else if (categories?.length) {
            where.categoryId = { in: categories };
        }

        const [data, totalItems] = await Promise.all([
            this.prismaService.serviceRequest.findMany({
                where,
                orderBy: { [sortBy]: orderBy },
                include: {
                    category: { select: { logo: true, name: true } },
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
                        }
                    }
                },
                skip,
                take,
            }),
            this.prismaService.serviceRequest.count({ where })
        ]);

        const mapped = data.map(({ customer: { user, ...rest }, ...res }) => ({
            ...res,
            customer: { ...rest, ...user }
        }));

        return {
            data: mapped,
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
        };
    }
    async getServiceRequestDetail(serviceRequestId: number) {
        const result = await this.prismaService.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            include: {
                category: {
                    select: { logo: true, name: true }
                },
                booking: {
                    select: {
                        id: true,
                        status: true,
                        transaction: {
                            omit: { bookingId: true }
                        },
                        staff: {
                            select: {
                                id: true, user: {
                                    select: {
                                        avatar: true,
                                        email: true,
                                        name: true, phone: true,

                                    }
                                }
                            }
                        },
                        inspectionReport: {
                            omit: {
                                staffId: true,
                                bookingId: true
                            }
                        },
                        Proposal: {
                            omit: { bookingId: true },
                            include: {
                                ProposalItem: {
                                    include: {
                                        Service: {
                                            select: {
                                                virtualPrice: true,
                                                basePrice: true,
                                                description: true,
                                                name: true,
                                                images: true,
                                                durationMinutes: true,
                                                category: true,
                                                attachedItems: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!result) throw ServiceRequestNotFoundException

        const { customer: { user, ...rest }, ...res } = result;
        return {
            ...res,

            customer: {
                ...rest,
                ...user
            }
        };
    }

    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType) {

        return await this.prismaService.booking.update({
            where: {
                serviceRequestId: body.serviceRequestId
            }, data: {
                staffId: body.staffId
            }
        })


    }
    async cancelRequestService(serviceRequestId: number) {
        return await this.prismaService.$transaction(async (tx) => {
            const serviceRequest = await tx.serviceRequest.update({
                where: { id: serviceRequestId },
                data: { status: RequestStatus.CANCELLED },
            });

            const booking = await tx.booking.update({
                where: { serviceRequestId },
                data: { status: BookingStatus.CANCELLED },
            });

            return { serviceRequest, booking };
        });
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
                    status: ProposalStatus.PENDING,
                    notes: body.notes,
                    bookingId: body.bookingId,

                    ProposalItem: {
                        create: body.services.map((item) => ({
                            serviceId: item.serviceId,
                            quantity: item.quantity,
                        })),
                    }

                }
            })
        })



    }
    async editProposed(body: EditProposedServiceType) {
        const { proposalId, ...rest } = body
        return await this.prismaService.proposal.update({
            where: {
                id: proposalId
            },
            data: {
                status: ProposalStatus.PENDING,
                notes: rest.notes,
                ProposalItem: {
                    create: rest.services.map((item) => ({
                        serviceId: item.serviceId,
                        quantity: item.quantity,
                    })),
                }
            }
        })

    }
}