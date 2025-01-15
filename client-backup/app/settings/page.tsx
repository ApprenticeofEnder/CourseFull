'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/react';

import Loading from '@app/loading';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';

import DeleteAccount from '@components/Settings/DeleteAccount';
import AccountDetails from '@components/Settings/AccountDetails';
import Security from '@components/Settings/Security';

export default function SettingsPage() {
    const { session, loadingSession } = useSession()!;

    useProtectedEndpoint(session, loadingSession);
    return (
        <div>
            <div>
                <h1>Settings</h1>

                <hr className="border-1 border-primary-100/50 my-2" />
            </div>
            <Suspense fallback={<Loading />}>
                {!loadingSession && session ? (
                    <Tabs
                        aria-label="Account Details"
                        className="w-full lg:justify-center"
                        classNames={{
                            tabList:
                                'bg-background-900 gap-6 relative rounded-none p-4 w-full lg:w-fit flex-col lg:flex-row h-fit',
                            cursor: 'w-full bg-primary-700 group-data-[details=danger]:bg-danger-200 p-4',
                            tabContent:
                                'w-full group-data-[details=danger]:text-danger-800 group-data-[selected=true]:text-foreground font-bold text-lg p-4',
                            panel: 'w-full',
                        }}
                    >
                        <Tab title="Account Details">
                            <AccountDetails session={session} />
                        </Tab>
                        <Tab title="Security and Passwords">
                            <Security />
                        </Tab>
                        <Tab
                            title="Delete Your Account"
                            data-details="danger"
                            data-testid="delete-account"
                        >
                            <DeleteAccount session={session} />
                        </Tab>
                    </Tabs>
                ) : (
                    <Loading />
                )}
            </Suspense>
        </div>
    );
}
