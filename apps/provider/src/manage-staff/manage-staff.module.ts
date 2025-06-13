import { Module } from "@nestjs/common";
import { ManageStaffController } from "./manage-staff.controller";
import { ManageStaffService } from "./manage-staff.service";



@Module({
  controllers: [ManageStaffController],
  providers: [ManageStaffService],
  exports: [ManageStaffService],
})
export class ManageStaffModule { }
