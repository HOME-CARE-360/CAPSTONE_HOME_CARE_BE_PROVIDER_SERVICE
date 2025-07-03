import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class SharedServiceItemRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique(serviceItemIds: number[]) {
        return await this.prismaService.serviceItem.findMany({
            where: {
                id: { in: serviceItemIds }
            },
            select: { id: true }
        });
    }
    async findUniqueBelongToProvider(serviceItemId: number, providerId: number) {
        return await this.prismaService.serviceItem.findUnique({
            where: {
                id: serviceItemId,
                providerId
            },
            select: { id: true }
        });
    }



}