import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './sidebar/Sidebar/Sidebar';

const AdminLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onToggle={setSidebarExpanded} />

      <main
        className={`flex-1 transition-all duration-300 min-h-screen ${
          sidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-8 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
