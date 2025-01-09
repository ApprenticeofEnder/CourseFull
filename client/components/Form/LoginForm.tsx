'use client';

import { Input } from '@nextui-org/react';
import { Fragment, useState } from 'react';

import { Endpoints } from '@coursefull';
import { login } from '@services/userService';
import Button from '@components/Button/Button';
import LinkButton from '@components/Button/LinkButton';
import { useRouter } from 'next/navigation';
import { LoginSchema, loginSchema } from '@lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function LoginForm() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: "onChange"
    });

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: LoginSchema) => {
            return login(email, password);
        },
        onSuccess: () => {
            router.push(Endpoints.DASHBOARD);
            setIsNavigating(true);
        },
    });
    if (loginMutation.error) {
        throw loginMutation.error;
    }

    return (
        <Fragment>
            <Input
                type="email"
                label="Email"
                placeholder="Email"
                {...register('email')}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                data-testid="login-email"
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                {...register('password')}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                data-testid="login-password"
            />
            <div className="flex gap-4">
                <LinkButton
                    className="basis-1/2"
                    isLoading={isNavigating}
                    href={Endpoints.SIGN_UP}
                    onClick={()=>{
                        setIsNavigating(true);
                    }}
                    data-testid="signup-nav-button"
                >
                    Go to Signup
                </LinkButton>
                <Button
                    className="basis-1/2"
                    onClick={() => {
                        const submitForm = handleSubmit((data: LoginSchema) => {
                            loginMutation.mutate(data);
                        });
                        submitForm();
                    }}
                    isLoading={loginMutation.isPending || isNavigating}
                    isDisabled={!isValid}
                    buttonType="confirm"
                    data-testid="login-button"
                >
                    {(loginMutation.isPending || isNavigating) ? 'Logging in...' : 'Log In'}
                </Button>
            </div>
        </Fragment>
    );
}
