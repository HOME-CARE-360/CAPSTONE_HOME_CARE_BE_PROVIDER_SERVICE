import { Module } from '@nestjs/common';
import { ManageServicesModule } from './manage-service/manage-services.module';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { ManageStaffModule } from './manage-staff/manage-staff.module';
import { ManageBookingModule } from './manage-booking/manage-booking.module';
import { ManageFundingModule } from './manage-funding/manage-funding.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [ManageServicesModule, ManageStaffModule, CommonModule, ConfigModule, ManageBookingModule, ManageFundingModule, DashboardModule],
})
export class ProviderModule { }
