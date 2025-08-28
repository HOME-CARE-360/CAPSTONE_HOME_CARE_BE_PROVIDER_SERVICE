import { NotFoundException, ConflictException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export const ProposalAlreadyExistsException = new RpcException(
    new ConflictException([
        { message: 'A proposal already exists for this booking', path: ['bookingId'] },
    ]),
);

export const ProposalNotFoundException = new RpcException(
    new NotFoundException([
        { message: 'Proposal not found', path: ['proposalId'] },
    ]),
);
