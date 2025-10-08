const Header = (): JSX.Element => {
  return (
    <div className="relative w-full h-[34vw] my-[30px] bg-no-repeat bg-contain bg-[position:120px_center] animate-[fadeIn_1s]" style={{ backgroundImage: "url(/header_img.png)" }}>
      <div className="absolute flex flex-col items-start gap-[1.5vw] max-w-[50%] bottom-[20%] left-[calc(6vw+40px)] animate-[fadeIn_2s] max-[1050px]:max-w-[45%] max-[750px]:max-w-[55%]">
        <h2 className="font-medium text-[#ffffff] text-[max(4.5vw,22px)]">
          TRÁI CÂY TƯƠI SỨC KHỎE XANH
        </h2>
        <p className="text-[#ffffff] text-[1vw] max-[750px]:hidden">
          Chúng tôi cung cấp trái cây sạch, tươi ngon mỗi ngày, đảm bảo an toàn và chất lượng cho sức khỏe của bạn và gia đình
        </p>
      </div>
    </div>
  );
};

export default Header;
