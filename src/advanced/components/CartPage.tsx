import { useAtom } from "jotai";
import { Coupon } from "../../types";
import Cart from "./cart/Cart";
import { ProductList } from "./cart/ProductList";
import { useDebounce } from "../utils/hooks/useDebounce";
import { searchTermAtom } from "../atoms/appAtoms";

interface CartPageProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const CartPage = ({
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  onSuccess,
  onError,
}: CartPageProps) => {
  const [searchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          debouncedSearchTerm={debouncedSearchTerm}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
      </div>
    </div>
  );
};
