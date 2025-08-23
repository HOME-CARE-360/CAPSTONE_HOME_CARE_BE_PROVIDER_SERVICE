import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { WithdrawalStatus } from "@prisma/client";

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

                        equals: WithdrawalStatus.COMPLETED
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