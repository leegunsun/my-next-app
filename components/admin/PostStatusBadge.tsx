"use client"

import React from 'react'
import { CheckCircle, Clock } from 'lucide-react'

interface PostStatusBadgeProps {
  status: 'draft' | 'published'
  size?: 'sm' | 'md'
}

export default function PostStatusBadge({ status, size = 'sm' }: PostStatusBadgeProps) {
  const isSmall = size === 'sm'
  
  if (status === 'published') {
    return (
      <span className={`
        inline-flex items-center gap-1 px-2 py-1 bg-accent-success/20 text-accent-success rounded-full font-medium
        ${isSmall ? 'text-xs' : 'text-sm'}
      `}>
        <CheckCircle size={isSmall ? 12 : 14} />
        게시됨
      </span>
    )
  }

  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-1 bg-accent-warning/20 text-accent-warning rounded-full font-medium
      ${isSmall ? 'text-xs' : 'text-sm'}
    `}>
      <Clock size={isSmall ? 12 : 14} />
      초안
    </span>
  )
}