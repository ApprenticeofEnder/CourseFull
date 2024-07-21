import { CartState, CartAction } from '@/lib/types';

export const initialState = {
    items: {},
};

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
    const newState = { ...state };
    let existingProduct;
    switch (action.type) {
        case 'ADD_PRODUCT':
            existingProduct = state.items[action.payload.product.stripe_id];
            if (existingProduct) {
                let newQuantity =
                    existingProduct.quantity + action.payload.quantity;
                action.payload = { ...action.payload, quantity: newQuantity };
            }

            let demoState = {
                items: {
                    ...state.items,
                    [action.payload.product.stripe_id]: action.payload,
                },
            };
            return demoState;
        case 'REMOVE_PRODUCT':
            if (state.items[action.payload]) {
                delete newState.items[action.payload];
                return newState;
            }
            return newState;
        case 'UPDATE_PRODUCT':
            existingProduct = state.items[action.payload.product.stripe_id];
            if (existingProduct) {
                existingProduct.quantity = action.payload.quantity;
            }

            return {
                items: {
                    ...state.items,
                    [existingProduct.product.stripe_id]: existingProduct,
                },
            };
        case 'INIT_STATE':
            return action.payload;
        default:
            return state;
    }
};
