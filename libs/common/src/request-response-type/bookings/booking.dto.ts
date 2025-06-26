import { createZodDto } from "nestjs-zod";
import { GetServicesRequestQuerySchema } from "./booking.model";


export class GetServicesRequestQueryDTO extends createZodDto(GetServicesRequestQuerySchema) { }
export class AssignStaffToBookingBodyDTO = z.infer<typeof AssignStaffToBookingBodySchema>