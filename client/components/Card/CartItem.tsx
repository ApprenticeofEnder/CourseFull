'use client';

import { useCart } from '@/lib/cart/cartContext';
import { priceFormatter } from '@/lib/helpers';
import { CartItem } from '@/lib/types';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CartItemProps extends CartItem {
    addQuantity: (quantity: number) => void;
    removeQuantity: (quantity: number) => void;
    removeItem: () => void;
}

export default function CartItemCard({
    product,
    quantity,
    addQuantity,
    removeQuantity,
    removeItem,
}: CartItemProps) {
    return (
        <div className="flex">
            <div className="basis-1/3 p-4">
                <h3 className="text-left">{product.name}</h3>
                <p>{product.description}</p>
            </div>
            <div className="p-4 grid grid-cols-4 gap-4">
                <div className="flex flex-col justify-center">
                    <Button
                        radius="full"
                        startContent={<MinusIcon className="h-6 w-6" />}
                        onPressEnd={() => {
                            removeQuantity(1);
                        }}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h3>{quantity}</h3>
                </div>
                <div className="flex flex-col justify-center">
                    <Button
                        radius="full"
                        startContent={<PlusIcon className="h-6 w-6" />}
                        onPressEnd={() => addQuantity(1)}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <Button
                        radius="full"
                        buttonType="danger"
                        startContent={<XMarkIcon className="h-6 w-6" />}
                        onPressEnd={removeItem}
                    />
                </div>
            </div>
            <div className="col-span-3">
                {priceFormatter.format(product.price / 100)}
            </div>
        </div>
    );
}
