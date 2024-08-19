'use client';

import { Product } from '@coursefull';
import { useContext, useState } from 'react';
import Button from '@components/Button/Button';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { classNames, priceFormatter } from '@lib/helpers';
import { useCart } from '@lib/cart/cartContext';
import { useRouter } from 'next/navigation';
import { Endpoints } from '@coursefull';

interface ProductCardProps extends Product {
    className: string;
    isCourseTicket?: boolean;
}

export default function ProductCard({
    name,
    description,
    stripe_id,
    stripe_price,
    price,
    className,
    isCourseTicket,
}: ProductCardProps) {
    const router = useRouter();

    const [quantity, setQuantity] = useState(0);
    const [cardLoading, setCardLoading] = useState(false);

    const { cart, dispatch } = useCart()!;

    const displayPrice = priceFormatter.format(price / 100);

    const currentlyInCart = cart.items[stripe_id]?.quantity || 0;

    const addToCart = () => {
        setQuantity(0);
        setCardLoading(true);
        dispatch({
            type: 'ADD_PRODUCT',
            payload: {
                product: {
                    name,
                    description,
                    stripe_id,
                    stripe_price,
                    price,
                },
                quantity,
            },
        });
        router.push(Endpoints.CHECKOUT);
    };

    return (
        <div
            className={classNames(
                'rounded-lg bg-primary-800 p-2 border-solid border-2 border-primary-500/10',
                className
            )}
        >
            <h3>{name}</h3>
            <h3 className="text-xl sm:text-2xl">{displayPrice}*</h3>
            <p className="m-4 text-center">{description}</p>
            <div className="grid grid-cols-3">
                <Button
                    radius="full"
                    startContent={<MinusIcon className="h-6 w-6" />}
                    onPressEnd={() => {
                        const newQuantity = quantity - 1;
                        if (newQuantity >= 0) {
                            setQuantity(newQuantity);
                        }
                    }}
                ></Button>
                <h3>{quantity}</h3>
                <Button
                    radius="full"
                    startContent={<PlusIcon className="h-6 w-6" />}
                    onPressEnd={() => setQuantity(quantity + 1)}
                ></Button>
            </div>
            {currentlyInCart > 0 ? (
                <h3 className="text-xl sm:text-2xl my-4 font-bold">
                    You have {currentlyInCart} in your cart!
                </h3>
            ) : (
                <></>
            )}
            <h3 className="text-xl sm:text-2xl my-4 font-bold">
                Total:{' '}
                {priceFormatter.format(
                    (price * (currentlyInCart + quantity)) / 100
                )}
                *
            </h3>
            {isCourseTicket && currentlyInCart + quantity >= 4 ? (
                <h3 className="text-lg sm:text-xl my-4 text-success-800 font-bold">
                    Total (With Coupon):{' '}
                    {priceFormatter.format(
                        (price * (currentlyInCart + quantity) * 0.8) / 100
                    )}
                    *
                </h3>
            ) : (
                <></>
            )}

            <Button
                endContent={<PlusIcon className="h-6 w-6" />}
                className="w-full mt-4"
                onPressEnd={addToCart}
                isDisabled={quantity === 0}
                isLoading={cardLoading}
                buttonType="confirm"
            >
                Add to Cart
            </Button>
            <p className="mt-4">*All prices are in Canadian dollars (CAD).</p>
        </div>
    );
}
