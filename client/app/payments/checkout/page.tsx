'use client';

import CartItemCard from '@/components/Card/CartItem';
// import LinkButton from '@/components/Button/LinkButton';
import { useCart } from '@/lib/cart/cartContext';
import { CartItem } from '@/lib/types';
import { priceFormatter } from '@/lib/helpers';
import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { Endpoints } from '@/lib/enums';
import { createPayment } from '@/services/paymentsService';
import { useSupabaseSession } from '@/supabase';
import { useRouter } from 'next/navigation';

export default function Checkout() {
    const router = useRouter();

    const { cart, dispatch } = useCart()!;

    const session = useSupabaseSession((session) => {
        if (!session) {
            router.push(Endpoints.ROOT);
        }
    });

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
            ></CartItemCard>
        );
    };

    const checkout = async () => {
        const { response, success } = await createPayment(
            Object.values(cart.items),
            session,
            (error) => {
                try {
                    const errorData = JSON.parse(error.message);
                    const noItemsError =
                        errorData.status === 400 &&
                        errorData.data.error_type === 'empty_cart';
                    if (!noItemsError) {
                    }
                } catch (err) {
                    alert(`Something went wrong: ${error.message}`);
                }
            }
        );
        if (!success) {
            console.log(response?.data);
            return;
        }

        router.push(response?.data.redirect);
    };

    return (
        <div>
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
                                    {priceFormatter.format(cart.total! / 100)}
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
    );
}
