import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, Textarea } from '@/components';
import { productSchema, ProductFormData } from '@/schemas/product';

interface InputFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData, file?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'Leafy', label: 'Rau lá xanh' },
  { value: 'Root', label: 'Rau củ rễ' },
  { value: 'Cruciferous', label: 'Rau họ cải' },
  { value: 'Fruiting', label: 'Rau quả' },
  { value: 'Herbs', label: 'Rau thơm' },
];

const InputForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: InputFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: initialData?.productName || '',
      productDescription: initialData?.productDescription || '',
      productPrice: initialData?.productPrice || 0,
      productQuantity: initialData?.productQuantity || 0,
      category: initialData?.category || 'Leafy',
    },
  });

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image as string);
    }
  }, [initialData]);

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Revoke previous object URL to prevent memory leak
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      // Create new object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data, selectedFile || undefined);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {mode === 'add' ? 'Thêm sản phẩm mới' : 'Cập nhật sản phẩm'}
      </h1>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên sản phẩm
            </label>
            <Input
              id="productName"
              type="text"
              placeholder="Nhập tên sản phẩm"
              {...register('productName')}
              error={errors.productName?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loại sản phẩm
              </label>
              <select
                id="category"
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="productQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số lượng
              </label>
              <Input
                id="productQuantity"
                type="number"
                min="1"
                placeholder="Nhập số lượng"
                {...register('productQuantity', { valueAsNumber: true })}
                error={errors.productQuantity?.message}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Giá bán ra (VNĐ)
            </label>
            <Input
              id="productPrice"
              type="number"
              min="0"
              placeholder="Nhập giá bán ra"
              {...register('productPrice', { valueAsNumber: true })}
              error={errors.productPrice?.message}
            />
          </div>

          <div>
            <label
              htmlFor="productDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <Textarea
              id="productDescription"
              rows={4}
              placeholder="Nhập mô tả sản phẩm"
              {...register('productDescription')}
              error={errors.productDescription?.message}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              color="success"
              size="lg"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading
                ? 'Đang xử lý...'
                : mode === 'add'
                  ? 'Thêm sản phẩm'
                  : 'Cập nhật sản phẩm'}
            </Button>
            <Button
              type="button"
              color="secondary"
              size="lg"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Hình ảnh sản phẩm
            </label>

            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#28a745] file:text-white hover:file:bg-[#218838] cursor-pointer"
            />

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
