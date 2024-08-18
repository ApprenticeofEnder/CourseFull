'use client';
import { Fragment, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Tab, Tabs } from '@nextui-org/react';
import { SessionProps } from '@coursefull';

import Loading from '@app/loading';

import Button from '@components/Button/Button';

import { useProtectedEndpoint, useSession } from '@lib/supabase/sessionContext';
import { deleteUser } from '@services/userService';

function DeleteAccount({ session }: SessionProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const deleteAccount = async () => {
        await deleteUser(session, (error) => {
            console.error(error.message);
        });
    };

    return (
        <div className="bg-danger-200 border-2 border-primary-100/15 rounded-lg p-10 flex flex-col gap-4">
            <h3 className="text-left" data-testid="delete-heading">
                Delete Your Account
            </h3>
            <p>
                <strong>WARNING:</strong> This action is permanent. All data on
                your account, other than anything processed with Stripe (such as
                payment information, purchase receipts, etc.), will be deleted.
            </p>
            <Input
                description="Type 'DELETE' if you're sure you want to do this."
                onValueChange={setDeleteConfirmation}
                value={deleteConfirmation}
                data-testid="delete-confirmation"
            />
            {deleteConfirmation === 'DELETE' ? (
                <Fragment>
                    <p>
                        Well, it was nice knowing you,{' '}
                        {session.user.user_metadata.first_name}! Wishing you all
                        the best.
                    </p>
                    <Button
                        buttonType="danger"
                        onPressEnd={deleteAccount}
                        data-testid="delete-account-btn"
                    >
                        Delete Account
                    </Button>
                </Fragment>
            ) : (
                <></>
            )}
        </div>
    );
}

function AccountDetails({ session }: SessionProps) {
    const [firstName, setFirstName] = useState(
        session.user.user_metadata.first_name
    );
    const [lastName, setLastName] = useState(
        session.user.user_metadata.last_name
    );
    const [email, setEmail] = useState(session.user.email!);

    const updateAccountDetails = async () => {};

    return (
        <div className="bg-primary-800 border-2 border-primary-100/15 rounded-lg p-10 flex flex-col gap-4">
            <h3 className="text-left">
                Account Details - {session.user.user_metadata.first_name}{' '}
                {session.user.user_metadata.last_name}
            </h3>
            <div className="flex justify-between gap-4">
                <Input
                    value={firstName}
                    onValueChange={setFirstName}
                    label="First Name"
                />
                <Input
                    value={lastName}
                    onValueChange={setLastName}
                    label="Last Name"
                />
            </div>
            <Input value={email} onValueChange={setEmail} label="Email" />
            <Button buttonType="confirm">Save Changes</Button>
        </div>
    );
}

function Security({ session }: SessionProps) {
    return (
        <div className="flex flex-col gap-4">
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

export default function SettingsPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useProtectedEndpoint(session, loadingSession, router);
    return (
        <div>
            <div className="my-4">
                <h1>Settings</h1>
            </div>
            <Suspense fallback={<Loading />}>
                {!loadingSession && session ? (
                    <Tabs
                        aria-label="Deliverables"
                        classNames={{
                            tabList:
                                'bg-background-900 gap-6 relative rounded-none p-4',
                            cursor: 'w-full bg-primary-700 group-data-[details=danger]:bg-danger-200 p-4',
                            tabContent:
                                'w-full group-data-[details=danger]:text-danger-800 group-data-[selected=true]:text-foreground font-bold text-lg p-4',
                            panel: 'w-full',
                        }}
                        isVertical
                    >
                        <Tab title="Account Details">
                            <AccountDetails session={session} />
                        </Tab>
                        <Tab title="Security and Passwords">
                            <Security session={session}></Security>
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
