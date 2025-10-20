import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Toast } from '@/components';
import { UserProvider } from '@/contexts/UserContext';

import router from './routes';

import '@/lib/i18n.ts';
import '@/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <Toast />
    </UserProvider>
  </React.StrictMode>,
);
