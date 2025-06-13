import { z } from "zod"
import { RegisterBody } from "../../auth/auth.model"

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
export type CreateStaffBodyType = z.infer<typeof CreateStaffBodySchema>