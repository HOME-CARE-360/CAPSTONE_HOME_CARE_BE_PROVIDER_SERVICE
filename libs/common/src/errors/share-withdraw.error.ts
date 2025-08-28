import { BadRequestException, ConflictException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const WithdrawRequestAlreadyProcessingException = new RpcException(
    new ConflictException([
        {
            message: 'A withdraw request is already being processed',
            path: ['withdraw'],
        },
    ]),
);

export const InsufficientBalanceException = new RpcException(
    new BadRequestException([
        {
            message: 'Insufficient balance',
            path: ['balance'],
        },
    ]),
);

export const BankAccountNotConfiguredException = new RpcException(
    new BadRequestException([
        {
            message: 'Bank account is not configured',
            path: ['wallet'],
        },
    ]),
);
