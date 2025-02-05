'use client';

import { Form } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { login } from '@/app/auth/actions';
import Button from '@/components/Button/Button';
import { Input } from '@/components/Form/Input';
import { LoginSchema, loginSchema } from '@/lib/validation';

export default function EmailLoginForm() {
    const [isNavigating, setIsNavigating] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    async function onSubmit(data: LoginSchema) {
        setIsNavigating(true);
        login(data);
    }

    return (
        <div className="flex flex-col gap-4">
            <h2>Log In to CourseFull</h2>
            <Form onSubmit={handleSubmit(onSubmit)} className="gap-4">
                <Input control={control} name="email" label="Email" />
                <Input
                    control={control}
                    name="password"
                    label="Password"
                    type="password"
                />
                <Button
                    className="w-full"
                    buttonType="confirm"
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={isNavigating}
                >
                    {isNavigating ? 'Logging in...' : 'Log In'}
                </Button>
            </Form>
        </div>
    );
}
