import { Module } from '@nestjs/common';
import { ManageServicesService } from './manage-services.service';
import { ManageServicesController } from './manage-services.controller';


@Module({
  controllers: [ManageServicesController],
  providers: [ManageServicesService],
})
export class ManageServicesModule { }

