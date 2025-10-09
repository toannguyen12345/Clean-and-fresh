interface AddToCartButtonProps {
  onClick: () => void;
  icon: string;
  className?: string;
}

const AddToCartButton = ({
  onClick,
  icon,
  className = '',
}: AddToCartButtonProps): JSX.Element => {
  return (
    <img
      onClick={onClick}
      src={icon}
      alt="Add to cart"
      className={`w-[35px] absolute bottom-[15px] right-[15px] cursor-pointer rounded-full ${className}`}
    />
  );
};

export default AddToCartButton;
