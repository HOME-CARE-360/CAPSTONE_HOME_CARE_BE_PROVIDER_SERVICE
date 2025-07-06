import { z } from "zod";
import { CreateProposalSchema } from "../../models/shared-proposed.model";

export const CreateProposedServiceSchema = CreateProposalSchema.strict()
export type CreateProposedServiceType = z.infer<typeof CreateProposedServiceSchema> 