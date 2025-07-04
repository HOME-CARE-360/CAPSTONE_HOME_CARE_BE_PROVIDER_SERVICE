import { Controller, Get, Post, } from "@nestjs/common";
import { ManageBookingsService } from "./manage-booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AssignStaffToBookingBodySchemaType, GetServicesRequestQueryType } from "libs/common/src/request-response-type/bookings/booking.model";


@Controller('manage-bookings')
export class ManageBookingsController {
  constructor(private readonly manageBookingService: ManageBookingsService) { }
  @Get("get-request-service")
  @MessagePattern({ cmd: "get-request-service" })
  async getRequestService(@Payload() { data, providerID }: { data: GetServicesRequestQueryType, providerID: number }) {
    console.log("hi");

    console.log(data, providerID);

    return await this.manageBookingService.getListServiceRequest(data, providerID)
  }
  @MessagePattern({ cmd: "assign-staff-to-booking" })
  @Post("assign-staff-to-booking")
  async assignStaffToBooking(@Payload() { data, providerID }: { data: AssignStaffToBookingBodySchemaType, providerID: number }) {
    return await this.manageBookingService.assignStaffToBooking(data, providerID)
  }


}
