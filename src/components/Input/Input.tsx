import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          className={`px-4 py-2 border border-gray-300 rounded-lg bg-red focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
