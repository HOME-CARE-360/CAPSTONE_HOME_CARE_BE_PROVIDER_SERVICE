import { z } from 'zod';

export const CreateProposalSchema = z.object({
    bookingId: z.number(),
    notes: z.string().max(1000).optional(),
    services: z.array(z.object({
        serviceId: z.number(),
        quantity: z.number(),
        price: z.number()
    }))
});

