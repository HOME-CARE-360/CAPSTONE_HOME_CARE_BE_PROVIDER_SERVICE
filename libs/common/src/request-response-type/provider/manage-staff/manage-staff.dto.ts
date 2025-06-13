import { createZodDto } from "nestjs-zod";
import { CreateStaffBodySchema } from "./manage-staff.model";

export class CreateStaffBodyDTO extends createZodDto(CreateStaffBodySchema) { }

