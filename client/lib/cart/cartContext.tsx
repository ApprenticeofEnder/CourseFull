'use client';

import {
    FC,
    ReactNode,
    Dispatch,
    useReducer,
    createContext,
    useContext,
    useMemo,
    useEffect,
} from 'react';
import { CartAction, CartState } from '@/lib/types';
import { cartReducer, initialState } from '@/lib/cart/cartReducer';

export const CartContext = createContext<{
    cart: CartState;
    dispatch: Dispatch<CartAction>;
} | null>(null);

const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    const contextValue = useMemo(() => {
        return { cart, dispatch };
    }, [cart, dispatch]);

    useEffect(() => {
        let localCart: CartState = JSON.parse(localStorage.getItem('cart')!);
        if (localCart) {
            dispatch({
                type: 'INIT_STATE',
                payload: localCart,
            });
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    return useContext(CartContext);
}

export default CartProvider;
