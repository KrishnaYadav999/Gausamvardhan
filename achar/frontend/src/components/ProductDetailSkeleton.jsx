import React from "react";

const Skeleton = ({ className }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
  </div>
);

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT IMAGE SECTION */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <Skeleton className="h-[420px] md:h-[560px] w-full rounded-2xl" />

            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT SECTION */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-6">

            {/* Title */}
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-4 w-2/5" />

            {/* Description */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>

            {/* Price */}
            <Skeleton className="h-12 w-44 rounded-lg" />

            {/* Feature boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>

            {/* CTA Buttons */}
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />

          </div>
        </div>
      </div>

      {/* shimmer animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.8s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetailSkeleton;
