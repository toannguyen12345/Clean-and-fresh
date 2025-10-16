import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Toast } from '@/components';

import router from './routes';

import '@/lib/i18n.ts';
import '@/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toast />
  </React.StrictMode>,
);
