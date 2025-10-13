import { CameraIcon } from '@/icons';

interface UserAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

const UserAvatar = ({
  src,
  alt,
  size = 'lg',
  editable = false,
  onImageChange,
}: UserAvatarProps): JSX.Element => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-4 border-gray-200`}
      />
      {editable && (
        <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-dark transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <CameraIcon className="w-5 h-5" />
        </label>
      )}
    </div>
  );
};

export default UserAvatar;
