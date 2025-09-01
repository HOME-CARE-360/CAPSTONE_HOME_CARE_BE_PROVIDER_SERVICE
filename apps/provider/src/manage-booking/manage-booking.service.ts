import { Injectable } from "@nestjs/common"
import { ManageBookingsRepository } from "./manager-booking.repo"
import { AssignStaffToBookingBodySchemaType, CreateBookingReportBodyType, GetBookingReportsQueryType, GetServicesRequestQueryType, UpdateBookingReportBodyType } from "libs/common/src/request-response-type/bookings/booking.model"
import { ShareStaffRepository } from "libs/common/src/repositories/shared-staff.repo"
import { SharedProviderRepository } from "libs/common/src/repositories/share-provider.repo"
import { StaffNotFoundOrNotBelongToProviderException } from "libs/common/src/errors/share-staff.error"
import { BookingNotPendingException, PreferredDateHasExpiredException, ServiceRequestNotFoundException } from "libs/common/src/errors/share-provider.error"
import { CreateProposedServiceType, EditProposedServiceType } from "libs/common/src/request-response-type/proposed/proposed.model"
import { SharedBookingRepository } from "libs/common/src/repositories/shared-booking.repo"
import { SharedServicesRepository } from "libs/common/src/repositories/shared-service.repo"
import { BookingNotFoundException, BookingNotFoundOrNotBelongToProviderException, BookingReportAlreadyExistsException, BookingReportNotFoundOrNotBelongToProviderException } from "libs/common/src/errors/share-booking.error"
import { InvalidServiceIdException } from "libs/common/src/errors/share-service.error"
import { SharedProposalRepository } from "libs/common/src/repositories/shared-proposed.repo"
import { ProposalAlreadyExistsException, ProposalNotFoundException } from "libs/common/src/errors/shared-proposal.error"

@Injectable()
export class ManageBookingsService {
    constructor(private readonly manageBookingRepository: ManageBookingsRepository, private readonly sharedStaffRepository: ShareStaffRepository, private readonly sharedProviderRepository: SharedProviderRepository, private readonly bookingRepository: SharedBookingRepository, private readonly serviceRepository: SharedServicesRepository, private readonly proposalRepository: SharedProposalRepository) {

    }
    async cancelRequest(serviceRequestId: number, providerId: number) {
        const booking = await this.bookingRepository.findUniqueServiceRequest({ id: serviceRequestId, providerId })
        if (!booking) {
            throw ServiceRequestNotFoundException
        }
        if (booking.status !== "PENDING") {
            throw BookingNotPendingException(booking.status)
        }
        return await this.manageBookingRepository.cancelRequestService(serviceRequestId)
    }
    async getListServiceRequest(data: GetServicesRequestQueryType, providerId: number) {

        return await this.manageBookingRepository.getListRequestService({ ...data, providerId })
    }
    async assignStaffToBooking(body: AssignStaffToBookingBodySchemaType, providerId: number) {
        const [staff, serviceRequest] = await Promise.all([this.sharedStaffRepository.findUniqueStaffAndBelongToProvider(body.staffId, providerId), this.sharedProviderRepository.findUniqueServiceRequestBelongToProvider({ providerId, serviceRequestId: body.serviceRequestId })])


        if (!staff) throw StaffNotFoundOrNotBelongToProviderException
        if (!serviceRequest) throw ServiceRequestNotFoundException
        if (serviceRequest.preferredDate) {
            const preferredDate = new Date(serviceRequest.preferredDate);
            const now = new Date();
            if (preferredDate < now) {
                throw PreferredDateHasExpiredException
            }
        }
        return await this.manageBookingRepository.assignStaffToBooking(body)
    }
    async createProposed(body: CreateProposedServiceType, providerId: number) {
        const [booking, services, belong, proposal] = await Promise.all([this.bookingRepository.findUnique({ id: body.bookingId }),
        this.serviceRepository.findUnique(body.services.map((item) => item.serviceId)),
        this.bookingRepository.findBookingBelongToProvider({
            id: body.bookingId,
            providerId,

        }), this.proposalRepository.findUnique(body.bookingId)])
        if (!booking) {
            throw BookingNotFoundException
        }
        if (proposal) {
            throw ProposalAlreadyExistsException
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
    async getServiceRequestDetail(serviceRequestId: number, providerId: number) {
        if (!await this.bookingRepository.findUniqueServiceRequest({ id: serviceRequestId, providerId })) throw ServiceRequestNotFoundException
        return await this.manageBookingRepository.getServiceRequestDetail(serviceRequestId)
    }
    async editProposed(body: EditProposedServiceType, providerId: number) {
        const [services, proposal] = await Promise.all([
            this.serviceRepository.findUnique(body.services.map((item) => item.serviceId)),
            this.proposalRepository.findUniqueId(body.proposalId, providerId)])

        if (!proposal) {
            throw ProposalNotFoundException
        }
        const foundIds = services.map((s) => s.id);
        const notFound = body.services.filter((item) => !foundIds.includes(item.serviceId))
        if (notFound.length > 0) {
            throw InvalidServiceIdException(notFound.map((item) => item.serviceId))
        }
        return await this.manageBookingRepository.editProposed(body)
    }
    async cancelAndReportBooking(body: CreateBookingReportBodyType, userId: number) {
        const booking = await this.bookingRepository.findUnique({ id: body.bookingId })
        if (!booking) throw BookingNotFoundOrNotBelongToProviderException
        if (booking.BookingReport.length > 0) throw BookingReportAlreadyExistsException
        // if(booking.status===BookingStatus.)
        return await this.manageBookingRepository.reportAndCancelBooking(body, userId, booking)
    }
    async updateReportBooking(body: UpdateBookingReportBodyType, userId: number) {
        if (!await this.bookingRepository.findUniqueReportBelongToProvider(body.id, userId)) throw BookingReportNotFoundOrNotBelongToProviderException
        return await this.manageBookingRepository.updateReportBooking(body)
    }
    async getListReportBooking(query: GetBookingReportsQueryType, userId: number) {

        return await this.manageBookingRepository.getListReportBooking(query, userId)
    }
    async getReportDetail(reportId: number, userId: number) {
        return await this.manageBookingRepository.getReportDetail(reportId, userId)
    }
}
