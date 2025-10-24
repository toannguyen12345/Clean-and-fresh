import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Button, Input, Label, Textarea } from '@/components';
import { UserAvatar } from '@/components/UserAvatar';
import {
  userProfileSchema,
  UserProfileFormData,
} from '@/schemas/userProfile.schema';
import authService from '@/apis/auth';
import userService from '@/apis/user';
import { useUser } from '@/contexts/UserContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UserProfile = (): JSX.Element => {
  const { refreshUserAvatar } = useUser();
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  );
  const [_isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [account, setAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isMapInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
          toast.error('Không thể lấy thông tin user');
          return;
        }

        const result = await userService.getUserById(currentUser.id);

        if (result.success && result.data) {
          const userData = (Array.isArray(result.data)
            ? result.data[0]
            : result.data) as unknown as Record<string, unknown>;

          const userNameValue = (userData.userName as string) || '';
          const userAddressValue = (userData.userAddress as string) || '';

          const accountName =
            (currentUser.account as string) ||
            (currentUser.idAccount as string) ||
            '';

          setAccount(accountName);
          setUserName(userNameValue);
          setUserAddress(userAddressValue);

          reset({
            account: accountName,
            userName: userNameValue,
            userEmail: (userData.userEmail as string) || '',
            userBirthDay: (userData.userBirthDay as string) || '',
            userAddress: userAddressValue,
          });

          if (userData.IMG) {
            setPreviewImage(userData.IMG as string);
          }
        } else {
          toast.error('Lấy thông tin user thất bại');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải thông tin user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [reset]);

  useEffect(() => {
    if (!mapContainerRef.current || isMapInitialized.current) return;

    try {
      isMapInitialized.current = true;

      const map = L.map(mapContainerRef.current).setView(
        [16.0544, 108.2022],
        13,
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([16.0544, 108.2022])
        .addTo(map)
        .bindPopup(`<b>${userName}</b><br>${userAddress}`)
        .openPopup();

      mapRef.current = map;
    } catch (error) {
      console.error('Map init error:', error);
      isMapInitialized.current = false;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        isMapInitialized.current = false;
      }
    };
  }, [userName, userAddress]);

  const handleImageChange = (file: File) => {
    const maxSize = 1 * 1024 * 1024;
    const validFormats = ['image/jpeg', 'image/png'];

    if (file.size > maxSize) {
      toast.error('Ảnh phải nhỏ hơn 1 MB');
      return;
    }

    if (!validFormats.includes(file.type)) {
      toast.error('Chỉ hỗ trợ định dạng JPEG và PNG');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        toast.error('Không thể lấy thông tin user');
        return;
      }

      const updatePayload = {
        userName: data.userName || userName,
        userEmail: data.userEmail,
        userBirthDay: data.userBirthDay,
        userAddress: data.userAddress || userAddress,
      };

      const result = await userService.updateUser(
        currentUser.id,
        updatePayload,
        imageFile || undefined,
      );

      if (result.success) {
        toast.success('Cập nhật thông tin thành công');
        setImageFile(null);

        if (result.data) {
          const userData = (Array.isArray(result.data)
            ? result.data[0]
            : result.data) as unknown as Record<string, unknown>;
          if (userData.IMG) {
            setPreviewImage(userData.IMG as string);
          }
        }

        const reloadResult = await userService.getUserById(currentUser.id);
        if (reloadResult.success && reloadResult.data) {
          const reloadedData = (Array.isArray(reloadResult.data)
            ? reloadResult.data[0]
            : reloadResult.data) as unknown as Record<string, unknown>;
          if (reloadedData.IMG) {
            setPreviewImage(reloadedData.IMG as string);
          }
        }

        await refreshUserAvatar();
      } else {
        toast.error(result.message || 'Cập nhật thông tin thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
        <p className="text-gray-600 mt-1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tên đăng nhập:
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
                  {account}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label required>Tên người dùng:</Label>
                <Input
                  type="text"
                  {...register('userName')}
                  error={errors.userName?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label required>Email:</Label>
                <Input
                  type="email"
                  {...register('userEmail')}
                  error={errors.userEmail?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label required>Ngày sinh:</Label>
                <Input
                  type="date"
                  {...register('userBirthDay')}
                  max={new Date().toISOString().split('T')[0]}
                  error={errors.userBirthDay?.message}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label required>Địa chỉ:</Label>
                <Textarea
                  {...register('userAddress')}
                  rows={3}
                  error={errors.userAddress?.message}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="submit" color="success" size="lg">
                  Lưu
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <UserAvatar
                src={previewImage}
                alt={userName || 'User Avatar'}
                size="lg"
                editable
                onImageChange={handleImageChange}
              />
              <p className="text-sm text-gray-500 text-center leading-tight">
                Dung lượng tối đa 1 MB
                <br />
                Định dạng: .JPEG, .PNG
              </p>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Vị trí của bạn
          </h2>
          <div
            ref={mapContainerRef}
            className="rounded-lg overflow-hidden shadow-md h-80 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
