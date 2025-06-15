'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page));
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex space-x-1">
        {currentPage > 3 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              1
            </Button>
            {currentPage > 4 && (
              <span className="px-2 py-1 text-gray-400">...</span>
            )}
          </>
        )}

        {getVisiblePages().map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
            className={
              currentPage === page
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            }
          >
            {page}
          </Button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-2 py-1 text-gray-400">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}