'use client';

import { Product } from '@/lib/types';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import ConfirmButton from '../Button/ConfirmButton';
import { classNames } from '@/lib/helpers';

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
    const [quantity, setQuantity] = useState(0);

    const numberFormatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    });
    const displayPrice = numberFormatter.format(price / 100);
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
            <h3 className="text-xl sm:text-2xl my-4 font-bold">
                Total: {numberFormatter.format((price * quantity) / 100)}*
            </h3>
            {isCourseTicket && quantity >= 4 ? (
                <h3 className="text-lg sm:text-xl my-4 text-success-800 font-bold">
                    Total (With Coupon):{' '}
                    {numberFormatter.format((price * quantity * 0.8) / 100)}*
                </h3>
            ) : (
                <></>
            )}

            <ConfirmButton
                endContent={<PlusIcon className="h-6 w-6" />}
                className="w-full mt-4"
            >
                Add to Cart
            </ConfirmButton>
            {/* TODO: Add a cart system on the front end */}
            <p className="mt-4">*All prices are in Canadian dollars (CAD).</p>
        </div>
    );
}
