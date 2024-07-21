import { CartState, CartAction } from '@/lib/types';

export const initialState = {
    items: {},
};

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
    const newState = { ...state };
    switch (action.type) {
        case 'ADD_PRODUCT':
            let stripeId = action.payload.product.stripe_id;
            let existingProduct = state.items[stripeId];
            if (existingProduct) {
                let newQuantity =
                    existingProduct.quantity + action.payload.quantity;
                action.payload = { ...action.payload, quantity: newQuantity };
            }

            let demoState = {
                items: { ...state.items, [stripeId]: action.payload },
            };
            console.log(demoState);
            return demoState;
        case 'REMOVE_PRODUCT':
            if (state.items[action.payload]) {
                delete newState.items[action.payload];
                return newState;
            }
            return newState;
        case 'UPDATE_PRODUCT':
            stripeId = action.payload.product.stripe_id;
            existingProduct = state.items[stripeId];
            if (existingProduct) {
                existingProduct.quantity = action.payload.quantity;
            }
            return state;
        case 'INIT_STATE':
            return action.payload;
        default:
            return state;
    }
};
