"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

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

interface CustomSectionProps {
  section: {
    id: string
    title: string
    description: string
    icon: string
    color: string
    href: string
    homeSection: string
    isActive: boolean
    showInNavigation: boolean
    showInAdminGrid: boolean
    order: number
    createdAt: string
    updatedAt: string
  }
  delay?: number
  className?: string
}

export default function CustomSection({ section, delay = 0, className = "" }: CustomSectionProps) {
  const [content, setContent] = useState<CustomSectionContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSectionContent = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/portfolio/custom-content?sectionId=${section.id}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setContent(result.data)
      } else {
        // Create default content if none exists
        const defaultContent: CustomSectionContent = {
          id: `content-${Date.now()}`,
          sectionId: section.id,
          title: section.title.replace(' 관리', ''),
          content: section.description || '새로운 커스텀 섹션입니다.',
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
      }
    } catch (error) {
      console.error('Error fetching custom section content:', error)
      setError('콘텐츠를 불러오는 중 오류가 발생했습니다.')
      
      // Fallback content
      const fallbackContent: CustomSectionContent = {
        id: `fallback-${Date.now()}`,
        sectionId: section.id,
        title: section.title.replace(' 관리', ''),
        content: section.description || '새로운 커스텀 섹션입니다.\n\n관리자 페이지에서 이 섹션의 내용을 편집할 수 있습니다.',
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
      setContent(fallbackContent)
    } finally {
      setIsLoading(false)
    }
  }, [section.id, section.title, section.description])

  useEffect(() => {
    fetchSectionContent()
  }, [section.id, fetchSectionContent])

  const renderContent = () => {
    if (!content) return null

    switch (content.contentType) {
      case 'markdown':
        // Simple markdown rendering (basic)
        return (
          <div className="prose prose-gray max-w-none">
            <div 
              className="text-foreground-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: content.content
                  .replace(/\n/g, '<br>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code class="bg-background-secondary px-1 py-0.5 rounded text-sm">$1</code>')
              }}
            />
          </div>
        )
      
      case 'rich-text':
        return (
          <div 
            className="prose prose-gray max-w-none text-foreground-secondary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        )
      
      default: // 'text'
        return (
          <div className="text-foreground-secondary leading-relaxed whitespace-pre-line">
            {content.content}
          </div>
        )
    }
  }

  if (!section.isActive) {
    return null
  }

  return (
    <section 
      id={section.homeSection || section.id}
      className={`py-20 ${className}`}
      aria-label={section.title}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection delay={delay} className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">
              {content?.title || section.title.replace(' 관리', '')}
            </h2>
            {section.description && (
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                {section.description}
              </p>
            )}
          </AnimatedSection>

          <div className="space-y-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-foreground-secondary">콘텐츠를 불러오는 중...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">콘텐츠 로드 오류</h3>
                  <p className="text-foreground-secondary text-sm">{error}</p>
                </div>
              </div>
            ) : content ? (
              <AnimatedSection delay={delay + 0.1} className="card-primary">
                <div className="space-y-6">
                  {renderContent()}
                  
                  {/* Tags */}
                  {content.metadata.tags && content.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {content.metadata.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: delay + 0.2 + index * 0.1 }}
                          className="px-3 py-1 bg-accent-info/20 text-accent-info text-sm rounded-full"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Featured indicator */}
                  {content.metadata.featured && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: delay + 0.3 }}
                      className="flex items-center gap-2 text-accent-warning"
                    >
                      <span className="text-lg">⭐</span>
                      <span className="text-sm font-medium">추천 섹션</span>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📄</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">콘텐츠 없음</h3>
                  <p className="text-foreground-secondary text-sm">
                    이 섹션에 표시할 콘텐츠가 없습니다. 관리자 페이지에서 콘텐츠를 추가해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}