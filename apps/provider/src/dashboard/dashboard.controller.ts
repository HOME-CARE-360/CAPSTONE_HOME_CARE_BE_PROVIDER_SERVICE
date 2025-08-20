import { Body, Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ZodSerializerDto } from "nestjs-zod";
import { GetProviderStatsQueryDTO } from "libs/common/src/request-response-type/provider/dashboard/dashboard.dto";
import { DashboardParamsType } from "libs/common/src/request-response-type/provider/dashboard/dashboard.model";

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    // HTTP
    @Get()
    @ZodSerializerDto(GetProviderStatsQueryDTO)
    async getStatsHttp(
        @Body()
        { params, providerId }: { providerId: number, params: DashboardParamsType }) {

        return this.dashboardService.getProviderStats(providerId, params);
    }

    // // MessagePattern (nếu bạn cũng expose qua microservices)
    // @MessagePattern({ cmd: 'provider.stats' })
    // async getStatsMsg(@Payload() payload: { providerId: number; params?: any }) {
    //     const { providerId, params } = payload;
    //     const q = GetProviderStatsQuerySchema.parse(params ?? {});
    //     return this.stats.getProviderStats(providerId, q);
    // }

}