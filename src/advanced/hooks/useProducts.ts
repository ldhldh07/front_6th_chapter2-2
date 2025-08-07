import { useAtom, useSetAtom } from "jotai";
import { ProductWithUI } from "../models/product";
import {
  addProductActionAtom,
  updateProductActionAtom,
  deleteProductActionAtom,
  startEditProductActionAtom,
  addDiscountActionAtom,
  removeDiscountActionAtom,
  updateDiscountQuantityActionAtom,
  updateDiscountRateActionAtom,
} from "../atoms/productActions";
import {
  productsAtom,
  productFormAtom,
  editingProductAtom,
} from "../atoms/appAtoms";
import { percentToDecimal } from "../utils/formatters";

export const useProducts = (onSuccess?: (message: string) => void) => {
  // Atom states
  const [products, setProducts] = useAtom(productsAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);

  // Atom actions
  const addProductAction = useSetAtom(addProductActionAtom);
  const updateProductAction = useSetAtom(updateProductActionAtom);
  const deleteProductAction = useSetAtom(deleteProductActionAtom);
  const startEditProductAction = useSetAtom(startEditProductActionAtom);
  const addDiscountAction = useSetAtom(addDiscountActionAtom);
  const removeDiscountAction = useSetAtom(removeDiscountActionAtom);
  const updateDiscountQuantityAction = useSetAtom(
    updateDiscountQuantityActionAtom
  );
  const updateDiscountRateAction = useSetAtom(updateDiscountRateActionAtom);

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    if (onSuccess) {
      addProductAction({ newProduct, onSuccess });
    } else {
      addProductAction({ newProduct, onSuccess: () => {} });
    }
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    if (onSuccess) {
      updateProductAction({ productId, updates, onSuccess });
    } else {
      updateProductAction({ productId, updates, onSuccess: () => {} });
    }
  };

  const deleteProduct = (productId: string) => {
    deleteProductAction(productId);
    if (onSuccess) {
      onSuccess("상품이 삭제되었습니다.");
    }
  };

  return {
    products,
    setProducts,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,

    addProductAction,
    updateProductAction,
    deleteProductAction,
    startEditProductAction,

    addProduct,
    updateProduct,
    deleteProduct,

    addDiscountAction,
    removeDiscountAction,
    updateDiscountQuantityAction,
    updateDiscountRateAction,

    percentToDecimal,
  };
};
