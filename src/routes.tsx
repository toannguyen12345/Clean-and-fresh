import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { USER_ROUTES } from '@/constants/routes';
import DefaultLayout from '@/layouts/DefaultLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const DetailFoodPage = lazy(() => import('./pages/DetailFood'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProductTablePage = lazy(() => import('./pages/Product/ProductTable'));
const AddProductPage = lazy(() => import('./pages/Product/AddProduct'));
const EditProductPage = lazy(() => import('./pages/Product/EditProduct'));

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
    </Route>,
  ),
);

export default router;
