import { BookingStatus } from "@prisma/client";
import { z } from "zod";

export const BookingSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    providerId: z.number(),
    status: z.enum([BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.CONFIRMED, BookingStatus.PENDING]),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    staffId: z.number(),
    serviceRequestId: z.number(),
})
export type BookingType = z.infer<typeof BookingSchema>