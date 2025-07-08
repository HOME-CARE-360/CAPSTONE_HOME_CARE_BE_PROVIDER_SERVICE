import { NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const BookingNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Error.BookingNotFound', path: ['id'] },
    ])
);
export const BookingNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException(
        [
            {
                message: 'Error.BookingNotFoundOrNotBelongToProvider',
                path: ['bookingId'],
            },
        ])
);
export const ServiceRequestNotFoundOrNotBelongToProviderException = new RpcException(
    new NotFoundException(
        [
            {
                message: 'Error.ServiceRequestNotFoundOrNotBelongToProvider',
                path: ['serviceRequestId'],
            },
        ])
);