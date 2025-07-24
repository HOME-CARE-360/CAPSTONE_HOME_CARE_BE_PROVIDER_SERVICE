import { z } from "zod"
import { OrderBy, SortByServiceRequest } from "../../constants/others.constant"
import { RequestStatus } from "@prisma/client"
import { BookingSchema } from "../../models/shared-booking.model"

export const GetServicesRequestQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    location: z.string().optional(),
    status: z.enum([RequestStatus.PENDING, RequestStatus.ESTIMATED, RequestStatus.IN_PROGRESS, RequestStatus.PENDING]).optional(),
    categories: z
        .preprocess((value) => {
            if (typeof value === 'string') {
                return [Number(value)]
            }
            return value
        }, z.array(z.coerce.number().int().positive()))
        .optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortByServiceRequest.CreatedAt, SortByServiceRequest.PreferredDate]).default(SortByServiceRequest.CreatedAt),
})
export const AssignStaffToBookingBodySchema = BookingSchema.pick({
    staffId: true,
    customerId: true,
    serviceRequestId: true,
})


export const CreateBookingBodySchema = BookingSchema.omit({
    updatedAt: true,
    createdAt: true,
    id: true
}).strict()
export const CancelServiceRequestBodySchema = z.object({
    serviceRequestId: z.number(),
}).strict()
export type CancelServiceRequestBodySchema = z.infer<typeof CancelServiceRequestBodySchema>
export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>
export type GetServicesRequestQueryType = z.infer<typeof GetServicesRequestQuerySchema>
export type AssignStaffToBookingBodySchemaType = z.infer<typeof AssignStaffToBookingBodySchema>