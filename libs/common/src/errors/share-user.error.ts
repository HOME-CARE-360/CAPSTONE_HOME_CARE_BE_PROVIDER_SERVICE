import { UnprocessableEntityException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const UserNotFoundException = new RpcException(new UnprocessableEntityException([
    {
        message: 'Error.UserNotFound',
        path: 'code',
    },
]))
export const EmailAlreadyExistsException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.EmailAlreadyExists', path: 'email' },
    ])
);
export const EmailNotFoundException = new RpcException(
    new UnprocessableEntityException([
        { message: 'Error.EmailNotFound', path: 'email' },
    ])
);
