import { z } from "zod";
import { ServiceItemSchema } from "../../models/shared-service-item.model";
import { OrderBy, SortBy } from "../../constants/others.constant";

export const CreateServiceItemSchema = ServiceItemSchema.pick({
    name: true,
    unitPrice: true,
    warrantyPeriod: true,
    brand: true,
    description: true,
    isActive: true,
    model: true,
    stockQuantity: true,
}).strict()
export const UpdateServiceItemSchema = ServiceItemSchema.pick({
    name: true,
    unitPrice: true,
    warrantyPeriod: true,
    brand: true,
    description: true,
    isActive: true,
    model: true,
    stockQuantity: true,
    id: true
}).strict()
const isActiveSchema = z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional();
export const GetServiceItemsQuerySchema = z.object({
    isActive: isActiveSchema,
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    name: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortBy.CreatedAt, SortBy.Price]).default(SortBy.CreatedAt),
})
export const GetServiceItemParamsSchema = z
    .object({
        serviceItemId: z.coerce.number().int().positive(),
    })
    .strict()
export type GetServiceItemParamsType = z.infer<typeof GetServiceItemParamsSchema>

export type GetServiceItemsQueryType = z.infer<typeof GetServiceItemsQuerySchema>


export type CreateServiceItemType = z.infer<typeof CreateServiceItemSchema>
export type UpdateServiceItemType = z.infer<typeof UpdateServiceItemSchema>

