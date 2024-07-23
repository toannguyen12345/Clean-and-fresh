import { z } from 'zod';
import { TFunction } from 'i18next';

import { MIN_LENGTH } from '@/constants';

// Without i18n
export const loginSchema = z.object({
  email: z
    .string()
    .min(MIN_LENGTH.REQUIRED, {
      message: 'This field is required.',
    })
    .email({
      message: 'Must be email',
    }),
  password: z.string().min(MIN_LENGTH.REQUIRED, {
    message: 'This field is required.',
  }),
});

// With i18n
export const generateLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(MIN_LENGTH.REQUIRED, {
        message: t('validation.required'),
      })
      .email({
        message: t('validation.email'),
      }),
    password: z.string().min(MIN_LENGTH.REQUIRED, {
      message: t('validation.required'),
    }),
  });

export type TLoginForm = z.infer<ReturnType<typeof generateLoginSchema>>;
