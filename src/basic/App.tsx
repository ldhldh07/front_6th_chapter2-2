import { useState, useCallback, useEffect } from "react";
import { Coupon } from "../types";
import { CartPage } from "./components/CartPage";
import { AdminPage } from "./components/AdminPage";
import { initialProducts, initialCoupons } from "./constants";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useProducts } from "./hooks/useProducts";
import { useNotifications } from "./hooks/useNotifications";
import { formatPrice } from "./models/product";
import { createEmptyCouponForm } from "./models/coupon";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { CloseIcon, CartIcon } from "./components/icons";

export type NotificationType = "error" | "success" | "warning";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const {
    cart,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    getStockForProduct,
    calculateTotal,
  } = useCart();

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  } = useCoupons({
    coupons,
    onUpdateCoupons: setCoupons,
    addNotification,
    cart,
  });

  const {
    products,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
    handleProductSubmit,
    startEditProduct,
    handleCancelClick,
    handleDiscountAdd,
    handleDiscountRemove,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
  } = useProducts(initialProducts, addNotification);

  const formatPriceWrapper = useCallback(
    (price: number, productId?: string): string => {
      return formatPrice(price, productId, products, isAdmin);
    },
    [products, isAdmin]
  );

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notifications) => (
            <div
              key={notifications.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notifications.type === "error"
                  ? "bg-red-600"
                  : notifications.type === "warning"
                    ? "bg-yellow-600"
                    : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notifications.message}</span>
              <button
                onClick={() => removeNotification(notifications.id)}
                className="text-white hover:text-gray-200"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            formatPrice={formatPriceWrapper}
            addNotification={addNotification}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            emptyCouponForm={createEmptyCouponForm()}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            startEditProduct={startEditProduct}
            handleCancelClick={handleCancelClick}
            handleDiscountAdd={handleDiscountAdd}
            handleDiscountRemove={handleDiscountRemove}
            handleDiscountQuantityChange={handleDiscountQuantityChange}
            handleDiscountRateChange={handleDiscountRateChange}
          />
        ) : (
          <CartPage
            products={products}
            coupons={coupons}
            debouncedSearchTerm={debouncedSearchTerm}
            formatPrice={formatPriceWrapper}
            addNotification={addNotification}
            cart={cart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            completeOrder={completeOrder}
            getStockForProduct={getStockForProduct}
            calculateTotal={calculateTotal}
          />
        )}
      </main>
    </>
  );
};

export default App;
