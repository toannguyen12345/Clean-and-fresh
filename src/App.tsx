import DefaultLayout from '@/layouts/DefaultLayout';
import { ProductItem, SearchBar } from '@/components';

function App() {
  return (
    <DefaultLayout>
      {/* SearchBar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Product Demo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
        <div className="grid grid-cols-4 gap-4">
          <ProductItem
            data={{
              id: '1',
              name: 'Táo Fuji',
              price: 50000,
              description: 'Táo Fuji nhập khẩu từ Nhật Bản',
              image:
                'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
            }}
          />
          <ProductItem
            data={{
              id: '2',
              name: 'Cam Sành',
              price: 35000,
              description: 'Cam sành Việt Nam tươi ngon',
              image:
                'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
            }}
          />
          <ProductItem
            data={{
              id: '3',
              name: 'Nho Xanh',
              price: 120000,
              description: 'Nho xanh không hạt nhập khẩu',
              image:
                'https://images.unsplash.com/photo-1599819177331-c8d6ab241e5f?w=400',
            }}
          />
          <ProductItem
            data={{
              id: '4',
              name: 'Dâu Tây',
              price: 85000,
              description: 'Dâu tây Đà Lạt tươi ngon',
              image:
                'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
            }}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default App;
