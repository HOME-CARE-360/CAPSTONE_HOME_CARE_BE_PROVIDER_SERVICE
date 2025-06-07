import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ManageServicesService } from './manage-services.service';
import { ZodSerializerDto } from 'nestjs-zod';



import { ApiQuery } from '@nestjs/swagger';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import { CreateServicesBodyDTO, DeleteServicesParamDTO, GetServiceResDTO, GetServicesForProviderQueryDTO, GetServicesForProviderResDTO, UpdateServicesBodyDTO } from 'libs/common/src/request-response-type/service/services.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { OrderBy, SortBy } from 'libs/common/src/constants/others.constant';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';


@Controller('manage-services')
@UseGuards(VerifiedProviderGuard)
export class ManageServicesController {
  constructor(private readonly manageServicesService: ManageServicesService) { }
  @Post("/create-service")

  @ZodSerializerDto(CreateServicesBodyDTO)
  async createService(@Body() body: CreateServicesBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    await this.manageServicesService.createService(body, user.userId, user.providerId as number)
    return {
      message: "Create service successfully"
    }
  }
  @Get("/list-service")
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by service name (partial match)' })
  @ApiQuery({
    name: 'categories',
    required: false,
    isArray: true,
    type: Number,
    description: 'List of category IDs to filter by',
    example: [4, 7],
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum base price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum base price' })
  @ApiQuery({ name: 'createdById', required: false, type: Number, description: 'Filter by creator user ID' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderBy,
    description: 'Sort order: Asc or Desc',
    example: OrderBy.Desc,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
    description: 'Sort field: CreatedAt, Price, or Discount',
    example: SortBy.CreatedAt,
  })
  @ZodSerializerDto(GetServicesForProviderResDTO)
  list(@Query() query: GetServicesForProviderQueryDTO, @ActiveUser("userId") providerID: number) {
    console.log(providerID);

    return this.manageServicesService.getListService({
      ...query, createdById: providerID
    })
  }
  @Patch("/update-service")
  @ZodSerializerDto(MessageResDTO)
  async updateService(@Body() body: UpdateServicesBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    const data = await this.manageServicesService.updateService(body, user.userId, user.providerId as number, user.roles)
    return {
      message: `Update service ${data.name} with id:${data.id} successfully`
    }
  }
  @Patch("/delete-service/:serviceId")

  @ZodSerializerDto(UpdateServicesBodyDTO)
  async deleteService(@Param() serviceID: DeleteServicesParamDTO, @ActiveUser() user: AccessTokenPayload) {
    const data = await this.manageServicesService.deleteService(serviceID.serviceId, user.userId, user.providerId as number, user.roles)
    return {
      message: `Delete service ${data.name} with id:${data.id} successfully`
    }
  }
  @Get("detail/:serviceId")
  @ZodSerializerDto(GetServiceResDTO)
  async getDetailService(@Param() serviceID: DeleteServicesParamDTO, @ActiveUser() user: AccessTokenPayload) {
    const data = await this.manageServicesService.getServiceDetail(serviceID.serviceId, user.providerId as number, user.roles)
    return {
      message: `Get service ${data.name} detail successfully`,
      data
    }
  }

}
