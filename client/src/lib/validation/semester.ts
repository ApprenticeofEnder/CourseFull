import { z } from 'zod';

import { ItemStatus } from '@/types';

export const semesterSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters long',
        })
        .max(150, {
            message: 'Name must not be longer than 150 characters',
        }),
    status: z.nativeEnum(ItemStatus),
    goal: z
        .number()
        .min(0.1, { message: 'Goal must be greater than 0' })
        .max(100, { message: 'Goal must be at most 100' }),
});

export type SemesterSchema = z.infer<typeof semesterSchema>;
