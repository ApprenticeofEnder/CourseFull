import { Cart, CartItem, Product } from '@/lib/types';
import { useEffect } from 'react';

export type CartObserver = (cart: Cart) => void;

interface CartData {
    [stripe_id: string]: {
        stripe_id: string;
        stripe_price: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
    };
}

class CartSubject {
    private observers: CartObserver[] = [];
    private cartData: CartData | null = null;
    private intervalId: number | null = null;

    public attach(observer: CartObserver) {
        this.observers.push(observer);
        if (this.cartData) {
            return;
        }
    }

    public detatch(observerToRemove: CartObserver) {
        this.observers = this.observers.filter(
            (observer) => observerToRemove !== observer
        );
    }

    public updateCartData() {
        this.intervalId = window.setInterval(() => {}, 1000);
    }

    public addItem(product: Product, quantity: Number) {}

    /**
     * So when do I actually pull from local storage?
     * I guess when you attach the first observer
     */
}
