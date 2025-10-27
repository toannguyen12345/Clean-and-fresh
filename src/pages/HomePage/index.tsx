import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductItem } from '@/components';
import Header from '@/layouts/Header/Header';
import { listProducts } from '@/apis/product';
import { USER_ROUTES } from '@/constants/routes';
import type { ProductInfo } from '@/apis/product';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await listProducts();
        if (result.success && result.data) {
          setProducts(result.data);
          setFilteredProducts(result.data);
        }
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(USER_ROUTES.US0002_DETAIL_FOOD.replace(':id', id));
  };

  return (
    <div className="flex flex-col w-full">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745]"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  data={{
                    id: product._id,
                    name: product.productName,
                    description: product.productDescription,
                    price: product.ProductPrice,
                    image: product.IMG || product.image || '',
                  }}
                  onProductClick={handleProductClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Không tìm thấy sản phẩm</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
