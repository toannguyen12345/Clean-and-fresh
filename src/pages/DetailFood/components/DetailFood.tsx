import { useState } from 'react';

import { Button, RatingStars } from '@/components';
import { QuantitySelector } from '@/components/QuantitySelector';

const mockProduct = {
  id: '1',
  name: 'Táo Fuji Nhật Bản',
  description:
    'Táo Fuji nhập khẩu trực tiếp từ Nhật Bản, giòn ngọt, giàu dinh dưỡng. Sản phẩm được trồng theo tiêu chuẩn hữu cơ, không sử dụng hóa chất độc hại.',
  price: 150000,
  image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
  rating: 5,
  reviewCount: 5,
};

const DetailFood = (): JSX.Element => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {};

  const handleBuyNow = () => {};

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <img
            src={mockProduct.image}
            alt={mockProduct.name}
            className="w-full h-4/5 rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mockProduct.name}
          </h1>

          <div className="flex items-center gap-2">
            <RatingStars />
            <span className="text-sm text-gray-600">
              {mockProduct.reviewCount} Customer Review
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {mockProduct.description}
          </p>

          <div className="text-3xl font-bold text-primary">
            {mockProduct.price.toLocaleString('vi-VN')} VND
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
              />

              <Button onClick={handleAddToCart} color="primary" size="lg">
                Thêm vào giỏ hàng
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleBuyNow} color="success" size="lg">
                Mua ngay
              </Button>

              <Button onClick={handleGoBack} color="danger" size="lg" outline>
                Quay về
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFood;
