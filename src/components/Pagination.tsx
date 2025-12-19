import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => {
          const isCurrentPage = page === currentPage;
          const isEllipsis = page === '...';
          
          // 고유한 key 생성: 페이지 번호 또는 ellipsis + 위치
          const uniqueKey = typeof page === 'number' 
            ? `page-${page}` 
            : `ellipsis-${index}`;
          
          return (
            <button
              key={uniqueKey}
              onClick={() => {
                if (typeof page === 'number') {
                  onPageChange(page);
                }
              }}
              disabled={page === '...'}
              className={`min-w-10 h-10 rounded-lg transition-colors ${
                isCurrentPage
                  ? 'bg-blue-500 text-white shadow-md'
                  : isEllipsis
                  ? 'cursor-default bg-transparent'
                  : 'bg-white hover:bg-gray-50 shadow-md border border-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

