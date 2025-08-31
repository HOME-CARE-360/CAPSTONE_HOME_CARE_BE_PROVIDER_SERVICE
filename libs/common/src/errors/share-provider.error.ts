import { ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const ServiceProviderNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Service provider not found', path: ['id'] },
    ]),
);

export const MissingProviderIdentifierException = new RpcException(
    new BadRequestException([
        { message: 'Provider identifier is missing', path: ['providerId'] },
    ]),
);

export const ProviderNotVerifiedException = new RpcException(
    new ForbiddenException([
        { message: 'Your provider account has not been verified', path: ['providerId'] },
    ]),
);

export const ServiceRequestNotFoundException = new RpcException(
    new NotFoundException([
        {
            message: 'Service request not found or does not belong to this provider',
            path: ['serviceRequestId'],
        },
    ]),
);
export const BookingNotPendingException = (current: string) => new RpcException(
    new BadRequestException([{
        message: `Booking must be PENDING, but got ${current}`,
    }])
)

export const PreferredDateHasExpiredException = new RpcException(
    new BadRequestException([
        {
            message: 'Preferred date has expired',
            path: ['serviceRequestId'],
        },
    ]),
);
