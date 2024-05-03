import supabase from '@/supabase';
import { Spinner } from '@nextui-org/react';
import { redirect } from 'next/navigation';

export default function Logout() {
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
            throw Error(error.message);
        }
    }

    signOut()
        .then(() => {
            redirect('/');
        })
        .catch((err: Error) => {
            alert(`Error signing out: ${err.message}`);
        });

    return <Spinner label="Signing you out..." color="primary" />;
}
