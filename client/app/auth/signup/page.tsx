'use client';

import { useState } from 'react';

import Spacer from '@/components/Spacer';
import Button from '@/components/Button/Button';
import supabase, { useSupabaseSession } from '@/supabase';
import { Input } from '@nextui-org/react';

export default function Signup() {
    const session = useSupabaseSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    /**
     * 
const { data, error } = await supabase.auth.signUp(
  {
    email: 'example@email.com',
    password: 'example-password',
    options: {
      data: {
        first_name: 'John',
        age: 27,
      }
    }
  }
)
<ChevronRightIcon className="rotate-90 h-6 w-6" />
     */

    async function supabaseSignUp() {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(`Something went wrong: ${error.message}`);
            return;
        }
    }

    return (
        <main>
            <Spacer>
                <div className="flex flex-row justify-center">
                    <div className="w-3/4 sm:w-1/2 h-dvh flex flex-col justify-center gap-4">
                        <h1>Sign up for CourseFull</h1>
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
                        <Button
                            onPressEnd={supabaseSignUp}
                            className="button-confirm w-1/2 m-auto my-2"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </Spacer>
            {/* 
            Name
            Email
            Password
            Maybe social auth (maybe)
            Submit Button */}
        </main>
    );
}
