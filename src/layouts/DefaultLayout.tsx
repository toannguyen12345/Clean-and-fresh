import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { useUser } from '@/contexts/UserContext';
import Loading from '@/components/Loading/Loading';

import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

interface DefaultLayoutProps {
  children?: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default DefaultLayout;
