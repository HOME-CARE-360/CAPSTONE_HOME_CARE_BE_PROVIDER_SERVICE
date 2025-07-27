import { Injectable } from "@nestjs/common";
import { ManageFundingRepository } from "./manager-funding.repo";
import { CreateWithdrawBodyType, GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model";
import { SharedWidthDrawRepository } from "libs/common/src/repositories/share-withdraw.repo";
import { InsufficientBalanceException, WithdrawRequestAlreadyProcessingException } from "libs/common/src/errors/share-withdraw.error";

@Injectable()
export class ManageFundingService {
    constructor(private readonly manageFundingRepository: ManageFundingRepository, private readonly sharedWidthDrawRepository: SharedWidthDrawRepository) {

    }
    async getListWithDraw(query: GetListWidthDrawQueryType, providerId: number) {
        return await this.manageFundingRepository.getListWithDraw(providerId, query)
    }
    async getWithDrawDetail(id: number, providerId: number) {
        return await this.manageFundingRepository.getWithDrawDetail(id, providerId)
    }
    async createWithdraw(body: CreateWithdrawBodyType, providerId: number) {
        const [wallet, widthDraw] = await Promise.all([this.sharedWidthDrawRepository.findWalletBalance(providerId), this.sharedWidthDrawRepository.findManyWithStatus()])

        if (widthDraw.length > 0) {
            throw WithdrawRequestAlreadyProcessingException
        }
        if (wallet && (wallet.user.Wallet!.balance < body.amount)) {
            throw InsufficientBalanceException
        }
        return await this.manageFundingRepository.createWithdraw(body, providerId)
    }
}
