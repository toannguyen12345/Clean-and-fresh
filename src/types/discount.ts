export interface Discount {
  _id: string;
  discountType: string;
  discountName: string;
  discountCode: string;
  discountValue: number;
  startDate: string;
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
}
