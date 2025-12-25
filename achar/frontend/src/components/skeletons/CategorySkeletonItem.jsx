import React from "react";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const CategorySkeletonItem = () => {
  return (
    <div className="flex flex-col items-center snap-start min-w-[110px] md:min-w-[140px]">
      {/* Circle Image */}
      <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full" />

      {/* Text */}
      <Skeleton className="h-4 w-16 mt-3 rounded" />
    </div>
  );
};

export default CategorySkeletonItem;
