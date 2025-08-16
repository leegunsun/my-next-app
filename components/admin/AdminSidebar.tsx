"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    title: '글 관리',
    href: '/admin/posts',
    icon: FileText,
    description: '블로그 게시물 관리'
  },
  {
    title: '메시지 관리',
    href: '/admin/messages', 
    icon: MessageSquare,
    description: '연락 메시지 관리'
  },
  {
    title: '통계',
    href: '/admin/analytics',
    icon: BarChart3,
    description: '사이트 분석'
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
    description: '시스템 설정'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-64 bg-background-card border-r border-border/30 min-h-screen shadow-sm"
    >
      <div className="p-6">
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">관리자 패널</h2>
              <p className="text-sm text-foreground-secondary">사이트 관리</p>
            </div>
          </div>
          
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mt-4 origin-left"
          />
        </motion.div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl transition-all group cursor-pointer glass-effect backdrop-blur-sm",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-md" 
                        : "hover:bg-background-secondary/50 text-foreground-secondary hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/30"
                    )}
                  >
                    <Icon size={20} className={cn(
                      "transition-colors",
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-medium transition-colors",
                        isActive ? "text-primary" : "group-hover:text-foreground"
                      )}>
                        {item.title}
                      </div>
                      <div className="text-xs text-foreground-muted line-clamp-1">
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}