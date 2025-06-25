import { createZodDto } from "nestjs-zod";
import { GetServicesRequestQuerySchema } from "./booking.model";


export class GetServicesRequestQueryDTO extends createZodDto(GetServicesRequestQuerySchema) { }