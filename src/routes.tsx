import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { USER_ROUTES } from '@/constants/routes';
import DefaultLayout from '@/layouts/DefaultLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const DetailFoodPage = lazy(() => import('./pages/DetailFoodPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<DefaultLayout />}>
      <Route path={USER_ROUTES.US0001_HOME} element={<HomePage />} />
      <Route
        path={USER_ROUTES.US0002_DETAIL_FOOD}
        element={<DetailFoodPage />}
      />
      <Route path={USER_ROUTES.US0003_PROFILE} element={<ProfilePage />} />
    </Route>,
  ),
);

export default router;
