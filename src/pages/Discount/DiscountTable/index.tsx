import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { DataTable, Button, Loading } from '@/components';
import { Discount } from '@/types/discount';
import { USER_ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/date';
import { listDiscounts, deleteDiscount } from '@/apis/discount';

const DiscountTablePage = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const result = await listDiscounts();
      if (result.success && result.data) {
        setDiscounts(result.data);
      } else {
        toast.error('Lấy danh sách mã giảm giá thất bại');
      }
    } catch (error) {
      console.error('Fetch discounts error:', error);
      toast.error('Có lỗi xảy ra khi lấy danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAddDiscount = () => {
    navigate(USER_ROUTES.US0009_ADD_DISCOUNT);
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      toast.success('Xóa mã giảm giá thành công!');
      fetchDiscounts();
    } catch (error) {
      toast.error('Xóa mã giảm giá thất bại');
    }
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
            color="danger"
            onClick={() => handleDeleteDiscount(row.original._id)}
          >
            Xóa
          </Button>
          <Button
            size="sm"
            color="success"
            onClick={() => handleUpdateDiscount(row.original._id)}
          >
            Cập nhật
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

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

      <DataTable columns={columns} data={discounts} />
    </div>
  );
};

export default DiscountTablePage;
