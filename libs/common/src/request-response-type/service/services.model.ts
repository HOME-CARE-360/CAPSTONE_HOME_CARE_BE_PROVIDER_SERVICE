



import { z } from "zod";
import { ServiceSchema } from "../../models/shared-services.model";
import { OrderBy, SortBy } from "../../constants/others.constant";
import { Unit } from "@prisma/client";

export const ServiceBodyPrototype = ServiceSchema.pick({
    basePrice: true,
    images: true,
    description: true,
    serviceItemsId: true,
    name: true,
    virtualPrice: true,
    durationMinutes: true,
}).extend({
    categoryId: z.number(),
})
export const CreateServiceBodySchema = ServiceBodyPrototype.strict().extend({
    unit: z.enum([Unit.PER_HOUR, Unit.PER_HOUR, Unit.PER_JOB, Unit.PER_SQUARE_METER]),
}).refine(data => data.virtualPrice < data.basePrice, {
    message: 'Virtual price must be less than base price',
    path: ['virtualPrice'],
})

export const GetServicesResSchema = z.object({
    data: z.array(
        ServiceSchema.omit({ updatedAt: true, deletedAt: true, publishedAt: true, createdById: true, deletedById: true, updatedById: true, createdAt: true, })
    ),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})
export const GetServicesForProviderResSchema = z.object({
    data: z.array(
        ServiceSchema
    ),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})
export const GetServicesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    name: z.string().optional(),
    providerIds: z
        .preprocess((value) => {
            if (typeof value === 'string') {
                return [Number(value)]
            }
            return value
        }, z.array(z.coerce.number().int().positive()))
        .optional(),
    categoryId: z
        .preprocess((value) => {
            if (typeof value === 'string') {
                return [Number(value)]
            }
            return value
        }, z.coerce.number().int().positive())
        .optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    createdById: z.coerce.number().int().positive().optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortBy.CreatedAt, SortBy.Price, SortBy.Discount]).default(SortBy.CreatedAt),
})

export const GetServicesForProviderQuerySchema = GetServicesQuerySchema.omit({
    providerIds: true

});
export const GetServiceParamsSchema = z
    .object({
        serviceId: z.coerce.number().int().positive(),
    })
    .strict()

export const UpdateServiceBodySchema = ServiceBodyPrototype.partial()
    .merge(ServiceSchema.pick({
        id: true,
    }))
    .strict()
    .refine(
        (data) =>
            data.virtualPrice === undefined ||
            data.basePrice === undefined ||
            data.virtualPrice < data.basePrice,
        {
            message: 'Virtual price must be less than base price',
            path: ['virtualPrice'],
        },
    );

export type CreateServiceType = z.infer<typeof CreateServiceBodySchema>
export type GetServicesResType = z.infer<typeof GetServicesResSchema>
export type GetServiceResType = z.infer<typeof ServiceBodyPrototype>
export type GetServicesForProviderResType = z.infer<typeof GetServicesForProviderResSchema>
export type UpdateServiceBodyType = z.infer<typeof UpdateServiceBodySchema>
export type GetServicesQueryType = z.infer<typeof GetServicesQuerySchema>
export type GetServicesForProviderQueryType = z.infer<typeof GetServicesForProviderQuerySchema>
export type DeleteServiceParamsType = z.infer<typeof GetServiceParamsSchema>



