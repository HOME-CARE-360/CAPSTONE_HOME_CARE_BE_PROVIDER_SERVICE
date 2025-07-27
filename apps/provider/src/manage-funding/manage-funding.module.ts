import { Module } from "@nestjs/common";
import { ManageFundingController } from "./manage-funding.controller";
import { ManageFundingRepository } from "./manager-funding.repo";
import { ManageFundingService } from "./manage-funding.service";


@Module({
  controllers: [ManageFundingController],
  providers: [ManageFundingRepository, ManageFundingService],
  exports: [ManageFundingRepository, ManageFundingService],
})
export class ManageFundingModule { }
