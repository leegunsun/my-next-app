"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react'
import { getAllPosts, deleteBlogPost, BlogPost } from '../../../lib/firebase/firestore'
import { useAuth } from '../../../contexts/AuthContext'
// Using native JavaScript Date formatting instead of date-fns
import Link from 'next/link'
import AdminHeader from '../../../components/admin/AdminHeader'
import PostStatusBadge from '../../../components/admin/PostStatusBadge'
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
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="게시물 관리"
        description="블로그 게시물을 작성하고 관리합니다"
      />

      <main className="pt-8">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-20rem)] flex flex-col justify-center py-8">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="게시물 검색..."
                    className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-3 py-2 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="all">전체</option>
                  <option value="published">게시됨</option>
                  <option value="draft">초안</option>
                </select>
              </div>

              {/* New Post Button */}
              <Link href="/admin/posts/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-blend text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                  새 글 작성
                </motion.button>
              </Link>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-background-secondary rounded-lg h-20"></div>
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
                      className="bg-background-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
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
                          {post.status === 'published' && (
                            <Link href={`/blog/${post.id}`} target="_blank">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-foreground-secondary hover:text-accent-info hover:bg-accent-info/10 rounded-md transition-colors"
                                title="미리보기"
                              >
                                <Eye size={16} />
                              </motion.button>
                            </Link>
                          )}
                          
                          <Link href={`/admin/posts/edit/${post.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-foreground-secondary hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                              title="편집"
                            >
                              <Edit size={16} />
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(post.id!)}
                            disabled={deleting === post.id}
                            className="p-2 text-foreground-secondary hover:text-accent-error hover:bg-accent-error/10 rounded-md transition-colors disabled:opacity-50"
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

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMorePosts}
                      disabled={loadingMore}
                      className="px-6 py-3 bg-background-secondary hover:bg-background-tertiary rounded-lg font-medium transition-colors disabled:opacity-70"
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
              <div className="text-center flex-1 flex flex-col justify-center items-center min-h-[50vh]">
                <div className="w-20 h-20 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-foreground-secondary" />
                </div>
                <h3 className="text-xl font-medium mb-4">게시물이 없습니다</h3>
                <p className="text-foreground-secondary mb-8">
                  {searchTerm || statusFilter !== 'all' 
                    ? '검색 조건에 맞는 게시물이 없습니다.' 
                    : '첫 번째 게시물을 작성해보세요.'
                  }
                </p>
                <Link href="/admin/posts/new">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    새 글 작성
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}