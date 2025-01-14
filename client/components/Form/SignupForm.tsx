'use client';

import { Fragment, useState } from 'react';
import { Input, Checkbox, Divider, cn } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@components/Button/Button';
import { Endpoints } from '@coursefull';
import { createUser } from '@services/userService';
import LinkButton from '@components/Button/LinkButton';
import { signupSchema, SignupSchema } from '@lib/validation';
import { useSupabase } from '@lib/supabase';

export default function SignupForm({}) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
        control,
    } = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            subscribed: false,
        },
        mode: 'onChange',
    });

    const supabase = useSupabase();

    const signupMutation = useMutation({
        mutationFn: (signupData: SignupSchema) => {
            return createUser(signupData, supabase);
        },
        onSuccess: () => {
            router.push(Endpoints.EMAIL_VERIFY);
            setIsNavigating(true);
        },
    });
    if (signupMutation.error) {
        throw signupMutation.error;
    }
    return (
        <Fragment>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
                <Input
                    type="text"
                    label="First Name"
                    placeholder="First Name"
                    {...register('first_name')}
                    isInvalid={!!errors.first_name}
                    errorMessage={errors.first_name?.message}
                    data-testid="signup-fname"
                />
                <Input
                    type="text"
                    label="Last Name"
                    placeholder="Last Name"
                    {...register('last_name')}
                    isInvalid={!!errors.last_name}
                    errorMessage={errors.last_name?.message}
                    data-testid="signup-lname"
                />
            </div>

            {!!errors.last_name || !getValues('last_name') ? (
                <p className="text-center">
                    <strong>Hint:</strong>{' '}
                    {
                        "If you don't have 2 separate names, just put in 2 hyphens (--) for the last name field."
                    }
                </p>
            ) : (
                <Fragment />
            )}

            <Input
                type="email"
                label="Email"
                placeholder="Email"
                {...register('email')}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                data-testid="signup-email"
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                isInvalid={!!errors.password}
                errorMessage="Please enter a valid password"
                {...register('password')}
                data-testid="signup-password"
            />
            {!!errors.password && (
                <div className="text-success-800">
                    <p>A password must have:</p>
                    <ul>
                        <li>At least 1 uppercase character</li>
                        <li>At least 1 lowercase character</li>
                        <li>At least 1 number</li>
                        <li>10 Characters or more</li>
                    </ul>
                    <strong>We also recommend using a password manager!</strong>
                </div>
            )}
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
                        }}
                    >
                        I want to get emails from CourseFull, including
                        resources for academic success, product updates, and
                        promotional offers.
                    </Checkbox>
                )}
            />
            <Divider className="my-2"></Divider>
            <div className="flex gap-4">
                <LinkButton
                    className="basis-1/2"
                    isLoading={signupMutation.isPending || isNavigating}
                    href={Endpoints.LOGIN}
                    onClick={() => {
                        setIsNavigating(true);
                    }}
                    data-testid="signup-nav-button"
                >
                    Go to Login
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
        </Fragment>
    );
}
