import Cart from "./cart/Cart";
import { ProductList } from "./cart/ProductList";

interface CartPageProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const CartPage = ({ onSuccess, onError }: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList onSuccess={onSuccess} onError={onError} />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart onSuccess={onSuccess} onError={onError} />
        </div>
      </div>
    </div>
  );
};
