import { useState } from 'react';

import { RatingStars, AddToCartButton } from '@/components';

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
              onIncrement={() => setQuantity(quantity + 1)}
              onDecrement={() => setQuantity(Math.max(0, quantity - 1))}
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
