import { useState, useCallback } from "react";
import { Coupon, CartItem } from "../../types";
import { NotificationType } from "../App";
import {
  CouponFormData,
  createEmptyCouponForm,
  validateCouponApplication,
  removeCouponFromList,
  addCouponToList,
} from "../models/coupon";
import { calculateCartTotal } from "../models/cart";

interface UseCouponsProps {
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  addNotification: (message: string, type?: NotificationType) => void;
  cart?: CartItem[];
}

/**
 * 쿠폰 관리를 위한 커스텀 Hook
 * 쿠폰 폼 상태, 쿠폰 추가/삭제 로직을 관리합니다.
 */
export const useCoupons = ({
  coupons,
  onUpdateCoupons,
  addNotification,
  cart = [],
}: UseCouponsProps) => {
  const [couponForm, setCouponForm] = useState<CouponFormData>(
    createEmptyCouponForm()
  );
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      onUpdateCoupons(addCouponToList(coupons, newCoupon));
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, onUpdateCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      onUpdateCoupons(removeCouponFromList(coupons, couponCode));
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [coupons, onUpdateCoupons, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      const validation = validateCouponApplication(currentTotal, coupon);

      if (!validation.valid) {
        addNotification(validation.message!, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, addNotification]
  );

  return {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
