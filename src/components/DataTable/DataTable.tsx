import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';

import { SearchBar, Button } from '@/components';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchColumn?: keyof T;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchColumn,
  pageSizeOptions = [4, 6, 8],
  defaultPageSize = 4,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (searchColumn) {
      table.getColumn(searchColumn as string)?.setFilterValue(value);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-sm">
          <SearchBar
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <span
                            className={`text-xs ${header.column.getIsSorted() === 'asc' ? 'text-gray-900' : 'text-gray-400'}`}
                          >
                            ▲
                          </span>
                          <span
                            className={`text-xs ${header.column.getIsSorted() === 'desc' ? 'text-gray-900' : 'text-gray-400'}`}
                          >
                            ▼
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            data.length,
          )}{' '}
          of {data.length} results
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            color="secondary"
            size="sm"
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
              .filter((page) => {
                const currentPage = pagination.pageIndex + 1;
                return (
                  page === 1 ||
                  page === table.getPageCount() ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return [
                    <span key={`ellipsis-${page}`} className="px-2 py-1">
                      ...
                    </span>,
                    <button
                      key={page}
                      onClick={() => table.setPageIndex(page - 1)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pagination.pageIndex === page - 1
                          ? 'bg-[#28a745] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>,
                  ];
                }
                return (
                  <button
                    key={page}
                    onClick={() => table.setPageIndex(page - 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pagination.pageIndex === page - 1
                        ? 'bg-[#28a745] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
          </div>

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            color="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
