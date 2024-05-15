'use client';

import { Fragment, useState } from 'react';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints } from '@/lib/enums';
import { useSupabaseSession } from '@/supabase';
import { createUser } from '@/services/userService';

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
                value={fname}
                onValueChange={setFname}
            />
            <Input
                type="text"
                label="Last Name"
                placeholder="Last Name"
                value={lname}
                onValueChange={setLname}
            />
            <Input
                type="email"
                label="Email"
                placeholder="Email"
                value={email}
                onValueChange={setEmail}
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                value={password}
                onValueChange={setPassword}
            />
            <ConfirmButton
                className="w-1/2 m-auto my-2"
                onPressEnd={handleSignUp}
                isLoading={loading}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </ConfirmButton>
        </Fragment>
    );
}
