import { Controller, Get, } from "@nestjs/common";
import { ManageBookingsService } from "./manage-booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetServicesRequestQueryType } from "libs/common/src/request-response-type/bookings/booking.model";


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


}
