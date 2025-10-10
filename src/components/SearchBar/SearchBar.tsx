import { useState } from 'react';

const SearchBar = () => {
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="flex justify-center my-5">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={name}
        onChange={handleChange}
        className="px-8 py-6 w-96 border border-gray-300 rounded-full text-lg text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
      />
    </div>
  );
};

export default SearchBar;
