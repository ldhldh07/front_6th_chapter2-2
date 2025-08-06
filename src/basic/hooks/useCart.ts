import { useState, useEffect, useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getRemainingStock,
  calculateTotalItemCount,
  calculateCartTotal,
  generateOrderNumber,
  isStockExceeded,
  findCartItemByProductId,
} from "../models/cart";
import { findProductById } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { NotificationType } from "../App";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const count = calculateTotalItemCount(cart);
    setCartItemCount(count);
  }, [cart]);

  const addToCart = useCallback(
    (
      product: Product,
      addNotification: (message: string, type?: NotificationType) => void
    ) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const newCart = addItemToCart(cart, product);
      const addedItem = findCartItemByProductId(newCart, product.id);

      if (addedItem && isStockExceeded(addedItem.quantity, product.stock)) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart(newCart);
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(removeItemFromCart(cart, productId));
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      products: Product[],
      addNotification: (message: string, type?: NotificationType) => void
    ) => {
      if (newQuantity <= 0) {
        setCart(removeItemFromCart(cart, productId));
        return;
      }

      const product = findProductById(products, productId);
      if (!product) return;

      if (isStockExceeded(newQuantity, product.stock)) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart(updateCartItemQuantity(cart, productId, newQuantity));
    },
    [cart]
  );

  const completeOrder = useCallback(
    (addNotification: (message: string, type?: NotificationType) => void) => {
      const orderNumber = generateOrderNumber(Date.now());
      addNotification(
        `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        "success"
      );
      setCart([]);
    },
    []
  );

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
