import { CartItem, Coupon, Product } from "../../types";

/**
 * 적용 가능한 최대 할인율 계산
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  allCartItems: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = allCartItems.some(
    (cartItem) => cartItem.quantity >= 10
  );
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 */
export const calculateItemTotal = (
  item: CartItem,
  allCartItems: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, allCartItems);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 할인 전 총액 계산
 */
export const calculateSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

/**
 * 할인 후 총액 계산
 */
export const calculateDiscountedTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + calculateItemTotal(item, cart);
  }, 0);
};

/**
 * 쿠폰 할인 적용
 */
export const applyCouponDiscount = (
  totalPrice: number,
  coupon: Coupon
): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, totalPrice - coupon.discountValue);
  } else {
    return Math.round(totalPrice * (1 - coupon.discountValue / 100));
  }
};

/**
 * 장바구니 총액 계산 (할인 전/후)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = calculateSubtotal(cart);
  const discountedTotal = calculateDiscountedTotal(cart);
  const totalAfterDiscount = coupon
    ? applyCouponDiscount(discountedTotal, coupon)
    : discountedTotal;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

/**
 * 장바구니에 상품 추가
 */
export const addItemToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cart, { product, quantity }];
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 남은 재고 계산
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
