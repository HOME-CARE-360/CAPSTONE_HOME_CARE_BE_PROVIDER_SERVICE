import { createZodDto } from "nestjs-zod";
import { AssignStaffToBookingBodySchema, GetServicesRequestQuerySchema } from "./booking.model";


export class GetServicesRequestQueryDTO extends createZodDto(GetServicesRequestQuerySchema) { }
export class AssignStaffToBookingBodyDTO extends createZodDto(AssignStaffToBookingBodySchema){}