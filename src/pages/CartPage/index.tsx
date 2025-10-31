import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, Input } from '@/components';
import { cleanCart, cleanFullCart, addCart, removeCart } from '@/apis/cart';
import { applyDiscount } from '@/utils/discount';
import { createOrder } from '@/apis/order';
import { cartItemHelpers } from '@/utils/cart';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';

import CartItemComponent from './components/CartItem';

const CartPage = () => {
  const { userId } = useUser();
  const { cartItems, refreshCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + cartItemHelpers.getPrice(item) * item.quantity,
      0,
    );
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleIncreaseQuantity = async (itemId: string) => {
    try {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item) return;

      if (item.quantity >= cartItemHelpers.getMaxQuantity(item)) {
        toast.error(
          `Số lượng tối đa là ${cartItemHelpers.getMaxQuantity(item)}`,
        );
        return;
      }

      if (!userId) return;

      await addCart({
        product: cartItemHelpers.getId(item),
        user: userId,
        quantity: 1,
        productName: cartItemHelpers.getName(item),
        price: cartItemHelpers.getPrice(item),
      });

      await refreshCart();

      // Reset discount khi thay đổi giỏ hàng
      setDiscount(0);
      setPromoCode('');
    } catch (error: unknown) {
      console.error('[CartPage] Error increasing quantity:', error);
    }
  };

  const handleDecreaseQuantity = async (itemId: string) => {
    try {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item || item.quantity <= 1) return;

      if (!userId) return;

      await removeCart({
        product: cartItemHelpers.getId(item),
        user: userId,
        quantity: 1,
        productName: cartItemHelpers.getName(item),
        price: cartItemHelpers.getPrice(item),
      });

      await refreshCart();

      // Reset discount khi thay đổi giỏ hàng
      setDiscount(0);
      setPromoCode('');
    } catch (error: unknown) {
      console.error('[CartPage] Error decreasing quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item) return;

      await refreshCart();
      if (!userId) return;

      await cleanCart({
        product: cartItemHelpers.getId(item),
        user: userId,
        quantity: item.quantity,
      });

      // Reset discount khi thay đổi giỏ hàng
      setDiscount(0);
      setPromoCode('');
    } catch (error: unknown) {
      console.error('[CartPage] Error removing item:', error);
    }
  };

  const handleApplyDiscount = async (code: string) => {
    setDiscountError('');
    if (!code.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      const result = await applyDiscount(promoCode, getTotalPrice());
      if (result.discountAmount > 0) {
        setDiscount(result.discountAmount);
        setPromoCode('');
      } else {
        setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        setDiscount(0);
      }
    } catch (error: unknown) {
      console.error('[CartPage] Error applying discount:', error);
      setDiscountError('Có lỗi xảy ra khi áp dụng mã giảm giá');
      setDiscount(0);
    }
  };

  const finalTotal = getTotalPrice() - discount;

  const handleCheckout = async (method: 'online' | 'cash') => {
    try {
      if (!userId) return;

      const totalPrice = getTotalPrice();
      const finalTotal = totalPrice - discount;

      // Tính discount cho từng item (chia đều)
      const discountRatio = totalPrice > 0 ? discount / totalPrice : 0;

      const orderItems = cartItems.map((item) => {
        const itemPrice = cartItemHelpers.getPrice(item);
        const itemQuantity = item.quantity;
        const itemGrossTotal = itemPrice * itemQuantity;
        const itemDiscount = itemGrossTotal * discountRatio;
        const itemNetTotal = itemGrossTotal - itemDiscount;

        return {
          productId: cartItemHelpers.getId(item),
          quantity: itemQuantity,
          productName: cartItemHelpers.getName(item),
          price: itemPrice,
          itemTotal: itemNetTotal,
        };
      });

      const orderData = {
        userId,
        items: orderItems,
        totalAmount: finalTotal,
        paymentMethod: method === 'online' ? 'ONLINE' : 'CASH',
      };

      const response = await createOrder(orderData);

      if (response.success) {
        toast.success('Tạo đơn hàng thành công');

        await cleanFullCart(userId);
        await refreshCart();
        setDiscount(0);
        setPromoCode('');
      } else {
        toast.error(response.message || 'Tạo đơn hàng thất bại');
      }
    } catch (error: unknown) {
      console.error('[CartPage] Error during checkout:', error);
      toast.error('Có lỗi xảy ra');
    }
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
                <CartItemComponent
                  key={item._id}
                  data={{
                    id: item._id,
                    productName: cartItemHelpers.getName(item),
                    productPrice: cartItemHelpers.getPrice(item),
                    productImage: cartItemHelpers.getImage(item),
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
                  disabled={cartItems.length === 0 || !userId}
                >
                  Thanh toán online
                </Button>
                <Button
                  onClick={() => handleCheckout('cash')}
                  color="secondary"
                  className="w-full"
                  disabled={cartItems.length === 0 || !userId}
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
                  <Button
                    onClick={() => handleApplyDiscount(promoCode)}
                    color="success"
                  >
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
