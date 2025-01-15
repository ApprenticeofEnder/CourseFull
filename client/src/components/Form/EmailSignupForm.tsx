'use client';

import { signup } from '@/app/auth/actions';
import { signupSchema, SignupSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, Form, Input } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import LinkButton from '@/components/Button/LinkButton';
import { Endpoints } from '@/types';
import Button from '@/components/Button/Button';

export default function EmailSignupForm() {
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const {
        handleSubmit,
        formState: { isValid },
        control,
    } = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            subscribed: searchParams.get('subscribed') === 'true',
        },
        mode: 'onChange',
    });

    const signupMutation = useMutation({
        mutationFn: (signupData: SignupSchema) => {
            return signup(signupData);
        },
        onSuccess: () => {
            setIsNavigating(true);
        },
    });
    if (signupMutation.error) {
        throw signupMutation.error;
    }

    return (
        <div className="flex flex-col gap-4">
            <h2>Sign Up for CourseFull</h2>
            <Form
                className="gap-4"
                onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
            >
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Controller
                        control={control}
                        name="first_name"
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
                                label="First Name"
                                name={name}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="last_name"
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
                                label="Last Name"
                                name={name}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                            />
                        )}
                    />
                </div>
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
                        <>
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
                            {error && (
                                <div className="text-success-800">
                                    <p>A password must have:</p>
                                    <ul className="">
                                        <li>At least 1 uppercase character</li>
                                        <li>At least 1 lowercase character</li>
                                        <li>At least 1 number</li>
                                        <li>10 Characters or more</li>
                                    </ul>
                                    <strong>
                                        We also recommend using a password
                                        manager!
                                    </strong>
                                </div>
                            )}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="subscribed"
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            onChange={onChange}
                            isSelected={value}
                            data-testid="signup-subscribe"
                            classNames={{
                                wrapper:
                                    'border-2 border-primary rounded-full group-data-[selected=true]:border-transparent',
                                label: 'w-full',
                            }}
                        >
                            I want to get emails from CourseFull, including
                            resources for academic success, product updates, and
                            promotional offers.
                        </Checkbox>
                    )}
                />
                <div className="flex gap-4 w-full">
                    <LinkButton
                        className="basis-1/2"
                        isLoading={signupMutation.isPending || isNavigating}
                        href={Endpoints.Auth.LOGIN}
                        onPress={() => {
                            setIsNavigating(true);
                        }}
                        data-testid="signup-nav-button"
                    >
                        Have an account?
                    </LinkButton>
                    <Button
                        className="basis-1/2"
                        onPressEnd={() => {
                            const submitForm = handleSubmit(
                                async (data: SignupSchema) => {
                                    signupMutation.mutate(data);
                                }
                            );
                            submitForm();
                        }}
                        isLoading={signupMutation.isPending || isNavigating}
                        isDisabled={!isValid}
                        buttonType="confirm"
                        data-testid="signup-button"
                    >
                        {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
