'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import Button from '@components/Button/Button';
import { Endpoints } from '@coursefull';
import { createUser } from '@services/userService';
import { validateEmail, validateName, validatePassword } from '@lib/helpers';
import { useSession } from '@lib/supabase/sessionContext';
import LinkButton from '@components/Button/LinkButton';

export default function Signup() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.ROOT);
            return;
        }
    }, [session, loadingSession]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [loading, setLoading] = useState(false);

    const invalidEmail = useMemo(() => {
        if (email === '') return false;

        return validateEmail(email) ? false : true;
    }, [email]);

    const invalidPassword = useMemo(() => {
        if (password === '') return false;

        return validatePassword(password) ? false : true;
    }, [password]);

    const invalidFirstName = useMemo(() => {
        if (fname === '') return false;

        return validateName(fname) ? false : true;
    }, [fname]);

    const invalidLastName = useMemo(() => {
        if (lname === '') return false;

        return validateName(lname) ? false : true;
    }, [lname]);

    const validForm = useMemo(() => {
        const noInvalidData = !(
            invalidEmail ||
            invalidPassword ||
            invalidFirstName ||
            invalidLastName
        );
        const allDataFilled = email && password && fname && lname;
        return noInvalidData && !!allDataFilled;
    }, [
        invalidEmail,
        invalidPassword,
        invalidFirstName,
        invalidLastName,
        email,
        password,
        fname,
        lname,
    ]);

    async function handleSignUp() {
        setLoading(true);
        const { success } = await createUser(
            fname,
            lname,
            email,
            password,
            (error) => {
                alert(`Something went wrong: ${error}`);
                setLoading(false);
            }
        );
        if (success) {
            router.push(Endpoints.EMAIL_VERIFY);
        }
    }

    return (
        <div className="h-dvh flex flex-col justify-center gap-4 sm:w-3/4 mx-auto">
            <h1 data-testid="signup-header">Sign up for CourseFull</h1>
            <Input
                type="text"
                label="First Name"
                placeholder="First Name"
                isInvalid={invalidFirstName}
                errorMessage="Name should be between 2 and 150 characters long"
                value={fname}
                onValueChange={setFname}
                data-testid="signup-fname"
            />
            <Input
                type="text"
                label="Last Name"
                placeholder="Last Name"
                isInvalid={invalidLastName}
                errorMessage="Name should be between 2 and 150 characters long"
                value={lname}
                onValueChange={setLname}
                data-testid="signup-lname"
            />
            {invalidLastName || !lname ? (
                <p className="text-center">
                    <strong>Hint:</strong> If you don't have 2 separate names,
                    just put in 2 hyphens (--) for the last name field.
                </p>
            ) : (
                <Fragment />
            )}

            <Input
                type="email"
                label="Email"
                placeholder="Email"
                isInvalid={invalidEmail}
                errorMessage="Please enter a valid email"
                value={email}
                onValueChange={setEmail}
                data-testid="signup-email"
            />
            {invalidPassword ? (
                <div className="text-success-800">
                    <p>A password must have:</p>
                    <ul>
                        <li>At least 1 uppercase character</li>
                        <li>At least 1 lowercase character</li>
                        <li>At least 1 number</li>
                        <li>At least 1 of the following: !#$%&? _"</li>
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
                isInvalid={invalidPassword}
                errorMessage="Please enter a valid password"
                value={password}
                onValueChange={setPassword}
                data-testid="signup-password"
            />

            <div className="flex gap-4">
                <LinkButton
                    className="basis-1/2"
                    isLoading={loading}
                    href={Endpoints.LOGIN}
                    data-testid="signup-nav-button"
                >
                    Go to Login
                </LinkButton>
                <Button
                    className="basis-1/2"
                    onPressEnd={handleSignUp}
                    isLoading={loading}
                    isDisabled={!validForm}
                    buttonType="confirm"
                    data-testid="signup-button"
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
            </div>
        </div>
    );
}
