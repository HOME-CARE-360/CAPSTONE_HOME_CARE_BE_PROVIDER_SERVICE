import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { CreateStaffBodyType } from "../request-response-type/provider/manage-staff/manage-staff.model";
import { SharedUserRepository } from "./shared-user.repo";

import { SharedRoleRepository } from "./shared-role.repo";
@Injectable()
export class ShareStaffRepository {
    constructor(private readonly prismaService: PrismaService, private readonly shareUser: SharedUserRepository, private readonly rolesService: SharedRoleRepository) { }
    async findUniqueStaffAndBelongToProvider(id: number, providerId: number) {
        return await this.prismaService.staff.findUnique({
            where: {
                id: id,
                providerId
            }
        })
    }
    async createStaff(providerID: number, body: Omit<CreateStaffBodyType, "confirmPassword">) {
        const { categoryIds, ...staff } = body
        const staffRole = await this.rolesService.getStaffRoleId()
        const user = await this.shareUser.createUserIncludeRole({
            ...staff, roles: [staffRole]
        })
        console.log("âh");

        await this.prismaService.$transaction(async (tx) => {


            const staffDb = await tx.staff.create({
                data: {
                    userId: user.id,
                    providerId: providerID,
                },

            })
            await tx.staffCategory.createMany({
                data: categoryIds.map((categoryId) => ({
                    staffId: staffDb.id,
                    categoryId,
                })),
            })
        })
        console.log("hi");

        return {
            message: "Create staff successfully"
        }

    }
}