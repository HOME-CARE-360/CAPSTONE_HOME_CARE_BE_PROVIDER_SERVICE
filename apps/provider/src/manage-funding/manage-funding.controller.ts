import { Controller } from "@nestjs/common";
import { ManageFundingService } from "./manage-funding.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ZodSerializerDto } from "nestjs-zod";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { CreateWithdrawBodyType, GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model";


@Controller('manage-funding')
export class ManageFundingController {
  constructor(private readonly manageFundingService: ManageFundingService) { }
  @MessagePattern({ cmd: "get-list-withdraw" })
  @ZodSerializerDto(MessageResDTO)
  async getListWithDraw(@Payload() { userId, query }: { query: GetListWidthDrawQueryType, userId: number }) {
    return await this.manageFundingService.getListWithDraw(query, userId)

  }
  @MessagePattern({ cmd: "get-withdraw-detail" })
  @ZodSerializerDto(MessageResDTO)
  async getWithDrawDetail(@Payload() { id, userId }: { id: number, userId: number }) {
    return await this.manageFundingService.getWithDrawDetail(id, userId)

  }
  @MessagePattern({ cmd: "create-withdraw-request" })

  @ZodSerializerDto(MessageResDTO)
  async createWithdrawRequest(@Payload() { data, userId }: { data: CreateWithdrawBodyType, userId: number }) {
    return await this.manageFundingService.createWithdraw(data, userId)

  }
}