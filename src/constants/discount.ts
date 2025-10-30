import { DISCOUNT_TYPES } from '@/utils/discount';

export const DISCOUNT_TYPE_OPTIONS = Object.entries(DISCOUNT_TYPES).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
