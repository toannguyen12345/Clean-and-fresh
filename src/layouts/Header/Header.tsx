import { useState, useEffect } from 'react';

import img1 from '@/assets/360_F_552010790_ZIeJI42YzsoTIORzAjhHBi54XuJ5CuwS.jpg';
import img2 from '@/assets/assortment-fresh-vegetables-fruits-background-260nw-2284408579.webp';
import img3 from '@/assets/fresh-vegetables-fruits-background-260nw-671214979.webp';

const SLIDES = [
  {
    image: '/header_img.png',
    title: 'TRÁI CÂY TƯƠI SỨC KHỎE XANH',
    desc: 'Chúng tôi cung cấp trái cây sạch, tươi ngon mỗi ngày, đảm bảo an toàn và chất lượng cho sức khỏe của bạn và gia đình',
  },
  {
    image: img1,
    title: 'RAU CỦ TƯƠI NGON',
    desc: 'Nguồn gốc rõ ràng, đảm bảo an toàn vệ sinh thực phẩm',
  },
  {
    image: img2,
    title: 'THỰC PHẨM SẠCH',
    desc: 'Đa dạng loại rau củ quả tươi mỗi ngày',
  },
  {
    image: img3,
    title: 'DINH DƯỠNG XANH',
    desc: 'Giàu vitamin và khoáng chất thiết yếu',
  },
];

const Header = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[34vw] my-8 overflow-hidden rounded-2xl">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center transition-opacity duration-1000 rounded-2xl ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute flex flex-col items-start gap-6 max-w-1/2 bottom-1/5 left-8 lg:max-w-[45%] md:max-w-[55%]">
            <h2 className="font-medium text-[#ffffff] text-[max(4.5vw,22px)] drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-[#ffffff] text-[1vw] max-[750px]:hidden drop-shadow-lg">
              {slide.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;
