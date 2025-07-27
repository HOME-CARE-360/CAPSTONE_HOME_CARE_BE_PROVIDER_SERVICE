import { Injectable } from "@nestjs/common";
import { ManageFundingRepository } from "./manager-funding.repo";
import { GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model";

@Injectable()
export class ManageFundingService {
    constructor(private readonly manageFundingRepository: ManageFundingRepository) {

    }
    async getListWithDraw(query: GetListWidthDrawQueryType, providerId: number) {
        return await this.manageFundingRepository.getListWithDraw(providerId, query)
    }
    async getWithDrawDetail(id: number, providerId: number) {
        return await this.manageFundingRepository.getWithDrawDetail(id, providerId)
    }
}
