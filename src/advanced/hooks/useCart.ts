import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import { getRemainingStock, calculateCartTotal } from "../models/cart";
import { cartAtom } from "../atoms/appAtoms";
import {
  addToCartActionAtom,
  removeFromCartActionAtom,
  updateQuantityActionAtom,
  completeOrderActionAtom,
  cartItemCountAtom,
} from "../atoms/cartActions";

export const useCart = (
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void
) => {
  // Atom states
  const [cart, setCart] = useAtom(cartAtom);
  const [cartItemCount] = useAtom(cartItemCountAtom);

  // Atom actions
  const addToCartAction = useSetAtom(addToCartActionAtom);
  const removeFromCartAction = useSetAtom(removeFromCartActionAtom);
  const updateQuantityAction = useSetAtom(updateQuantityActionAtom);
  const completeOrderAction = useSetAtom(completeOrderActionAtom);

  const addToCart = useCallback(
    (product: Product) => {
      if (onSuccess && onError) {
        addToCartAction({ product, onSuccess, onError });
      } else {
        addToCartAction({
          product,
          onSuccess: () => {},
          onError: () => {},
        });
      }
    },
    [addToCartAction, onSuccess, onError]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartAction(productId);
    },
    [removeFromCartAction]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: Product[]) => {
      if (onError) {
        updateQuantityAction({ productId, newQuantity, products, onError });
      } else {
        updateQuantityAction({
          productId,
          newQuantity,
          products,
          onError: () => {},
        });
      }
    },
    [updateQuantityAction, onError]
  );

  const completeOrder = useCallback(() => {
    if (onSuccess) {
      completeOrderAction(onSuccess);
    } else {
      completeOrderAction(() => {});
    }
  }, [completeOrderAction, onSuccess]);

  const getStockForProduct = useCallback(
    (product: Product): number => {
      return getRemainingStock(product, cart);
    },
    [cart]
  );

  const calculateTotal = useCallback(
    (cartItems?: CartItem[], coupon?: Coupon | null) => {
      return calculateCartTotal(cartItems || cart, coupon || null);
    },
    [cart]
  );

  return {
    cart,
    setCart,
    cartItemCount,

    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,

    getStockForProduct,
    calculateTotal,
  };
};
