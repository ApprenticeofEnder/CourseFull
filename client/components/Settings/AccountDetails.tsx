'use client';
import { useState } from 'react';
import { Input } from '@nextui-org/react';

import { SessionProps } from '@coursefull';
import Button from '@components/Button/Button';
import { useToast } from '@lib/use-toast';
import { supabase } from '@lib/supabase';

export default function AccountDetails({ session }: SessionProps) {
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