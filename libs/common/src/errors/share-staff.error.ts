import { NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const StaffNotFoundOrNotBelongToProviderException = new RpcException(new NotFoundException([
    {
        message: 'Error.StaffNotFoundOrNotBelongToProvider',
        path: ['staffId'],
    },
]))