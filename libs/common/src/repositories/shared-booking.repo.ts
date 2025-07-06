import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

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
    async findBookingBelongToProvider({ id, providerId }: { id: number, providerId: number }) {
        return await this.prismaService.booking.findUnique({
            where: {
                id,
                providerId
            }
        })
    }


}