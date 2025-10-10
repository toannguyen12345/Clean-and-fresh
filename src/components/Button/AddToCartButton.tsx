import Button from './Button';

interface IAddToCartButtonProps {
  onClick?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'black';
  outline?: boolean;
  disabled?: boolean;
  className?: string;
  quantity?: number;
}

const AddToCartButton = ({
  onClick,
  onIncrement,
  onDecrement,
  size = 'sm',
  color = 'dark',
  outline = false,
  disabled = false,
  className = '',
  quantity = 0,
}: IAddToCartButtonProps): JSX.Element => {
  if (quantity === 0) {
    return (
      <div className="absolute bottom-8 right 1 z 1">
        <Button
          onClick={onClick || onIncrement}
          color={color}
          size={size}
          outline={outline}
          disabled={disabled}
          className={`rounded-full ${className}`}
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-8 right-1 z 1">
      <div className="flex items-center gap-1">
        <Button
          onClick={onDecrement}
          color="danger"
          size="sm"
          outline={true}
          className="p-0 border-0 bg-transparent hover:bg-transparent min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-xs"
        >
          −
        </Button>
        <span className="text-sm font-semibold text-gray-800 px-2">
          {quantity}
        </span>
        <Button
          onClick={onIncrement}
          color="success"
          size="sm"
          outline={true}
          className="p-0 border-0 bg-transparent hover:bg-transparent min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-xs"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default AddToCartButton;
