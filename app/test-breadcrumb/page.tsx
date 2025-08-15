"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ChevronRight } from 'lucide-react'

export default function TestBreadcrumbPage() {
  // Simulate the breadcrumb variant from AdminNavigation
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Background with Subtle Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary/30 to-background-tertiary/20 pointer-events-none" />
      
      {/* Fixed breadcrumb navigation with better contrast */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/95 backdrop-blur-sm border-b border-border/30 shadow-sm relative z-10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1 font-medium"
            >
              <Home size={16} />
              홈
            </Link>
            <ChevronRight size={14} className="text-foreground/60" />
            <span className="text-foreground font-semibold">관리자</span>
            <ChevronRight size={14} className="text-foreground/60" />
            <span className="text-foreground/80 font-medium">메시지</span>
          </div>
        </div>
      </motion.nav>
      
      {/* Test content to show the breadcrumb */}
      <div className="relative z-10 p-8">
        <h1 className="text-2xl font-bold mb-4">Breadcrumb Navigation Test</h1>
        <p className="text-foreground-secondary mb-4">
          이 페이지는 breadcrumb 내비게이션의 텍스트 가시성과 위치 문제를 테스트하기 위한 페이지입니다.
        </p>
        
        {/* Show text color variables for comparison */}
        <div className="space-y-2 mt-8">
          <p className="text-foreground">text-foreground (기본 텍스트)</p>
          <p className="text-foreground-secondary">text-foreground-secondary (보조 텍스트)</p>
          <p className="text-foreground-muted">text-foreground-muted (흐린 텍스트)</p>
        </div>
        
        {/* Test different background combinations */}
        <div className="mt-8 space-y-4">
          <div className="bg-background-secondary border-b border-border p-4 rounded">
            <h3 className="font-medium mb-2">Same background as breadcrumb:</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground-secondary">홈</span>
              <ChevronRight size={14} className="text-foreground-muted" />
              <span className="text-foreground font-medium">관리자</span>
              <ChevronRight size={14} className="text-foreground-muted" />
              <span className="text-foreground-secondary">메시지</span>
            </div>
          </div>
          
          <div className="bg-background p-4 rounded border">
            <h3 className="font-medium mb-2">Normal background:</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground-secondary">홈</span>
              <ChevronRight size={14} className="text-foreground-muted" />
              <span className="text-foreground font-medium">관리자</span>
              <ChevronRight size={14} className="text-foreground-muted" />
              <span className="text-foreground-secondary">메시지</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}