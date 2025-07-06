import { BadRequestException, UnprocessableEntityException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";



export function InvalidServiceIdException(invalidIds: number[]) {
    return new RpcException(
        new BadRequestException([
            {
                message: 'Error.InvalidServiceId',
                path: ['servicesRequirements'],
                meta: { invalidIds },
            },
        ])
    )
}
export const ServiceNotFoundException = new RpcException(new UnprocessableEntityException([
    {
        message: 'Error.ServiceNotFound',
        path: 'serviceId',
    },
]))

