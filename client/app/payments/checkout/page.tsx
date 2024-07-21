'use client';

import CartItemCard from '@/components/Card/CartItem';
// import LinkButton from '@/components/Button/LinkButton';
import { useCart } from '@/lib/cart/cartContext';

export default function Checkout() {
    const { cart, dispatch } = useCart()!;

    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
                {Object.keys(cart.items).length
                    ? Object.keys(cart.items).map((stripeId) => {
                          const cartItem = cart.items[stripeId];
                          return (
                              <CartItemCard
                                  {...cartItem}
                                  addQuantity={(quantity: number) => {
                                      dispatch({
                                          type: 'UPDATE_PRODUCT',
                                          payload: {
                                              product: cartItem.product,
                                              quantity:
                                                  cartItem.quantity + quantity,
                                          },
                                      });
                                  }}
                                  removeQuantity={(quantity: number) => {
                                      if (cartItem.quantity - quantity < 0) {
                                          return;
                                      }
                                      dispatch({
                                          type: 'UPDATE_PRODUCT',
                                          payload: {
                                              product: cartItem.product,
                                              quantity:
                                                  cartItem.quantity - quantity,
                                          },
                                      });
                                  }}
                                  removeItem={() => {
                                      dispatch({
                                          type: 'REMOVE_PRODUCT',
                                          payload: cartItem.product.stripe_id,
                                      });
                                  }}
                                  key={cartItem.product.stripe_id}
                              ></CartItemCard>
                          );
                      })
                    : 'There are no items in your cart.'}
            </div>
            <div>Hello</div>
        </div>
    );
}
