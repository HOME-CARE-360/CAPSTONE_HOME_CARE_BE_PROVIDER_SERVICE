import { Injectable } from "@nestjs/common"
import { DashboardRepository } from "./dashboard.repo"
import { GetProviderStatsQueryType } from "libs/common/src/request-response-type/provider/dashboard/dashboard.model"

@Injectable()
export class DashboardService {
    constructor(private readonly dashboardRepository: DashboardRepository) {

    }
    async getProviderStats(providerId: number, params: GetProviderStatsQueryType) {
        return await this.dashboardRepository.getProviderStats(providerId, params)
    }
}