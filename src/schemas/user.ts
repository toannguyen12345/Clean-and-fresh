import { z } from 'zod';
import { TFunction } from 'i18next';

import { MIN_LENGTH, MAX_LENGTH } from '@/constants';

// Login Schema
export const loginSchema = z.object({
  account: z.string().min(1, 'Tên tài khoản không được để trống'),
  password: z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự'),
});

// Register Schema
export const registerSchema = z.object({
  userName: z.string().min(1, 'Tên không được để trống'),
  userEmail: z.string().email('Email không hợp lệ'),
  account: z.string().min(1, 'Tên tài khoản không được để trống'),
  password: z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự'),
});

// Edit User Schema
export const editUserSchema = z.object({
  userName: z
    .string()
    .min(1, 'Tên người dùng không được để trống')
    .max(
      MAX_LENGTH.INPUT_DEFAULT,
      `Tên người dùng không được vượt quá ${MAX_LENGTH.INPUT_DEFAULT} ký tự`,
    ),
  userBirthDay: z.string().min(1, 'Ngày sinh không được để trống'),
  userEmail: z
    .string()
    .email('Email không hợp lệ')
    .max(
      MAX_LENGTH.INPUT_DEFAULT,
      `Email không được vượt quá ${MAX_LENGTH.INPUT_DEFAULT} ký tự`,
    ),
  userAddress: z
    .string()
    .min(1, 'Địa chỉ không được để trống')
    .max(
      MAX_LENGTH.INPUT_DEFAULT,
      `Địa chỉ không được vượt quá ${MAX_LENGTH.INPUT_DEFAULT} ký tự`,
    ),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;

// Example with i18n (keep for reference)
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
