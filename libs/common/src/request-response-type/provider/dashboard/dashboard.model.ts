import { z } from 'zod';

export const GranularityEnum = z.enum(['day', 'week', 'month']);
export type Granularity = z.infer<typeof GranularityEnum>;

export const GetProviderStatsQuerySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    granularity: GranularityEnum.default('day'),
});




export const DashboardParamsSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    granularity: GranularityEnum.optional(),
})
    .refine(
        (v) => !(v.startDate && v.endDate) || v.startDate <= v.endDate,
        { path: ['endDate'], message: 'endDate must be >= startDate' }
    );

export type DashboardParamsType = z.infer<typeof DashboardParamsSchema>;
