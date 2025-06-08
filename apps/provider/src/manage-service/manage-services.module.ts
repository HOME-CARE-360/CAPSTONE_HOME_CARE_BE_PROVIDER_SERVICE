import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-services.service';
import { ManageServicesRepository } from './manager-service.repo';


@Module({
  providers: [ManageServicesService, ManageServicesRepository],
  exports: [ManageServicesService, ManageServicesRepository],
})
export class ManageServicesModule { }
