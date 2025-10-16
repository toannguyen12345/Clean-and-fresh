import { z } from 'zod';

export const productSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  productDescription: z.string().min(1, 'Mô tả không được để trống'),
  productPrice: z
    .number({ invalid_type_error: 'Giá phải là số' })
    .positive('Giá phải lớn hơn 0'),
  productQuantity: z
    .number({ invalid_type_error: 'Số lượng phải là số' })
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng phải lớn hơn 0'),
  category: z.string().min(1, 'Vui lòng chọn loại sản phẩm'),
  image: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
