import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, FormField } from '@/components';
import { discountSchema, DiscountFormData } from '@/schemas/discount';
import { DISCOUNT_TYPES } from '@/utils/discount';

interface InputFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<DiscountFormData>;
  onSubmit: (data: DiscountFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DISCOUNT_TYPE_OPTIONS = Object.entries(DISCOUNT_TYPES).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const InputForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: InputFormProps) => {
  const { register, handleSubmit, control } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      discountType: initialData?.discountType || '',
      discountName: initialData?.discountName || '',
      discountCode: initialData?.discountCode || '',
      discountValue: initialData?.discountValue || 0,
      startDate: initialData?.startDate || '',
      expiryDate: initialData?.expiryDate || '',
    },
  });

  const { errors } = useFormState({ control });

  const handleFormSubmit = (data: DiscountFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {mode === 'add' ? 'THÊM MÃ GIẢM GIÁ' : 'CẬP NHẬT MÃ GIẢM GIÁ'}
      </h1>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <FormField label="Tên Giảm Giá" isRequired>
            <Input
              {...register('discountName')}
              placeholder="Tên Giảm Giá"
              error={errors.discountName?.message}
            />
          </FormField>

          <FormField label="Mã Giảm Giá" isRequired>
            <Input
              {...register('discountCode')}
              placeholder="Mã Giảm Giá"
              error={errors.discountCode?.message}
            />
          </FormField>

          <FormField label="Kiểu Giảm Giá" isRequired>
            <select
              {...register('discountType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]"
            >
              <option value="">Chọn kiểu giảm giá</option>
              {DISCOUNT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label as string}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="space-y-6">
          <FormField label="Ngày Bắt Đầu" isRequired>
            <Input
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
          </FormField>

          <FormField label="Ngày Hết Hạn" isRequired>
            <Input
              type="date"
              {...register('expiryDate')}
              error={errors.expiryDate?.message}
            />
          </FormField>

          <FormField label="Giá Trị Giảm" isRequired>
            <Input
              type="number"
              {...register('discountValue', { valueAsNumber: true })}
              placeholder="Giá Trị Giảm"
              error={errors.discountValue?.message}
            />
          </FormField>
        </div>

        <div className="lg:col-span-2 flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onCancel}
            color="danger"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" color="success" disabled={isLoading}>
            {isLoading
              ? 'Đang xử lý...'
              : mode === 'add'
                ? 'Thêm mã giảm giá'
                : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
