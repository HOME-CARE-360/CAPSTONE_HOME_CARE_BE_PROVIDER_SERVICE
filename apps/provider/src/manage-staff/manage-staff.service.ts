import { Injectable } from '@nestjs/common';
import { InvalidCategoryIdException } from 'libs/common/src/errors/share-category.error';
import { EmailAlreadyExistsException } from 'libs/common/src/errors/share-user.error';
import { SharedCategoryRepository } from 'libs/common/src/repositories/shared-category.repo';
import { ShareStaffRepository } from 'libs/common/src/repositories/shared-staff.repo';
import { SharedUserRepository } from 'libs/common/src/repositories/shared-user.repo';
import { CreateStaffBodyType, GetStaffsQueryType } from 'libs/common/src/request-response-type/provider/manage-staff/manage-staff.model';
import { ManageStaffRepository } from './manage-staff.repo';



@Injectable()
export class ManageStaffService {
    constructor(private readonly sharedStaffRepository: ShareStaffRepository, private readonly sharedCategoryRepository: SharedCategoryRepository, private readonly userRepository: SharedUserRepository, private readonly staffRepository: ManageStaffRepository) {

    }
    async createStaff(providerID: number, body: CreateStaffBodyType) {
        if (await this.userRepository.findUnique({ email: body.email })) {
            throw EmailAlreadyExistsException
        }
        const categoriesDB = (await this.sharedCategoryRepository.findUnique(body.categoryIds)).map((item) => item.id)
        const missingCategory = body.categoryIds.filter((id) => !categoriesDB.includes(id))
        if (missingCategory.length > 0) {
            throw InvalidCategoryIdException(missingCategory)
        }
        return await this.sharedStaffRepository.createStaff(providerID, body)

    }
    async listStaff(query: GetStaffsQueryType, providerID: number) {
        return await this.sharedStaffRepository.listStaff(query, providerID)
    }
    async getAvailableStaff(query: GetStaffsQueryType, providerId: number) {
        console.log(query, providerId);

        return await this.staffRepository.getAvailableStaff(query, providerId)
    }
}
