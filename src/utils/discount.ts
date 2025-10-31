import type { DiscountType } from '@/types/discount';
import type { Discount } from '@/types/discount';
import type { DiscountFormData } from '@/schemas/discount';
import { searchDiscountByCode } from '@/apis/discount';

export interface DiscountArrayResponse {
  discounts: Discount[];
}

export const isDiscountArrayResponse = (
  data: unknown,
): data is DiscountArrayResponse => {
  if (Array.isArray(data)) {
    return true;
  }
  return (
    data !== null &&
    typeof data === 'object' &&
    'discounts' in data &&
    Array.isArray(data.discounts)
  );
};

export const DISCOUNT_TYPES = {
  fixed: 'Cố định',
  percent: 'Phần trăm',
} satisfies Record<DiscountType, string>;

export const getDiscountTypeLabel = (type: DiscountType): string => {
  return DISCOUNT_TYPES[type] || type;
};

const isDiscountTypeKey = (key: string): key is DiscountType => {
  return key === 'fixed' || key === 'percent';
};

export const getDiscountTypeByLabel = (label: string): DiscountType | null => {
  const entry = Object.entries(DISCOUNT_TYPES).find(
    ([, value]) => value === label,
  );
  if (!entry) return null;
  const [key] = entry;
  return isDiscountTypeKey(key) ? key : null;
};

const isDiscountType = (value: unknown): value is DiscountType => {
  return value === 'fixed' || value === 'percent';
};

export const createDiscountPayload = (
  data: DiscountFormData,
): Omit<Discount, '_id' | 'createdAt' | 'updatedAt'> => {
  const discountType = isDiscountType(data.discountType)
    ? data.discountType
    : 'fixed';

  return {
    discountName: data.discountName,
    discountCode: data.discountCode,
    discountValue: data.discountValue,
    discountType,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
  };
};

export const applyDiscount = async (
  code: string,
  totalPrice: number,
): Promise<{
  discountAmount: number;
  finalPrice: number;
  discount?: Discount;
}> => {
  try {
    const discounts = await searchDiscountByCode(code);

    if (!discounts || discounts.length === 0) {
      return { discountAmount: 0, finalPrice: totalPrice };
    }

    const discount = discounts[0];
    const baseDiscountAmount =
      discount.discountType === 'percent'
        ? (totalPrice * discount.discountValue) / 100
        : discount.discountValue;

    const discountAmount = Math.max(
      0,
      Math.min(baseDiscountAmount, totalPrice),
    );

    const finalPrice = Math.max(0, totalPrice - discountAmount);

    return {
      discountAmount,
      finalPrice,
      discount,
    };
  } catch (error: unknown) {
    console.error('[discountUtils] Error applying discount:', error);
    return { discountAmount: 0, finalPrice: totalPrice };
  }
};
