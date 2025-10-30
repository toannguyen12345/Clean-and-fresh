export type DiscountType = 'fixed' | 'percent';

export interface Discount {
  _id: string;
  discountType: DiscountType;
  discountName: string;
  discountCode: string;
  discountValue: number;
  startDate: string;
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
}
