import { useAtom } from "jotai";
import { Product, CartItem, Coupon } from "../../types";
import Cart from "./cart/Cart";
import { calculateItemTotal } from "../models/cart";
import { ProductList } from "./cart/ProductList";
import { ProductWithUI } from "../models/product";
import { useDebounce } from "../utils/hooks/useDebounce";
import { searchTermAtom } from "../atoms/appAtoms";

interface CartPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addToCart: (
    product: Product,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: Product[],
    onError: (message: string) => void
  ) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: (onSuccess: (message: string) => void) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
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
  cart,
  selectedCoupon,
  setSelectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  completeOrder,
  onSuccess,
  onError,
  getStockForProduct,
  calculateTotal,
}: CartPageProps) => {
  const [searchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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
          onSuccess={onSuccess}
          onError={onError}
          getStockForProduct={getStockForProduct}
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
            onSuccess={onSuccess}
            onError={onError}
            products={products}
          />
        </div>
      </div>
    </div>
  );
};
