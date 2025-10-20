import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  loader?: ReactNode;
  endMessage?: ReactNode;
  threshold?: number;
}

const InfiniteScroll = ({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  loader,
  endMessage,
  threshold = 100,
}: InfiniteScrollProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0, rootMargin: `${threshold}px` },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div>
      {children}

      <div ref={observerTarget} className="w-full py-4">
        {isLoading &&
          (loader || (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#28a745]" />
            </div>
          ))}

        {!hasMore &&
          !isLoading &&
          (endMessage || (
            <p className="text-center text-gray-500 text-sm">
              Đã hiển thị tất cả đơn hàng
            </p>
          ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
