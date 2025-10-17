import { z } from 'zod';

export const discountSchema = z.object({
  discountType: z.string().min(1, 'Vui lòng chọn kiểu giảm'),
  discountName: z
    .string()
    .min(1, 'Tên Giảm Giá là bắt buộc')
    .regex(/^[\p{L}\s]+$/u, 'Tên Giảm Giá không được chứa ký tự đặc biệt'),
  discountCode: z.string().min(1, 'Mã Giảm Giá là bắt buộc'),
  discountValue: z.number().min(1, 'Giá Trị Giảm là bắt buộc'),
  startDate: z.string().min(1, 'Ngày Bắt Đầu là bắt buộc'),
  expiryDate: z.string().min(1, 'Ngày Hết Hạn là bắt buộc'),
});

export type DiscountFormData = z.infer<typeof discountSchema>;
