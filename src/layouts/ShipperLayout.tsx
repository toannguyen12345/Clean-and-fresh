import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import SidebarShipper from './sidebar/Sidebar/SidebarShipper';

interface ShipperLayoutProps {
  children?: ReactNode;
}

const ShipperLayout = ({ children }: ShipperLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <SidebarShipper />

      <main className="flex-1 ml-20 transition-all duration-300 min-h-screen">
        <div className="p-8 w-full">{children || <Outlet />}</div>
      </main>
    </div>
  );
};

export default ShipperLayout;
