import { useState, useCallback } from "react";
import { CartItem, Coupon, Product } from "../../types";
import Cart from "./Cart";
import {
  calculateCartTotal,
  calculateItemTotal,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface CartPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  debouncedSearchTerm: string;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const CartPage = ({
  products,
  coupons,
  cart,
  setCart,
  debouncedSearchTerm,
  formatPrice,
  addNotification,
}: CartPageProps) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);
    return remaining;
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const newCart = addItemToCart(cart, product);
      const addedItem = newCart.find((item) => item.product.id === product.id);

      if (addedItem && addedItem.quantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart(newCart);

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(removeItemFromCart(cart, productId));
    },
    [cart, setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart(updateCartItemQuantity(cart, productId, newQuantity));
    },
    [cart, products, removeFromCart, addNotification, setCart]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const totals = calculateCartTotal(cart, selectedCoupon);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock(product);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* 상품 이미지 영역 (placeholder) */}
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-24 h-24 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {product.isRecommended && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          BEST
                        </span>
                      )}
                      {product.discounts.length > 0 && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          ~
                          {Math.max(...product.discounts.map((d) => d.rate)) *
                            100}
                          %
                        </span>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* 가격 정보 */}
                      <div className="mb-3">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price, product.id)}
                        </p>
                        {product.discounts.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.discounts[0].quantity}개 이상 구매시 할인{" "}
                            {product.discounts[0].rate * 100}%
                          </p>
                        )}
                      </div>

                      {/* 재고 상태 */}
                      <div className="mb-3">
                        {remainingStock <= 5 && remainingStock > 0 && (
                          <p className="text-xs text-red-600 font-medium">
                            품절임박! {remainingStock}개 남음
                          </p>
                        )}
                        {remainingStock > 5 && (
                          <p className="text-xs text-gray-500">
                            재고 {remainingStock}개
                          </p>
                        )}
                      </div>

                      {/* 장바구니 버튼 */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={remainingStock <= 0}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          remainingStock <= 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {remainingStock <= 0 ? "품절" : "장바구니 담기"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            calculateItemTotal={calculateItemTotal}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            totals={totals}
            completeOrder={completeOrder}
          />
        </div>
      </div>
    </div>
  );
};
