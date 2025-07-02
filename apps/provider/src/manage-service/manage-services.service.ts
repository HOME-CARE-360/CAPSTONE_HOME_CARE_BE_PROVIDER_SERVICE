import { Injectable } from '@nestjs/common';
import { RoleType } from 'libs/common/src/models/shared-role.model';
import { CreateServiceType, GetServicesForProviderQueryType, UpdateServiceBodyType } from 'libs/common/src/request-response-type/service/services.model';
import { ManageServicesRepository } from './manager-service.repo';
import { SharedServiceItemRepository } from 'libs/common/src/repositories/shared-service-item.repo';
import { InvalidServiceItemsIdException } from 'libs/common/src/errors/share-service-item.error';
import { CreateServiceItemType } from 'libs/common/src/request-response-type/service-item/service-item.model';


@Injectable()
export class ManageServicesService {
    constructor(private readonly servicesRepository: ManageServicesRepository, private readonly serviceItemRepository: SharedServiceItemRepository) {

    }
    async createService(data: CreateServiceType, userId: number, providerId: number) {
        if (data.serviceItemsId) {
            const existingIds = (await this.serviceItemRepository.findUnique(data.serviceItemsId)).map((item) => item.id)
            const missingIds = data.serviceItemsId.filter(
                id => !existingIds.includes(id)
            );
            if (missingIds.length > 0) {
                throw InvalidServiceItemsIdException(missingIds)
            }

        }
        return await this.servicesRepository.createService(data, userId, providerId)
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
    async createServiceItem(body: CreateServiceItemType, providerID: number) {
        return await this.servicesRepository.createServiceItem(body, providerID)
    }
}
