export type ProductCategory =
  | 'Leafy'
  | 'Root'
  | 'Cruciferous'
  | 'Fruiting'
  | 'Herbs';

export interface Product extends Record<string, unknown> {
  _id: string;
  productName: string;
  productDescription: string;
  ProductPrice: number;
  ProductQuantity: number;
  category: ProductCategory;
  IMG?: string;
  image?: string;
  productNameNormalized?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductTableColumn {
  id: string;
  label: string;
  accessorKey: keyof Product;
  cell?: (product: Product) => React.ReactNode;
}
