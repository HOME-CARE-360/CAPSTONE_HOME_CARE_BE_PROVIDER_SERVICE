import { createZodDto } from "nestjs-zod";
import { CreateStaffBodySchema, GetStaffsQuerySchema } from "./manage-staff.model";

export class CreateStaffBodyDTO extends createZodDto(CreateStaffBodySchema) { }
export class GetStaffsQueryDTO extends createZodDto(GetStaffsQuerySchema) { }
