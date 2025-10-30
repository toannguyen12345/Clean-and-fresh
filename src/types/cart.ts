export interface CartItem {
  _id: string;
  product: {
    _id: string;
    productName: string;
    ProductPrice: number;
    ProductQuantity: number;
    image?: string;
    IMG?: string;
  };
  quantity: number;
}
