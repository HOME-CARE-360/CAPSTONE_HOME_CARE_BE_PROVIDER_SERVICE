import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model"
import { PrismaService } from "libs/common/src/services/prisma.service"



@Injectable()
export class ManageFundingRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async getListWithDraw(providerId: number, query: GetListWidthDrawQueryType) {
        const where: Prisma.WithdrawalRequestWhereInput = {
            providerId
        }


        return await this.prismaService.withdrawalRequest.findMany({
            where,
            orderBy: {
                [query.sortBy]: query.sortBy
            }
            ,
            skip: (query.page - 1) * query.limit,
            take: query.limit

        })
    }
    async getWithDrawDetail(id: number, providerId: number) {
        const data = await this.prismaService.withdrawalRequest.findUnique({
            where: { id, providerId },
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                processedAt: true,
                note: true,

                ServiceProvider: {
                    select: {
                        address: true,
                        description: true, companyType: true,
                        logo: true,
                        industry: true,
                        licenseNo: true,
                        taxId: true,

                        user: {
                            select: {
                                name: true,
                                phone: true,
                                email: true,
                                Wallet: {
                                    select: {
                                        bankAccount: true,
                                        bankName: true,
                                        accountHolder: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!data) return null;


        const { ServiceProvider, ...rest } = data;
        const { user, ...providerFields } = ServiceProvider;

        return {
            ...rest,
            ServiceProvider: {
                ...providerFields,
                ...user
            }
        };

    }
}