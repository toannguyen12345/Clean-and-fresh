import { ColumnDef } from '@tanstack/react-table';
import { useNavigate, generatePath } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { DataTable, Button, Loading } from '@/components';
import { User } from '@/types/user';
import { USER_ROUTES } from '@/constants/routes';
import userService from '@/apis/user';
import { filterUsersByRoleCode } from '@/utils/user';

const ShipperTablePage = () => {
  const navigate = useNavigate();
  const [shippers, setShippers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShippers = async () => {
    try {
      setLoading(true);
      const result = await userService.listUsers();
      if (result.success && result.users) {
        const filteredShippers = filterUsersByRoleCode(3, result.users);
        setShippers(filteredShippers);
      } else {
        toast.error('Lấy danh sách shipper thất bại');
      }
    } catch (error) {
      console.error('Fetch shippers error:', error);
      toast.error('Có lỗi xảy ra khi lấy danh sách shipper');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippers();
  }, []);

  const handleDeleteShipper = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.success('Xóa shipper thành công!');
      fetchShippers();
    } catch (error) {
      toast.error('Xóa shipper thất bại');
    }
  };

  const handleUpdateShipper = (id: string) => {
    navigate(generatePath(USER_ROUTES.US0017_EDIT_SHIPPER, { id }));
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'userName',
      header: 'Tên',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 font-medium">
                {row.original.userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {row.original.userName}
            </span>
            <span className="text-sm text-gray-500">
              {row.original.userEmail}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'userBirthDay',
      header: 'Ngày sinh',
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.userBirthDay
            ? new Date(row.original.userBirthDay).toLocaleDateString('vi-VN')
            : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'userEmail',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.userEmail}</span>
      ),
    },
    {
      accessorKey: 'userAddress',
      header: 'Địa chỉ',
      cell: ({ row }) => (
        <span className="text-gray-700 max-w-xs truncate">
          {row.original.userAddress}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Hành Động',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleDeleteShipper(row.original._id)}
            color="danger"
            size="sm"
          >
            Xóa
          </Button>
          <Button
            onClick={() => handleUpdateShipper(row.original._id)}
            color="success"
            size="sm"
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý shipper</h1>
      </div>
      <DataTable
        data={shippers}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên..."
        searchColumn="userName"
        pageSizeOptions={[4, 6, 8]}
        defaultPageSize={4}
      />
    </div>
  );
};

export default ShipperTablePage;
