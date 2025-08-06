import { Product, CartItem, Coupon } from "../../types";
import Cart from "./Cart";
import { calculateItemTotal } from "../models/cart";
import { ProductList } from "./ProductList";
import { ProductWithUI } from "../models/product";
import { NotificationType } from "../App";

interface CartPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  debouncedSearchTerm: string;
  addNotification: (message: string, type?: NotificationType) => void;
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addToCart: (
    product: Product,
    addNotification: (message: string, type?: NotificationType) => void
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: Product[],
    addNotification: (message: string, type?: NotificationType) => void
  ) => void;
  applyCoupon: (
    coupon: Coupon,
    addNotification: (message: string, type?: NotificationType) => void
  ) => void;
  completeOrder: (
    addNotification: (message: string, type?: NotificationType) => void
  ) => void;
  getStockForProduct: (product: Product) => number;
  calculateTotal: (
    cartItems?: CartItem[],
    coupon?: Coupon | null
  ) => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export const CartPage = ({
  products,
  coupons,
  debouncedSearchTerm,
  addNotification,
  cart,
  selectedCoupon,
  setSelectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  completeOrder,
  getStockForProduct,
  calculateTotal,
}: CartPageProps) => {
  const totals = calculateTotal(cart, selectedCoupon);

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
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          addToCart={addToCart}
          getStockForProduct={getStockForProduct}
          addNotification={addNotification}
        />
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
            addNotification={addNotification}
            products={products}
          />
        </div>
      </div>
    </div>
  );
};
