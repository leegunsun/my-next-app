"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { CustomSelect } from '@/components/ui/select'
import { Filter, Mail, Eye, Reply, MessageSquare } from 'lucide-react'

interface MessageFiltersProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
  loading?: boolean
  counts?: {
    all: number
    unread: number
    read: number
    replied: number
  }
}

const MessageFilters: React.FC<MessageFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  loading = false,
  counts
}) => {
  const statusOptions = [
    {
      value: 'all',
      label: '전체 메시지',
      icon: MessageSquare,
      count: counts?.all || 0,
      color: 'default' as const
    },
    {
      value: 'unread',
      label: '읽지 않음',
      icon: Mail,
      count: counts?.unread || 0,
      color: 'destructive' as const
    },
    {
      value: 'read',
      label: '읽음',
      icon: Eye,
      count: counts?.read || 0,
      color: 'secondary' as const
    },
    {
      value: 'replied',
      label: '답변 완료',
      icon: Reply,
      count: counts?.replied || 0,
      color: 'default' as const
    }
  ]


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-background/50 backdrop-blur-sm border border-border/30 rounded-2xl shadow-sm"
    >
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" />
        <span>메시지 필터</span>
      </div>

      {/* Status Filter Dropdown */}
      <div className="flex items-center gap-3">
        <CustomSelect
          options={statusOptions.map((option) => ({
            id: option.value,
            name: `${option.label}${option.count > 0 ? ` (${option.count})` : ''}`,
            value: option.value,
            icon: <option.icon className="h-4 w-4" />
          }))}
          value={selectedStatus}
          onChange={onStatusChange}
          disabled={loading}
          className="w-44"
        />
      </div>

      {/* Quick Stats */}
      {counts && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">총 {counts.all}개</span>
            {counts.unread > 0 && (
              <span className="text-red-500 font-medium ml-2">
                • 미처리 {counts.unread}개
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default MessageFilters