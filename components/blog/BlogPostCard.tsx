"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Tag, User, ArrowRight } from 'lucide-react'
import { BlogPost } from '../../lib/firebase/firestore'
// Using native JavaScript Date formatting instead of date-fns
import Link from 'next/link'

interface BlogPostCardProps {
  post: BlogPost
  delay?: number
}

export default function BlogPostCard({ post, delay = 0 }: BlogPostCardProps) {
  const formatDate = (timestamp: { toDate?: () => Date } | Date | string) => {
    if (!timestamp) return ''
    
    let date: Date
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && timestamp.toDate) {
      date = timestamp.toDate()
    } else if (timestamp instanceof Date) {
      date = timestamp
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp)
    } else {
      // Fallback for any other case
      date = new Date()
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      development: 'bg-primary/10 text-primary',
      insights: 'bg-accent-purple/10 text-accent-purple',
      learning: 'bg-accent-success/10 text-accent-success',
      career: 'bg-accent-warning/10 text-accent-warning',
      technology: 'bg-accent-info/10 text-accent-info'
    }
    return colors[category] || 'bg-foreground-muted/10 text-foreground-muted'
  }

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      development: '개발',
      insights: '인사이트',
      learning: '학습',
      career: '커리어',
      technology: '기술'
    }
    return names[category] || category
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="bg-background-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${getCategoryColor(post.category)}
            `}>
              {getCategoryName(post.category)}
            </div>
            <div className="flex items-center text-xs text-foreground-secondary">
              <Calendar size={14} className="mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-foreground-secondary text-sm leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-background-secondary text-xs text-foreground-secondary rounded-md"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-foreground-muted">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-foreground-secondary">
              <div className="flex items-center gap-1">
                <User size={14} />
                {post.author}
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}분 읽기
                </div>
              )}
            </div>
            
            <motion.div
              className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 2 }}
            >
              읽기
              <ArrowRight size={14} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}