import { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({
  children,
  required,
  className = '',
  ...props
}: LabelProps): JSX.Element => {
  return (
    <label
      className={`text-sm font-semibold text-gray-700 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
