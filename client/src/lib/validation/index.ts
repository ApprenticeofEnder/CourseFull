import { ItemStatus } from '@/types';
import { ZonedDateTime } from '@internationalized/date';
import { z } from 'zod';

export function validatePassword(password: string) {
    return password.match(/^.*(?=.{10,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/i);
}

export const deliverableSchema = z
    .object({
        name: z
            .string()
            .min(2, {
                message: 'Name must be at least 2 characters long',
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
        start_date: z.custom<ZonedDateTime>(),
        deadline: z.custom<ZonedDateTime>(),
    })
    .refine(
        (deliverable) => {
            return deliverable.start_date < deliverable.deadline;
        },
        {
            message: 'Deadline must be after the start date',
        }
    );

export type DeliverableSchema = z.infer<typeof deliverableSchema>;

export const deliverableDtoSchema = z
    .object({
        name: z
            .string()
            .min(2, {
                message: 'Name must be at least 2 characters long',
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
            .min(0, { message: 'Mark must be at least 0' })
            .max(100, { message: 'Mark must be at most 100' }),
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

export type DeliverableDtoSchema = z.infer<typeof deliverableDtoSchema>;

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

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema
    .extend({
        first_name: z
            .string()
            .min(2, {
                message: 'First name must be at least 2 characters long',
            })
            .max(150, {
                message: 'First name must not be longer than 150 characters',
            }),
        last_name: z
            .string()
            .min(2, {
                message: 'Last name must be at least 2 characters long',
            })
            .max(150, {
                message: 'Last name must not be longer than 150 characters',
            }),
        subscribed: z.boolean(),
        password: z.string().refine((password)=>{
            return validatePassword(password) || false;
        }),
    });

export type SignupSchema = z.infer<typeof signupSchema>;