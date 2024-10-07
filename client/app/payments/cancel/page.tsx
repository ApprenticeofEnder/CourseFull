'use client';

import LinkButton from '@components/Button/LinkButton';
export default function CancelPayment() {
    return (
        <div className="h-dvh flex flex-col justify-center gap-8">
            <h1>Hey, No Worries</h1>
            <p className="text-center text-lg">
                We get it. Being a student is expensive! Or you might not be
                sure you&apos;re in a spot to buy right now.
            </p>

            <p className="text-center text-lg">
                Either way, we&apos;ll keep the servers warm. If and when you
                change your mind, we&apos;ll be here!
            </p>
            <LinkButton href="/" className="w-1/2 mx-auto">
                Back Home
            </LinkButton>
        </div>
    );
}
