interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  className = '',
}: CheckboxProps): JSX.Element => {
  return (
    <label className={`relative flex items-start cursor-pointer ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
            checked
              ? 'bg-[#28a745] border-[#28a745]'
              : 'bg-white border-gray-300 hover:border-[#28a745]'
          }`}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && <div className="font-medium text-gray-900">{label}</div>}
          {description && <div className="text-gray-500">{description}</div>}
        </div>
      )}
    </label>
  );
};

export default Checkbox;
