import React from 'react';

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading list items">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="space-y-2.5 flex-1 w-full">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="h-3.5 bg-gray-100 rounded-md w-3/5"></div>
            <div className="h-3 bg-gray-100 rounded-md w-2/5"></div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-10 bg-gray-200 rounded-xl w-20"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard data">
      <div className="h-28 bg-emerald-950/20 rounded-3xl w-full"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-gray-100 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-72 bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-100 rounded-2xl"></div>
        </div>
        <div className="lg:col-span-5 h-72 bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-100 rounded-full w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const PlotMapSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading plot inventory map">
      <div className="h-14 bg-white rounded-2xl border border-gray-100"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-96 bg-gray-200 rounded-3xl"></div>
        <div className="lg:col-span-4 h-96 bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-100 rounded-2xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = ListSkeleton;
