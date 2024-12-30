'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import CartItemCard from '@components/Card/CartItem';
import { useCart } from '@lib/cart/CartContext';
import { priceFormatter } from '@lib/helpers';
import Button from '@components/Button/Button';
import LinkButton from '@components/Button/LinkButton';
import { Endpoints, CartItem, PaymentLinkDto } from '@coursefull';
import { createPayment } from '@services/paymentsService';

import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';

import Loading from '@app/loading';

export default function Checkout() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { cart, dispatch } = useCart()!;
    const [error, setError] = useState<any>(null);

    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    useEffect(() => {
        if (!loadingSession && session) {
            setLoading(false);
        }
    }, [session, loadingSession]);

    const addQuantity = (cartItem: CartItem, quantity: number) => {
        dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
                product: cartItem.product,
                quantity: cartItem.quantity + quantity,
            },
        });
    };

    const removeQuantity = (cartItem: CartItem, quantity: number) => {
        if (cartItem.quantity - quantity < 0) {
            return;
        }
        dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
                product: cartItem.product,
                quantity: cartItem.quantity - quantity,
            },
        });
    };

    const stripeIds = Object.keys(cart.items);

    const createCartItem = (stripeId: string) => {
        const cartItem = cart.items[stripeId];
        return (
            <CartItemCard
                {...cartItem}
                addQuantity={(quantity: number) => {
                    addQuantity(cartItem, quantity);
                }}
                removeQuantity={(quantity: number) => {
                    removeQuantity(cartItem, quantity);
                }}
                removeItem={() => {
                    dispatch({
                        type: 'REMOVE_PRODUCT',
                        payload: cartItem.product.stripe_id,
                    });
                }}
                key={cartItem.product.stripe_id}
            />
        );
    };

    const checkout = async () => {
        try {
            const paymentLink: PaymentLinkDto = await createPayment(
                Object.values(cart.items),
                session
            );
            router.push(paymentLink.redirect);
        }
        catch(err) {
            setError(err);
        }
    };

    if (error) {
        throw error;
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex flex-col justify-start gap-8">
                <h1 className="mb-12">Checkout</h1>
                <div className="grid gap-4">
                    <div>
                        {stripeIds.length
                            ? stripeIds.map(createCartItem)
                            : 'There are no items in your cart.'}
                        <hr className="border-1 border-primary-100/50 my-4" />
                        <div className="p-2">
                            <div className="p-4 lg:px-0 gap-2 lg:gap-4 grid grid-cols-3 lg:grid-cols-5">
                                <h3 className="col-span-2 text-left lg:px-4">
                                    Total
                                </h3>
                                <div className="grid lg:col-span-3 lg:grid-cols-12 gap-2 lg:gap-4">
                                    <h3 className="lg:col-end-12 col-span-2">
                                        {priceFormatter.format(
                                            cart.total! / 100
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <LinkButton href={Endpoints.PRODUCTS}>
                            Continue Shopping
                        </LinkButton>
                        <Button buttonType="confirm" onPressEnd={checkout}>
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
