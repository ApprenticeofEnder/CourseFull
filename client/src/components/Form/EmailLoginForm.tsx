'use client';

import { Controller, useForm } from 'react-hook-form';
import { Form, Input } from '@nextui-org/react';

import Button from '@/components/Button/Button';

import { useState } from 'react';
import { LoginSchema, loginSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/app/auth/actions';

export default function EmailLoginForm() {
    const [isNavigating, setIsNavigating] = useState<boolean>(false);

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

    const loginMutation = useMutation({
        mutationFn: (loginData: LoginSchema) => {
            return login(loginData);
        },
        onSuccess: () => {
            setIsNavigating(true);
        },
    });
    if (loginMutation.error) {
        throw loginMutation.error;
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2>Log In to CourseFull</h2>
            <Form
                onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
                className="gap-4"
            >
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
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={loginMutation.isPending || isNavigating}
                >
                    Submit
                </Button>
            </Form>
        </div>
    );
}
