'use client';

import { Fragment, useEffect } from 'react';
import { Input, Checkbox } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@components/Button/Button';
import { Endpoints } from '@coursefull';
import { createUser } from '@services/userService';
import { useSession } from '@lib/supabase/SessionContext';
import LinkButton from '@components/Button/LinkButton';
import { signupSchema, SignupSchema } from '@lib/validation';

export default function Signup() {
    const router = useRouter();
    const { session, loadingSession } = useSession();

    const {
        register,
        handleSubmit,
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
    });

    const queryClient = useQueryClient();

    const signupMutation = useMutation({
        mutationFn: (signupData: SignupSchema) => {
            return createUser(signupData);
        },
        onSuccess: () => {
            router.push(Endpoints.EMAIL_VERIFY);
        },
    });
    if (signupMutation.error) {
        throw signupMutation.error;
    }

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.DASHBOARD);
            return;
        }
    }, [session, loadingSession, router]);

    return (
        <Fragment>
            <h1 data-testid="signup-header">Sign up for CourseFull</h1>
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

            {!!errors.last_name ? (
                <p className="text-center">
                    <strong>Hint:</strong> If you don&quot;t have 2 separate
                    names, just put in 2 hyphens (--) for the last name field.
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
            {!!errors.password ? (
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
            ) : (
                <Fragment />
            )}
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                isInvalid={!!errors.password}
                errorMessage="Please enter a valid password"
                {...register('password')}
                data-testid="signup-password"
            />

            <Checkbox
                {...register('subscribed')}
                data-testid="signup-subscribe"
            >
                I want to get emails from CourseFull, including resources for
                academic success, product updates, and promotional offers.
            </Checkbox>

            <div className="flex gap-4">
                <LinkButton
                    className="basis-1/2"
                    isLoading={signupMutation.isPending}
                    href={Endpoints.LOGIN}
                    data-testid="signup-nav-button"
                >
                    Go to Login
                </LinkButton>
                <Button
                    className="basis-1/2"
                    onPressEnd={() => {
                        handleSubmit(async (data: SignupSchema) => {
                            signupMutation.mutate(data);
                        })();
                    }}
                    isLoading={signupMutation.isPending}
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
