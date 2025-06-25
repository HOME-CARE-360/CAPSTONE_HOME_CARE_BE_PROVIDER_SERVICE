import { Module } from "@nestjs/common";
import { ManageStaffController } from "./manage-staff.controller";
import { ManageStaffService } from "./manage-staff.service";
import { ManageStaffRepository } from "./manage-staff.repo";



@Module({
  controllers: [ManageStaffController],
  providers: [ManageStaffService, ManageStaffRepository],
  exports: [ManageStaffService, ManageStaffRepository],
})
export class ManageStaffModule { }
