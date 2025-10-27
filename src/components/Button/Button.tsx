import { ReactNode } from 'react';

import { LoadingIcon } from '@/icons';

export interface IButtonProps {
  children: ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'black'
    | 'link';
  outline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button = ({
  children,
  color = 'primary',
  outline = false,
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}: IButtonProps): JSX.Element => {
  const colorClasses = {
    primary: outline
      ? 'border-primary text-primary hover:bg-primary hover:text-white'
      : 'bg-primary text-white hover:bg-primary-dark',
    secondary: outline
      ? 'border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white'
      : 'bg-gray-500 text-white hover:bg-gray-600',
    success: outline
      ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
      : 'bg-green-500 text-white hover:bg-green-600',
    danger: outline
      ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
      : 'bg-red-500 text-white hover:bg-red-600',
    warning: outline
      ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white'
      : 'bg-yellow-500 text-white hover:bg-yellow-600',
    info: outline
      ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
      : 'bg-blue-400 text-white hover:bg-blue-500',
    light: outline
      ? 'border-gray-200 text-gray-800 hover:bg-gray-200'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    dark: outline
      ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      : 'bg-gray-900 text-white hover:bg-black',
    black: outline
      ? 'border-black text-black hover:bg-black hover:text-white'
      : 'bg-black text-white hover:bg-gray-900',
    link: 'text-primary hover:underline border-transparent bg-transparent',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseClasses =
    'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  const borderClass = outline ? 'border-2' : 'border border-transparent';
  const blockClass = block ? 'w-full' : '';
  const disabledClass =
    loading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${colorClasses[color]} ${sizeClasses[size]} ${borderClass} ${blockClass} ${disabledClass} ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <LoadingIcon />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
