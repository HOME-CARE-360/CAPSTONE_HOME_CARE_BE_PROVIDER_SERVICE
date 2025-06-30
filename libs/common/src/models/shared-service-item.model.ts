import { z } from "zod";

export const ServiceItemSchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(255),
    brand: z.string().max(255).nullable(),
    model: z.string().max(255).nullable(),
    description: z.string().max(1000).nullable(),
    unitPrice: z.number(),
    stockQuantity: z.number(),
    warrantyPeriod: z.number().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
