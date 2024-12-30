'use client';
import { Fragment, useState } from 'react';
import { Input } from '@nextui-org/react';

import { SessionProps } from '@coursefull';
import Button from '@components/Button/Button';
import { useToast } from '@lib/use-toast';
import { deleteUser } from '@services/userService';
import { ensureError } from '@lib/helpers';

export default function DeleteAccount({ session }: SessionProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const { toast } = useToast();

    const deleteAccount = async () => {
        try {
            await deleteUser(session);
        }
        catch(error){
            let actualError = ensureError(error)
            console.error(actualError.message);
            toast({
                title: 'Error',
                description: actualError.message,
                variant: 'destructive',
            });
        }
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