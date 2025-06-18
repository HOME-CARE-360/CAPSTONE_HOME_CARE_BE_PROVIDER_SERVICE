import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-services.service';
import { ManageServicesRepository } from './manager-service.repo';
import { ManageServicesController } from './manage-services.controller';


@Module({
  controllers: [ManageServicesController],
  providers: [ManageServicesService, ManageServicesRepository],
  exports: [ManageServicesService, ManageServicesRepository],
})
export class ManageServicesModule { }
