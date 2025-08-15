"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { getBlogPost, BlogPost } from '../../../../../lib/firebase/firestore'
import PostEditor from '../../../../../components/admin/PostEditor'
import AdminHeader from '../../../../../components/admin/AdminHeader'

export default function EditPostPage() {
  const params = useParams()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Enhanced Background */}
        <div className="absolute inset-0 hero-gradient-bg opacity-15 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AdminHeader 
            title="게시물 편집"
            description="게시물을 편집합니다"
            backUrl="/admin/posts"
          />
        </motion.div>
        
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
                <div className="animate-pulse space-y-8">
                  <div className="h-12 bg-background-secondary/50 rounded-2xl"></div>
                  <div className="h-80 bg-background-secondary/50 rounded-2xl"></div>
                  <div className="h-40 bg-background-secondary/50 rounded-2xl"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Enhanced Background */}
        <div className="absolute inset-0 hero-gradient-bg opacity-15 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AdminHeader 
            title="게시물 편집"
            description="게시물을 편집합니다"
            backUrl="/admin/posts"
          />
        </motion.div>
        
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                  className="w-16 h-16 bg-accent-error/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-2xl">⚠️</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl font-medium mb-4"
                >
                  게시물을 찾을 수 없습니다
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-foreground-secondary mb-8 text-lg"
                >
                  {error || '요청하신 게시물이 존재하지 않거나 삭제되었습니다.'}
                </motion.p>
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="/admin/posts"
                  className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-4 rounded-2xl font-medium transition-all shadow-lg inline-block"
                >
                  게시물 목록으로 돌아가기
                </motion.a>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced Background */}
      <div className="absolute inset-0 hero-gradient-bg opacity-15 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <AdminHeader 
          title="게시물 편집"
          description={`"${post.title}" 편집`}
          backUrl="/admin/posts"
        />
      </motion.div>

      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
              <PostEditor initialPost={post} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}