'use client';
import { logout } from '@/app/auth/actions';
import Loading from '@/app/loading';
import { useEffect } from 'react';

export default function LogoutPage() {
    useEffect(() => {
        logout();
    });

    return <Loading message="Logging you out..." />;
}
