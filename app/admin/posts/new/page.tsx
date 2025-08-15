"use client"

import React from 'react'
import PostEditor from '../../../../components/admin/PostEditor'
import AdminHeader from '../../../../components/admin/AdminHeader'

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="새 글 작성"
        description="새로운 블로그 게시물을 작성합니다"
        backUrl="/admin/posts"
      />

      <main className="pt-20">
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <PostEditor />
          </div>
        </div>
      </main>
    </div>
  )
}