import { useState, useCallback } from "react";
import { NotificationType } from "../App";
import {
  ProductWithUI,
  ProductFormData,
  createProduct,
  generateProductId,
  addDiscountToList,
  removeDiscountFromList,
  updateDiscountQuantity,
  updateDiscountRate,
  createEmptyProductForm,
  createProductFormFromProduct,
} from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { percentToDecimal } from "../utils/formatters";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export const useProducts = (
  initialProducts: ProductWithUI[],
  addNotification: (message: string, type?: NotificationType) => void
) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const [productForm, setProductForm] = useState<ProductFormData>(
    createEmptyProductForm()
  );

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // ============================================================================
  // 상품 CRUD 작업
  // ============================================================================

  /**
   * 새 상품 추가
   */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = createProduct(
        newProduct,
        generateProductId(Date.now())
      );
      setProducts((prev) => [...prev, product]);
      addNotification(`상품 "${product.name}"이(가) 추가되었습니다.`);
    },
    [setProducts, addNotification]
  );

  /**
   * 상품 수정
   */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.");
    },
    [setProducts, addNotification]
  );

  /**
   * 상품 삭제
   */
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      addNotification("상품이 삭제되었습니다.");
    },
    [setProducts, addNotification]
  );

  // ============================================================================
  // 상품 폼 관리
  // ============================================================================

  /**
   * 상품 폼 제출 처리
   */
  const handleProductSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (editingProduct === "new") {
        addProduct(productForm);
      }

      if (editingProduct && editingProduct !== "new") {
        updateProduct(editingProduct, productForm);
      }

      setEditingProduct(null);
      setProductForm(createEmptyProductForm());
      setShowProductForm(false);
    },
    [editingProduct, productForm, addProduct, updateProduct]
  );

  /**
   * 상품 편집 시작
   */
  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm(createProductFormFromProduct(product));
    setShowProductForm(true);
  }, []);

  /**
   * 폼 취소 처리
   */
  const handleCancelClick = useCallback(() => {
    setEditingProduct(null);
    setProductForm(createEmptyProductForm());
    setShowProductForm(false);
  }, []);

  // ============================================================================
  // 할인 관리
  // ============================================================================

  /**
   * 할인 추가
   */
  const handleDiscountAdd = useCallback(() => {
    setProductForm((prev) => ({
      ...prev,
      discounts: addDiscountToList(prev.discounts),
    }));
  }, []);

  /**
   * 할인 제거
   */
  const handleDiscountRemove = useCallback((index: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: removeDiscountFromList(prev.discounts, index),
    }));
  }, []);

  /**
   * 할인 수량 변경
   */
  const handleDiscountQuantityChange = useCallback(
    (index: number, quantity: number) => {
      setProductForm((prev) => ({
        ...prev,
        discounts: updateDiscountQuantity(prev.discounts, index, quantity),
      }));
    },
    []
  );

  /**
   * 할인율 변경
   */
  const handleDiscountRateChange = useCallback(
    (index: number, rate: number) => {
      setProductForm((prev) => ({
        ...prev,
        discounts: updateDiscountRate(
          prev.discounts,
          index,
          percentToDecimal(rate)
        ),
      }));
    },
    []
  );

  return {
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
  };
};
