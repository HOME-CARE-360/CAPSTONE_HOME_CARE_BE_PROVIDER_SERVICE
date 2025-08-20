import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repo';
import { DashboardService } from './dashboard.service';


@Module({
    controllers: [DashboardController],
    providers: [DashboardRepository, DashboardService],
    exports: [DashboardRepository, DashboardService]
})
export class DashboardModule { }
