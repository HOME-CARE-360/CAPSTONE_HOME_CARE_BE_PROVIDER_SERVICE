import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class SharedWidthDrawRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique({ id }: { id: number }) {
        return await this.prismaService.withdrawalRequest.findUnique({
            where: {
                id
            }
        })
    }

    async findMany() {
        return await this.prismaService.withdrawalRequest.findMany()
    }
    async findManyWithStatus(userId: number) {
        return await this.prismaService.withdrawalRequest.findMany({
            where: {
                userId,
                status: {
                    not: {
                        in: ["COMPLETED", "APPROVED", "CANCELLED", "REJECTED"]
                    }
                }
            }
        })
    }
    async findWalletBalance(userId: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId
            }, include: {


                Wallet: true


            }
        })
    }
}