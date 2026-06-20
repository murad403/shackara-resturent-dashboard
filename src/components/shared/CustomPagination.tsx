import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const CustomPagination = ({ currentPage, totalPages, onPageChange }: CustomPaginationProps) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const range = 1 // adjacent pages

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 select-none py-6 border-t border-gray-100 mt-8">
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white active:scale-95 focus:outline-none"
      >
        <ChevronLeft className="w-4.5 h-4.5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-semibold select-none cursor-default"
              >
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 focus:outline-none ${
                isCurrent
                  ? 'bg-button-color text-white shadow-md shadow-button-color/20 border border-transparent'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white active:scale-95 focus:outline-none"
      >
        <ChevronRight className="w-4.5 h-4.5" />
      </button>
    </div>
  )
}

export default CustomPagination