import { Injectable } from "@nestjs/common"
import { ManageBookingsRepository } from "./manager-booking.repo"
import { GetServicesRequestQueryType } from "libs/common/src/request-response-type/bookings/booking.model"

@Injectable()
export class ManageBookingsService {
    constructor(private readonly manageBookingRepository: ManageBookingsRepository) {

    }
    async getListServiceRequest(data: GetServicesRequestQueryType, providerId: number) {
        console.log(data);

        return await this.manageBookingRepository.getListRequestService({ ...data, providerId })
    }
}
