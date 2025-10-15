import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DataTable, Button } from '@/components';
import { Product } from '@/types/product';
import { USER_ROUTES } from '@/constants/routes';

const mockProducts: Product[] = [
  {
    _id: '1',
    productName: 'Táo Fuji Nhật Bản',
    ProductPrice: 150000,
    ProductQuantity: 10,
    category: '66f3b0ba7eb7ffbdd806be66',
    IMG: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200',
    userId: '123',
  },
  {
    _id: '2',
    productName: 'Cam Sành Việt Nam',
    ProductPrice: 45000,
    ProductQuantity: 0,
    category: '66f3b0ba7eb7ffbdd806be67',
    IMG: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200',
    userId: '123',
  },
  {
    _id: '3',
    productName: 'Nho Mỹ Không Hạt',
    ProductPrice: 120000,
    ProductQuantity: 15,
    category: '66f3b0ba7eb7ffbdd806be67',
    IMG: 'https://images.unsplash.com/photo-1599819177626-c0d3b8c2c8d8?w=200',
    userId: '123',
  },
  {
    _id: '4',
    productName: 'Dưa Hấu Không Hạt',
    ProductPrice: 35000,
    ProductQuantity: 8,
    category: '66f3b0ba7eb7ffbdd806be67',
    IMG: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=200',
    userId: '123',
  },
];

const ProductTablePage = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate(USER_ROUTES.US0006_ADD_PRODUCT);
  };

  const handleDeleteProduct = (id: string) => {
    toast.success(`Xóa sản phẩm ID: ${id} thành công!`);
  };

  const handleUpdateProduct = (id: string) => {
    navigate(USER_ROUTES.US0007_EDIT_PRODUCT.replace(':id', id));
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'productName',
      header: 'Tên Sản Phẩm',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={row.original.IMG || 'https://via.placeholder.com/50'}
              alt={row.original.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-900">
            {row.original.productName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'ProductPrice',
      header: 'Giá',
      cell: ({ row }) => (
        <span className="text-gray-900 font-semibold">
          {row.original.ProductPrice.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      accessorKey: 'ProductQuantity',
      header: 'Số lượng',
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.ProductQuantity}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {row.original.category}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.original.ProductQuantity > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.ProductQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Hành Động',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleDeleteProduct(row.original._id)}
            color="danger"
            size="sm"
          >
            Xóa
          </Button>
          <Button
            onClick={() => handleUpdateProduct(row.original._id)}
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <Button onClick={handleAddProduct} color="success">
          Thêm mới sản phẩm
        </Button>
      </div>
      <DataTable
        data={mockProducts}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên sản phẩm..."
        searchColumn="productName"
        pageSizeOptions={[4, 6, 8]}
        defaultPageSize={4}
      />
    </div>
  );
};

export default ProductTablePage;
