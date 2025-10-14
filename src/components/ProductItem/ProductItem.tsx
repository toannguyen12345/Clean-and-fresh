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
  const { id, name, price, description, image } = data;
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="w-full max-w-sm rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 relative overflow-visible">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-cover rounded-t-2xl"
        />
      </div>

      <div className="p-5 cursor-pointer" onClick={() => onProductClick?.(id)}>
        <div className="flex justify-between items-start mb-2.5 gap-6">
          <h2 className="text-lg font-bold text-text-dark">{name}</h2>
          <div className="flex flex-col items-end gap-2">
            <RatingStars />
            <AddToCartButton
              onIncrement={() => setQuantity(quantity + 1)}
              onDecrement={() => setQuantity(Math.max(0, quantity - 1))}
              quantity={quantity}
              color="black"
            />
          </div>
        </div>

        <p className="text-text-gray text-sm line-clamp-3 overflow-hidden text-ellipsis">
          {description}
        </p>

        <p className="text-[#ff6347] text-xl font-[700] my-2.5">
          {price.toLocaleString()}VND
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
