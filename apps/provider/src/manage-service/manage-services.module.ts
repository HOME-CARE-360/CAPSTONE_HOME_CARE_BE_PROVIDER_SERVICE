import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-services.service';
import { ManageServicesController } from './manage-services.controller';
import { ManageServicesRepository } from './manager-service.repo';


@Module({
  controllers: [ManageServicesController],
  providers: [ManageServicesService, ManageServicesRepository],
  exports: [ManageServicesService],
})
export class ManageServicesModule { }
