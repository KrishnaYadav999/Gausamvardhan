import React from "react";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const AcharProductSkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-full w-full">
      {/* IMAGE */}
      <div className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[300px] rounded-t-2xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* DETAILS */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col flex-1">
        {/* TITLE + PRICE */}
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <Skeleton className="h-4 sm:h-5 w-[65%]" />
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>

        {/* SUB TEXT */}
        <Skeleton className="h-3 w-32 mb-2 sm:mb-3" />

        {/* RATING */}
        <Skeleton className="h-3 w-20 mb-3" />

        {/* WEIGHT SELECT */}
        <Skeleton className="h-8 sm:h-9 w-full mb-3" />

        {/* BUTTON */}
        <Skeleton className="h-8 sm:h-10 w-full rounded-lg mt-auto" />
      </div>
    </div>
  );
};

export default AcharProductSkeletonCard;
