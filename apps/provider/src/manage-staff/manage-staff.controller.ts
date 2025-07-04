import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { CreateStaffBodyType, GetStaffsQueryType } from "libs/common/src/request-response-type/provider/manage-staff/manage-staff.model";
import { ZodSerializerDto } from "nestjs-zod";
import { ManageStaffService } from "./manage-staff.service";
import { GetStaffsQueryDTO } from "libs/common/src/request-response-type/provider/manage-staff/manage-staff.dto";

@Controller('manage-staffs')
export class ManageStaffController {
  constructor(private readonly manageStaffService: ManageStaffService) { }
  @MessagePattern({ cmd: 'create-staff' })
  // @Post("create-staff")
  @ZodSerializerDto(MessageResDTO)
  async createStaff(@Payload() { body, providerID }: { body: CreateStaffBodyType, providerID: number }) {
    return await this.manageStaffService.createStaff(providerID, body)
  }

  @MessagePattern({ cmd: 'get-list-staff' })

  @ZodSerializerDto(MessageResDTO)
  async getListStaff(@Payload() { query, providerID }: { query: GetStaffsQueryDTO, providerID: number }) {


    return await this.manageStaffService.listStaff(query, providerID)
  }
  @MessagePattern({ cmd: 'available-staff' })
  @ZodSerializerDto(MessageResDTO)
  async getAvailableStaff(@Payload() { providerID, query }: { query: GetStaffsQueryType, providerID: number }) {
    return await this.manageStaffService.getAvailableStaff(query, providerID)
  }
}
