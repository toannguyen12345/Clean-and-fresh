interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
}

const RadioGroup = ({
  options,
  value,
  onChange,
  name,
  className = '',
}: RadioGroupProps): JSX.Element => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 hover:border-[#28a745] focus:outline-none"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            className="sr-only"
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm">
                <div
                  className={`font-medium ${value === option.value ? 'text-[#28a745]' : 'text-gray-900'}`}
                >
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-gray-500">
                    <span>{option.description}</span>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                value === option.value
                  ? 'border-[#28a745] bg-[#28a745]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {value === option.value && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
