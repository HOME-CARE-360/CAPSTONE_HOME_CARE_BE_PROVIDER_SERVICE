import { WithdrawalStatus } from "@prisma/client";
import { z } from "zod";

export const WithdrawalRequestSchema = z.object({
    id: z.number(),
    providerId: z.number(),
    amount: z.number(),
    status: z.enum([WithdrawalStatus.APPROVED, WithdrawalStatus.CANCELLED, WithdrawalStatus.COMPLETED, WithdrawalStatus.PENDING, WithdrawalStatus.REJECTED]),
    note: z.string().nullable().optional(),
    processedById: z.number().nullable().optional(),
    processedAt: z.date().nullable().optional(),
    createdAt: z.date(),
})
