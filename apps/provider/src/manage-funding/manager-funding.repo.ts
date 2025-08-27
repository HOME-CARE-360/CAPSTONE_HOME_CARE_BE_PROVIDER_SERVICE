import { Injectable } from "@nestjs/common"
import { PaymentTransactionStatus, Prisma, WithdrawalStatus } from "@prisma/client"
import { CreateWithdrawBodyType, GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageFundingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async getListWithDraw(userId: number, query: GetListWidthDrawQueryType) {
        const where: Prisma.WithdrawalRequestWhereInput = {
            userId
        }

        if (query.status) {
            where.status = {
                in: query.status
            }
        }
        return await this.prismaService.withdrawalRequest.findMany({
            where,
            orderBy: {
                [query.sortBy]: query.orderBy
            }
            ,
            skip: (query.page - 1) * query.limit,
            take: query.limit

        })
    }
    async getWithDrawDetail(id: number, userId: number) {

        const data = await this.prismaService.withdrawalRequest.findUnique({
            where: { id, userId },
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                processedAt: true,
                note: true,
                User: {
                    select: {
                        name: true,
                        phone: true,
                        email: true,
                        avatar: true,
                    }

                }

            }
        });
        if (!data) return null;




        return data
    }
    async createWithdraw(body: CreateWithdrawBodyType, userId: number) {
        const withdraw = await this.prismaService.withdrawalRequest.create({
            data: {
                ...body,
                userId,
                status: WithdrawalStatus.PENDING,
                PaymentTransaction: {
                    create: {
                        gateway: 'EXTERNAL_WALLET',
                        status: PaymentTransactionStatus.PENDING,
                        userId,
                        transactionDate: new Date(),
                        amountOut: body.amount,
                    },
                },
            },

            select: {
                id: true,
                status: true,
                PaymentTransaction: {
                    select: { id: true, status: true, amountOut: true, transactionDate: true },
                },
            },
        });

        return withdraw;
    }

}