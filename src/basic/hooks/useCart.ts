import { useState, useEffect, useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock,
  calculateTotalItemCount,
  generateOrderNumber,
  isStockExceeded,
  isCouponUsageValid,
  findCartItemByProductId,
} from "../models/cart";
import { findProductById } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const count = calculateTotalItemCount(cart);
    setCartItemCount(count);
  }, [cart]);

  const addToCart = useCallback(
    (
      product: Product,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
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
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
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

  const applyCoupon = useCallback(
    (
      coupon: Coupon,
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (!isCouponUsageValid(currentTotal, coupon.discountType)) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon]
  );

  const completeOrder = useCallback(
    (
      addNotification: (
        message: string,
        type?: "error" | "success" | "warning"
      ) => void
    ) => {
      const orderNumber = generateOrderNumber();
      addNotification(
        `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        "success"
      );
      setCart([]);
      setSelectedCoupon(null);
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
      return calculateCartTotal(
        cartItems || cart,
        coupon !== undefined ? coupon : selectedCoupon
      );
    },
    [cart, selectedCoupon]
  );

  return {
    cart,
    setCart,
    cartItemCount,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
    getStockForProduct,
    calculateTotal,
  };
};
