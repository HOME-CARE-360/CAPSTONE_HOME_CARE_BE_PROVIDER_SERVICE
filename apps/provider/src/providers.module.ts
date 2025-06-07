import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-service/manage-services.service';
import { ManageServicesController } from './manage-service/manage-services.controller';
import { ManageServicesModule } from './manage-service/manage-services.module';

@Module({
  imports: [ManageServicesModule],
  controllers: [ManageServicesController],
  providers: [ManageServicesService],
})
export class ProviderModule { }
