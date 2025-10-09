import { useState } from 'react';

import { assets } from '@/assets/assets';
import { RatingStars, AddToCartButton } from '@/components';

interface ProductItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  onProductClick?: (id: string) => void;
}

const ProductItem = ({
  id,
  name,
  price,
  description,
  image,
  onProductClick,
}: ProductItemProps): JSX.Element => {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="w-full rounded-[15px] shadow-[0_0_10px_rgba(0,0,0,0.08)] transition-all duration-300 animate-[fadeIn_1s] hover:scale-105">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-[200px] object-cover rounded-t-[15px]"
        />

        {quantity > 0 ? (
          <div
            className="absolute bottom-[15px] right-[15px] flex items-center px-[6px] py-[6px] rounded-[50px] bg-white"
            style={{ gap: '10px' }}
          >
            <img
              src={assets.remove_icon_red}
              alt="Remove"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-[25px] h-[25px] cursor-pointer"
            />
            <div className="w-[25px] h-[25px] rounded-full bg-[#f0f0f0] flex items-center justify-center">
              <p className="mb-0 font-medium text-sm leading-none">
                {quantity}
              </p>
            </div>
            <img
              src={assets.add_icon_green}
              alt="Add"
              onClick={() => setQuantity(quantity + 1)}
              className="w-[25px] h-[25px] cursor-pointer"
            />
          </div>
        ) : (
          <AddToCartButton
            onClick={() => setQuantity(1)}
            icon={assets.add_icon_white}
          />
        )}
      </div>

      <div className="p-5 cursor-pointer" onClick={() => onProductClick?.(id)}>
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-[25px] font-[700]">{name}</h2>
          <RatingStars />
        </div>

        <p className="text-[#676767] text-xs line-clamp-3 overflow-hidden text-ellipsis">
          {description}
        </p>

        <p className="text-[#ff6347] text-[22px] font-[700] my-2.5">
          {price.toLocaleString()}VND
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
