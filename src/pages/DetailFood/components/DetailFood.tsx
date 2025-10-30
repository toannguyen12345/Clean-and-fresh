import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, RatingStars } from '@/components';
import { QuantitySelector } from '@/components/QuantitySelector';
import { getProductById } from '@/apis/product';
import type { Product } from '@/types/product';

const DetailFood = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const result = await getProductById(id);
          if (result) {
            setProduct(result);
          }
        } catch (error) {
          console.error('Fetch product error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {};

  const handleBuyNow = () => {};

  const handleGoBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md">
        <div className="flex items-start justify-start pr-4">
          <img
            src={product.IMG || product.image || ''}
            alt={product.productName}
            className="w-full h-[500px] rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 py-0">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.productName}
          </h1>

          <div className="flex items-center gap-2">
            <RatingStars />
            <span className="text-sm text-gray-600">0 Customer Review</span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {product.productDescription}
          </p>

          <div className="text-3xl font-bold text-primary">
            {product.ProductPrice.toLocaleString('vi-VN')} VND
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
