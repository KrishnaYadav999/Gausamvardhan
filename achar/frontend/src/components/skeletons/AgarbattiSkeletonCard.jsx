import React from "react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const AgarbattiSkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-full">
      {/* Image */}
      <div className="h-40 sm:h-48 rounded-t-2xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Details */}
      <div className="px-4 py-3 flex flex-col flex-1">
        {/* Title + Price */}
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Tagline */}
        <Skeleton className="h-3 w-1/2 mb-2" />

        {/* Rating */}
        <Skeleton className="h-3 w-24 mb-3" />

        {/* Pack select */}
        <Skeleton className="h-8 w-full mb-3" />

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg mt-auto" />
      </div>
    </div>
  );
};

export default AgarbattiSkeletonCard;
