import { Injectable } from "@nestjs/common"
import { Prisma, WithdrawalStatus } from "@prisma/client"
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
        return await this.prismaService.withdrawalRequest.create({
            data: {
                ...body,
                userId,
                status: WithdrawalStatus.PENDING,
                createdAt: new Date()
            }
        })
    }
}