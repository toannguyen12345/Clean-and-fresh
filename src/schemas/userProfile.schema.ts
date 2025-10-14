import { z } from 'zod';

export const userProfileSchema = z.object({
  account: z.string(),
  userName: z
    .string()
    .min(1, 'Vui lòng nhập tên người dùng')
    .regex(/^[\p{L}\s]+$/u, 'Tên người dùng không được có ký tự đặc biệt'),
  userEmail: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ'),
  userBirthDay: z
    .string()
    .min(1, 'Vui lòng nhập ngày sinh')
    .refine(
      (value) => {
        const today = new Date();
        const birth = new Date(value);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
          age--;
        }
        return age >= 16;
      },
      { message: 'Bạn phải trên 16 tuổi' },
    ),
  userAddress: z.string().min(1, 'Vui lòng nhập địa chỉ'),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
