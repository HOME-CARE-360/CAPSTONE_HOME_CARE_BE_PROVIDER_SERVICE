import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class SharedProposalRepository {
    constructor(private readonly prismaService: PrismaService) { }
    async findUnique(proposalId: number) {
        return await this.prismaService.proposal.findUnique({
            where: {
                id: proposalId
            },
            select: { id: true }
        });
    }



}