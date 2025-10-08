import { useState } from 'react';
import { Link } from 'react-router-dom';

//import { assets } from '@/assets/assets';

interface INavbarProps {
}

const Navbar = ({}: INavbarProps): JSX.Element => {
  const [menu, setMenu] = useState<string>('Home');

  return (
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
          onClick={() => setMenu('menu')}
          className={`cursor-pointer hover:text-[#28a745] transition-colors ${
            menu === 'menu' ? 'text-[#28a745] font-semibold' : ''
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
          href="#"
          onClick={() => setMenu('About')}
          className={`cursor-pointer hover:text-[#28a745] transition-colors ${
            menu === 'About' ? 'text-[#28a745] font-semibold' : ''
          }`}
        >
          Liên hệ
        </a>
      </ul>

      <div className="flex items-center gap-[50px] cursor-pointer">
        <button className="px-8 py-3 bg-white text-black border-2 border-[#28a745] rounded-full hover:bg-[#28a745] hover:text-white transition-colors text-[1.21rem] min-h-[50px]">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Navbar;
