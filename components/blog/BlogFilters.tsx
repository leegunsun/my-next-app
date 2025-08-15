"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'

interface BlogFiltersProps {
  categories: Array<{ id: string; name: string; count: number }>
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearchSubmit: () => void
}

export default function BlogFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  onSearchSubmit
}: BlogFiltersProps) {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit()
  }

  return (
    <div className="bg-background-secondary py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
              <div className="relative">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" 
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="검색어를 입력하세요..."
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-foreground-secondary mr-2">
                <Filter size={16} />
                카테고리:
              </div>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-background-tertiary text-foreground-secondary hover:text-foreground border border-border'
                    }
                  `}
                >
                  {category.name}
                  {category.count > 0 && (
                    <span className={`
                      ml-2 px-1.5 py-0.5 text-xs rounded-full
                      ${selectedCategory === category.id
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-foreground-muted/20 text-foreground-muted'
                      }
                    `}>
                      {category.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}