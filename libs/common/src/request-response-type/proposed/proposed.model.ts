import { z } from "zod";
import { CreateProposalSchema } from "../../models/shared-proposed.model";

export const CreateProposedServiceSchema = CreateProposalSchema.strict()

export const EditProposedServiceSchema = CreateProposalSchema.omit({ bookingId: true }).extend({
    proposalId: z.number()
})
export type CreateProposedServiceType = z.infer<typeof CreateProposedServiceSchema>
export type EditProposedServiceType = z.infer<typeof EditProposedServiceSchema> 