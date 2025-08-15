"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, ArrowLeft, Tag, Clock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { createBlogPost, updateBlogPost, calculateReadTime, BlogPost } from '../../lib/firebase/firestore'
import RichTextEditor from './RichTextEditor'

interface PostEditorProps {
  initialPost?: BlogPost
}

export default function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: initialPost?.title || '',
    content: initialPost?.content || '',
    excerpt: initialPost?.excerpt || '',
    category: initialPost?.category || 'development',
    tags: initialPost?.tags?.join(', ') || '',
    status: initialPost?.status || 'draft' as 'draft' | 'published'
  })

  const categories = [
    { id: 'development', name: '개발' },
    { id: 'insights', name: '인사이트' },
    { id: 'learning', name: '학습' },
    { id: 'career', name: '커리어' },
    { id: 'technology', name: '기술' }
  ]

  // Auto-generate excerpt from content if not provided
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const textContent = formData.content.replace(/<[^>]*>/g, '').trim()
      const excerpt = textContent.length > 200 
        ? textContent.substring(0, 200) + '...'
        : textContent
      setFormData(prev => ({ ...prev, excerpt }))
    }
  }, [formData.content])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    setSaving(true)

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const readTime = calculateReadTime(formData.content)

    const postData = {
      title: formData.title.trim(),
      content: formData.content,
      excerpt: formData.excerpt.trim() || formData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      author: user.displayName || user.email || 'Unknown',
      authorEmail: user.email || '',
      tags: tagsArray,
      category: formData.category,
      status,
      readTime
    }

    try {
      if (initialPost?.id) {
        // Update existing post
        const { error } = await updateBlogPost(initialPost.id, postData)
        if (error) {
          throw new Error(error)
        }
        alert(`게시물이 ${status === 'published' ? '게시' : '저장'}되었습니다.`)
      } else {
        // Create new post
        const { id, error } = await createBlogPost(postData)
        if (error) {
          throw new Error(error)
        }
        alert(`게시물이 ${status === 'published' ? '게시' : '저장'}되었습니다.`)
        router.push('/admin/posts')
      }
    } catch (error: any) {
      console.error('Save error:', error)
      alert(`오류가 발생했습니다: ${error.message}`)
    }

    setSaving(false)
  }

  const handlePreview = () => {
    if (initialPost?.id) {
      window.open(`/blog/${initialPost.id}`, '_blank')
    } else {
      alert('미리보기는 게시물을 저장한 후 이용할 수 있습니다.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">제목</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="게시물 제목을 입력하세요"
          className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg"
        />
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">카테고리</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">태그 (쉼표로 구분)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="예: React, Next.js, TypeScript"
            className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">내용</label>
        <RichTextEditor
          value={formData.content}
          onChange={(content) => handleInputChange('content', content)}
          placeholder="게시물 내용을 작성하세요..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-2">
          요약 <span className="text-foreground-secondary">(자동 생성되지만 직접 수정 가능)</span>
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          rows={3}
          placeholder="게시물 요약을 입력하세요"
          className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-foreground-secondary">
          <div className="flex items-center gap-1">
            <User size={16} />
            {user?.displayName || user?.email}
          </div>
          {formData.content && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              약 {calculateReadTime(formData.content)}분 읽기
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {initialPost && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-background-secondary hover:bg-background-tertiary rounded-lg font-medium transition-colors"
            >
              <Eye size={16} />
              미리보기
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-background-secondary hover:bg-background-tertiary rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            <Save size={16} />
            {saving ? '저장 중...' : '초안 저장'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blend text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            <Save size={16} />
            {saving ? '게시 중...' : '게시하기'}
          </motion.button>
        </div>
      </div>

      {/* Auto-save indicator */}
      {saving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-background-card border border-border rounded-lg px-4 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            />
            저장 중...
          </div>
        </motion.div>
      )}
    </div>
  )
}