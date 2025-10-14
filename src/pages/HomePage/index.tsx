import { ProductItem } from '@/components';
import Header from '@/layouts/Header/Header';

const mockProducts = [
  {
    id: '1',
    name: 'Táo Fuji Nhật Bản',
    description:
      'Táo Fuji nhập khẩu trực tiếp từ Nhật Bản, giòn ngọt, giàu dinh dưỡng.',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
  },
  {
    id: '2',
    name: 'Cam Sành Việt Nam',
    description: 'Cam sành tươi ngon, nhiều nước, giàu vitamin C.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
  },
  {
    id: '3',
    name: 'Nho Mỹ Không Hạt',
    description: 'Nho nhập khẩu từ Mỹ, ngọt tự nhiên, không hạt.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1599819177086-d9e1c5e0a0e6?w=800',
  },
  {
    id: '4',
    name: 'Dưa Hấu Không Hạt',
    description: 'Dưa hấu ruột đỏ, ngọt mát, không hạt.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
  },
];

const HomePage = () => {
  const handleProductClick = (_id: string) => {
    // TODO: Navigate to product detail page
  };

  return (
    <div>
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductItem
            key={product.id}
            data={product}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
