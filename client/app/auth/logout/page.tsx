'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';

import { useSupabase } from '@lib/supabase';
import { useCart } from '@lib/cart/CartContext';
import { Endpoints } from '@coursefull';

export default function Logout() {
    const supabase = useSupabase();
    const router = useRouter();
    const { dispatch } = useCart()!;

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
            throw Error(error.message);
        }
    }

    signOut()
        .then(() => {
            dispatch({ type: 'WIPE_CART' });
            router.push(Endpoints.ROOT);
        })
        .catch((err: Error) => {
            console.error(err.message);
        });

    return <Spinner label="Signing you out..." color="primary" />;
}
