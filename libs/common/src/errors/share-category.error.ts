import { BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function InvalidCategoryIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: `Invalid category ID(s): ${invalidIds.join(', ')}`,
                path: ['categoryRequirements'],
                meta: { invalidIds },
            },
        ]),
    );
}
