import type { DiscountType } from '@/types/discount';
import type { Discount } from '@/types/discount';
import type { DiscountFormData } from '@/schemas/discount';

interface DiscountResponse {
  discount: Discount;
}

interface DiscountArrayResponse {
  foundDiscounts: Discount[];
}

const hasDiscountKey = (obj: object): obj is { discount: unknown } => {
  return 'discount' in obj;
};

export const isDiscountResponse = (data: unknown): data is DiscountResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasDiscountKey(data) &&
    typeof data.discount === 'object' &&
    data.discount !== null
  );
};

const hasFoundDiscountsKey = (
  obj: object,
): obj is { foundDiscounts: unknown } => {
  return 'foundDiscounts' in obj;
};

export const isDiscountArrayResponse = (
  data: unknown,
): data is DiscountArrayResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasFoundDiscountsKey(data) &&
    Array.isArray(data.foundDiscounts)
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
