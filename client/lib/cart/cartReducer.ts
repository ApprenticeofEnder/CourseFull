import { CartState, CartAction, CartItem } from '@/lib/types';

export const initialState = {
    items: {},
    total: 0,
};

function getCartTotal(state: CartState) {
    return Object.keys(state.items).reduce(
        (currentTotal, itemId) =>
            currentTotal +
            state.items[itemId].quantity * state.items[itemId].product.price,
        0
    );
}

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
    const newState = { ...state };
    let existingProduct: CartItem, tmpState: CartState;
    switch (action.type) {
        case 'ADD_PRODUCT':
            existingProduct = state.items[action.payload.product.stripe_id];
            if (existingProduct) {
                let newQuantity =
                    existingProduct.quantity + action.payload.quantity;
                action.payload = { ...action.payload, quantity: newQuantity };
            }

            tmpState = {
                items: {
                    ...state.items,
                    [action.payload.product.stripe_id]: action.payload,
                },
            };
            return { ...tmpState, total: getCartTotal(tmpState) };
        case 'REMOVE_PRODUCT':
            if (state.items[action.payload]) {
                delete newState.items[action.payload];
                return { ...newState, total: getCartTotal(newState) };
            }
            return newState;
        case 'UPDATE_PRODUCT':
            existingProduct = state.items[action.payload.product.stripe_id];
            if (existingProduct) {
                existingProduct.quantity = action.payload.quantity;
            }

            tmpState = {
                items: {
                    ...state.items,
                    [existingProduct.product.stripe_id]: existingProduct,
                },
            };

            return {
                ...tmpState,
                total: getCartTotal(tmpState),
            };
        case 'WIPE_CART':
            return initialState;
        case 'INIT_STATE':
            return action.payload;
        default:
            return state;
    }
};
