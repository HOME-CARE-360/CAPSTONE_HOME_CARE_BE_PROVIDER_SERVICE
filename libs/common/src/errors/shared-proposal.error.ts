import { BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";



export const ProposalAlreadyExistsException = new RpcException(
    new BadRequestException([
        { message: 'Proposal.AlreadyExists', path: 'bookingId' },
    ])
);