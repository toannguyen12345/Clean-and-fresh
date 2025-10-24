import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, FormField } from '@/components';
import { editUserSchema, EditUserFormData } from '@/schemas/user';

interface UserFormProps {
  initialData?: Partial<EditUserFormData>;
  onSubmit: (data: EditUserFormData, file?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      userName: initialData?.userName || '',
      userBirthDay: initialData?.userBirthDay || '',
      userEmail: initialData?.userEmail || '',
      userAddress: initialData?.userAddress || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFormSubmit = (data: EditUserFormData) => {
    onSubmit(data, selectedFile || undefined);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Cập nhật người dùng
      </h1>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-4">
          <FormField
            label="Họ và Tên"
            isRequired
            error={errors.userName?.message}
          >
            <Input
              type="text"
              placeholder="Nhập họ và tên"
              {...register('userName')}
              error={errors.userName?.message}
            />
          </FormField>

          <FormField
            label="Ngày sinh"
            isRequired
            error={errors.userBirthDay?.message}
          >
            <Input
              type="date"
              max={today}
              {...register('userBirthDay')}
              error={errors.userBirthDay?.message}
            />
          </FormField>

          <FormField label="Email" isRequired error={errors.userEmail?.message}>
            <Input
              type="email"
              placeholder="Nhập email"
              {...register('userEmail')}
              error={errors.userEmail?.message}
            />
          </FormField>

          <FormField
            label="Địa chỉ"
            isRequired
            error={errors.userAddress?.message}
          >
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              {...register('userAddress')}
              error={errors.userAddress?.message}
            />
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              color="success"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
            </Button>
            <Button
              type="button"
              color="danger"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ảnh đại diện
              </h3>

              <div className="space-y-4">
                <label
                  htmlFor="image-upload"
                  className="block w-full px-4 py-2 text-center bg-[#28a745] text-white rounded-lg cursor-pointer hover:bg-[#218838] transition-colors"
                >
                  Thêm ảnh
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {!imagePreview && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
