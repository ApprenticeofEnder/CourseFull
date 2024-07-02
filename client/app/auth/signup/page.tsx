'use client';

import { Fragment, useMemo, useState } from 'react';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints } from '@/lib/enums';
import { useSupabaseSession } from '@/supabase';
import { createUser } from '@/services/userService';
import { validateEmail, validateName, validatePassword } from '@/lib/helpers';

export default function Signup() {
    const router = useRouter();
    useSupabaseSession((session) => {
        if (session) {
            router.push(Endpoints.ROOT);
        }
    });
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
        <Fragment>
            <h1>Sign up for CourseFull</h1>
            <Input
                type="text"
                label="First Name"
                placeholder="First Name"
                isInvalid={invalidFirstName}
                errorMessage="Name should be between 2 and 150 characters long"
                value={fname}
                onValueChange={setFname}
            />
            <Input
                type="text"
                label="Last Name"
                placeholder="Last Name"
                isInvalid={invalidLastName}
                errorMessage="Name should be between 2 and 150 characters long"
                value={lname}
                onValueChange={setLname}
            />
            {invalidLastName || !lname ? (
                <p>
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
            />

            <ConfirmButton
                className="w-1/2 m-auto my-2"
                onPressEnd={handleSignUp}
                isLoading={loading}
                isDisabled={!validForm}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </ConfirmButton>
        </Fragment>
    );
}
