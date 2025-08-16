"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, Code, Copy, Check } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { CodeExample } from '../../../../lib/types/portfolio'
import CodeSnippet from '../../../../components/CodeSnippet'
import AnimatedSection from '../../../../components/AnimatedSection'

export default function CodeExamplesManagementPage() {
  const [codeExamples, setCodeExamples] = useState<CodeExample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingExample, setEditingExample] = useState<string | null>(null)
  const [newExample, setNewExample] = useState({
    title: '',
    language: 'javascript',
    code: '',
    description: ''
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', class: 'bg-yellow-500' },
    { value: 'typescript', label: 'TypeScript', class: 'bg-blue-500' },
    { value: 'dart', label: 'Dart', class: 'bg-primary' },
    { value: 'kotlin', label: 'Kotlin', class: 'bg-purple-500' },
    { value: 'java', label: 'Java', class: 'bg-red-500' },
    { value: 'python', label: 'Python', class: 'bg-green-500' },
    { value: 'yaml', label: 'YAML', class: 'bg-gray-500' },
    { value: 'json', label: 'JSON', class: 'bg-orange-500' },
    { value: 'sql', label: 'SQL', class: 'bg-indigo-500' }
  ]

  useEffect(() => {
    fetchCodeExamples()
  }, [])

  const fetchCodeExamples = async () => {
    try {
      const response = await fetch('/api/portfolio/code-examples')
      const result = await response.json()
      if (result.success) {
        setCodeExamples(result.data)
      }
    } catch (error) {
      console.error('Error fetching code examples:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/portfolio/code-examples', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(codeExamples)
      })
      
      const result = await response.json()
      if (result.success) {
        setCodeExamples(result.data)
        alert('저장되었습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving code examples:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const addExample = () => {
    if (!newExample.title.trim() || !newExample.code.trim()) return
    
    const example: CodeExample = {
      id: Date.now().toString(),
      title: newExample.title.trim(),
      language: newExample.language,
      code: newExample.code.trim(),
      description: newExample.description.trim(),
      isActive: true,
      order: codeExamples.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setCodeExamples([...codeExamples, example])
    setNewExample({ title: '', language: 'javascript', code: '', description: '' })
  }

  const removeExample = (id: string) => {
    setCodeExamples(codeExamples.filter(example => example.id !== id))
  }

  const updateExample = (id: string, field: keyof CodeExample, value: any) => {
    setCodeExamples(codeExamples.map(example => 
      example.id === id 
        ? { ...example, [field]: value, updatedAt: new Date().toISOString() }
        : example
    ))
  }

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const getLanguageColor = (language: string) => {
    const lang = languageOptions.find(l => l.value === language)
    return lang?.class || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <AdminTitle
          title="코드 예제 관리"
          description="개발 기술을 보여주는 코드 예제를 관리합니다."
        />
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 border shadow-sm ${
              isPreviewMode 
                ? 'bg-accent-warning text-white border-accent-warning' 
                : 'bg-background-secondary text-foreground border-border hover:bg-background-tertiary'
            }`}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreviewMode ? '편집 모드' : '미리보기'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent-blend text-primary-foreground hover:opacity-90 px-6 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? '저장 중...' : '저장'}
          </motion.button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode - Matching actual homepage code examples section layout
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Code Examples Section Preview */}
          <div className="bg-background-secondary rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-medium mb-6 text-center">홈페이지 코드 예제 섹션 미리보기</h3>
            
            {/* Section Header */}
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">코드 예제 & GitHub</h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                실제 프로젝트에서 사용한 코드 패턴과 GitHub 저장소를 통해 
                개발 역량과 코드 품질을 확인해보세요.
              </p>
            </AnimatedSection>

            {/* Code Examples Section */}
            <div className="mb-16">
              <AnimatedSection delay={0.1} className="mb-8">
                <h3 className="text-2xl font-medium text-center">코드 스니펫</h3>
              </AnimatedSection>
              
              {(() => {
                const activeCodeExamples = codeExamples
                  .filter(example => example.isActive)
                  .sort((a, b) => (a.order || 99) - (b.order || 99))
                
                if (activeCodeExamples.length > 0) {
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {activeCodeExamples.map((example) => (
                        <CodeSnippet
                          key={example.id}
                          title={example.title}
                          language={example.language}
                          code={example.code}
                          className="w-full"
                        />
                      ))}
                    </div>
                  )
                } else {
                  return (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Code size={24} className="text-foreground-secondary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">표시할 코드 예제가 없습니다</h3>
                        <p className="text-foreground-secondary text-sm">
                          활성화된 코드 예제가 없거나 코드 예제를 추가해주세요.
                        </p>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>

            {/* GitHub Repositories Section Preview */}
            <div>
              <AnimatedSection delay={0.2} className="mb-8">
                <h3 className="text-2xl font-medium text-center">GitHub 저장소</h3>
              </AnimatedSection>
              
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">📁</span>
                  </div>
                  <p className="text-foreground-secondary text-sm">
                    GitHub 저장소는 별도 관리 페이지에서 설정됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Edit Mode
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Add New Code Example */}
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-4">새 코드 예제 추가</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="제목 (예: Flutter Provider 패턴)"
                  value={newExample.title}
                  onChange={(e) => setNewExample({ ...newExample, title: e.target.value })}
                  className="p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <select
                  value={newExample.language}
                  onChange={(e) => setNewExample({ ...newExample, language: e.target.value })}
                  className="p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {languageOptions.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              
              <textarea
                placeholder="코드 설명"
                rows={2}
                value={newExample.description}
                onChange={(e) => setNewExample({ ...newExample, description: e.target.value })}
                className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              
              <textarea
                placeholder="코드를 입력하세요..."
                rows={8}
                value={newExample.code}
                onChange={(e) => setNewExample({ ...newExample, code: e.target.value })}
                className="w-full p-3 bg-background font-mono text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addExample}
                className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                코드 예제 추가
              </motion.button>
            </div>
          </div>

          {/* Existing Code Examples */}
          <AnimatePresence>
            {codeExamples.map((example) => (
              <motion.div
                key={example.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-primary p-6"
              >
                {/* Example Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLanguageColor(example.language)}`}>
                      {example.language.toUpperCase()}
                    </div>
                    {editingExample === example.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={example.title}
                          onChange={(e) => updateExample(example.id, 'title', e.target.value)}
                          className="text-xl font-semibold bg-background-secondary border border-border rounded px-3 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                          onBlur={() => setEditingExample(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingExample(null)}
                          autoFocus
                        />
                        <select
                          value={example.language}
                          onChange={(e) => updateExample(example.id, 'language', e.target.value)}
                          className="p-2 bg-background-secondary border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {languageOptions.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold">{example.title}</h3>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(example.code, example.id)}
                      className="p-2 text-foreground-secondary hover:text-primary"
                    >
                      {copiedId === example.id ? <Check size={16} /> : <Copy size={16} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingExample(editingExample === example.id ? null : example.id)}
                      className="p-2 text-foreground-secondary hover:text-primary"
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeExample(example.id)}
                      className="p-2 text-foreground-secondary hover:text-accent-error"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  {editingExample === example.id ? (
                    <textarea
                      rows={2}
                      value={example.description}
                      onChange={(e) => updateExample(example.id, 'description', e.target.value)}
                      className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="코드 설명"
                    />
                  ) : (
                    example.description && (
                      <p className="text-foreground-secondary">{example.description}</p>
                    )
                  )}
                </div>

                {/* Code */}
                <div className="bg-background rounded-lg overflow-hidden">
                  {editingExample === example.id ? (
                    <textarea
                      rows={12}
                      value={example.code}
                      onChange={(e) => updateExample(example.id, 'code', e.target.value)}
                      className="w-full p-4 bg-background font-mono text-sm border-0 focus:ring-2 focus:ring-primary resize-y"
                    />
                  ) : (
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}