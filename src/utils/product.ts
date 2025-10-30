import type { ProductCategory } from '@/types/product';
import type { Product } from '@/types/product';
import type { ProductFormData } from '@/schemas/product';

interface ProductResponse {
  product: Product;
}

interface ProductArray {
  products: Product[];
}

const hasProductKey = (obj: object): obj is { product: unknown } => {
  return 'product' in obj;
};

export const isProductResponse = (data: unknown): data is ProductResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasProductKey(data) &&
    typeof data.product === 'object' &&
    data.product !== null
  );
};

const hasProductsKey = (obj: object): obj is { products: unknown } => {
  return 'products' in obj;
};

export const isProductArray = (data: unknown): data is ProductArray => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasProductsKey(data) &&
    Array.isArray(data.products)
  );
};

export const PRODUCT_CATEGORIES = {
  Leafy: 'Rau lá xanh',
  Root: 'Rau củ rễ',
  Cruciferous: 'Rau họ cải',
  Fruiting: 'Rau quả',
  Herbs: 'Rau thơm',
} satisfies Record<ProductCategory, string>;

export const getCategoryLabel = (category: ProductCategory): string => {
  return PRODUCT_CATEGORIES[category] || category;
};

const isProductCategoryKey = (key: string): key is ProductCategory => {
  return (
    key === 'Leafy' ||
    key === 'Root' ||
    key === 'Cruciferous' ||
    key === 'Fruiting' ||
    key === 'Herbs'
  );
};

export const getCategoryByLabel = (label: string): ProductCategory | null => {
  const entry = Object.entries(PRODUCT_CATEGORIES).find(
    ([, value]) => value === label,
  );
  if (!entry) return null;
  const [key] = entry;
  return isProductCategoryKey(key) ? key : null;
};

// Type guard for Product
export const isProduct = (data: unknown): data is Product => {
  return (
    data !== null &&
    typeof data === 'object' &&
    '_id' in data &&
    'productName' in data &&
    'ProductPrice' in data &&
    'ProductQuantity' in data &&
    'category' in data
  );
};

export const buildProductFormData = (
  productData: ProductFormData,
  imageFile?: File,
): FormData => {
  const formData = new FormData();

  if (productData.productName) {
    formData.append('productName', productData.productName);
  }
  if (productData.productDescription) {
    formData.append('productDescription', productData.productDescription);
  }
  if (
    productData.productPrice !== undefined &&
    productData.productPrice !== null
  ) {
    formData.append('ProductPrice', productData.productPrice.toString());
  }
  if (
    productData.productQuantity !== undefined &&
    productData.productQuantity !== null
  ) {
    formData.append('ProductQuantity', productData.productQuantity.toString());
  }
  if (productData.category) {
    formData.append('category', productData.category);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return formData;
};
