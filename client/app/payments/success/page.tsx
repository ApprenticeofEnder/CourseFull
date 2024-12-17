'use client';

import LinkButton from '@components/Button/LinkButton';
import { useCart } from '@lib/cart/cartContext';

export default function SuccessfulPayment() {
    const { dispatch } = useCart()!;

    dispatch({ type: 'WIPE_CART' });
    return (
        <div className="flex flex-col justify-start gap-8">
            <h1>Payment Successful!</h1>
            <p className="text-center text-lg">
                Thank you so much for your purchase! You should be receiving an
                email confirmation shortly.
            </p>

            <p className="text-center text-lg">
                We really appreciate you helping us keep our servers running!
            </p>
            <LinkButton href="/" className="w-1/2 mx-auto">
                Back Home
            </LinkButton>
        </div>
    );
}
