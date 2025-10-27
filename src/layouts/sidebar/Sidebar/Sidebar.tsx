import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { removeAuthToken } from '@/utils/auth';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/listUser', icon: '👥', label: 'Người dùng' },
  { path: '/admin/products', icon: '🥬', label: 'Sản phẩm' },
  { path: '/admin/listShipper', icon: '🚚', label: 'Shipper' },
  { path: '/admin/discounts', icon: '🎫', label: 'Mã giảm giá' },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-all duration-300 z-[100] ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isExpanded ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-lg text-white">Clean&Fresh</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center text-2xl text-gray-400 hover:text-white transition-colors"
          >
            ☰
          </button>
        )}
      </div>

      <ul className="py-4">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={() => !isExpanded && setIsExpanded(true)}
              className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 ${
                isActiveRoute(item.path)
                  ? 'bg-[#28a745] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${!isExpanded && 'justify-center'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isExpanded && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          </li>
        ))}

        <li className="mt-4 border-t border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all duration-200 ${
              !isExpanded && 'justify-center'
            }`}
          >
            <span className="text-2xl">🚪</span>
            {isExpanded && (
              <span className="font-medium whitespace-nowrap">Đăng xuất</span>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
