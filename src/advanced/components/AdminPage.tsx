import { useState } from "react";
import { Coupon } from "../../types";
import { CouponForm } from "./admin/CouponForm";
import { ProductWithUI, createEmptyProductForm } from "../models/product";
import { CouponFormData } from "../models/coupon";
import { ProductForm } from "./admin/ProductForm";
import { ProductTable } from "./admin/ProductTable";
import { CouponList } from "./admin/CouponList";
import { useProducts } from "../hooks/useProducts";

interface AdminPageProps {
  coupons: Coupon[];
  couponForm: CouponFormData;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  showCouponForm: boolean;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  emptyCouponForm: CouponFormData;
}

export const AdminPage = ({
  coupons,
  couponForm,
  setCouponForm,
  showCouponForm,
  setShowCouponForm,
  addCoupon,
  deleteCoupon,
  onError,
  onSuccess,
  emptyCouponForm,
}: AdminPageProps) => {
  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    startEditProductAction,
  } = useProducts(onSuccess);

  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [showProductForm, setShowProductForm] = useState(false);

  const handleOpenProductForm = () => {
    setEditingProduct("new");
    setShowProductForm(true);
  };

  const handleStartEditProduct = (product: ProductWithUI) => {
    startEditProductAction(product);
    setShowProductForm(true);
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setProductForm(createEmptyProductForm());
    setShowProductForm(false);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingProduct === "new") {
      addProduct(productForm);
    }

    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
    }

    setShowProductForm(false);
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
                  onClick={handleOpenProductForm}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  새 상품 추가
                </button>
              </div>
            </div>

            <ProductTable
              startEditProduct={handleStartEditProduct}
              onSuccess={onSuccess}
            />
            <ProductForm
              showProductForm={showProductForm}
              handleProductSubmit={handleSubmitForm}
              onError={onError}
              handleCancelClick={handleCancelForm}
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
                setShowCouponForm={setShowCouponForm}
                addCoupon={addCoupon}
                onError={onError}
                emptyCouponForm={emptyCouponForm}
                coupons={coupons}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
