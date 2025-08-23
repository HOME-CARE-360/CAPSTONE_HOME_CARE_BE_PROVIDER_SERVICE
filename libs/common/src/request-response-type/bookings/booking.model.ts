import { z } from "zod"
import { OrderBy, ReportSortBy, SortBy, SortByServiceRequest } from "../../constants/others.constant"
import { ReportStatus, RequestStatus } from "@prisma/client"
import { BookingSchema } from "../../models/shared-booking.model"
import { BookingReportSchema } from "../../models/shared-report.model"

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



export const CreateBookingReportBodySchema = BookingReportSchema.pick({
    description: true,
    imageUrls: true,
    note: true,
    reporterType: true,
    reason: true,
    reportedCustomerId: true,
    reportedProviderId: true,
    bookingId: true,

})

export const UpdateProviderReportBodySchema = z.object({
    reason: z.string().max(255).optional(),
    description: z.string().max(2000).optional(),
    imageUrls: z.array(z.string().url()).optional(),
})

export const ReviewProviderReportBodySchema = z.object({
    reportId: z.number().int().positive(),
    status: z.nativeEnum(ReportStatus),
    note: z.string().max(1000).optional(),
})

export const GetProviderReportsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: z.nativeEnum(ReportStatus).optional(),
    reporterId: z.coerce.number().int().positive().optional(),
    reportedCustomerId: z.coerce.number().int().positive().optional(),
    reportedProviderId: z.coerce.number().int().positive().optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([ReportSortBy.CreatedAt]).default(SortBy.CreatedAt),
})

export type CreateBookingReportBodyType = z.infer<typeof CreateBookingReportBodySchema>
export type UpdateProviderReportBodyType = z.infer<typeof UpdateProviderReportBodySchema>
export type ReviewProviderReportBodyType = z.infer<typeof ReviewProviderReportBodySchema>
export type GetProviderReportsQueryType = z.infer<typeof GetProviderReportsQuerySchema>

export type CancelServiceRequestBodySchema = z.infer<typeof CancelServiceRequestBodySchema>
export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>
export type GetServicesRequestQueryType = z.infer<typeof GetServicesRequestQuerySchema>
export type AssignStaffToBookingBodySchemaType = z.infer<typeof AssignStaffToBookingBodySchema>