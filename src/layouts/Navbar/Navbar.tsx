import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LoginPopup, UserAvatar, Dropdown, Button } from '@/components';
import { USER_ROUTES } from '@/constants/routes';
import { getAuthToken, removeAuthToken } from '@/utils/auth';
import { useUser } from '@/contexts/UserContext';

const Navbar = (): JSX.Element => {
  const [menu, setMenu] = useState<string>('Home');
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userAvatar } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleMenuClick = () => {
    setMenu('menu');
  };

  const handleContactClick = () => {
    setMenu('About');
  };

  return (
    <>
      <div className="flex items-center justify-between px-[100px] py-5 bg-white pt-[5px]">
        <Link to="/">
          <h1 className="text-2xl font-bold">Clean&Fresh</h1>
        </Link>

        <ul className="flex list-none gap-[50px] text-[1.21rem] text-[#49557e] m-0 p-0">
          <Link
            to="/"
            onClick={() => setMenu('Home')}
            className={`cursor-pointer hover:text-[#28a745] transition-colors ${
              menu === 'Home' ? 'text-[#28a745] font-semibold' : ''
            }`}
          >
            Trang chủ
          </Link>

          <a
            href="#food-display"
            onClick={handleMenuClick}
            className={`cursor-pointer hover:text-[#28a745] transition-colors ${
              menu === 'menu'
                ? 'text-[#28a745] font-semibold'
                : 'text-[#49557e]'
            }`}
          >
            Menu
          </a>

          <Link
            to="/user/history"
            onClick={() => setMenu('history')}
            className={`cursor-pointer hover:text-[#28a745] transition-colors ${
              menu === 'history' ? 'text-[#28a745] font-semibold' : ''
            }`}
          >
            Đơn mua
          </Link>

          <a
            href="#footer"
            onClick={handleContactClick}
            className={`cursor-pointer hover:text-[#28a745] transition-colors ${
              menu === 'About'
                ? 'text-[#28a745] font-semibold'
                : 'text-[#49557e]'
            }`}
          >
            Liên hệ
          </a>
        </ul>

        <div className="flex items-center gap-[50px] cursor-pointer">
          {isLoggedIn ? (
            <Dropdown
              trigger={<UserAvatar src={userAvatar} alt="User" size="md" />}
              items={[
                {
                  label: 'Giỏ hàng',
                  onClick: () => navigate(USER_ROUTES.US0004_CART),
                  className: 'text-gray-700 hover:bg-gray-50',
                },
                {
                  label: 'Hồ sơ',
                  onClick: () => navigate(USER_ROUTES.US0003_PROFILE),
                  className: 'text-gray-700 hover:bg-gray-50',
                },
                {
                  label: 'Đăng xuất',
                  onClick: handleLogout,
                  className: 'text-red-600 hover:bg-red-50',
                },
              ]}
            />
          ) : (
            <Button
              onClick={() => setShowLogin(true)}
              color="success"
              outline
              size="lg"
              className="rounded-full min-h-[50px] px-8 text-[1.21rem]"
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;
