import { z } from "zod";
import { ServiceItemSchema } from "../../models/shared-service-item.model";

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
export type CreateServiceItemType = z.infer<typeof CreateServiceItemSchema>