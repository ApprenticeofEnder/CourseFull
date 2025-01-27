'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input } from "@heroui/react";
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { login } from '@/app/auth/actions';
import Button from '@/components/Button/Button';
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
                <Controller
                    control={control}
                    name="email"
                    render={({
                        field: { name, value, onChange, onBlur, ref },
                        fieldState: { error, invalid },
                    }) => (
                        <Input
                            ref={ref}
                            isRequired
                            errorMessage={error?.message}
                            // Let React Hook Form handle validation instead of the browser.
                            validationBehavior="aria"
                            isInvalid={invalid}
                            label="Email"
                            name={name}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({
                        field: { name, value, onChange, onBlur, ref },
                        fieldState: { error, invalid },
                    }) => (
                        <Input
                            ref={ref}
                            isRequired
                            errorMessage={error?.message}
                            type="password"
                            // Let React Hook Form handle validation instead of the browser.
                            validationBehavior="aria"
                            isInvalid={invalid}
                            label="Password"
                            name={name}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                        />
                    )}
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
