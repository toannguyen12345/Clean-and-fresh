import { QuantitySelector } from '@/components';

export interface CartItemData {
  id: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

interface CartItemProps {
  data: CartItemData;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({
  data,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  const { id, productName, productPrice, productImage, quantity } = data;

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-gray-50">
      <div className="col-span-2">
        <img
          src={productImage}
          alt={productName}
          className="w-20 h-20 object-cover rounded"
        />
      </div>
      <div className="col-span-4">
        <p className="font-medium text-gray-900">{productName}</p>
        <p className="text-sm text-gray-500">
          {productPrice.toLocaleString('vi-VN')} ₫
        </p>
      </div>
      <div className="col-span-3">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => onIncrease(id)}
          onDecrease={() => onDecrease(id)}
        />
      </div>
      <div className="col-span-2">
        <p className="font-semibold text-gray-900">
          {(productPrice * quantity).toLocaleString('vi-VN')} ₫
        </p>
      </div>
      <div className="col-span-1">
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-700"
        >
          <i className="bx bx-x text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
