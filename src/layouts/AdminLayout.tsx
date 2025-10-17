import { Outlet } from 'react-router-dom';

import Sidebar from './sidebar/Sidebar/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-20 transition-all duration-300 min-h-screen">
        <div className="p-8 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
