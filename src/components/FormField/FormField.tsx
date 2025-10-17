import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  isRequired?: boolean;
  error?: string;
  children: ReactNode;
}

const FormField = ({
  label,
  isRequired = false,
  error,
  children,
}: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
