import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'avatar' | 'image' | 'button' | 'card' | 'list-item';
  lines?: number;
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text', 
  lines = 1,
  width,
  height 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'title':
        return 'h-6 mb-2';
      case 'avatar':
        return 'w-10 h-10 rounded-full';
      case 'image':
        return 'w-full h-32 rounded-lg';
      case 'button':
        return 'h-10 w-24 rounded-lg';
      case 'card':
        return 'w-full h-48 rounded-lg';
      case 'list-item':
        return 'h-16 w-full rounded-lg';
      default:
        return 'h-4 mb-2';
    }
  };

  const getWidth = () => {
    if (width) return width;
    switch (variant) {
      case 'title':
        return 'w-3/4';
      case 'text':
        return 'w-full';
      case 'button':
        return 'w-24';
      default:
        return 'w-full';
    }
  };

  const getHeight = () => {
    if (height) return height;
    return '';
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${getWidth()} ${getHeight()}`}
            style={{
              width: index === lines - 1 ? '60%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${getVariantClasses()} ${getWidth()} ${getHeight()} ${className}`}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton variant="avatar" />
      <div className="flex-1">
        <Skeleton variant="title" />
        <Skeleton variant="text" width="w-1/2" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="w-20" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" width="w-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ 
  items?: number; 
  columns?: number;
  className?: string;
  itemClassName?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className = '',
  itemClassName = ''
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index} className={itemClassName} />
    ))}
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <Skeleton variant="avatar" className="w-12 h-12" />
          <div className="ml-4 flex-1">
            <Skeleton variant="text" width="w-16" />
            <Skeleton variant="title" width="w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <Skeleton variant="title" className="mb-6" />
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <Skeleton variant="text" width="w-24" className="mb-2" />
          <Skeleton variant="button" width="w-full" height="h-10" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonModal: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <Skeleton variant="title" width="w-48" />
      </div>
      <div className="p-6">
        <SkeletonForm />
      </div>
    </div>
  </div>
);

export default Skeleton; 