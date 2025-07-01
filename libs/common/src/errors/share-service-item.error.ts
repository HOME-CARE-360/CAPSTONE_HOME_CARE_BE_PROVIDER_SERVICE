import { BadRequestException } from "@nestjs/common";
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