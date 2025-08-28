import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function InvalidServiceIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: `Invalid service ID(s): ${invalidIds.join(", ")}`,
                path: ['servicesRequirements'],
                meta: { invalidIds },
            },
        ]),
    );
}

export const ServiceNotFoundException = new RpcException(
    new NotFoundException([
        {
            message: 'Service not found',
            path: ['serviceId'],
        },
    ]),
);
