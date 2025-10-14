import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input } from '@/components';

import CartItem from './components/CartItem';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  maxQuantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Táo Fuji Nhật Bản',
    productPrice: 150000,
    productImage:
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
    quantity: 2,
    maxQuantity: 10,
  },
  {
    id: '2',
    productId: '2',
    productName: 'Cam Sành Việt Nam',
    productPrice: 45000,
    productImage:
      'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
    quantity: 3,
    maxQuantity: 20,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0,
    );
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (item.quantity >= item.maxQuantity) {
            alert(`Số lượng tối đa là ${item.maxQuantity}`);
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleApplyDiscount = () => {
    setDiscountError('');
    if (promoCode === 'DISCOUNT10') {
      setDiscount(getTotalPrice() * 0.1);
    } else if (promoCode === 'DISCOUNT20') {
      setDiscount(getTotalPrice() * 0.2);
    } else {
      setDiscountError('Mã giảm giá không hợp lệ');
      setDiscount(0);
    }
  };

  const finalTotal = getTotalPrice() - discount;

  const handleCheckout = (method: 'online' | 'cash') => {
    alert(
      `Thanh toán ${method === 'online' ? 'online' : 'tiền mặt'} thành công!`,
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Giỏ hàng trống</p>
          <Link to="/">
            <Button color="success">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 border-b">
                <div className="col-span-2">Hình ảnh</div>
                <div className="col-span-4">Sản phẩm</div>
                <div className="col-span-3">Số lượng</div>
                <div className="col-span-2">Tạm tính</div>
                <div className="col-span-1" />
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  data={{
                    id: item.id,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productImage: item.productImage,
                    quantity: item.quantity,
                  }}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tổng đơn hàng
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng</span>
                  <span>{getTotalQuantity()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Tổng</span>
                  <span>{finalTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <Button
                  onClick={() => handleCheckout('online')}
                  color="success"
                  className="w-full bg-[#28a745] hover:bg-[#218838]"
                >
                  Thanh toán online
                </Button>
                <Button
                  onClick={() => handleCheckout('cash')}
                  color="secondary"
                  className="w-full"
                >
                  Thanh toán tiền mặt
                </Button>
              </div>

              <Link
                to="/user/history"
                className="block text-center text-sm text-blue-600 hover:underline"
              >
                Xem lịch sử đơn hàng
              </Link>

              <div className="mt-6 pt-6 border-t">
                <p className="font-semibold text-gray-900 mb-2">Mã ưu đãi</p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handleApplyDiscount} color="success">
                    Áp dụng
                  </Button>
                </div>
                {discountError && (
                  <p className="text-sm text-red-500 mt-2">{discountError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Thử: DISCOUNT10 hoặc DISCOUNT20
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
