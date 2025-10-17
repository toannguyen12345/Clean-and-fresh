import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, FormField } from '@/components';
import { discountSchema, DiscountFormData } from '@/schemas/discount';

interface InputFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<DiscountFormData>;
  onSubmit: (data: DiscountFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

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
          <FormField
            label="Tên Giảm Giá"
            isRequired
            error={errors.discountName?.message}
          >
            <Input {...register('discountName')} placeholder="Tên Giảm Giá" />
          </FormField>

          <FormField
            label="Mã Giảm Giá"
            isRequired
            error={errors.discountCode?.message}
          >
            <Input {...register('discountCode')} placeholder="Mã Giảm Giá" />
          </FormField>

          <FormField
            label="Kiểu Giảm Giá"
            isRequired
            error={errors.discountType?.message}
          >
            <select
              {...register('discountType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#28a745]"
            >
              <option value="">Chọn kiểu giảm giá</option>
              <option value="fixed">Cố định</option>
              <option value="percent">Phần trăm</option>
            </select>
          </FormField>

          <FormField
            label="Giá Trị Giảm"
            isRequired
            error={errors.discountValue?.message}
          >
            <Input
              type="number"
              {...register('discountValue', { valueAsNumber: true })}
              placeholder="Giá Trị Giảm"
            />
          </FormField>
        </div>

        <div className="space-y-6">
          <FormField
            label="Ngày Bắt Đầu"
            isRequired
            error={errors.startDate?.message}
          >
            <Input type="date" {...register('startDate')} />
          </FormField>

          <FormField
            label="Ngày Hết Hạn"
            isRequired
            error={errors.expiryDate?.message}
          >
            <Input type="date" {...register('expiryDate')} />
          </FormField>
        </div>

        <div className="lg:col-span-2 flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onCancel}
            color="secondary"
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
