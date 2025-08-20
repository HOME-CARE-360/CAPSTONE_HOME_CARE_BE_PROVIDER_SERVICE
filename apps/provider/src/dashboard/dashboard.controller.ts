import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetProviderStatsQueryType } from "libs/common/src/request-response-type/provider/dashboard/dashboard.model";
import { DashboardService } from "./dashboard.service";

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    // HTTP
    // @Get()
    // async getStatsHttp(
    //     @Body()
    //     { providerId }: { providerId: number }, @Query() params: GetProviderStatsQueryDTO) {
    //     console.log(params, providerId);

    //     return this.dashboardService.getProviderStats(providerId, params);
    // }

    // MessagePattern (nếu bạn cũng expose qua microservices)
    @MessagePattern({ cmd: 'provider.stats' })
    async getStatsMsg(@Payload() { providerId, params }: { providerId: number, params: GetProviderStatsQueryType }) {
        {


            return await this.dashboardService.getProviderStats(providerId, params);
        }

    }
}