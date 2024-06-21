'use client';

import LinkButton from '@/components/Button/LinkButton';

export default function CancelPayment() {
    return (
        <div className="h-dvh flex flex-col justify-center gap-8">
            <h1>Payment Successful!</h1>
            <p className="text-center text-lg">
                Thank you so much for your purchase! You should be receiving an
                email confirmation shortly.
            </p>
            <LinkButton href="/" className="w-1/2 mx-auto">
                Back Home
            </LinkButton>
        </div>
    );
}
