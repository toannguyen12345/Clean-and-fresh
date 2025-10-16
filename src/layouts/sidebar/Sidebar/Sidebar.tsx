import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout?: () => void;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/admin/dashboard', icon: 'bx bxs-dashboard', label: 'Dashboard' },
  { path: '/admin/listUser', icon: 'bx bxs-user', label: 'Người dùng' },
  {
    path: '/admin/listDistributor',
    icon: 'bx bxs-truck',
    label: 'Nhà phân phối',
  },
  {
    path: '/admin/listDiscount',
    icon: 'bx bxs-discount',
    label: 'Mã giảm giá',
  },
  {
    path: '/admin/approved',
    icon: 'bx bxs-bar-chart-alt-2',
    label: 'Cấp quyền',
  },
  { path: '/admin/chat', icon: 'bx bx-chat', label: 'Tin nhắn' },
];

const Sidebar = ({ onLogout }: SidebarProps) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-50 ${
        isActive ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div
          className={`flex items-center gap-3 ${!isActive && 'justify-center'}`}
        >
          <i className="bx bxl-codepen text-2xl text-[#28a745]" />
          {isActive && (
            <span className="font-bold text-lg text-gray-900">Clean&Fresh</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-600 hover:text-[#28a745] transition-colors"
        >
          <i className="bx bx-menu" />
        </button>
      </div>

      {/* Navigation */}
      <ul className="py-4">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                isActiveRoute(item.path)
                  ? 'bg-[#28a745] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className={`${item.icon} text-2xl`} />
              {isActive && <span className="font-medium">{item.label}</span>}
            </Link>
          </li>
        ))}

        {/* Logout */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i className="bx bx-log-out text-2xl" />
            {isActive && <span className="font-medium">Đăng xuất</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
