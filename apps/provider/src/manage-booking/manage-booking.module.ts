import { Module } from '@nestjs/common';
import { ManageBookingsController } from './manage-booking.controller';
import { ManageBookingsRepository } from './manager-booking.repo';
import { ManageBookingsService } from './manage-booking.service';


@Module({
  controllers: [ManageBookingsController],
  providers: [ManageBookingsRepository, ManageBookingsService],
  exports: [ManageBookingsRepository, ManageBookingsService],
})
export class ManageBookingModule { }
