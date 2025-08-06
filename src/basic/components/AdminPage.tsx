import { useState } from "react";
import { Coupon } from "../../types";
import { NotificationType } from "../App";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { CouponForm } from "./CouponForm";
import { CouponList } from "./CouponList";
import { ProductWithUI, ProductFormData } from "../models/product";
import { CouponFormData } from "../models/coupon";

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type?: NotificationType) => void;
  couponForm: CouponFormData;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  showCouponForm: boolean;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  emptyCouponForm: CouponFormData;
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  editingProduct: string | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  showProductForm: boolean;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  startEditProduct: (product: ProductWithUI) => void;
  handleCancelClick: () => void;
  handleDiscountAdd: () => void;
  handleDiscountRemove: (index: number) => void;
  handleDiscountQuantityChange: (index: number, quantity: number) => void;
  handleDiscountRateChange: (index: number, rate: number) => void;
}

export const AdminPage = ({
  products,
  coupons,
  formatPrice,
  addNotification,
  couponForm,
  setCouponForm,
  showCouponForm,
  setShowCouponForm,
  addCoupon,
  deleteCoupon,
  emptyCouponForm,
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  showProductForm,
  setShowProductForm,
  deleteProduct,
  handleProductSubmit,
  startEditProduct,
  handleCancelClick,
  handleDiscountAdd,
  handleDiscountRemove,
  handleDiscountQuantityChange,
  handleDiscountRateChange,
}: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  const handleCouponSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addCoupon(couponForm);
    setCouponForm(emptyCouponForm);
    setShowCouponForm(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              상품 관리
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "coupons"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              쿠폰 관리
            </button>
          </nav>
        </div>

        {activeTab === "products" ? (
          <section className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">상품 목록</h2>
                <button
                  onClick={() => {
                    setEditingProduct("new");
                    setShowProductForm(true);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  새 상품 추가
                </button>
              </div>
            </div>

            <ProductTable
              products={products}
              formatPrice={formatPrice}
              startEditProduct={startEditProduct}
              deleteProduct={deleteProduct}
            />
            <ProductForm
              showProductForm={showProductForm}
              editingProduct={editingProduct}
              productForm={productForm}
              setProductForm={setProductForm}
              handleProductSubmit={handleProductSubmit}
              setEditingProduct={setEditingProduct}
              setShowProductForm={setShowProductForm}
              addNotification={addNotification}
              handleCancelClick={handleCancelClick}
              handleDiscountAdd={handleDiscountAdd}
              handleDiscountRemove={handleDiscountRemove}
              handleDiscountQuantityChange={handleDiscountQuantityChange}
              handleDiscountRateChange={handleDiscountRateChange}
            />
          </section>
        ) : (
          <section className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">쿠폰 관리</h2>
            </div>
            <div className="p-6">
              <CouponList
                coupons={coupons}
                deleteCoupon={deleteCoupon}
                setShowCouponForm={setShowCouponForm}
                showCouponForm={showCouponForm}
              />

              <CouponForm
                showCouponForm={showCouponForm}
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                handleCouponSubmit={handleCouponSubmit}
                setShowCouponForm={setShowCouponForm}
                addNotification={addNotification}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
