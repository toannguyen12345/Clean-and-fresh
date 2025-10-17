import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DataTable, Button } from '@/components';
import { Discount } from '@/types/discount';
import { USER_ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/date';

const mockDiscounts: Discount[] = [
  {
    _id: '1',
    discountType: 'percent',
    discountName: 'Giảm giá mùa hè',
    discountCode: 'SUMMER2024',
    discountValue: 20,
    startDate: '2024-06-01',
    expiryDate: '2024-08-31',
  },
  {
    _id: '2',
    discountType: 'fixed',
    discountName: 'Ưu đãi khách hàng mới',
    discountCode: 'NEWUSER',
    discountValue: 50000,
    startDate: '2024-01-01',
    expiryDate: '2024-12-31',
  },
  {
    _id: '3',
    discountType: 'percent',
    discountName: 'Flash sale',
    discountCode: 'FLASH50',
    discountValue: 50,
    startDate: '2024-05-15',
    expiryDate: '2024-05-16',
  },
];

const DiscountTablePage = () => {
  const navigate = useNavigate();

  const handleAddDiscount = () => {
    navigate(USER_ROUTES.US0009_ADD_DISCOUNT);
  };

  const handleDeleteDiscount = (id: string) => {
    toast.success(`Xóa mã giảm giá ID: ${id} thành công!`);
  };

  const handleUpdateDiscount = (id: string) => {
    navigate(USER_ROUTES.US0010_EDIT_DISCOUNT.replace(':id', id));
  };

  const columns: ColumnDef<Discount>[] = [
    {
      accessorKey: 'discountCode',
      header: 'Mã giảm giá',
      cell: ({ row }) => (
        <div className="font-semibold text-[#28a745]">
          {row.original.discountCode}
        </div>
      ),
    },
    {
      accessorKey: 'discountName',
      header: 'Tên giảm giá',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.discountName}>
          {row.original.discountName}
        </div>
      ),
    },
    {
      accessorKey: 'discountType',
      header: 'Kiểu giảm',
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.discountType === 'percent' ? 'Phần trăm' : 'Cố định'}
        </span>
      ),
    },
    {
      accessorKey: 'discountValue',
      header: 'Giá trị giảm',
      cell: ({ row }) => (
        <span className="font-medium text-orange-600">
          {row.original.discountType === 'percent'
            ? `${row.original.discountValue}%`
            : `${row.original.discountValue.toLocaleString('vi-VN')} ₫`}
        </span>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      accessorKey: 'expiryDate',
      header: 'Ngày hết hạn',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.expiryDate)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            color="primary"
            onClick={() => handleUpdateDiscount(row.original._id)}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => handleDeleteDiscount(row.original._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý mã giảm giá
        </h1>
        <Button color="success" onClick={handleAddDiscount}>
          + Thêm mã giảm giá
        </Button>
      </div>

      <DataTable columns={columns} data={mockDiscounts} />
    </div>
  );
};

export default DiscountTablePage;
