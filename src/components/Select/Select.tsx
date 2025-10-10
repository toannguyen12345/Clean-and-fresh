import { useState } from 'react';

import { ChevronDownIcon, CheckIcon } from '@/icons';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  className = '',
}: SelectProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-[#28a745] hover:text-white ${
                option.value === selectedValue
                  ? 'bg-[#28a745] text-white'
                  : 'text-gray-900'
              }`}
            >
              <span className="block truncate">{option.label}</span>
              {option.value === selectedValue && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <CheckIcon className="h-5 w-5" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
