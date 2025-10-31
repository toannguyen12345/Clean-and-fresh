export interface ProductInfo {
  _id: string;
  productName: string;
  ProductPrice: number;
  ProductQuantity: number;
  image?: string;
  IMG?: string;
}

export interface CartItem {
  _id: string;
  product: ProductInfo | string; // Can be product object or product ID
  quantity: number;
}
