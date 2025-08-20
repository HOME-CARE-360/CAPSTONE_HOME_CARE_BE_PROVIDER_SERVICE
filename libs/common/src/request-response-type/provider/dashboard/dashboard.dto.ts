import { createZodDto } from "nestjs-zod";
import { GetProviderStatsQuerySchema } from "./dashboard.model";

export class GetProviderStatsQueryDTO extends createZodDto(GetProviderStatsQuerySchema) { }