'use client';

import CartItemCard from '@/components/Card/CartItem';
// import LinkButton from '@/components/Button/LinkButton';
import { useCart } from '@/lib/cart/cartContext';
import { CartItem } from '@/lib/types';
import { priceFormatter } from '@/lib/helpers';
import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { Endpoints } from '@/lib/enums';

export default function Checkout() {
    const { cart, dispatch } = useCart()!;

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
        // TODO: Implement
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
                <div>
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
