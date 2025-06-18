import { Injectable } from '@nestjs/common';
import { RoleType } from 'libs/common/src/models/shared-role.model';
import { CreateServiceType, GetServicesForProviderQueryType, UpdateServiceBodyType } from 'libs/common/src/request-response-type/service/services.model';
import { ManageServicesRepository } from './manager-service.repo';


@Injectable()
export class ManageServicesService {
    constructor(private readonly servicesRepository: ManageServicesRepository) {

    }
    async createService(data: CreateServiceType, userId: number, providerId: number) {
        await this.servicesRepository.createService(data, userId, providerId)
    }
    async getListService(data: GetServicesForProviderQueryType & { providerId: number }) {
        return await this.servicesRepository.listForProvider(data)


    }
    async updateService(data: UpdateServiceBodyType, userId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(data.id, providerId, roles)
        return await this.servicesRepository.updateServices(data, userId)
    }
    async deleteService(serviceId: number, userId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(serviceId, providerId, roles)
        return await this.servicesRepository.deleteService(serviceId, userId)
    }
    async getServiceDetail(serviceId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(serviceId, providerId, roles)
        const data = await this.servicesRepository.getServiceDetailForProvider(serviceId)
        return data

    }
}
