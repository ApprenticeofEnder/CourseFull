'use client';
import Spacer from '@/components/Spacer';
import Button from '@/components/Button/Button';
import supabase, { useSupabaseSession } from '@/supabase';
import { Input } from '@nextui-org/react';

export default function Signup() {
    const session = useSupabaseSession();
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
    return (
        <main>
            <Spacer>
                <Input type="email" label="Email" placeholder="Email" />
                <Input
                    type="password"
                    label="Password"
                    placeholder="Password"
                />
                <Button className="bg-red-500">Sign Up</Button>
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
