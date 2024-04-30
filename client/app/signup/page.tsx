'use client';
import Spacer from '@/components/Spacer';
import useSupabaseSession from '@/supabase/useSupabaseSession';
import supabase from '@/supabase';

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

     */
    return (
        <main>
            <Spacer>Henlo</Spacer>
            {/* 
            Name
            Email
            Password
            Maybe social auth (maybe)
            Submit Button */}
        </main>
    );
}
