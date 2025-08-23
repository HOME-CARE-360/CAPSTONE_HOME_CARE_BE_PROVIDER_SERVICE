
import { ReporterType, ReportStatus } from "@prisma/client"
import { z } from "zod"

export const BookingReportSchema = z.object({
    id: z.number(),
    bookingId: z.number(),
    reporterId: z.number(),
    reporterType: z.enum([ReporterType.CUSTOMER, ReporterType.PROVIDER]),
    reportedCustomerId: z.number().nullable(),
    reportedProviderId: z.number().nullable(),

    reason: z.string().max(255),
    description: z.string().max(2000).nullable(),
    imageUrls: z.array(z.string()),

    status: z.enum([ReportStatus.PENDING, ReportStatus.RESOLVED, ReportStatus.UNDER_REVIEW, ReportStatus.REJECTED]),
    createdAt: z.date(),
    reviewedAt: z.date().nullable(),
    reviewedById: z.number().nullable(),
    note: z.string().max(1000).nullable(),
    reviewResponse: z.string().max(2000).nullable(),
})

export type ProviderReportType = z.infer<typeof BookingReportSchema>
