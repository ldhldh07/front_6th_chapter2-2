import React from "react";
import { NotificationType } from "../../App";
import { ProductFormData } from "../../models/product";
import { CloseIcon } from ".././icons";
import {
  isValidPrice,
  isValidStock,
  safeParseInt,
  extractNumbers,
} from "../../utils/validators";

interface ProductFormProps {
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  handleProductSubmit: (e: React.FormEvent) => void;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  addNotification: (message: string, type?: NotificationType) => void;
  handleCancelClick: () => void;
  handleDiscountAdd: () => void;
  handleDiscountRemove: (index: number) => void;
  handleDiscountQuantityChange: (index: number, quantity: number) => void;
  handleDiscountRateChange: (index: number, rate: number) => void;
}

export const ProductForm = ({
  showProductForm,
  editingProduct,
  productForm,
  setProductForm,
  handleProductSubmit,
  addNotification,
  handleCancelClick,
  handleDiscountAdd,
  handleDiscountRemove,
  handleDiscountQuantityChange,
  handleDiscountRateChange,
}: ProductFormProps) => {
  if (!showProductForm) {
    return null;
  }

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  name: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              type="text"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              type="text"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={(e) => {
                const value = e.target.value;
                const numbersOnly = extractNumbers(value);
                if (value === "" || value === numbersOnly) {
                  setProductForm({
                    ...productForm,
                    price: safeParseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const parsedPrice = safeParseInt(value);

                if (value === "") {
                  setProductForm({ ...productForm, price: 0 });
                } else if (!isValidPrice(parsedPrice)) {
                  addNotification("가격은 0보다 커야 합니다", "error");
                  setProductForm({ ...productForm, price: 0 });
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              type="text"
              value={productForm.stock === 0 ? "" : productForm.stock}
              onChange={(e) => {
                const value = e.target.value;
                const numbersOnly = extractNumbers(value);
                if (value === "" || value === numbersOnly) {
                  setProductForm({
                    ...productForm,
                    stock: safeParseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const parsedStock = safeParseInt(value);

                if (value === "") {
                  setProductForm({ ...productForm, stock: 0 });
                } else if (!isValidStock(parsedStock)) {
                  if (parsedStock < 0) {
                    addNotification("재고는 0보다 커야 합니다", "error");
                    setProductForm({ ...productForm, stock: 0 });
                  } else if (parsedStock > 9999) {
                    addNotification(
                      "재고는 9999개를 초과할 수 없습니다",
                      "error"
                    );
                    setProductForm({ ...productForm, stock: 9999 });
                  }
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) =>
                    handleDiscountQuantityChange(
                      index,
                      safeParseInt(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) =>
                    handleDiscountRateChange(
                      index,
                      safeParseInt(e.target.value)
                    )
                  }
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => handleDiscountRemove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleDiscountAdd}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === "new" ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
};
