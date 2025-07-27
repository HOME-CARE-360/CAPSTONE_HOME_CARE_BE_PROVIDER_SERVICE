import { createZodDto } from "nestjs-zod";
import { GetListWidthDrawQuerySchema, UpdateWithDrawalBodySchema } from "./with-draw.model";

export class GetListWidthDrawQueryDTO extends createZodDto(GetListWidthDrawQuerySchema) { }
export class UpdateWithDrawalBodyDTO extends createZodDto(UpdateWithDrawalBodySchema) { }
