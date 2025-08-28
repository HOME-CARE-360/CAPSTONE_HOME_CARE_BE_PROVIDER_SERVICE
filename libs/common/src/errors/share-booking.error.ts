import { NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const BookingNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Booking not found', path: ['id'] },
    ]),
);

export const BookingNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException([
        {
            message: 'Booking not found or does not belong to this provider',
            path: ['bookingId'],
        },
    ]),
);

export const BookingReportNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException([
        {
            message: 'Booking report not found or does not belong to this provider',
            path: ['bookingId'],
        },
    ]),
);

export const ServiceRequestNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException([
        {
            message: 'Service request not found or does not belong to this provider',
            path: ['serviceRequestId'],
        },
    ]),
);
