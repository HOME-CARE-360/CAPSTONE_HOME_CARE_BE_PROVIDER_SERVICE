import { Controller } from '@nestjs/common';

import { ZodSerializerDto } from 'nestjs-zod';
import { CreateServicesBodyDTO, DeleteServicesParamDTO, GetServiceResDTO, GetServicesForProviderQueryDTO, GetServicesForProviderResDTO, UpdateServicesBodyDTO } from 'libs/common/src/request-response-type/service/services.dto';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ManageServicesService } from './manage-services.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateServiceItemType, GetServiceItemParamsType, GetServiceItemsQueryType, UpdateServiceItemType } from 'libs/common/src/request-response-type/service-item/service-item.model';
import { RoleType } from 'libs/common/src/models/shared-role.model';
@Controller('manage-services')
export class ManageServicesController {
  constructor(private readonly manageServicesService: ManageServicesService) { }
  @MessagePattern({ cmd: "create-service" })

  @ZodSerializerDto(CreateServicesBodyDTO)
  async createService(@Payload() { body, providerId, userID }: { body: CreateServicesBodyDTO, userID: number, providerId: number }) {
    console.log("create service");
    console.log(body, providerId, userID);
    await this.manageServicesService.createService(body, userID, providerId)
    return {
      message: "Create service successfully"
    }
  }
  @MessagePattern({ cmd: "create-service-item" })

  @ZodSerializerDto(CreateServicesBodyDTO)
  async createServiceItem(@Payload() { body, providerId }: { body: CreateServiceItemType, providerId: number }) {
    console.log("create service item");
    await this.manageServicesService.createServiceItem(body, providerId)
    return {
      message: "Create service item successfully"
    }
  }
  @MessagePattern({ cmd: "update-service-item" })

  @ZodSerializerDto(CreateServicesBodyDTO)
  async updateServiceItem(@Payload() { body, providerId, role }: { body: UpdateServiceItemType, providerId: number, role: Pick<RoleType, "id" | "name">[] }) {
    console.log("create service item");
    await this.manageServicesService.updateServiceItem(body, providerId, role)
    return {
      message: "Update service item successfully"
    }
  }
  @MessagePattern({ cmd: "get-service-item" })

  @ZodSerializerDto(CreateServicesBodyDTO)
  async getServiceItem(@Payload() { query, providerId }: { query: GetServiceItemsQueryType, providerId: number }) {
    console.log(query);
    console.log(providerId);

    const data = await this.manageServicesService.getListServiceItem({
      ...query, providerId


    })
    return {
      data,
      message: "Get services item successfully"
    }
  }
  @MessagePattern({ cmd: "/list-service" })
  @ZodSerializerDto(GetServicesForProviderResDTO)
  list(@Payload() { query, providerID }: { query: GetServicesForProviderQueryDTO, providerID: number }) {
    return this.manageServicesService.getListService({
      ...query, providerId: providerID
    })
  }
  @MessagePattern({ cmd: "/update-service" })
  @ZodSerializerDto(MessageResDTO)
  async updateService(@Payload() { body, user }: { body: UpdateServicesBodyDTO, user: AccessTokenPayload }) {
    const data = await this.manageServicesService.updateService(body, user.userId, user.providerId as number, user.roles)
    return {
      message: `Update service ${data.name} with id:${data.id} successfully`
    }
  }
  @MessagePattern({ cmd: "/delete-service" })
  @ZodSerializerDto(UpdateServicesBodyDTO)
  async deleteService(@Payload() { serviceID, user }: { serviceID: DeleteServicesParamDTO, user: AccessTokenPayload }) {
    const data = await this.manageServicesService.deleteService(serviceID.serviceId, user.userId, user.providerId as number, user.roles)
    return {
      message: `Delete service ${data.name} with id:${data.id} successfully`
    }
  }
  @MessagePattern({ cmd: "delete-service-item" })
  @ZodSerializerDto(UpdateServicesBodyDTO)
  async deleteServiceItem(@Payload() { param, user }: { param: GetServiceItemParamsType, user: AccessTokenPayload }) {
    const data = await this.manageServicesService.deleteServiceItem(param, user.providerId as number)
    return {
      message: `Delete service ${data.name} with id:${data.id} successfully`
    }
  }

  @MessagePattern({ cmd: "get-service-item-detail" })
  async getDetailServiceItem(@Payload() { param, user }: { param: GetServiceItemParamsType, user: AccessTokenPayload }) {

    const data = await this.manageServicesService.getServiceItemDetail(param, user.providerId as number)
    return {
      message: `Get service ${data?.id} detail successfully`,
      data
    }
  }
  @MessagePattern({ cmd: "/detail" })
  @ZodSerializerDto(GetServiceResDTO)
  async getDetailService(@Payload() { serviceID, user }: { serviceID: DeleteServicesParamDTO, user: AccessTokenPayload }) {
    const data = await this.manageServicesService.getServiceDetail(serviceID.serviceId, user.providerId as number, user.roles)
    return {
      message: `Get service ${data.name} detail successfully`,
      data
    }
  }

}
