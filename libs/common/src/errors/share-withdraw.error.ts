import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const WithdrawRequestAlreadyProcessingException = new RpcException(
    new NotFoundException([
        {
            message: 'Error.WithdrawRequestAlreadyProcessing',
            path: ['withdraw'],
        },
    ])
);
export const InsufficientBalanceException = new RpcException(
    new BadRequestException([
        {
            message: 'Error.InsufficientBalance',
            path: ['balance'],
        },
    ])
);

export const BankAccountNotConfiguredException = new RpcException(
    new BadRequestException([
        {
            message: 'Error.BankAccountNotConfigured',
            path: ['wallet'],
        },
    ])
);