"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Bug } from 'lucide-react'
import { getPublishedPosts, searchPosts, getPostsByCategory, BlogPost, debugCollection } from '../../lib/firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import AnimatedSection from '../../components/AnimatedSection'
import BlogPostCard from '../../components/blog/BlogPostCard'
import BlogHeader from '../../components/blog/BlogHeader'
import { LoginButton } from '../../components/auth/LoginButton'
import MobileBridgeStatus from '../../components/mobile-bridge/MobileBridgeStatus'
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import Link from 'next/link'

export default function BlogPage() {
  const { isMaster } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cachedPosts, setCachedPosts] = useState<{[key: string]: BlogPost[]}>({})
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{ totalDocs: number; publishedDocs: number } | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  // const [isTransitioning, setIsTransitioning] = useState(false) // Reserved for future use

  // Categories for filtering
  const categories = [
    { id: 'all', name: '전체', count: 0 },
    { id: 'development', name: '개발', count: 0 },
    { id: 'insights', name: '인사이트', count: 0 },
    { id: 'learning', name: '학습', count: 0 },
    { id: 'career', name: '커리어', count: 0 },
    { id: 'technology', name: '기술', count: 0 }
  ]

  // Load initial posts
  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPosts = async (forceReload = false) => {
    // Check cache first for 'all' category
    if (!forceReload && cachedPosts['all'] && cachedPosts['all'].length > 0) {
      setPosts(cachedPosts['all'])
      setLoading(false)
      return
    }
    
    setLoading(true)
    
    const { posts: newPosts, lastDoc: newLastDoc, hasMore: newHasMore, error } = await getPublishedPosts(6)
    
    if (error) {
      console.error('❌ Error loading published posts:', error)
    }
    
    // Cache the results
    setCachedPosts(prev => ({ ...prev, 'all': newPosts }))
    setPosts(newPosts)
    setLastDoc(newLastDoc)
    setHasMore(newHasMore)
    setLoading(false)
  }

  const loadMorePosts = async () => {
    if (!lastDoc || loadingMore) return
    
    setLoadingMore(true)
    const { posts: newPosts, lastDoc: newLastDoc, hasMore: newHasMore } = await getPublishedPosts(6, lastDoc)
    setPosts(prev => [...prev, ...newPosts])
    setLastDoc(newLastDoc)
    setHasMore(newHasMore)
    setLoadingMore(false)
  }

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      loadPosts()
      return
    }
    
    setLoading(true)
    const { posts: searchResults } = await searchPosts(term)
    setPosts(searchResults)
    setHasMore(false)
    setLoading(false)
  }

  const handleCategoryFilter = async (categoryId: string) => {
    // If clicking the same category, do nothing
    if (selectedCategory === categoryId) return
    
    console.log('🔄 Switching from category:', selectedCategory, 'to:', categoryId)
    setSelectedCategory(categoryId)
    
    // Always fetch fresh data for now to debug the issue
    // Comment out cache check temporarily
    // if (cachedPosts[categoryId] && cachedPosts[categoryId].length > 0) {
    //   setPosts(cachedPosts[categoryId])
    //   setHasMore(false)
    //   return
    // }
    
    // If no cached data, show transition state instead of full loading
    // setIsTransitioning(true) // Disabled until transition feature is implemented
    setLoadingCategory(categoryId)
    
    try {
      if (categoryId === 'all') {
        const { posts: newPosts, lastDoc: newLastDoc, hasMore: newHasMore, error } = await getPublishedPosts(6)
        
        if (!error) {
          console.log(`📊 Category "all" returned ${newPosts.length} posts`)
          setCachedPosts(prev => ({ ...prev, [categoryId]: newPosts }))
          setPosts(newPosts)
          setLastDoc(newLastDoc)
          setHasMore(newHasMore)
        }
      } else {
        const { posts: filteredPosts, error } = await getPostsByCategory(categoryId)
        
        if (!error) {
          console.log(`📊 Category "${categoryId}" returned ${filteredPosts.length} posts`)
          filteredPosts.forEach(post => {
            console.log(`  - ${post.title} (category: ${post.category})`)
          })
          setCachedPosts(prev => ({ ...prev, [categoryId]: filteredPosts }))
          setPosts(filteredPosts)
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Category filter error:', error)
    } finally {
      // setIsTransitioning(false) // Disabled until transition feature is implemented
      setLoadingCategory(null)
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const handleDebug = async () => {
    console.log('🔍 Starting debug...')
    const info = await debugCollection()
    setDebugInfo(info)
    setShowDebug(true)
    console.log('📊 Debug results:', info)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-medium text-primary hover:opacity-80 transition-opacity">
            ← Portfolio
          </Link>
          <div className="flex items-center gap-4">
            {isMaster && (
              <>
                <Link href="/admin/posts">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-blend text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus size={16} />
                    게시물 관리
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDebug}
                  className="flex items-center gap-2 px-4 py-2 bg-background-secondary/80 backdrop-blur-sm border border-accent-warning/30 text-accent-warning rounded-2xl font-medium hover:bg-accent-warning/10 transition-all shadow-sm hover:shadow-md"
                  title="데이터베이스 상태 확인"
                >
                  <Bug size={16} />
                  진단
                </motion.button>
              </>
            )}
            <LoginButton variant="minimal" />
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Blog Header */}
        <BlogHeader />

        {/* Debug Info */}
        {showDebug && debugInfo && (
          <section className="py-6 bg-background-secondary/50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-effect backdrop-blur-md border border-accent-warning/20 rounded-3xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bug size={20} className="text-accent-warning" />
                        <h3 className="text-lg font-medium text-foreground">시스템 진단</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-effect rounded-xl p-3 border border-border/30">
                          <p className="text-xs text-foreground-secondary mb-1">총 게시물</p>
                          <p className="text-2xl font-semibold text-foreground">{debugInfo.totalDocs}</p>
                        </div>
                        <div className="glass-effect rounded-xl p-3 border border-border/30">
                          <p className="text-xs text-foreground-secondary mb-1">게시된 글</p>
                          <p className="text-2xl font-semibold text-accent-success">{debugInfo.publishedDocs}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground-secondary flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-accent-warning rounded-full animate-pulse"></span>
                        콘솔에서 상세 로그 확인 가능
                      </p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDebug(false)}
                      className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-xl transition-all"
                      title="닫기"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="py-8 bg-background-secondary">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchInput}
                      placeholder="검색어를 입력하세요..."
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </form>

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                        ${selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background hover:bg-background-tertiary text-foreground-secondary hover:text-foreground'
                        }
                      `}
                    >
                      {loadingCategory === category.id && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 border border-current border-t-transparent rounded-full"
                        />
                      )}
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto relative">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-background-secondary rounded-2xl h-80"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {posts.map((post, index) => (
                      <BlogPostCard key={post.id} post={post} delay={index * 0.1} />
                    ))}
                  </motion.div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center mt-12">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMorePosts}
                        disabled={loadingMore}
                        className="px-8 py-3 bg-accent-blend text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
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
                <AnimatedSection className="text-center py-20">
                  <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-foreground-secondary" />
                  </div>
                  <h3 className="text-xl font-medium mb-4">게시물이 없습니다</h3>
                  <p className="text-foreground-secondary">
                    {searchTerm || selectedCategory !== 'all' 
                      ? '검색 조건에 맞는 게시물을 찾을 수 없습니다.' 
                      : '아직 게시된 글이 없습니다.'
                    }
                  </p>
                </AnimatedSection>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Mobile Bridge Status (Master only) */}
      <MobileBridgeStatus />
    </div>
  )
}