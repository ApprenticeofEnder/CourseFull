'use client';

import { useCart } from '@/lib/cart/cartContext';
import { priceFormatter } from '@/lib/helpers';
import { CartItem } from '@/coursefull.d';
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
        <div className="grid grid-cols-5 gap-4 rounded-lg bg-primary-800 p-2 border-solid border-2 border-primary-500/10">
            <div className="col-span-5 lg:col-span-2 p-4">
                <h3 className="text-left">{product.name}</h3>
                <p>{product.description}</p>
            </div>
            <div className="col-span-6 lg:col-span-3 grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 p-4 lg:p-0">
                <div className="flex flex-col justify-center lg:col-span-3">
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
                <div className="flex flex-col justify-center lg:col-span-3">
                    <Button
                        radius="full"
                        startContent={<PlusIcon className="h-6 w-6" />}
                        onPressEnd={() => addQuantity(1)}
                    />
                </div>
                <div className="flex flex-col justify-center mt-4 lg:mt-0 lg:col-span-2">
                    <Button
                        radius="full"
                        buttonType="danger"
                        startContent={<XMarkIcon className="h-6 w-6" />}
                        onPressEnd={removeItem}
                    />
                </div>
                <div className="flex flex-col justify-center col-end-4 lg:col-span-2">
                    <h3>
                        {priceFormatter.format(
                            (product.price * quantity) / 100
                        )}
                    </h3>
                </div>
            </div>
        </div>
    );
}
