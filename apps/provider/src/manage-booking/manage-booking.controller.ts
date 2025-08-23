import { Body, Controller, Get, Post, } from "@nestjs/common";
import { ManageBookingsService } from "./manage-booking.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AssignStaffToBookingBodySchemaType, CancelServiceRequestBodySchema, CreateBookingReportBodyType, GetBookingReportsQueryType, GetServicesRequestQueryType, UpdateBookingReportBodyType } from "libs/common/src/request-response-type/bookings/booking.model";
import { CreateProposedServiceType, EditProposedServiceType } from "libs/common/src/request-response-type/proposed/proposed.model";


@Controller('manage-bookings')
export class ManageBookingsController {
  constructor(private readonly manageBookingService: ManageBookingsService) { }
  @Get("get-request-service")
  @MessagePattern({ cmd: "get-request-service" })
  async getRequestService(@Body() { data, providerID }: { data: GetServicesRequestQueryType, providerID: number }) {

    return await this.manageBookingService.getListServiceRequest(data, providerID)
  }
  @Get("get-request-service-detail")
  @MessagePattern({ cmd: "get-request-service-detail" })
  async getRequestServiceDetail(@Body() { data, providerID }: { data: CancelServiceRequestBodySchema, providerID: number }) {
    console.log("hi");

    console.log(data, providerID);

    return await this.manageBookingService.getServiceRequestDetail(data.serviceRequestId, providerID)
  }
  @MessagePattern({ cmd: "assign-staff-to-booking" })
  @Post("assign-staff-to-booking")
  async assignStaffToBooking(@Payload() { data, providerID }: { data: AssignStaffToBookingBodySchemaType, providerID: number }) {


    return await this.manageBookingService.assignStaffToBooking(data, providerID)


  }
  @MessagePattern({ cmd: "create-proposed" })
  async createProposed(@Payload() { data, providerID }: { data: CreateProposedServiceType, providerID: number }) {
    await this.manageBookingService.createProposed(data, providerID)

    return {
      message: "Create proposed successfully"
    }
  }
  @MessagePattern({ cmd: "cancel-service-request" })
  async cancelServiceRequest(@Payload() { data, providerID }: { data: CancelServiceRequestBodySchema, providerID: number }) {
    await this.manageBookingService.cancelRequest(data.serviceRequestId, providerID)

    return {
      message: "Cancel service request successfully"
    }
  }

  @MessagePattern({ cmd: "edit-proposed" })
  async editProposed(@Payload() { data, providerID }: { data: EditProposedServiceType, providerID: number }) {
    await this.manageBookingService.editProposed(data, providerID)

    return {
      message: "Edit proposed successfully"
    }
  }
  @MessagePattern("report-booking")
  async cancelBooking(@Payload() { body, userId }: { userId: number, body: CreateBookingReportBodyType }) {
    await this.manageBookingService.cancelAndReportBooking(body, userId)
  }
  @MessagePattern("update-report-booking")
  async updateCancelBooking(@Payload() { body, userId }: { body: UpdateBookingReportBodyType, userId: number }) {
    await this.manageBookingService.updateReportBooking(body, userId)
  }
  @MessagePattern("get-list-report")
  async getListCancelBooking(@Payload() { query, userId }: { query: GetBookingReportsQueryType, userId: number }) {
    await this.manageBookingService.getListReportBooking(query, userId)
  }

}
