import { NotFoundException, ConflictException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const UserNotFoundException = new RpcException(
    new NotFoundException([
        {
            message: 'User not found',
            path: ['code'],
        },
    ]),
);

export const EmailAlreadyExistsException = new RpcException(
    new ConflictException([
        { message: 'Email already exists', path: ['email'] },
    ]),
);

export const EmailNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Email not found', path: ['email'] },
    ]),
);
