'use client';
import { Fragment, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Tab, Tabs } from '@nextui-org/react';

import { SessionProps } from '@coursefull';
import Loading from '@app/loading';
import Button from '@components/Button/Button';
import { useProtectedEndpoint, useSession } from '@lib/supabase/sessionContext';
import { useToast } from '@lib/use-toast';
import { deleteUser } from '@services/userService';
import { supabase } from '@lib/supabase';

function DeleteAccount({ session }: SessionProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const { toast } = useToast();

    const deleteAccount = async () => {
        console.info('That should have produced a pop up...');
        await deleteUser(session, (error) => {
            console.error(error.message);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
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
    const { toast } = useToast();

    const [firstName, setFirstName] = useState(
        session.user.user_metadata.first_name
    );
    const [lastName, setLastName] = useState(
        session.user.user_metadata.last_name
    );
    const [email, setEmail] = useState(session.user.email!);

    async function updateAccountDetails() {
        const nameUpdateSuccessful = await updateName();
        if (!nameUpdateSuccessful) {
            return;
        }
        const emailUpdateSuccessful = await updateEmail();
        if (!emailUpdateSuccessful) {
            return;
        }
    }

    async function updateName() {
        const { data, error } = await supabase.auth.updateUser({
            data: {
                first_name: firstName,
                last_name: lastName,
            },
        });
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }
        return true;
    }

    async function updateEmail() {
        const { data, error } = await supabase.auth.updateUser({
            email,
        });

        if (error) {
            alert(error.message);
            return false;
        }

        toast({
            title: 'Email Updated',
            description:
                "Please check your inboxes! You'll need to accept the change with both your old and new email.",
            action: (
                <Button
                    onClick={() => {
                        location.reload();
                    }}
                >
                    Ok
                </Button>
            ),
        });
        return true;
    }

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

            <Button buttonType="confirm" onClick={updateAccountDetails}>
                Save Changes
            </Button>
        </div>
    );
}

function Security() {
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

export default function SettingsPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useProtectedEndpoint(session, loadingSession, router);
    return (
        <div className="mt-20 sm:mt-32">
            <div className="my-4">
                <h1>Settings</h1>

                <hr className="border-1 border-primary-100/50 my-2" />
            </div>
            <Suspense fallback={<Loading />}>
                {!loadingSession && session ? (
                    <Tabs
                        aria-label="Deliverables"
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
                            <Security></Security>
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
