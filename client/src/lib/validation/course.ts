import { z } from 'zod';

import { ItemStatus } from '@/types';

export const courseSchema = z.object({
    title: z
        .string()
        .min(2, { message: 'Title must be at least 2 characters long' })
        .max(150, { message: 'Title must not be longer than 150 characters' }),
    course_code: z
        .string()
        .min(2, { message: 'Course code must be at least 2 characters long' })
        .max(16, {
            message: 'Course code must not be longer than 16 characters',
        }),
    status: z.nativeEnum(ItemStatus),
});

export type CourseSchema = z.infer<typeof courseSchema>;
