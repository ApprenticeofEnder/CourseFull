import { ItemStatus } from '@coursefull';
import { z } from 'zod';

export const DeliverableDtoSchema = z
    .object({
        name: z
            .string()
            .min(2, {
                message: 'Name must be 2 or more characters long',
            })
            .max(150, {
                message: 'Name must not be longer than 150 characters',
            }),
        status: z.nativeEnum(ItemStatus),
        weight: z
            .number()
            .min(0.1, { message: 'Weight must be greater than 0' })
            .max(100, { message: 'Weight must be less than 100' }),
        mark: z
            .number()
            .min(0, { message: 'Mark must be greater than 0' })
            .max(100, { message: 'Mark must be less than 100' }),
        notes: z.string(),
        start_date: z.string().datetime(),
        deadline: z.string().datetime(),
    })
    .refine(
        (deliverable) => {
            return deliverable.start_date < deliverable.deadline;
        },
        {
            message: 'Deadline must be after the start date',
        }
    );

export const CourseDtoSchema = z.object({
    title: z.string(),
});
