import { Product } from "../../types";
import { formatAdminPrice, formatUserPrice } from "../utils/formatters";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
}

// ============================================================================
// 엔티티를 다루지 않는 함수
// ============================================================================

/**
 * 상품 ID로 상품 찾기
 */
export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => products.find((product) => product.id === productId);

/**
 * 상품이 품절인지 확인
 */
const isSoldOut = (
  productId: string | undefined,
  products: ProductWithUI[]
): boolean => {
  if (!productId) return false;
  const product = findProductById(products, productId);
  return product ? product.stock <= 0 : false;
};
/**
 * 가격 포맷팅
 */
export const formatPrice = (
  price: number,
  productId: string | undefined,
  products: ProductWithUI[],
  isAdmin: boolean
): string => {
  if (isSoldOut(productId, products)) {
    return "SOLD OUT";
  }

  if (isAdmin) {
    return formatAdminPrice(price);
  }

  return formatUserPrice(price);
};

/**
 * 새 상품 추가
 */
export const addProduct = (
  newProduct: Omit<ProductWithUI, "id">,
  products: ProductWithUI[],
  onUpdateProducts: (products: ProductWithUI[]) => void,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const product: ProductWithUI = {
    id: `p${Date.now()}`,
    ...newProduct,
  };
  onUpdateProducts([...products, product]);
  addNotification(`상품 "${product.name}"이(가) 추가되었습니다.`);
};

/**
 * 상품 수정
 */
export const updateProduct = (
  productId: string,
  updates: Partial<ProductWithUI>,
  products: ProductWithUI[],
  onUpdateProducts: (products: ProductWithUI[]) => void,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const updatedProducts = products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  onUpdateProducts(updatedProducts);
  addNotification("상품이 수정되었습니다.");
};

/**
 * 상품 삭제
 */
export const deleteProduct = (
  productId: string,
  products: ProductWithUI[],
  onUpdateProducts: (products: ProductWithUI[]) => void,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const updatedProducts = products.filter(
    (product) => product.id !== productId
  );
  onUpdateProducts(updatedProducts);
  addNotification("상품이 삭제되었습니다.");
};

/**
 * 상품 폼 제출 처리
 */
export const handleProductSubmit = (
  e: React.FormEvent,
  editingProduct: string | null,
  productForm: ProductFormData,
  products: ProductWithUI[],
  onUpdateProducts: (products: ProductWithUI[]) => void,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void,
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>,
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  if (editingProduct === "new") {
    addProduct(productForm, products, onUpdateProducts, addNotification);
  } else if (editingProduct) {
    updateProduct(
      editingProduct,
      productForm,
      products,
      onUpdateProducts,
      addNotification
    );
  }
  setEditingProduct(null);
  setProductForm({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });
  setShowProductForm(false);
};

/**
 * 상품 편집 시작
 */
export const startEditProduct = (
  product: ProductWithUI,
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>,
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditingProduct(product.id);
  setProductForm({
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description || "",
    discounts: product.discounts,
  });
  setShowProductForm(true);
};

/**
 * 폼 취소 처리
 */
export const handleCancelClick = (
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>,
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditingProduct(null);
  setProductForm({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });
  setShowProductForm(false);
};

/**
 * 할인 추가
 */
export const handleDiscountAdd = (
  productForm: ProductFormData,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  setProductForm({
    ...productForm,
    discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
  });
};

/**
 * 할인 제거
 */
export const handleDiscountRemove = (
  index: number,
  productForm: ProductFormData,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
  setProductForm({
    ...productForm,
    discounts: newDiscounts,
  });
};

/**
 * 할인 수량 변경
 */
export const handleDiscountQuantityChange = (
  index: number,
  quantity: number,
  productForm: ProductFormData,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const newDiscounts = [...productForm.discounts];
  newDiscounts[index].quantity = quantity;
  setProductForm({
    ...productForm,
    discounts: newDiscounts,
  });
};

/**
 * 할인율 변경
 */
export const handleDiscountRateChange = (
  index: number,
  rate: number,
  productForm: ProductFormData,
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>
) => {
  const newDiscounts = [...productForm.discounts];
  newDiscounts[index].rate = rate / 100;
  setProductForm({
    ...productForm,
    discounts: newDiscounts,
  });
};

export type { ProductWithUI, ProductFormData };
