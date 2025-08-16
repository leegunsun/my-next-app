"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, Star, GitFork, ExternalLink, Calendar } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { GitHubRepository } from '../../../../lib/types/portfolio'

export default function GitHubReposManagementPage() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingRepo, setEditingRepo] = useState<string | null>(null)
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    lastUpdated: '',
    url: ''
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const languageOptions = [
    { value: 'JavaScript', label: 'JavaScript', color: 'bg-yellow-500' },
    { value: 'TypeScript', label: 'TypeScript', color: 'bg-blue-500' },
    { value: 'Dart', label: 'Dart', color: 'bg-primary' },
    { value: 'Kotlin', label: 'Kotlin', color: 'bg-purple-500' },
    { value: 'Java', label: 'Java', color: 'bg-red-500' },
    { value: 'Python', label: 'Python', color: 'bg-green-500' },
    { value: 'Go', label: 'Go', color: 'bg-cyan-500' },
    { value: 'Rust', label: 'Rust', color: 'bg-orange-500' },
    { value: 'Docker', label: 'Docker', color: 'bg-blue-600' },
    { value: 'Shell', label: 'Shell', color: 'bg-gray-600' }
  ]

  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/portfolio/github-repos')
      const result = await response.json()
      if (result.success) {
        setRepositories(result.data)
      }
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/portfolio/github-repos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repositories)
      })
      
      const result = await response.json()
      if (result.success) {
        setRepositories(result.data)
        alert('저장되었습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving repositories:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const addRepository = () => {
    if (!newRepo.name.trim() || !newRepo.url.trim()) return
    
    const repository: GitHubRepository = {
      id: Date.now().toString(),
      name: newRepo.name.trim(),
      description: newRepo.description.trim(),
      language: newRepo.language,
      stars: newRepo.stars,
      forks: newRepo.forks,
      lastUpdated: newRepo.lastUpdated || new Date().toISOString().split('T')[0],
      url: newRepo.url.trim(),
      isActive: true,
      order: repositories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setRepositories([...repositories, repository])
    setNewRepo({
      name: '',
      description: '',
      language: 'JavaScript',
      stars: 0,
      forks: 0,
      lastUpdated: '',
      url: ''
    })
  }

  const removeRepository = (id: string) => {
    setRepositories(repositories.filter(repo => repo.id !== id))
  }

  const updateRepository = (id: string, field: keyof GitHubRepository, value: any) => {
    setRepositories(repositories.map(repo => 
      repo.id === id 
        ? { ...repo, [field]: value, updatedAt: new Date().toISOString() }
        : repo
    ))
  }

  const getLanguageColor = (language: string) => {
    const lang = languageOptions.find(l => l.value === language)
    return lang?.color || 'bg-gray-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
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
          title="GitHub 저장소 관리"
          description="개발 프로젝트와 GitHub 저장소 정보를 관리합니다."
        />
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              isPreviewMode 
                ? 'bg-accent-warning text-white' 
                : 'bg-background-secondary text-foreground border border-border'
            }`}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreviewMode ? '편집 모드' : '미리보기'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? '저장 중...' : '저장'}
          </motion.button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {repositories.map((repo) => (
            <motion.div
              key={repo.id}
              whileHover={{ scale: 1.02 }}
              className="card-primary p-6 border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                    <span className="text-sm text-foreground-secondary">{repo.language}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{repo.name}</h3>
                  <p className="text-foreground-secondary text-sm leading-relaxed">
                    {repo.description}
                  </p>
                </div>
                <motion.a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-foreground-secondary hover:text-primary transition-colors"
                >
                  <ExternalLink size={16} />
                </motion.a>
              </div>
              
              <div className="flex items-center justify-between text-sm text-foreground-secondary mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={14} />
                    <span>{repo.forks}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(repo.lastUpdated)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Edit Mode
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Add New Repository */}
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-4">새 GitHub 저장소 추가</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="저장소 이름 (예: flutter-ecommerce-app)"
                  value={newRepo.name}
                  onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                  className="p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <select
                  value={newRepo.language}
                  onChange={(e) => setNewRepo({ ...newRepo, language: e.target.value })}
                  className="p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {languageOptions.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              
              <textarea
                placeholder="저장소 설명"
                rows={3}
                value={newRepo.description}
                onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              
              <input
                type="url"
                placeholder="GitHub URL (예: https://github.com/username/repo-name)"
                value={newRepo.url}
                onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">스타 수</label>
                  <input
                    type="number"
                    min="0"
                    value={newRepo.stars}
                    onChange={(e) => setNewRepo({ ...newRepo, stars: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">포크 수</label>
                  <input
                    type="number"
                    min="0"
                    value={newRepo.forks}
                    onChange={(e) => setNewRepo({ ...newRepo, forks: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">마지막 업데이트</label>
                  <input
                    type="date"
                    value={newRepo.lastUpdated}
                    onChange={(e) => setNewRepo({ ...newRepo, lastUpdated: e.target.value })}
                    className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addRepository}
                className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                저장소 추가
              </motion.button>
            </div>
          </div>

          {/* Existing Repositories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {repositories.map((repo) => (
                <motion.div
                  key={repo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card-primary p-6 border border-border"
                >
                  {/* Repository Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                        {editingRepo === repo.id ? (
                          <select
                            value={repo.language}
                            onChange={(e) => updateRepository(repo.id, 'language', e.target.value)}
                            className="text-sm bg-background-secondary border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {languageOptions.map(lang => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-foreground-secondary">{repo.language}</span>
                        )}
                      </div>
                      
                      {editingRepo === repo.id ? (
                        <input
                          type="text"
                          value={repo.name}
                          onChange={(e) => updateRepository(repo.id, 'name', e.target.value)}
                          className="font-semibold text-lg bg-background-secondary border border-border rounded px-3 py-1 w-full focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                        />
                      ) : (
                        <h3 className="font-semibold text-lg mb-2">{repo.name}</h3>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-foreground-secondary hover:text-primary"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingRepo(editingRepo === repo.id ? null : repo.id)}
                        className="p-2 text-foreground-secondary hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeRepository(repo.id)}
                        className="p-2 text-foreground-secondary hover:text-accent-error"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Description */}
                  {editingRepo === repo.id ? (
                    <textarea
                      rows={3}
                      value={repo.description}
                      onChange={(e) => updateRepository(repo.id, 'description', e.target.value)}
                      className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none mb-4"
                      placeholder="저장소 설명"
                    />
                  ) : (
                    <p className="text-foreground-secondary text-sm leading-relaxed mb-4">
                      {repo.description}
                    </p>
                  )}

                  {/* URL */}
                  {editingRepo === repo.id && (
                    <input
                      type="url"
                      value={repo.url}
                      onChange={(e) => updateRepository(repo.id, 'url', e.target.value)}
                      className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                      placeholder="GitHub URL"
                    />
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-foreground-secondary mb-1">스타</label>
                      {editingRepo === repo.id ? (
                        <input
                          type="number"
                          min="0"
                          value={repo.stars}
                          onChange={(e) => updateRepository(repo.id, 'stars', parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-background-secondary border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Star size={14} />
                          <span className="text-sm">{repo.stars}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-foreground-secondary mb-1">포크</label>
                      {editingRepo === repo.id ? (
                        <input
                          type="number"
                          min="0"
                          value={repo.forks}
                          onChange={(e) => updateRepository(repo.id, 'forks', parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-background-secondary border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <GitFork size={14} />
                          <span className="text-sm">{repo.forks}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-foreground-secondary mb-1">업데이트</label>
                      {editingRepo === repo.id ? (
                        <input
                          type="date"
                          value={repo.lastUpdated}
                          onChange={(e) => updateRepository(repo.id, 'lastUpdated', e.target.value)}
                          className="w-full p-2 bg-background-secondary border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span className="text-sm">{formatDate(repo.lastUpdated)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}