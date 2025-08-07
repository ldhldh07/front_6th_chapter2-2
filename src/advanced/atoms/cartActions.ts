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

export const addToCartActionAtom = atom(
  null,
  (
    get,
    set,
    {
      product,
      onSuccess,
      onError,
    }: {
      product: Product;
      onSuccess: (message: string) => void;
      onError: (message: string) => void;
    }
  ) => {
    const cart = get(cartAtom);
    const remainingStock = getRemainingStock(product, cart);

    if (remainingStock <= 0) {
      onError("재고가 부족합니다!");
      return;
    }

    const newCart = addItemToCart(cart, product);
    const addedItem = findCartItemByProductId(newCart, product.id);

    if (addedItem && isStockExceeded(addedItem.quantity, product.stock)) {
      onError(`재고는 ${product.stock}개까지만 있습니다.`);
      return;
    }

    set(cartAtom, newCart);
    onSuccess("장바구니에 담았습니다");
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
      onError,
    }: {
      productId: string;
      newQuantity: number;
      products: Product[];
      onError: (message: string) => void;
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
      onError(`재고는 ${product.stock}개까지만 있습니다.`);
      return;
    }

    set(cartAtom, updateCartItemQuantity(cart, productId, newQuantity));
  }
);

export const completeOrderActionAtom = atom(
  null,
  (_get, set, onSuccess: (message: string) => void) => {
    const orderNumber = generateOrderNumber(Date.now());
    onSuccess(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);
    set(cartAtom, []);
  }
);

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
