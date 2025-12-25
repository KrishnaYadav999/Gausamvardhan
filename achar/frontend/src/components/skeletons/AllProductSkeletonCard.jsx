import React from "react";

const SkeletonBox = ({ className }) => (
  <div
    className={`bg-gray-200 rounded-md animate-pulse ${className}`}
  />
);

const AllProductSkeletonCard = () => {
  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-sm flex flex-col">
      {/* Image Skeleton */}
      <SkeletonBox className="h-48 w-full rounded-xl mb-4" />

      {/* Category / Tag */}
      <SkeletonBox className="h-4 w-20 mb-2" />

      {/* Product Title */}
      <SkeletonBox className="h-5 w-3/4 mb-3" />

      {/* Rating */}
      <SkeletonBox className="h-4 w-28 mb-3" />

      {/* Price Row */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBox className="h-5 w-16" />
        <SkeletonBox className="h-4 w-10" />
      </div>

      {/* Dropdown / Variant */}
      <SkeletonBox className="h-10 w-full mb-3" />

      {/* Button */}
      <SkeletonBox className="h-11 w-full rounded-lg mt-auto" />
    </div>
  );
};

export default AllProductSkeletonCard;
