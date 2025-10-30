import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { RatingStars, AddToCartButton } from '@/components';
import { addCart } from '@/apis/cart';
import axiosInstance from '@/lib/axios';
import { getProductQuantityInCart } from '@/utils/cart';
import { isLoggedIn } from '@/utils/auth';

interface UserResponse {
  user?: {
    _id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ProductItemProps {
  data: ProductData;
  onProductClick?: (id: string) => void;
}

const ProductItem = ({
  data,
  onProductClick,
}: ProductItemProps): JSX.Element => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const loadQuantity = async () => {
      const qty = await getProductQuantityInCart(data.id);
      setQuantity(qty);
    };

    loadQuantity();
  }, [data.id]);

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    const savedQuantities = localStorage.getItem('cartQuantities');
    const quantities = savedQuantities ? JSON.parse(savedQuantities) : {};
    quantities[data.id] = newQuantity;
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
  };

  return (
    <div
      className="w-full max-w-sm rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 relative overflow-visible cursor-pointer"
      onClick={() => onProductClick?.(data.id)}
    >
      <div className="relative">
        <img
          src={data.image}
          alt={data.name}
          className="w-full aspect-square object-cover rounded-t-2xl"
        />
      </div>

      <div className="p-5">
        <div className="mb-2.5">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-lg font-bold text-text-dark flex-1">
              {data.name}
            </h2>
            <div className="flex-shrink-0">
              <RatingStars />
            </div>
          </div>
          <div
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToCartButton
              onIncrement={async () => {
                if (!isLoggedIn()) {
                  toast.error(
                    'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
                  );
                  return;
                }

                const newQuantity = quantity + 1;
                updateQuantity(newQuantity);

                try {
                  const response = (await axiosInstance.get(
                    '/API/user/me',
                  )) as UserResponse;
                  const userId = response.user?._id;
                  if (!userId) return;

                  await addCart({
                    product: data.id,
                    user: userId,
                    quantity: 1,
                    productName: data.name,
                    price: data.price,
                  });
                } catch (error) {
                  updateQuantity(quantity);
                }
              }}
              onDecrement={async () => {
                if (quantity <= 0) return;

                const newQuantity = Math.max(0, quantity - 1);
                updateQuantity(newQuantity);

                try {
                  const response = (await axiosInstance.get(
                    '/API/user/me',
                  )) as UserResponse;
                  const userId = response.user?._id;
                  if (!userId) return;

                  await axiosInstance.post(`/API/cart/remove`, {
                    product: data.id,
                    user: userId,
                    quantity: 1,
                    productName: data.name,
                    price: data.price,
                  });
                } catch (error) {
                  updateQuantity(quantity);
                }
              }}
              quantity={quantity}
              color="black"
            />
          </div>
        </div>

        <p className="text-text-gray text-sm line-clamp-3 overflow-hidden text-ellipsis">
          {data.description}
        </p>

        <p className="text-[#ff6347] text-xl font-[700] my-2.5">
          {data.price.toLocaleString()}VND
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
