'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageGroupSize?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageGroupSize = 10,
}: PaginationProps) {
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        이전
      </button>

      {startPage > 1 && (
        <button
          onClick={() => onPageChange(startPage - 1)}
          className="px-3 py-1 border rounded"
        >
          ◀
        </button>
      )}

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            p === currentPage ? 'bg-blue-500 text-white' : ''
          }`}
        >
          {p}
        </button>
      ))}

      {endPage < totalPages && (
        <button
          onClick={() => onPageChange(endPage + 1)}
          className="px-3 py-1 border rounded"
        >
          ▶
        </button>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}
