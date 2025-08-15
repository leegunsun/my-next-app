"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Calendar, Clock, Tag, User, ArrowLeft, Edit, Share2 } from 'lucide-react'
import { getBlogPost, BlogPost } from '../../../lib/firebase/firestore'
import { useAuth } from '../../../contexts/AuthContext'
// Using native JavaScript Date formatting instead of date-fns
import Link from 'next/link'
import AnimatedSection from '../../../components/AnimatedSection'

export default function BlogPostPage() {
  const params = useParams()
  const { isMaster } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string)
    }
  }, [params.id])

  const loadPost = async (postId: string) => {
    setLoading(true)
    const { post: fetchedPost, error: fetchError } = await getBlogPost(postId)
    
    if (fetchError) {
      setError(fetchError)
    } else {
      setPost(fetchedPost)
    }
    setLoading(false)
  }

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
      development: 'bg-primary/10 text-primary border-primary/20',
      insights: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
      learning: 'bg-accent-success/10 text-accent-success border-accent-success/20',
      career: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
      technology: 'bg-accent-info/10 text-accent-info border-accent-info/20'
    }
    return colors[category] || 'bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20'
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

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
          <div className="container mx-auto px-6 h-16 flex items-center">
            <Link href="/blog" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} />
              블로그로 돌아가기
            </Link>
          </div>
        </nav>
        
        <div className="pt-16 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-background-secondary rounded w-3/4"></div>
                <div className="h-4 bg-background-secondary rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-background-secondary rounded"></div>
                  <div className="h-4 bg-background-secondary rounded"></div>
                  <div className="h-4 bg-background-secondary rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
          <div className="container mx-auto px-6 h-16 flex items-center">
            <Link href="/blog" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} />
              블로그로 돌아가기
            </Link>
          </div>
        </nav>
        
        <div className="pt-16 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl font-medium mb-4">게시물을 찾을 수 없습니다</h1>
              <p className="text-foreground-secondary mb-8">
                {error || '요청하신 게시물이 존재하지 않거나 삭제되었습니다.'}
              </p>
              <Link href="/blog" className="btn-primary">
                블로그로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            블로그로 돌아가기
          </Link>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 bg-background-secondary hover:bg-background-tertiary rounded-md transition-colors"
            >
              <Share2 size={16} />
              공유
            </motion.button>
            
            {isMaster && (
              <Link href={`/admin/posts/edit/${post.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-accent-blend text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  <Edit size={16} />
                  편집
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <article>
          {/* Header */}
          <section className="py-12 bg-background-secondary">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <AnimatedSection>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className={`
                      px-4 py-2 rounded-full text-sm font-medium border
                      ${getCategoryColor(post.category)}
                    `}>
                      {getCategoryName(post.category)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(post.createdAt)}
                      </div>
                      
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {post.readTime}분 읽기
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {post.author}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                  <h1 className="text-3xl md:text-4xl font-medium mb-4 leading-tight">
                    {post.title}
                  </h1>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <p className="text-lg text-foreground-secondary leading-relaxed">
                    {post.excerpt}
                  </p>
                </AnimatedSection>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <AnimatedSection delay={0.3}>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-background text-foreground-secondary rounded-full text-sm border border-border"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <AnimatedSection delay={0.4}>
                  <div 
                    className="prose prose-lg max-w-none
                      prose-headings:font-medium prose-headings:text-foreground
                      prose-p:text-foreground-secondary prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-foreground prose-strong:font-medium
                      prose-code:bg-background-secondary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                      prose-pre:bg-background-secondary prose-pre:border prose-pre:border-border
                      prose-blockquote:border-l-primary prose-blockquote:bg-background-secondary prose-blockquote:rounded-r
                      prose-ul:text-foreground-secondary prose-ol:text-foreground-secondary
                      prose-li:text-foreground-secondary
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* Updated info */}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <section className="py-6 border-t border-border bg-background-secondary">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm text-foreground-secondary">
                    마지막 수정: {formatDate(post.updatedAt)}
                  </p>
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  )
}