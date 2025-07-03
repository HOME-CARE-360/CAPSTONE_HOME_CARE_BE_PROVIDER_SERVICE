import { Injectable } from '@nestjs/common';
import { RoleType } from 'libs/common/src/models/shared-role.model';
import { CreateServiceType, GetServicesForProviderQueryType, UpdateServiceBodyType } from 'libs/common/src/request-response-type/service/services.model';
import { ManageServicesRepository } from './manager-service.repo';
import { SharedServiceItemRepository } from 'libs/common/src/repositories/shared-service-item.repo';
import { InvalidServiceItemsIdException, ServiceItemNotFoundException } from 'libs/common/src/errors/share-service-item.error';
import { CreateServiceItemType, GetServiceItemParamsType, GetServiceItemsQueryType, UpdateServiceItemType } from 'libs/common/src/request-response-type/service-item/service-item.model';
import { SharedCategoryRepository } from 'libs/common/src/repositories/shared-category.repo';
import { InvalidCategoryIdException } from 'libs/common/src/errors/share-category.error';


@Injectable()
export class ManageServicesService {
    constructor(private readonly servicesRepository: ManageServicesRepository, private readonly serviceItemRepository: SharedServiceItemRepository, private readonly categoryRepository: SharedCategoryRepository) {

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
        if ((await this.categoryRepository.findUnique([data.categoryId])).length < 0) throw InvalidCategoryIdException([data.categoryId])
        return await this.servicesRepository.createService(data, userId, providerId)
    }
    async getListService(data: GetServicesForProviderQueryType & { providerId: number }) {
        return await this.servicesRepository.listForProvider(data)


    }
    async getListServiceItem(data: GetServiceItemsQueryType & { providerId: number }) {
        return await this.servicesRepository.getListServiceItem(data, data.providerId)


    }
    async updateService(data: UpdateServiceBodyType, userId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(data.id, providerId, roles)
        return await this.servicesRepository.updateServices(data, userId)
    }
    async updateServiceItem(data: UpdateServiceItemType, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceItemBelongProvider(data.id, providerId, roles)
        return await this.servicesRepository.updateServiceItem(data)
    }
    async deleteService(serviceId: number, userId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(serviceId, providerId, roles)
        return await this.servicesRepository.deleteService(serviceId, userId)
    }
    async deleteServiceItem(data: GetServiceItemParamsType, providerId: number) {
        if (await this.serviceItemRepository.findUniqueBelongToProvider(data.serviceItemId, providerId)) throw ServiceItemNotFoundException
        return await this.servicesRepository.deleteServiceItem(data)
    }
    async getServiceDetail(serviceId: number, providerId: number, roles: Pick<RoleType, "id" | "name">[]) {
        await this.servicesRepository.serviceBelongProvider(serviceId, providerId, roles)
        const data = await this.servicesRepository.getServiceDetailForProvider(serviceId)
        return data

    }
    async createServiceItem(body: CreateServiceItemType, providerID: number) {
        return await this.servicesRepository.createServiceItem(body, providerID)
    }
    async getServiceItemDetail(data: GetServiceItemParamsType, providerId: number) {
        return await this.servicesRepository.getServiceItemDetail(data, providerId)
    }
}
