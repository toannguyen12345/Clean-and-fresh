import { useLocation } from 'react-router-dom';

import { assets } from '@/assets/assets';

const Footer = (): JSX.Element | null => {
  const location = useLocation();

  if (location.pathname === '/user/navbar') {
    return null;
  }

  return (
    <div id="footer" className="flex flex-col items-center gap-8 px-[8vw] py-16 text-[#d9d9d9] bg-[#000000]" style={{ backgroundColor: '#000000' }}>
      <div className="w-full grid grid-cols-[1.5fr_1fr_1fr] gap-16 items-start max-[750px]:flex max-[750px]:flex-col max-[750px]:gap-[35px]">
        <div className="flex flex-col items-start gap-5">
          <p className="font-bold text-[40px] text-[#f25d3d]">Clean&Fresh</p>
          <p className="max-w-[420px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
            placeat modi deleniti eius perferendis? Alias odio magni molestias
            dolor maiores necessitatibus, dolore, enim quasi incidunt amet
            delectus temporibus? Necessitatibus, voluptas.
          </p>
          <div className="flex gap-4 mt-2">
            <span className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-full hover:bg-white/10 transition-colors"><img src={assets.facebook_icon} alt="Facebook" className="w-4" /></span>
            <span className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-full hover:bg-white/10 transition-colors"><img src={assets.twitter_icon} alt="Twitter" className="w-4" /></span>
            <span className="w-6 h-6 flex items-center justify-center border border-gray-400 rounded-full hover:bg-white/10 transition-colors"><img src={assets.linkedin_icon} alt="LinkedIn" className="w-4" /></span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 mt-[20px]">
          <h2 className="text-white">COMPANY</h2>
          <ul className="list-none">
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              Home
            </li>
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              About us
            </li>
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              Delivery
            </li>
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              Privacy policy
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-5 mt-[20px]">
          <h2 className="text-white">Get in touch</h2>
          <ul className="list-none">
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              000000000
            </li>
            <li className="mb-2.5 cursor-pointer hover:text-white transition-colors">
              contract@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <hr className="w-full h-px my-6 bg-[#4d4d4d] border-none" />

      <p className="text-center text-xs text-[#bdbdbd] max-[750px]:text-center">
        Copyright 2024 FreshandClean.com - All Right Reserved
      </p>
    </div>
  );
};

export default Footer;
