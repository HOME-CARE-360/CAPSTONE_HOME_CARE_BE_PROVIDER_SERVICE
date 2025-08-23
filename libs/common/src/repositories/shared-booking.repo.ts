import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { CreateBookingBodyType } from "../request-response-type/bookings/booking.model";

@Injectable()
export class SharedBookingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique({ id }: { id: number }) {
        return await this.prismaService.booking.findUnique({
            where: {
                id
            }
        })
    }
    async findUniqueServiceRequest({ id, providerId }: { id: number, providerId: number }) {
        return await this.prismaService.serviceRequest.findUnique({
            where: {
                id,
                providerId
            }
        })
    }

    async findBookingBelongToProvider({ id, providerId }: { id: number, providerId: number }) {
        return await this.prismaService.booking.findUnique({
            where: {
                id,
                providerId
            }
        })
    }
    async create(body: Omit<CreateBookingBodyType, "deletedAt">) {
        return await this.prismaService.booking.create({
            data: {
                ...body
            }
        })
    }
    async findUniqueReportBelongToProvider(id: number, userId: number) {
        return await this.prismaService.bookingReport.findUnique({
            where: {
                id,
                reporterId: userId

            }
        })
    }

}