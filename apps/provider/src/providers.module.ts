import { Module } from '@nestjs/common';
import { ManageServicesModule } from './manage-service/manage-services.module';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';

@Module({
  imports: [ManageServicesModule, CommonModule, ConfigModule],
})
export class ProviderModule { }
