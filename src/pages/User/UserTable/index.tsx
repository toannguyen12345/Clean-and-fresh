import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DataTable, Button } from '@/components';
import { User } from '@/types/user';
import { USER_ROUTES } from '@/constants/routes';

const mockUsers: User[] = [
  {
    _id: '1',
    userName: 'Nguyễn Văn A',
    userBirthDay: '1990-05-15',
    userEmail: 'nguyenvana@example.com',
    userAddress: '123 Đường ABC, Quận 1, TP.HCM',
    image: 'https://via.placeholder.com/50',
  },
  {
    _id: '2',
    userName: 'Trần Thị B',
    userBirthDay: '1995-08-20',
    userEmail: 'tranthib@example.com',
    userAddress: '456 Đường XYZ, Quận 2, TP.HCM',
    image: 'https://via.placeholder.com/50',
  },
  {
    _id: '3',
    userName: 'Lê Văn C',
    userBirthDay: '1988-12-10',
    userEmail: 'levanc@example.com',
    userAddress: '789 Đường DEF, Quận 3, TP.HCM',
  },
  {
    _id: '4',
    userName: 'Phạm Thị D',
    userBirthDay: '1992-03-25',
    userEmail: 'phamthid@example.com',
    userAddress: '321 Đường GHI, Quận 4, TP.HCM',
    image: 'https://via.placeholder.com/50',
  },
];

const UserTablePage = () => {
  const navigate = useNavigate();

  const handleDeleteUser = (id: string) => {
    toast.success(`Xóa người dùng ID: ${id} thành công!`);
  };

  const handleUpdateUser = (id: string) => {
    navigate(USER_ROUTES.US0015_EDIT_USER.replace(':id', id));
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
            onClick={() => handleDeleteUser(row.original._id)}
            color="danger"
            size="sm"
          >
            Xóa
          </Button>
          <Button
            onClick={() => handleUpdateUser(row.original._id)}
            color="success"
            size="sm"
          >
            Cập nhật
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
      </div>
      <DataTable
        data={mockUsers}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên..."
        searchColumn="userName"
        pageSizeOptions={[4, 6, 8]}
        defaultPageSize={4}
      />
    </div>
  );
};

export default UserTablePage;
