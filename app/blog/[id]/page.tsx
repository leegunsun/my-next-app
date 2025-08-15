"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Calendar, Clock, Tag, User, ArrowLeft, Edit, Share2, Heart, Bookmark, MessageCircle } from 'lucide-react'
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
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string)
    }
  }, [params.id])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
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
          <motion.div
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/blog" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all font-medium">
              <ArrowLeft size={20} />
              블로그로 돌아가기
            </Link>
          </motion.div>
          
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 glass-effect rounded-2xl transition-all border border-border/30 shadow-sm font-medium ${
                isLiked ? 'text-red-500 bg-red-50/50' : 'hover:bg-background-secondary/50'
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </motion.div>
              좋아요
            </motion.button>
            
            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 glass-effect rounded-2xl transition-all border border-border/30 shadow-sm font-medium ${
                isBookmarked ? 'text-yellow-500 bg-yellow-50/50' : 'hover:bg-background-secondary/50'
              }`}
            >
              <motion.div
                animate={isBookmarked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </motion.div>
              북마크
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 glass-effect hover:bg-background-secondary/50 rounded-2xl transition-all border border-border/30 shadow-sm font-medium"
            >
              <Share2 size={16} />
              공유
            </motion.button>
            
            {isMaster && (
              <Link href={`/admin/posts/edit/${post.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-blend text-primary-foreground rounded-2xl hover:opacity-90 transition-all shadow-lg font-medium"
                >
                  <Edit size={16} />
                  편집
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16 relative z-10">
        <article>
          {/* Enhanced Hero Header */}
          <section className="py-20 relative overflow-hidden">
            {/* Hero Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary/30 to-background-tertiary/20 pointer-events-none" />
            
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <AnimatedSection>
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm shadow-sm
                        ${getCategoryColor(post.category)}
                      `}
                    >
                      {getCategoryName(post.category)}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex items-center gap-6 text-sm text-foreground-secondary"
                    >
                      <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-border/30">
                        <Calendar size={16} />
                        {formatDate(post.createdAt)}
                      </div>
                      
                      {post.readTime && (
                        <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-border/30">
                          <Clock size={16} />
                          {post.readTime}분 읽기
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full border border-border/30">
                        <User size={16} />
                        {post.author}
                      </div>
                    </motion.div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight"
                  >
                    <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                      {post.title}
                    </span>
                  </motion.h1>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl text-foreground-secondary leading-relaxed max-w-3xl"
                  >
                    {post.excerpt}
                  </motion.p>
                </AnimatedSection>

                {/* Enhanced Tags */}
                {post.tags && post.tags.length > 0 && (
                  <AnimatedSection delay={0.3}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="flex flex-wrap gap-3 mt-8"
                    >
                      {post.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="inline-flex items-center gap-2 px-4 py-2 glass-effect text-foreground-secondary rounded-full text-sm border border-border/30 shadow-sm hover:border-primary/30 transition-all"
                        >
                          <Tag size={12} />
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </AnimatedSection>
                )}

              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12">
            
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <AnimatedSection delay={0.4}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative z-10"
                  >
                    {/* Content Container with Glass Effect */}
                    <div className="glass-effect backdrop-blur-sm border border-border/30 rounded-3xl p-8 md:p-12 shadow-2xl">
                      <div 
                        className="prose prose-lg max-w-none
                          prose-headings:font-medium prose-headings:text-foreground prose-headings:mb-6 prose-headings:mt-8
                          prose-h1:text-3xl prose-h1:leading-tight prose-h1:bg-gradient-to-r prose-h1:from-foreground prose-h1:to-primary prose-h1:bg-clip-text prose-h1:text-transparent
                          prose-h2:text-2xl prose-h2:leading-tight prose-h2:text-foreground
                          prose-h3:text-xl prose-h3:leading-snug prose-h3:text-foreground
                          prose-p:text-foreground-secondary prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[17px]
                          prose-a:text-primary prose-a:no-underline prose-a:font-medium prose-a:transition-all hover:prose-a:text-primary/80 hover:prose-a:underline hover:prose-a:underline-offset-4
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-em:text-foreground-secondary prose-em:font-medium
                          prose-code:bg-background-secondary prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-border/50
                          prose-pre:bg-background-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-inner prose-pre:overflow-x-auto
                          prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-background-secondary/50 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:backdrop-blur-sm
                          prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:font-medium
                          prose-ul:text-foreground-secondary prose-ul:space-y-2 prose-ol:text-foreground-secondary prose-ol:space-y-2
                          prose-li:text-foreground-secondary prose-li:leading-relaxed prose-li:marker:text-primary
                          prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-border/30
                          prose-hr:border-border/50 prose-hr:my-12
                          prose-table:border-collapse prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden
                          prose-th:bg-background-secondary prose-th:font-semibold prose-th:text-foreground prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-border
                          prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-border prose-td:text-foreground-secondary
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </motion.div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* Enhanced Updated Info */}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="py-8 relative"
            >
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                  <div className="glass-effect backdrop-blur-sm border border-border/30 rounded-2xl px-6 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-2 h-2 bg-accent-success rounded-full"
                      />
                      <p className="text-sm text-foreground-secondary font-medium">
                        마지막 수정: {formatDate(post.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          
          {/* Article Footer with Call-to-Action */}
          {/* Article Footer */}
          <section className="py-12 bg-background-secondary">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-background border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-medium mb-4 text-foreground">
                    더 많은 인사이트를 확인해보세요
                  </h3>
                  <p className="text-foreground-secondary mb-6 leading-relaxed">
                    개발 여정에서 배운 것들과 기술적 도전들을 지속적으로 공유하고 있습니다.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/blog">
                      <button className="flex items-center gap-2 px-6 py-3 bg-accent-blend text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
                        <ArrowLeft size={16} />
                        블로그 홈으로
                      </button>
                    </Link>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 py-3 bg-background border border-border rounded-md font-medium hover:bg-background-secondary transition-colors"
                    >
                      <Share2 size={16} />
                      이 글 공유하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* Floating Action Menu */}
        <div className="fixed bottom-8 right-8 z-40">
          <div className="flex flex-col gap-3">
            {/* Scroll to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:bg-background-secondary"
            >
              <ArrowLeft size={20} className="rotate-90" />
            </button>
            
            {/* Comments Button */}
            <button className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:bg-background-secondary">
              <MessageCircle size={20} />
            </button>
            
            {/* Quick Like */}
            <button
              onClick={handleLike}
              className={`w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:bg-background-secondary ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}