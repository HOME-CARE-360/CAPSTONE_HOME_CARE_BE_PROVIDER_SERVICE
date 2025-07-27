import { z } from "zod";
import { OrderBy, SortByWithDraw } from "../../constants/others.constant";
import { WithdrawalRequestSchema } from "../../models/withdrawal.model";

export const GetListWidthDrawQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: z.enum([
        "APPROVED", "CANCELLED", "COMPLETED", "PENDING", "REJECTED"
    ]).array(),

    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortByWithDraw.CreatedAt, SortByWithDraw.Amount, SortByWithDraw.ProcessedAt]).default(SortByWithDraw.CreatedAt),
})
export const UpdateWithDrawalBodySchema = WithdrawalRequestSchema.pick({
    note: true,
    id: true,
    status: true
})
export const CreateWithdrawBodySchema = WithdrawalRequestSchema.pick({
    amount: true,
})
export type CreateWithdrawBodyType = z.infer<typeof CreateWithdrawBodySchema>
export type UpdateWithDrawalBodyType = z.infer<typeof UpdateWithDrawalBodySchema>
export type GetListWidthDrawQueryType = z.infer<typeof GetListWidthDrawQuerySchema>