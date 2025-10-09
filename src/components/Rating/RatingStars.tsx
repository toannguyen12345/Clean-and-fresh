import { assets } from '@/assets/assets';

interface RatingStarsProps {
  className?: string;
}

const RatingStars = ({
  className = 'w-[70px]',
}: RatingStarsProps): JSX.Element => {
  return <img src={assets.rating_starts} alt="rating" className={className} />;
};

export default RatingStars;
