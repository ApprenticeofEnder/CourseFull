'use client';
import { Fragment, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Tab, Tabs } from '@nextui-org/react';

import { SessionProps } from '@coursefull';
import Loading from '@app/loading';
import Button from '@components/Button/Button';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { useToast } from '@lib/use-toast';
import { deleteUser } from '@services/userService';
import { supabase } from '@lib/supabase';

export default function Security() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-left">Security and Passwords</h3>
            <div className="bg-primary-800 border-2 border-primary-100/15 rounded-lg p-10 flex flex-col gap-4">
                <h3 className="text-left">Change Password</h3>
                <p>Coming soon!</p>
            </div>
            <div className="bg-primary-800 border-2 border-primary-100/15 rounded-lg p-10 flex flex-col gap-4">
                <h3 className="text-left">Multi-Factor Authentication (MFA)</h3>
                <p>Coming soon!</p>
            </div>
        </div>
    );
}