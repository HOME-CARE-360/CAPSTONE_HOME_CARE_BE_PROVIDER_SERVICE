import { z } from 'zod';

export const GranularityEnum = z.enum(['day', 'week', 'month']);
export type Granularity = z.infer<typeof GranularityEnum>;

const defaultStartDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 29);
    return d;
};
const defaultEndDate = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
};

const StartDateWithDefault = z.preprocess(
    (v) => (v === undefined || v === '' ? defaultStartDate() : v),
    z.coerce.date()
);
const EndDateWithDefault = z.preprocess(
    (v) => (v === undefined || v === '' ? defaultEndDate() : v),
    z.coerce.date()
);

export const GetProviderStatsQuerySchema = z.object({
    startDate: StartDateWithDefault,
    endDate: EndDateWithDefault,
    granularity: GranularityEnum.default('day'),
}).superRefine((val, ctx) => {
    if (val.startDate > val.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'endDate must be >= startDate',
            path: ['endDate'],
        });
    }
});

export type GetProviderStatsQueryType = z.infer<typeof GetProviderStatsQuerySchema>;


