import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function InvalidServiceItemsIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: `Invalid service item ID(s): ${invalidIds.join(", ")}`,
                path: ['serviceItemsRequirements'],
                meta: { invalidIds },
            },
        ]),
    );
}

export const ServiceItemNotFoundException = new RpcException(
    new NotFoundException([
        {
            message: 'Service item not found or does not belong to this provider',
            path: ['serviceItemId'],
        },
    ]),
);
