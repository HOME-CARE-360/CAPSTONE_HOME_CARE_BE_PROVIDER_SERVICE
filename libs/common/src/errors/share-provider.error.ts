import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const ServiceProviderNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Error.ServiceProviderNotFound', path: ['id'] },
    ])
);
export const MissingProviderIdentifierException = new RpcException(
    new ForbiddenException("Missing provider identifier")
);
export const ProviderNotVerifiedException = new RpcException(
    new ForbiddenException("Your provider account is not verified")
);
export const ServiceRequestNotFoundException = new RpcException(
    new NotFoundException(
        [
            {
                message: 'Error.ServiceRequestNotFoundOrNotBelongToProvider',
                path: ['serviceRequestId'],
            },
        ])
);

