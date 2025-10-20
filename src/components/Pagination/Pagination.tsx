interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <nav className="flex justify-center items-center mt-8">
      <ul className="flex gap-2">
        {pageNumbers.map((n) => {
          if (
            n === 1 ||
            n === totalPages ||
            (n >= currentPage - 1 && n <= currentPage + 1)
          ) {
            return (
              <li key={n}>
                <button
                  onClick={() => onPageChange(n)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                    currentPage === n
                      ? 'bg-[#28a745] text-white border-[#28a745]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-[#28a745] hover:text-white hover:scale-110'
                  }`}
                >
                  {n}
                </button>
              </li>
            );
          }
          if (n === currentPage - 2 || n === currentPage + 2) {
            return (
              <li key={n}>
                <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                  ...
                </span>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
