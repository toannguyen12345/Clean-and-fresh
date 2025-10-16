export interface Product extends Record<string, unknown> {
  _id: string;
  productName: string;
  ProductPrice: number;
  ProductQuantity: number;
  category: string;
  IMG?: string;
  userId: string;
}

export interface ProductTableColumn {
  id: string;
  label: string;
  accessorKey: keyof Product;
  cell?: (product: Product) => React.ReactNode;
}
