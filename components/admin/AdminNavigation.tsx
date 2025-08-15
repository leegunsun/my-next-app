"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings,
  Users,
  BarChart3,
  Home,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAdminStats } from '../../hooks/useAdminStats'

interface AdminNavigationProps {
  variant?: 'sidebar' | 'floating' | 'breadcrumb'
  className?: string
}

const adminNavItems = [
  {
    href: '/admin/posts',
    label: '게시물 관리',
    icon: FileText,
    description: '블로그 게시물 작성 및 관리'
  },
  {
    href: '/admin/messages',
    label: '메시지 관리', 
    icon: MessageSquare,
    description: '연락 폼으로 받은 메시지 관리'
  },
  {
    href: '/admin/posts/new',
    label: '새 글 작성',
    icon: FileText,
    description: '새로운 블로그 게시물 작성'
  }
]

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ 
  variant = 'sidebar',
  className = ''
}) => {
  const { user, isMaster } = useAuth()
  const pathname = usePathname()
  const { stats } = useAdminStats()

  // Don't render if user is not a master
  if (!user || !isMaster) {
    return null
  }

  // Floating variant for main site
  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <Link href="/admin/posts">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent-blend text-primary-foreground p-4 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center gap-2 group"
            title="관리자 패널"
          >
            <Settings size={24} />
            <span className="hidden group-hover:inline-block text-sm font-medium">
              관리자
            </span>
          </motion.button>
        </Link>
      </motion.div>
    )
  }

  // Breadcrumb variant for admin pages
  if (variant === 'breadcrumb') {
    const isAdminPage = pathname?.startsWith('/admin')
    if (!isAdminPage) return null

    return (
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-background/95 backdrop-blur-sm border-b border-border/30 shadow-sm ${className}`}
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
            {pathname !== '/admin/posts' && (
              <>
                <ChevronRight size={14} className="text-foreground/60" />
                <span className="text-foreground/80 font-medium">
                  {pathname?.includes('/messages') && '메시지'}
                  {pathname?.includes('/new') && '새 글 작성'}
                  {pathname?.includes('/edit') && '글 편집'}
                </span>
              </>
            )}
          </div>
        </div>
      </motion.nav>
    )
  }

  // Sidebar variant for admin layout
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-background-card border-r border-border min-h-screen ${className}`}
    >
      <div className="p-6">
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-blend rounded-lg flex items-center justify-center">
              <LayoutDashboard size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">관리자 패널</h2>
              <p className="text-sm text-foreground-secondary">사이트 관리</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {adminNavItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-background-secondary text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon size={20} className={`${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`}>
                        {item.label}
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-background-secondary rounded-lg"
        >
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            빠른 통계
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">
                {stats.loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mx-auto"
                  />
                ) : stats.error ? (
                  '-'
                ) : (
                  stats.totalPosts
                )}
              </div>
              <div className="text-foreground-muted">게시물</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent-info">
                {stats.loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mx-auto"
                  />
                ) : stats.error ? (
                  '-'
                ) : (
                  stats.totalMessages
                )}
              </div>
              <div className="text-foreground-muted">메시지</div>
            </div>
          </div>
          {stats.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-xs text-accent-error bg-accent-error/10 p-2 rounded border border-accent-error/20"
            >
              통계 로딩 실패: {stats.error}
            </motion.div>
          )}
        </motion.div>

        {/* Back to Site */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-background-secondary hover:bg-background-tertiary rounded-lg transition-colors text-sm font-medium"
            >
              <Home size={16} />
              사이트로 돌아가기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.aside>
  )
}

export default AdminNavigation