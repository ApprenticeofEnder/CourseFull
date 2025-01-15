export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: {
        [stripe_id: string]: CartItem;
    };
    total?: number;
}

export type CartAction =
    | { type: 'ADD_PRODUCT'; payload: CartItem }
    | { type: 'UPDATE_PRODUCT'; payload: CartItem }
    | { type: 'REMOVE_PRODUCT'; payload: string }
    | { type: 'INIT_STATE'; payload: CartState }
    | { type: 'WIPE_CART' };
