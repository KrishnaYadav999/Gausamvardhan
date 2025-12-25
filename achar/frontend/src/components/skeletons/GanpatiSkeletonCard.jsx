import React from "react";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const GanpatiSkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-md flex flex-col h-full">
      {/* Image */}
      <div className="h-40 sm:h-48 md:h-[250px] rounded-t-2xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Details */}
      <div className="px-3 py-3 flex flex-col flex-1">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 mb-2" />

        {/* Rating */}
        <Skeleton className="h-3 w-24 mb-3" />

        {/* Pack dropdown */}
        <Skeleton className="h-9 w-full mb-3" />

        {/* Price */}
        <Skeleton className="h-5 w-24 mb-3" />

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg mt-auto" />
      </div>
    </div>
  );
};

export default GanpatiSkeletonCard;
