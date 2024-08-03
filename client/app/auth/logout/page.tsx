'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';

import { Endpoints } from '@/lib/enums';
import { supabase } from '@/supabase';
import { useCart } from '@/lib/cart/cartContext';

export default function Logout() {
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
