'use client';

import supabase from '@/supabase';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Endpoints } from '@/lib/helpers';
import React from 'react';

export default function Logout() {
    const router = useRouter();
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
            throw Error(error.message);
        }
    }

    signOut()
        .then(() => {
            router.push(Endpoints.ROOT);
        })
        .catch((err: Error) => {
            console.error(err.message);
        });

    return <Spinner label="Signing you out..." color="primary" />;
}
