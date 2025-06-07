import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-service/manage-services.service';
import { ManageServicesController } from './manage-service/manage-services.controller';
import { ManageServicesModule } from './manage-service/manage-services.module';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
@Module({
  imports: [ManageServicesModule, CommonModule, ConfigModule],
  controllers: [ManageServicesController],
  providers: [ManageServicesService],
})
export class ProviderModule { }
