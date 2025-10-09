interface SearchBarNewProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const SearchBarNew = ({
  value = '',
  onChange,
  placeholder = 'Tìm kiếm sản phẩm...',
}: SearchBarNewProps): JSX.Element => {
  return (
    <div className="flex justify-center my-5">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="px-[45px] py-[20px] w-[500px] border border-[#ccc] rounded-full text-[20px] text-[#333] outline-none focus:border-[#28a745] focus:ring-2 focus:ring-[#28a745]/20 h-auto"
      />
    </div>
  );
};

export default SearchBarNew;
