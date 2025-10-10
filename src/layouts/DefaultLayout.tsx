import { ReactNode } from 'react';

import Navbar from './Navbar/Navbar';
import Header from './Header/Header';
import Footer from './Footer/Footer';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
