export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm sản phẩm...',
  className = '',
}: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`flex ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="px-4 py-2 w-full border border-gray-300 rounded-lg text-base text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
      />
    </div>
  );
};

export default SearchBar;
