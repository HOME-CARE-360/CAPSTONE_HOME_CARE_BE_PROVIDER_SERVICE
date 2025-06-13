import { z } from "zod"
import { RegisterBody } from "../../auth/auth.model"
import { OrderBy, SortBy } from "libs/common/src/constants/others.constant"

export const CreateStaffBodySchema = RegisterBody.omit({ code: true }).extend({
    categoryIds: z.array(z.number())
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Password and confirm password must match',
            path: ['confirmPassword']
        })
    }
})
export const GetStaffsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    name: z.string().optional(),
    isActive: z.boolean().optional(),
    categories: z
        .preprocess((value) => {
            if (typeof value === 'string') {
                return [Number(value)]
            }
            return value
        }, z.array(z.coerce.number().int().positive()))
        .optional(),
    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortBy.CreatedAt]).default(SortBy.CreatedAt),
})
export type CreateStaffBodyType = z.infer<typeof CreateStaffBodySchema>
export type GetStaffsQueryType = z.infer<typeof GetStaffsQuerySchema>
