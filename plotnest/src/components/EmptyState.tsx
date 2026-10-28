import React from 'react';
import { LucideIcon, FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="py-14 px-6 text-center rounded-3xl bg-white border border-[#EAE4D9] shadow-xs my-4">
      <div className="w-16 h-16 rounded-2xl bg-[#F4EFE6] text-[#14532D] mx-auto flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-bold shadow-xs transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="space-y-2.5 flex-1 w-full">
            <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
            <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
        </div>
      ))}
    </div>
  );
};
