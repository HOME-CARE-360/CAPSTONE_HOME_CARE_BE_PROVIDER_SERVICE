import { Injectable } from "@nestjs/common"
import { ManageBookingsRepository } from "./manager-booking.repo"
import { AssignStaffToBookingBodySchemaType, GetServicesRequestQueryType } from "libs/common/src/request-response-type/bookings/booking.model"
import { ShareStaffRepository } from "libs/common/src/repositories/shared-staff.repo"
import { SharedProviderRepository } from "libs/common/src/repositories/share-provider.repo"
import { StaffNotFoundOrNotBelongToProviderException } from "libs/common/src/errors/share-staff.error"
import { ServiceRequestNotFoundException } from "libs/common/src/errors/share-provider.error"

@Injectable()
export class ManageBookingsService {
    constructor(private readonly manageBookingRepository: ManageBookingsRepository, private readonly sharedStaffRepository: ShareStaffRepository, private readonly sharedProviderRepository: SharedProviderRepository) {

    }
    async getListServiceRequest(data: GetServicesRequestQueryType, providerId: number) {

        return await this.manageBookingRepository.getListRequestService({ ...data, providerId })
    }
    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType, providerId: number) {
        const [staff, serviceRequest] = await Promise.all([this.sharedStaffRepository.findUniqueStaffAndBelongToProvider(body.staffId, providerId), this.sharedProviderRepository.findUniqueServiceRequestBelongToProvider({ providerId, serviceRequestId: body.serviceRequestId })])
        if (!staff) throw StaffNotFoundOrNotBelongToProviderException
        if (!serviceRequest) throw ServiceRequestNotFoundException
        return await this.manageBookingRepository.assignStaffToBooking(body, providerId)
    }
}
