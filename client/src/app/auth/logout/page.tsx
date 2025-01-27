'use client';

import { useEffect } from 'react';

import { logout } from '@/app/auth/actions';
import Loading from '@/app/loading';

export default function LogoutPage() {
    useEffect(() => {
        logout();
    });

    return <Loading message="Logging you out..." />;
}
