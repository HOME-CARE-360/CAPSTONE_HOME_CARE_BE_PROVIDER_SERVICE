import { createZodDto } from "nestjs-zod";
import { CreateServiceItemSchema } from "./service-item.model";

export class CreateServiceItemDTO extends createZodDto(CreateServiceItemSchema) { }