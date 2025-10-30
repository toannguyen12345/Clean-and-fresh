import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, RatingStars } from '@/components';
import { QuantitySelector } from '@/components/QuantitySelector';
import { getProductById } from '@/apis/product';
import axiosInstance from '@/lib/axios';
import { getProductQuantityInCart, addProductToCart } from '@/utils/cart';
import { getUserId } from '@/apis/user';
import { isLoggedIn } from '@/utils/auth';
import { USER_ROUTES } from '@/constants/routes';
import type { Product } from '@/types/product';

const DetailFood = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(id!);

        if (response) {
          const product =
            response && typeof response === 'object' && 'success' in response
              ? (response as Record<string, unknown>).data
              : response;
          if (product && typeof product === 'object' && '_id' in product) {
            setProduct(product as Product);
          }
        }

        // Fetch quantity từ BE cart
        try {
          const qty = await getProductQuantityInCart(id!);
          setQuantity(qty);
        } catch (cartError) {
          setQuantity(0);
        }
      } catch (error) {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  const handleIncrease = async () => {
    if (!isLoggedIn()) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    setQuantity((prev) => prev + 1);

    try {
      const userId = await getUserId();
      if (!userId || !product) return;

      await addProductToCart(
        id!,
        userId,
        1,
        product.productName,
        product.ProductPrice,
      );
    } catch (error) {
      // Silent fail
    }
  };

  const handleDecrease = async () => {
    if (quantity <= 1) return;

    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    try {
      const userId = await getUserId();
      if (!userId || !product) return;

      await axiosInstance.post(`/API/cart/remove`, {
        product: id!,
        user: userId,
        quantity: 1,
        productName: product.productName,
        price: product.ProductPrice,
      });
    } catch (error) {
      // Silent fail
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    try {
      if (!product || !id || quantity === 0) {
        return;
      }

      const userId = await getUserId();
      if (!userId) return;

      await addProductToCart(
        id,
        userId,
        quantity,
        product.productName,
        product.ProductPrice,
      );
      toast.success('Thêm vào giỏ hàng thành công');
      setQuantity(0);
    } catch (error) {
      toast.error('Thêm vào giỏ hàng thất bại');
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn()) {
      toast.error('Vui lòng đăng nhập để mua sản phẩm');
      return;
    }

    try {
      if (!product || !id) {
        return;
      }

      const userId = await getUserId();
      if (!userId) return;

      await addProductToCart(
        id,
        userId,
        1,
        product.productName,
        product.ProductPrice,
      );
      navigate(USER_ROUTES.US0004_CART);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
