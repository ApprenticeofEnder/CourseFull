'use client';

import { Checkbox, Form, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { signup } from '@/app/auth/actions';
import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { SignupSchema, signupSchema } from '@/lib/validation';
import { Endpoints } from '@/types';

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

    async function onSubmit(data: SignupSchema) {
        setIsNavigating(true);
        signup(data);
    }

    return (
        <div className="flex flex-col gap-4">
            <h2>Sign Up for CourseFull</h2>
            <Form className="gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
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
                <div className="flex w-full gap-4">
                    <LinkButton
                        className="basis-1/2"
                        isLoading={isNavigating}
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
                        isLoading={isNavigating}
                        isDisabled={!isValid}
                        buttonType="confirm"
                        type="submit"
                        data-testid="signup-button"
                    >
                        {isNavigating ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
