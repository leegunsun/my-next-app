"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  loading?: boolean
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  hasNext,
  hasPrevious,
  onPageChange,
  onPageSizeChange,
  loading = false
}) => {
  // Calculate pagination numbers to show
  const getPageNumbers = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, array) => {
      return array.indexOf(item) === index && item !== 1 || index === 0
    })
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-background/50 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm"
    >
      {/* Results info */}
      <div className="text-sm text-muted-foreground flex-shrink-0 min-w-0">
        <span className="hidden md:inline">
          {startItem}-{endItem} of {totalCount} results
        </span>
        <span className="md:hidden">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 flex-1 justify-center max-w-md">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious || loading}
          className="hidden sm:flex h-9 w-9 p-0 bg-background/80 border-border/50 hover:bg-primary/5 hover:border-primary/30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious || loading}
          className="h-9 w-9 p-0 bg-background/80 border-border/50 hover:bg-primary/5 hover:border-primary/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[200px] sm:max-w-none">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-sm text-muted-foreground flex-shrink-0">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={loading}
                  className={`h-9 w-9 p-0 text-sm flex-shrink-0 ${
                    currentPage === page 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-background/80 border-border/50 hover:bg-primary/5 hover:border-primary/30"
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || loading}
          className="h-9 w-9 p-0 bg-background/80 border-border/50 hover:bg-primary/5 hover:border-primary/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext || loading}
          className="hidden sm:flex h-9 w-9 p-0 bg-background/80 border-border/50 hover:bg-primary/5 hover:border-primary/30"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
        <span className="whitespace-nowrap hidden md:inline">Items per page:</span>
        <span className="whitespace-nowrap md:hidden">Per page:</span>
        <div className="w-16 md:w-20">
          <CustomSelect
            options={[10, 25, 50, 100].map((size) => ({
              id: size.toString(),
              name: size.toString(),
              value: size.toString()
            }))}
            value={pageSize.toString()}
            onChange={(value) => onPageSizeChange(parseInt(value))}
            disabled={loading}
            className="min-w-14 md:min-w-16"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default PaginationComponent