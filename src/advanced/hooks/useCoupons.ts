import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import {
  couponsAtom,
  selectedCouponAtom,
  showCouponFormAtom,
} from "../atoms/appAtoms";
import {
  addCouponActionAtom,
  deleteCouponActionAtom,
  applyCouponActionAtom,
  clearSelectedCouponActionAtom,
} from "../atoms/couponActions";
import { Coupon } from "../../types";
import { CouponFormData, createEmptyCouponForm } from "../models/coupon";

export const useCoupons = (onSuccess?: (message: string) => void) => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom);

  const [couponForm, setCouponForm] = useState<CouponFormData>(
    createEmptyCouponForm()
  );

  const addCouponAction = useSetAtom(addCouponActionAtom);
  const deleteCouponAction = useSetAtom(deleteCouponActionAtom);
  const applyCouponAction = useSetAtom(applyCouponActionAtom);
  const clearSelectedCouponAction = useSetAtom(clearSelectedCouponActionAtom);

  const addCoupon = useCallback(
    (newCoupon: Omit<Coupon, "name"> & { name: string }) => {
      if (onSuccess) {
        addCouponAction({ newCoupon, onSuccess });
      } else {
        addCouponAction({ newCoupon, onSuccess: () => {} });
      }
    },
    [addCouponAction, onSuccess]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      if (onSuccess) {
        deleteCouponAction({ couponCode, onSuccess });
      } else {
        deleteCouponAction({ couponCode, onSuccess: () => {} });
      }
    },
    [deleteCouponAction, onSuccess]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCouponAction(coupon);
    },
    [applyCouponAction]
  );

  const clearSelectedCoupon = useCallback(() => {
    clearSelectedCouponAction();
  }, [clearSelectedCouponAction]);

  return {
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,

    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,

    addCouponAction,
    deleteCouponAction,
    applyCouponAction,
    clearSelectedCouponAction,

    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  };
};
