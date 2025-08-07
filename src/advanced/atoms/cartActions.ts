import { atom } from "jotai";
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
import { cartAtom } from "./appAtoms";
import {
  addSuccessNotificationActionAtom,
  addErrorNotificationActionAtom,
} from "./notificationActions";

export const addToCartActionAtom = atom(
  null,
  (get, set, { product }: { product: Product }) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);

    if (remainingStock <= 0) {
      set(addErrorNotificationActionAtom, "재고가 부족합니다!");
      return;
    }

    const newCart = addItemToCart(cart, product);
    const addedItem = findCartItemByProductId(newCart, product.id);

    if (addedItem && isStockExceeded(addedItem.quantity, product.stock)) {
      set(
        addErrorNotificationActionAtom,
        `재고는 ${product.stock}개까지만 있습니다.`
      );
      return;
    }

    set(cartAtom, newCart);
    set(addSuccessNotificationActionAtom, "장바구니에 담았습니다");
  }
);

export const removeFromCartActionAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    set(cartAtom, removeItemFromCart(cart, productId));
  }
);

export const updateQuantityActionAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      newQuantity,
      products,
    }: {
      productId: string;
      newQuantity: number;
      products: Product[];
    }
  ) => {
    const cart = get(cartAtom);

    if (newQuantity <= 0) {
      set(cartAtom, removeItemFromCart(cart, productId));
      return;
    }

    const product = findProductById(products, productId);
    if (!product) return;

    if (isStockExceeded(newQuantity, product.stock)) {
      set(
        addErrorNotificationActionAtom,
        `재고는 ${product.stock}개까지만 있습니다.`
      );
      return;
    }

    set(cartAtom, updateCartItemQuantity(cart, productId, newQuantity));
  }
);

export const completeOrderActionAtom = atom(null, (_get, set) => {
  const orderNumber = generateOrderNumber(Date.now());
  set(
    addSuccessNotificationActionAtom,
    `주문이 완료되었습니다. 주문번호: ${orderNumber}`
  );
  set(cartAtom, []);
});

export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return calculateTotalItemCount(cart);
});

export const cartTotalAtom = atom(
  (get) => {
    const cart = get(cartAtom);
    return cart;
  },
  (get, _set, coupon?: Coupon | null) => {
    const cart = get(cartAtom);
    return calculateCartTotal(cart, coupon || null);
  }
);
