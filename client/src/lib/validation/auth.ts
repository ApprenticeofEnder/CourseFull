import { z } from 'zod';

export function validatePassword(password: string) {
    return password.match(/^.*(?=.{10,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/i);
}

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
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
    password: z.string().refine((password) => {
        return validatePassword(password) || false;
    }),
});

export type SignupSchema = z.infer<typeof signupSchema>;
