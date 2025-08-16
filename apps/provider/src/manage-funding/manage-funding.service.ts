import { Injectable } from "@nestjs/common";
import { ManageFundingRepository } from "./manager-funding.repo";
import { CreateWithdrawBodyType, GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model";
import { SharedWidthDrawRepository } from "libs/common/src/repositories/share-withdraw.repo";
import { InsufficientBalanceException, WithdrawRequestAlreadyProcessingException } from "libs/common/src/errors/share-withdraw.error";

@Injectable()
export class ManageFundingService {
    constructor(private readonly manageFundingRepository: ManageFundingRepository, private readonly sharedWidthDrawRepository: SharedWidthDrawRepository) {

    }
    async getListWithDraw(query: GetListWidthDrawQueryType, userId: number) {
        return await this.manageFundingRepository.getListWithDraw(userId, query)
    }
    async getWithDrawDetail(id: number, userId: number) {

        return await this.manageFundingRepository.getWithDrawDetail(id, userId)
    }
    async createWithdraw(body: CreateWithdrawBodyType, userId: number) {
        const [wallet, widthDraw] = await Promise.all([this.sharedWidthDrawRepository.findWalletBalance(userId), this.sharedWidthDrawRepository.findManyWithStatus()])

        if (widthDraw.length > 0) {
            throw WithdrawRequestAlreadyProcessingException
        }
        if (wallet && (wallet.Wallet!.balance < body.amount)) {
            throw InsufficientBalanceException
        }
        return await this.manageFundingRepository.createWithdraw(body, userId)
    }
}
