import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';

import { USER_ROUTES } from '@/constants/routes';
import DefaultLayout from '@/layouts/DefaultLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ShipperLayout from '@/layouts/ShipperLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const DetailFoodPage = lazy(() => import('./pages/DetailFood'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistory'));
const ShipperOrderPage = lazy(() => import('./pages/ShipperOrderPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductTablePage = lazy(() => import('./pages/Product/ProductTable'));
const AddProductPage = lazy(() => import('./pages/Product/AddProduct'));
const EditProductPage = lazy(() => import('./pages/Product/EditProduct'));
const DiscountTablePage = lazy(() => import('./pages/Discount/DiscountTable'));
const AddDiscountPage = lazy(() => import('./pages/Discount/AddDiscount'));
const EditDiscountPage = lazy(() => import('./pages/Discount/EditDiscount'));
const UserTablePage = lazy(() => import('./pages/User/UserTable'));
const EditUserPage = lazy(() => import('./pages/User/EditUser'));
const ShipperTablePage = lazy(() => import('./pages/Shipper/ShipperTable'));
const EditShipperPage = lazy(() => import('./pages/Shipper/EditShipper'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#28a745] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 font-medium">Đang tải...</p>
    </div>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* User routes with Navbar */}
      <Route element={<DefaultLayout />}>
        <Route
          path={USER_ROUTES.US0001_HOME}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0002_DETAIL_FOOD}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DetailFoodPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0003_PROFILE}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0004_CART}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CartPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0011_ORDER_HISTORY}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <OrderHistoryPage />
            </Suspense>
          }
        />
      </Route>

      {/* Shipper routes with SidebarShipper */}
      <Route element={<ShipperLayout />}>
        <Route
          path={USER_ROUTES.US0012_SHIPPER_ORDERS}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ShipperOrderPage />
            </Suspense>
          }
        />
      </Route>

      {/* Admin routes with Sidebar */}
      <Route element={<AdminLayout />}>
        <Route
          path={USER_ROUTES.US0013_ADMIN_DASHBOARD}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0005_PRODUCT_LIST}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProductTablePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0006_ADD_PRODUCT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AddProductPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0007_EDIT_PRODUCT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EditProductPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0008_DISCOUNT_LIST}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DiscountTablePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0009_ADD_DISCOUNT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AddDiscountPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0010_EDIT_DISCOUNT}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EditDiscountPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/listUser"
          element={<Navigate to={USER_ROUTES.US0014_USER_LIST} replace />}
        />
        <Route
          path={USER_ROUTES.US0014_USER_LIST}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <UserTablePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0015_EDIT_USER}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EditUserPage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0016_SHIPPER_LIST}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ShipperTablePage />
            </Suspense>
          }
        />
        <Route
          path={USER_ROUTES.US0017_EDIT_SHIPPER}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EditShipperPage />
            </Suspense>
          }
        />
      </Route>
    </>,
  ),
);

export default router;
