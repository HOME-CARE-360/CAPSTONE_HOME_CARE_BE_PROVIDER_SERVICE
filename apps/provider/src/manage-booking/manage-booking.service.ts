import { Injectable } from "@nestjs/common"
import { ManageBookingsRepository } from "./manager-booking.repo"
import { AssignStaffToBookingBodySchemaType, GetServicesRequestQueryType } from "libs/common/src/request-response-type/bookings/booking.model"
import { ShareStaffRepository } from "libs/common/src/repositories/shared-staff.repo"
import { SharedProviderRepository } from "libs/common/src/repositories/share-provider.repo"
import { StaffNotFoundOrNotBelongToProviderException } from "libs/common/src/errors/share-staff.error"
import { ServiceRequestNotFoundException } from "libs/common/src/errors/share-provider.error"
import { CreateProposedServiceType } from "libs/common/src/request-response-type/proposed/proposed.model"
import { SharedBookingRepository } from "libs/common/src/repositories/shared-booking.repo"
import { SharedServicesRepository } from "libs/common/src/repositories/shared-service.repo"
import { BookingNotFoundException, BookingNotFoundOrNotBelongToProviderException } from "libs/common/src/errors/share-booking.error"
import { InvalidServiceIdException } from "libs/common/src/errors/share-service.error"

@Injectable()
export class ManageBookingsService {
    constructor(private readonly manageBookingRepository: ManageBookingsRepository, private readonly sharedStaffRepository: ShareStaffRepository, private readonly sharedProviderRepository: SharedProviderRepository, private readonly bookingRepository: SharedBookingRepository, private readonly serviceRepository: SharedServicesRepository) {

    }
    async getListServiceRequest(data: GetServicesRequestQueryType, providerId: number) {

        return await this.manageBookingRepository.getListRequestService({ ...data, providerId })
    }
    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType, providerId: number) {
        const [staff, serviceRequest] = await Promise.all([this.sharedStaffRepository.findUniqueStaffAndBelongToProvider(body.staffId, providerId), this.sharedProviderRepository.findUniqueServiceRequestBelongToProvider({ providerId, serviceRequestId: body.serviceRequestId })])
        if (!staff) throw StaffNotFoundOrNotBelongToProviderException
        if (!serviceRequest) throw ServiceRequestNotFoundException
        console.log("toi day r");

        return await this.manageBookingRepository.assignStaffToBooking(body)
    }
    async createProposed(body: CreateProposedServiceType, providerId: number) {
        const [booking, services, belong] = await Promise.all([this.bookingRepository.findUnique({ id: body.bookingId }),
        this.serviceRepository.findUnique(body.services.map((item) => item.serviceId)),
        this.bookingRepository.findBookingBelongToProvider({
            id: body.bookingId,
            providerId,

        })])
        if (!booking) {
            throw BookingNotFoundException
        }
        if (!belong) {
            throw BookingNotFoundOrNotBelongToProviderException
        }

        const foundIds = services.map((s) => s.id);
        const notFound = body.services.filter((item) => !foundIds.includes(item.serviceId))
        if (notFound.length > 0) {
            throw InvalidServiceIdException(notFound.map((item) => item.serviceId))
        }
        return await this.manageBookingRepository.createProposed(body)
    }
}
