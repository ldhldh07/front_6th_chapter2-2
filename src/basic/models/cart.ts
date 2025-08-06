import { CartItem, Coupon, Product } from "../../types";

// ============================================================================
// 엔티티를 다루지 않는 함수
// ============================================================================

/**
 * 상품의 기본 할인율 계산 (수량 기반)
 */
const getBaseDiscount = (
  discounts: { quantity: number; rate: number }[],
  quantity: number
): number =>
  discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount,
    0
  );

/**
 * 대량구매 보너스 할인율 계산
 */
const calculateBulkDiscount = (
  baseDiscount: number,
  bonusRate: number = 0.05
): number => baseDiscount + bonusRate;

/**
 * 할인율 상한선 적용
 */
const applyDiscountCap = (
  discountRate: number,
  maxDiscount: number = 0.5
): number => Math.min(discountRate, maxDiscount);

/**
 * 금액 할인 적용 (고정 금액)
 */
const applyAmountDiscount = (
  totalPrice: number,
  discountAmount: number
): number => Math.max(0, totalPrice - discountAmount);

/**
 * 퍼센트 할인 적용 (비율)
 */
const applyPercentageDiscount = (
  totalPrice: number,
  discountPercentage: number
): number => Math.round(totalPrice * (1 - discountPercentage / 100));

/**
 * 남은 재고 계산
 */
const calculateRemainingStock = (stock: number, usedQuantity: number): number =>
  stock - usedQuantity;

// ============================================================================
// 엔티티를 다루는 함수
// ============================================================================

/**
 * 장바구니에 대량구매 아이템이 있는지 확인
 */
const hasBulkPurchase = (
  cartItems: CartItem[],
  bulkThreshold: number = 10
): boolean => cartItems.some((cartItem) => cartItem.quantity >= bulkThreshold);

/**
 * 장바구니에서 특정 상품 아이템 찾기
 */
const findCartItem = (
  cart: CartItem[],
  productId: string
): CartItem | undefined => cart.find((item) => item.product.id === productId);

/**
 * 기존 장바구니 아이템의 수량 업데이트
 */
const updateExistingCartItem = (
  cart: CartItem[],
  productId: string,
  additionalQuantity: number
): CartItem[] =>
  cart.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: item.quantity + additionalQuantity }
      : item
  );

/**
 * 새로운 카트 아이템 생성
 */
const createNewCartItem = (product: Product, quantity: number): CartItem => ({
  product,
  quantity,
});

/**
 * 장바구니에 새 아이템 추가
 */
const addNewItemToCart = (cart: CartItem[], newItem: CartItem): CartItem[] => [
  ...cart,
  newItem,
];

/**
 * 적용 가능한 최대 할인율 계산
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  allCartItems: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = getBaseDiscount(discounts, quantity);

  if (hasBulkPurchase(allCartItems)) {
    const bulkDiscount = calculateBulkDiscount(baseDiscount);
    return applyDiscountCap(bulkDiscount);
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
export const calculateSubtotal = (cart: CartItem[]): number =>
  cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

/**
 * 할인 후 총액 계산
 */
export const calculateDiscountedTotal = (cart: CartItem[]): number =>
  cart.reduce((total, item) => total + calculateItemTotal(item, cart), 0);

/**
 * 쿠폰 할인 적용
 */
export const applyCouponDiscount = (
  totalPrice: number,
  coupon: Coupon
): number => {
  if (coupon.discountType === "amount") {
    return applyAmountDiscount(totalPrice, coupon.discountValue);
  } else {
    return applyPercentageDiscount(totalPrice, coupon.discountValue);
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
  const existingItem = findCartItem(cart, product.id);

  if (existingItem) {
    return updateExistingCartItem(cart, product.id, quantity);
  }

  const newItem = createNewCartItem(product, quantity);
  return addNewItemToCart(cart, newItem);
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => cart.filter((item) => item.product.id !== productId);

/**
 * 남은 재고 계산 (도메인 객체 처리)
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const usedQuantity = cartItem?.quantity || 0;
  return calculateRemainingStock(product.stock, usedQuantity);
};
