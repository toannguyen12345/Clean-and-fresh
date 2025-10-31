import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { Toast } from '@/components';
import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';

import router from './routes';

import '@/lib/i18n.ts';
import '@/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toast />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>,
);
