"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { 
  Save, Edit3, ArrowLeft, Settings, Plus, X, Check, 
  FileText, AlertCircle, Loader2, Image, Link, Type,
  AlignLeft, Hash, Star, Calendar
} from 'lucide-react'
import AdminTitle from '../../../../../components/admin/AdminTitle'
import { PortfolioSection } from '../../../../../lib/types/portfolio'

interface CustomSectionContent {
  id: string
  sectionId: string
  title: string
  content: string
  contentType: 'text' | 'markdown' | 'rich-text'
  metadata: {
    tags: string[]
    featured: boolean
    priority: number
    lastModified: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CustomSectionPage() {
  const params = useParams()
  const sectionId = params.id as string
  
  const [section, setSection] = useState<PortfolioSection | null>(null)
  const [content, setContent] = useState<CustomSectionContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  })

  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    contentType: 'text' as 'text' | 'markdown' | 'rich-text',
    tags: '',
    featured: false,
    priority: 1
  })

  useEffect(() => {
    if (sectionId) {
      fetchSectionData()
    }
  }, [sectionId])

  const fetchSectionData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch section info
      const sectionResponse = await fetch(`/api/portfolio/sections`)
      const sectionResult = await sectionResponse.json()
      
      if (sectionResult.success) {
        const currentSection = sectionResult.data.sections.find((s: PortfolioSection) => 
          s.id === `custom-${sectionId}` || s.id === sectionId || s.href.includes(sectionId)
        )
        setSection(currentSection || null)
      }

      // Fetch or initialize content
      try {
        // Try with the full section ID first, then with just the timestamp
        const fullSectionId = sectionId.startsWith('custom-') ? sectionId : `custom-${sectionId}`
        const contentResponse = await fetch(`/api/portfolio/custom-content?sectionId=${fullSectionId}`)
        const contentResult = await contentResponse.json()
        
        if (contentResult.success && contentResult.data) {
          setContent(contentResult.data)
          setEditForm({
            title: contentResult.data.title,
            content: contentResult.data.content,
            contentType: contentResult.data.contentType,
            tags: contentResult.data.metadata.tags.join(', '),
            featured: contentResult.data.metadata.featured,
            priority: contentResult.data.metadata.priority
          })
        } else {
          // Initialize with default content
          const defaultContent: CustomSectionContent = {
            id: `content-${Date.now()}`,
            sectionId: fullSectionId,
            title: '새 커스텀 섹션',
            content: '이곳에 커스텀 섹션의 내용을 작성하세요.',
            contentType: 'text',
            metadata: {
              tags: [],
              featured: false,
              priority: 1,
              lastModified: new Date().toISOString()
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setContent(defaultContent)
          setEditForm({
            title: defaultContent.title,
            content: defaultContent.content,
            contentType: defaultContent.contentType,
            tags: '',
            featured: false,
            priority: 1
          })
        }
      } catch (contentError) {
        console.error('Error fetching content:', contentError)
        // Set default content if API doesn't exist yet
        const fullSectionId = sectionId.startsWith('custom-') ? sectionId : `custom-${sectionId}`
        const defaultContent: CustomSectionContent = {
          id: `content-${Date.now()}`,
          sectionId: fullSectionId,
          title: '새 커스텀 섹션',
          content: '이곳에 커스텀 섹션의 내용을 작성하세요.\n\n이 섹션을 편집하려면 "편집 모드" 버튼을 클릭하세요.',
          contentType: 'text',
          metadata: {
            tags: [],
            featured: false,
            priority: 1,
            lastModified: new Date().toISOString()
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setContent(defaultContent)
        setEditForm({
          title: defaultContent.title,
          content: defaultContent.content,
          contentType: defaultContent.contentType,
          tags: '',
          featured: false,
          priority: 1
        })
      }
    } catch (error) {
      console.error('Error fetching section data:', error)
      setSaveStatus({
        type: 'error',
        message: '섹션 데이터를 불러오는 중 오류가 발생했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveStatus({ type: null, message: '' })

      if (!content) return

      const updatedContent: CustomSectionContent = {
        ...content,
        title: editForm.title,
        content: editForm.content,
        contentType: editForm.contentType,
        metadata: {
          ...content.metadata,
          tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          featured: editForm.featured,
          priority: editForm.priority,
          lastModified: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/portfolio/custom-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent)
      })

      const result = await response.json()
      
      if (result.success) {
        setContent(updatedContent)
        setIsEditing(false)
        setSaveStatus({
          type: 'success',
          message: '커스텀 섹션이 성공적으로 저장되었습니다!'
        })
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setSaveStatus({
        type: 'error',
        message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (content) {
      setEditForm({
        title: content.title,
        content: content.content,
        contentType: content.contentType,
        tags: content.metadata.tags.join(', '),
        featured: content.metadata.featured,
        priority: content.metadata.priority
      })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mb-4" />
            <p className="text-foreground-secondary">섹션 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!section && !content) {
    return (
      <div className="p-6 space-y-8">
        <AdminTitle
          title="섹션을 찾을 수 없음"
          description="요청한 커스텀 섹션을 찾을 수 없습니다."
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">섹션을 찾을 수 없습니다</h3>
            <p className="text-foreground-secondary mb-6">
              ID "{sectionId}"에 해당하는 커스텀 섹션이 존재하지 않습니다.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/admin/portfolio"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
            >
              <ArrowLeft size={20} />
              포트폴리오 관리로 돌아가기
            </motion.a>
          </div>
        </div>
      </div>
    )
  }

  const displayTitle = section?.title || content?.title || '커스텀 섹션'
  const displayDescription = section?.description || '사용자 정의 포트폴리오 섹션을 관리합니다.'

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/admin/portfolio"
            className="p-2 bg-background-secondary hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </motion.a>
          <AdminTitle
            title={displayTitle}
            description={displayDescription}
          />
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-background-secondary text-foreground hover:bg-background-tertiary rounded-lg font-medium transition-all border border-border"
              >
                <X size={20} />
                취소
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isSaving ? '저장 중...' : '저장'}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-accent-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
            >
              <Edit3 size={20} />
              편집 모드
            </motion.button>
          )}
        </div>
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              saveStatus.type === 'success' 
                ? 'bg-accent-success/10 border border-accent-success/20 text-accent-success' 
                : 'bg-red-500/10 border border-red-500/20 text-red-500'
            }`}
          >
            {saveStatus.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <span>{saveStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-primary p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">섹션 콘텐츠</h3>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Type size={16} />
                    제목
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                    placeholder="섹션 제목을 입력하세요"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Settings size={16} />
                    콘텐츠 타입
                  </label>
                  <select
                    value={editForm.contentType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contentType: e.target.value as any }))}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                  >
                    <option value="text">일반 텍스트</option>
                    <option value="markdown">마크다운</option>
                    <option value="rich-text">리치 텍스트</option>
                  </select>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <AlignLeft size={16} />
                    내용
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all resize-y"
                    placeholder="섹션 내용을 입력하세요..."
                  />
                </div>

                {/* Tags Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash size={16} />
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                    placeholder="예: 포트폴리오, 프로젝트, 개발"
                  />
                </div>

                {/* Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(e) => setEditForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-border"
                    />
                    <Star size={16} />
                    <span className="text-sm">추천 섹션</span>
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm">우선순위:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.priority}
                      onChange={(e) => setEditForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                      className="w-16 p-2 bg-background/80 border border-border/50 rounded-lg text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-lg font-medium">{content?.title}</h4>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap text-foreground-secondary leading-relaxed">
                    {content?.content}
                  </pre>
                </div>
                
                {content?.metadata.tags && content.metadata.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-4">
                    <Hash size={16} className="text-foreground-secondary" />
                    <div className="flex flex-wrap gap-2">
                      {content.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent-info/20 text-accent-info text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Section Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-primary p-6"
          >
            <h3 className="text-lg font-semibold mb-4">섹션 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">섹션 ID:</span>
                <span className="font-medium">{sectionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">생성일:</span>
                <span className="font-medium">
                  {content?.createdAt ? new Date(content.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">수정일:</span>
                <span className="font-medium">
                  {content?.updatedAt ? new Date(content.updatedAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">상태:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  content?.isActive 
                    ? 'bg-accent-success/20 text-accent-success' 
                    : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {content?.isActive ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-primary p-6"
          >
            <h3 className="text-lg font-semibold mb-4">빠른 작업</h3>
            <div className="space-y-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/admin/portfolio"
                className="flex items-center gap-3 p-3 bg-background-secondary hover:bg-background-tertiary rounded-lg transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-sm">포트폴리오 관리</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 p-3 bg-background-secondary hover:bg-background-tertiary rounded-lg transition-colors w-full text-left"
              >
                <Settings size={16} />
                <span className="text-sm">새로고침</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-primary p-6 border-l-4 border-accent-info"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-accent-info mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">사용 가이드</h3>
                <ul className="space-y-2 text-sm text-foreground-secondary">
                  <li>• <strong>편집 모드</strong>: 섹션 내용을 수정할 수 있습니다.</li>
                  <li>• <strong>마크다운</strong>: 마크다운 문법을 사용할 수 있습니다.</li>
                  <li>• <strong>태그</strong>: 섹션을 분류하는 태그를 추가할 수 있습니다.</li>
                  <li>• <strong>우선순위</strong>: 숫자가 낮을수록 높은 우선순위입니다.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}