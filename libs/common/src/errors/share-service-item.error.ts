import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function InvalidServiceItemsIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: 'Error.InvalidServiceItemId',
                path: ['serviceItemsRequirements'],
                meta: { invalidIds },
            },
        ])
    )
}
export const ServiceItemNotFoundException = new RpcException(
    new NotFoundException(
        [
            {
                message: 'Error.ServiceItemNotFoundOrNotBelongToProvider',
                path: ['serviceItemId'],
            },
        ])
);
