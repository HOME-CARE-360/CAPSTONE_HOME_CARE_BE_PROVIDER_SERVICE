import { Controller } from "@nestjs/common";
import { ManageFundingService } from "./manage-funding.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ZodSerializerDto } from "nestjs-zod";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { GetListWidthDrawQueryType } from "libs/common/src/request-response-type/with-draw/with-draw.model";


@Controller('manage-funding')
export class ManageFundingController {
  constructor(private readonly manageFundingService: ManageFundingService) { }
  @MessagePattern({ cmd: "get-list-withdraw" })
  @ZodSerializerDto(MessageResDTO)
  async getListWithDraw(@Payload() { providerId, query }: { query: GetListWidthDrawQueryType, providerId: number }) {
    return await this.manageFundingService.getListWithDraw(query, providerId)

  }
  @MessagePattern({ cmd: "get-withdraw-detail" })
  @ZodSerializerDto(MessageResDTO)
  async getWithDrawDetail(@Payload() { id, providerId }: { id: number, providerId: number, }) {
    return await this.manageFundingService.getWithDrawDetail(id, providerId)

  }
}