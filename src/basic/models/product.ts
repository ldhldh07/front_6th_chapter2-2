import { Product } from "../../types";
import { formatAdminPrice, formatUserPrice } from "../utils/formatters";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductFormData {
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
 * 기본 할인 정보 생성
 */
const createDefaultDiscount = () => ({ quantity: 10, rate: 0.1 });

/**
 * 할인 목록에 새 할인 추가
 */
export const addDiscountToList = (
  discounts: { quantity: number; rate: number }[]
) => [...discounts, createDefaultDiscount()];

/**
 * 할인 목록에서 특정 인덱스 할인 제거
 */
export const removeDiscountFromList = (
  discounts: { quantity: number; rate: number }[],
  index: number
) => discounts.filter((_, i) => i !== index);

/**
 * 할인 목록에서 특정 인덱스의 수량 업데이트
 */
export const updateDiscountQuantity = (
  discounts: { quantity: number; rate: number }[],
  index: number,
  quantity: number
) => {
  const newDiscounts = [...discounts];
  newDiscounts[index].quantity = quantity;
  return newDiscounts;
};

/**
 * 할인 목록에서 특정 인덱스의 할인율 업데이트
 */
export const updateDiscountRate = (
  discounts: { quantity: number; rate: number }[],
  index: number,
  rate: number
) => {
  const newDiscounts = [...discounts];
  newDiscounts[index].rate = rate;
  return newDiscounts;
};

/**
 * 빈 상품 폼 데이터 생성
 */
export const createEmptyProductForm = (): ProductFormData => ({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

/**
 * 상품 정보로부터 폼 데이터 생성
 */
export const createProductFormFromProduct = (
  product: ProductWithUI
): ProductFormData => ({
  name: product.name,
  price: product.price,
  stock: product.stock,
  description: product.description || "",
  discounts: product.discounts,
});

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

// ============================================================================
// 엔티티를 다루는 함수
// ============================================================================

/**
 * 상품 목록에서 특정 상품 업데이트
 */
export const updateProductInList = (
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] =>
  products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );

/**
 * 상품 목록에서 특정 상품 제거
 */
export const removeProductFromList = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] => products.filter((product) => product.id !== productId);

export const generateProductId = (date: number): string => `p${date}`;

export const createProduct = (
  newProduct: Omit<ProductWithUI, "id">,
  id: string
): ProductWithUI => ({
  id,
  ...newProduct,
});
