import { useState, useCallback, useEffect } from "react";
import { Coupon } from "../types";
import { CartPage } from "./components/CartPage";
import { AdminPage } from "./components/AdminPage";
import { initialProducts, initialCoupons, ProductWithUI } from "./constants";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        // 재고 체크를 위해 간단한 로직 (CartPage에서 더 정확히 계산)
        if (product.stock <= 0) {
          return "SOLD OUT";
        }
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  // 페이지 전환 핸들러
  const handleAdminClick = () => {
    setIsAdmin(true);
  };

  const handleBackToShop = () => {
    setIsAdmin(false);
  };

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                    ? "bg-yellow-600"
                    : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id)
                  )
                }
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          formatPrice={formatPrice}
          addNotification={addNotification}
          onBackToShop={handleBackToShop}
          onUpdateProducts={setProducts}
          onUpdateCoupons={setCoupons}
        />
      ) : (
        <CartPage
          products={products}
          coupons={coupons}
          formatPrice={formatPrice}
          onAdminClick={handleAdminClick}
        />
      )}
    </>
  );
};

export default App;
