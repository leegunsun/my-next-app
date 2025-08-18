"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock, FileText, CheckCircle, FileEdit, ToggleLeft, ToggleRight, Bug, RefreshCw } from 'lucide-react'
import { getAllPosts, deleteBlogPost, updateBlogPost, BlogPost, debugCollection } from '../../../lib/firebase/firestore'
import { useAuth } from '../../../contexts/AuthContext'
// Using native JavaScript Date formatting instead of date-fns
import Link from 'next/link'
import AdminHeader from '../../../components/admin/AdminHeader'
import PostStatusBadge from '../../../components/admin/PostStatusBadge'
import { CustomSelect, SelectOption } from '../../../components/ui/select'
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'

export default function AdminPostsPage() {
  const { } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{ totalDocs: number; publishedDocs: number } | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [publishingAll, setPublishingAll] = useState(false)

  const statusOptions: SelectOption[] = [
    { id: 'all', name: '전체', value: 'all', icon: <FileText size={16} /> },
    { id: 'published', name: '게시됨', value: 'published', icon: <CheckCircle size={16} /> },
    { id: 'draft', name: '초안', value: 'draft', icon: <FileEdit size={16} /> }
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const { posts: newPosts, lastDoc: newLastDoc, hasMore: newHasMore } = await getAllPosts(20)
    setPosts(newPosts)
    setLastDoc(newLastDoc)
    setHasMore(newHasMore)
    setLoading(false)
  }

  const loadMorePosts = async () => {
    if (!lastDoc || loadingMore) return
    
    setLoadingMore(true)
    const { posts: newPosts, lastDoc: newLastDoc, hasMore: newHasMore } = await getAllPosts(20, lastDoc)
    setPosts(prev => [...prev, ...newPosts])
    setLastDoc(newLastDoc)
    setHasMore(newHasMore)
    setLoadingMore(false)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) return
    
    setDeleting(postId)
    const { error } = await deleteBlogPost(postId)
    
    if (error) {
      console.error('Delete error:', error)
      alert('게시물 삭제 중 오류가 발생했습니다.')
    } else {
      setPosts(prev => prev.filter(post => post.id !== postId))
    }
    setDeleting(null)
  }

  const handleToggleStatus = async (postId: string, currentStatus: 'draft' | 'published') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const { error } = await updateBlogPost(postId, { status: newStatus })
    
    if (error) {
      console.error('Status update error:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    } else {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, status: newStatus } : post
      ))
      console.log(`🔄 Post ${postId} status changed to: ${newStatus}`)
    }
  }

  const handleDebug = async () => {
    console.log('🔍 Starting debug...')
    const info = await debugCollection()
    setDebugInfo(info)
    setShowDebug(true)
    console.log('📊 Debug results:', info)
  }

  const handlePublishAll = async () => {
    if (!confirm('모든 초안을 게시 상태로 변경하시겠습니까?')) return
    
    setPublishingAll(true)
    const draftPosts = posts.filter(post => post.status === 'draft')
    
    for (const post of draftPosts) {
      if (post.id) {
        await updateBlogPost(post.id, { status: 'published' })
        console.log(`📢 Published: ${post.title}`)
      }
    }
    
    await loadPosts()
    setPublishingAll(false)
    alert(`${draftPosts.length}개의 게시물이 게시되었습니다.`)
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
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 hero-gradient-bg opacity-20 pointer-events-none" />
      
      <AdminHeader 
        title="게시물 관리"
        description="블로그 게시물을 작성하고 관리합니다"
      />

      <main className="relative z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-20rem)] flex flex-col">
            {/* Header Actions with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8"
            >
              <div className="flex items-center gap-6 flex-1">
                {/* Enhanced Search with Glass Effect */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative flex-1 max-w-md"
                >
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="게시물 검색..."
                    className="w-full pl-12 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                  />
                </motion.div>

                {/* Enhanced Status Filter */}
                <div className="relative z-10">
                  <CustomSelect
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as 'all' | 'published' | 'draft')}
                    placeholder="상태 선택"
                    className="min-w-[140px] bg-background/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/admin/posts/new">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-3 bg-accent-blend text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Plus size={18} />
                    새 글 작성
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDebug}
                  className="flex items-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Bug size={18} />
                  디버그
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePublishAll}
                  disabled={publishingAll}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  <RefreshCw size={18} className={publishingAll ? 'animate-spin' : ''} />
                  모든 초안 게시
                </motion.button>
              </div>
            </motion.div>

            {/* Debug Info */}
            {showDebug && debugInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">디버그 정보</h3>
                    <p className="text-yellow-700 dark:text-yellow-300">전체 게시물: {debugInfo.totalDocs}개</p>
                    <p className="text-yellow-700 dark:text-yellow-300">Published 게시물: {debugInfo.publishedDocs}개</p>
                    <p className="text-yellow-700 dark:text-yellow-300">Draft 게시물: {debugInfo.totalDocs - debugInfo.publishedDocs}개</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                      콘솔에서 상세 정보를 확인하세요.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDebug(false)}
                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                  >
                    닫기
                  </button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Posts List */}
            {loading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="animate-pulse glass-effect rounded-3xl h-24 border border-border/30"
                  />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                <div className="space-y-4">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="card-interactive glass-effect border border-border/30 shadow-sm hover:shadow-lg backdrop-blur-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium truncate">{post.title}</h3>
                            <PostStatusBadge status={post.status} />
                          </div>
                          
                          <p className="text-foreground-secondary text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-foreground-secondary">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              작성: {formatDate(post.createdAt)}
                            </div>
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                수정: {formatDate(post.updatedAt)}
                              </div>
                            )}
                            {post.readTime && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime}분 읽기
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleStatus(post.id!, post.status)}
                            className={`p-3 rounded-xl transition-all shadow-sm hover:shadow-md ${
                              post.status === 'published' 
                                ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                            title={post.status === 'published' ? '초안으로 변경' : '게시로 변경'}
                          >
                            {post.status === 'published' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </motion.button>
                          
                          {post.status === 'published' && (
                            <Link href={`/blog/${post.id}`} target="_blank">
                              <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 text-foreground-secondary hover:text-accent-info hover:bg-accent-info/10 rounded-xl transition-all shadow-sm hover:shadow-md"
                                title="미리보기"
                              >
                                <Eye size={16} />
                              </motion.button>
                            </Link>
                          )}
                          
                          <Link href={`/admin/posts/edit/${post.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-3 text-foreground-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm hover:shadow-md"
                              title="편집"
                            >
                              <Edit size={16} />
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(post.id!)}
                            disabled={deleting === post.id}
                            className="p-3 text-foreground-secondary hover:text-accent-error hover:bg-accent-error/10 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            title="삭제"
                          >
                            {deleting === post.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMorePosts}
                      disabled={loadingMore}
                      className="px-8 py-4 glass-effect hover:bg-background-tertiary/50 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 border border-border/30"
                    >
                      {loadingMore ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          로딩 중...
                        </div>
                      ) : (
                        '더 보기'
                      )}
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center flex-1 flex flex-col justify-center items-center min-h-[50vh]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 glass-effect rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-border/30"
                >
                  <Search size={36} className="text-foreground-secondary" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-2xl font-medium mb-4"
                >
                  게시물이 없습니다
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-foreground-secondary mb-8 text-lg"
                >
                  {searchTerm || statusFilter !== 'all' 
                    ? '검색 조건에 맞는 게시물이 없습니다.' 
                    : '첫 번째 게시물을 작성해보세요.'
                  }
                </motion.p>
                <Link href="/admin/posts/new">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-4 text-lg rounded-2xl font-medium transition-all shadow-lg flex items-center gap-3"
                  >
                    <Plus size={20} />
                    새 글 작성
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}