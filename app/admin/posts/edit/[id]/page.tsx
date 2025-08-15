"use client"

import React, { useState, useEffect } from 'react'
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
      <div className="min-h-screen bg-background">
        <AdminHeader 
          title="게시물 편집"
          description="게시물을 편집합니다"
          backUrl="/admin/posts"
        />
        
        <main className="pt-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-background-secondary rounded"></div>
                <div className="h-64 bg-background-secondary rounded"></div>
                <div className="h-32 bg-background-secondary rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader 
          title="게시물 편집"
          description="게시물을 편집합니다"
          backUrl="/admin/posts"
        />
        
        <main className="pt-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-medium mb-4">게시물을 찾을 수 없습니다</h2>
              <p className="text-foreground-secondary mb-8">
                {error || '요청하신 게시물이 존재하지 않거나 삭제되었습니다.'}
              </p>
              <a href="/admin/posts" className="btn-primary">
                게시물 목록으로 돌아가기
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="게시물 편집"
        description={`"${post.title}" 편집`}
        backUrl="/admin/posts"
      />

      <main className="pt-20">
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <PostEditor initialPost={post} />
          </div>
        </div>
      </main>
    </div>
  )
}