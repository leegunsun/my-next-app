"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  MessageSquare, 
  FileText, 
  Edit,
  BarChart3,
  Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface QuickAction {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  color: string
  description: string
}

const quickActions: QuickAction[] = [
  {
    href: '/admin/posts/new',
    label: '새 글 작성',
    icon: Plus,
    color: 'bg-primary',
    description: '새로운 블로그 게시물 작성'
  },
  {
    href: '/admin/posts',
    label: '게시물 관리',
    icon: FileText,
    color: 'bg-accent-success',
    description: '게시물 목록 및 편집'
  },
  {
    href: '/admin/messages',
    label: '메시지 확인',
    icon: MessageSquare,
    color: 'bg-accent-info',
    description: '연락 폼 메시지 관리'
  }
]

interface QuickActionsProps {
  className?: string
  variant?: 'compact' | 'full'
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  className = '',
  variant = 'full'
}) => {
  const { user, isMaster } = useAuth()

  if (!user || !isMaster) {
    return null
  }

  if (variant === 'compact') {
    return (
      <div className={`flex gap-3 ${className}`}>
        {quickActions.slice(0, 2).map((action, index) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} text-white p-3 rounded-lg shadow-lg hover:opacity-90 transition-all flex items-center gap-2`}
                title={action.description}
              >
                <Icon size={18} />
                <span className="text-sm font-medium hidden sm:inline">{action.label}</span>
              </motion.button>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {quickActions.map((action, index) => {
        const Icon = action.icon
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-background-card rounded-lg border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${action.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-foreground-secondary text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default QuickActions