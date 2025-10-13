import { Button } from '@/components';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  className = '',
}: QuantitySelectorProps): JSX.Element => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={onDecrease}
        size="sm"
        color="secondary"
        className="w-10 h-10 flex items-center justify-center"
      >
        −
      </Button>
      <span className="text-lg font-semibold min-w-[40px] text-center">
        {quantity}
      </span>
      <Button
        onClick={onIncrease}
        size="sm"
        color="secondary"
        className="w-10 h-10 flex items-center justify-center"
      >
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;
