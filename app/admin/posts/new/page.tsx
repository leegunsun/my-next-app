"use client"

import React from 'react'
import { motion } from 'framer-motion'
import PostEditor from '../../../../components/admin/PostEditor'
import AdminHeader from '../../../../components/admin/AdminHeader'

export default function NewPostPage() {
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
          title="새 글 작성"
          description="새로운 블로그 게시물을 작성합니다"
        />
      </motion.div>

      <main className="pt-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
          >
            <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-4 sm:p-6 lg:p-8 xl:p-10">
              <PostEditor />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}