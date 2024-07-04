import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<HomePage />} />),
);

export default router;
