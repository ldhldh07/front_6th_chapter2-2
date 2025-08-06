import { Coupon } from "../../types";

// 쿠폰 폼 데이터 타입
export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

// 빈 쿠폰 폼 생성
export const createEmptyCouponForm = (): CouponFormData => ({
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
});

// 쿠폰 코드 중복 확인
export const isDuplicateCouponCode = (
  coupons: Coupon[],
  code: string
): boolean => {
  return coupons.some((coupon) => coupon.code === code);
};

// 쿠폰 사용 가능 여부 확인 (percentage 쿠폰은 10,000원 이상)
export const isCouponUsageValid = (
  total: number,
  discountType: "amount" | "percentage"
): boolean => {
  if (discountType === "percentage") {
    return total >= 10000;
  }
  return true;
};

// 쿠폰 생성
export const createCoupon = (formData: CouponFormData): Coupon => ({
  name: formData.name,
  code: formData.code,
  discountType: formData.discountType,
  discountValue: formData.discountValue,
});

// 쿠폰 목록에서 특정 쿠폰 제거
export const removeCouponFromList = (
  coupons: Coupon[],
  couponCode: string
): Coupon[] => {
  return coupons.filter((coupon) => coupon.code !== couponCode);
};

// 쿠폰 목록에 새 쿠폰 추가
export const addCouponToList = (
  coupons: Coupon[],
  newCoupon: Coupon
): Coupon[] => {
  return [...coupons, newCoupon];
};

// 쿠폰 할인 적용
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, total - coupon.discountValue);
  } else {
    const discountAmount = total * (coupon.discountValue / 100);
    return Math.max(0, total - discountAmount);
  }
};
