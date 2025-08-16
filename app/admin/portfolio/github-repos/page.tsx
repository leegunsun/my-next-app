"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, Star, GitFork, ExternalLink, Calendar, RefreshCw, Github, Database, Wifi, WifiOff, Home, Monitor } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import GitHubCard from '../../../../components/GitHubCard'
import { GitHubRepository } from '../../../../lib/types/portfolio'

export default function GitHubReposManagementPage() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [editingRepo, setEditingRepo] = useState<string | null>(null)
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    lastUpdated: '',
    url: '',
    showOnHomepage: false
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [dataSource, setDataSource] = useState<'github-api' | 'cache' | 'default'>('default')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [notification, setNotification] = useState<{ 
    type: 'success' | 'error' | 'info'; 
    message: string; 
    show: boolean 
  }>({ type: 'info', message: '', show: false })

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

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true })
  }

  const fetchRepositories = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      const url = forceRefresh 
        ? '/api/portfolio/github-repos?refresh=true' 
        : '/api/portfolio/github-repos'
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setRepositories(result.data)
        setDataSource(result.source || 'default')
        setLastUpdated(result.lastUpdated)
        setIsOnline(result.source === 'github-api')
        
        if (forceRefresh) {
          if (result.source === 'github-api') {
            showNotification('success', `GitHub에서 ${result.data.length}개의 저장소를 성공적으로 가져왔습니다.`)
          } else {
            showNotification('info', 'GitHub API를 사용할 수 없어 캐시된 데이터를 사용합니다.')
          }
        }
      } else {
        console.error('API error:', result.message)
        setIsOnline(false)
        if (forceRefresh) {
          showNotification('error', result.message || 'GitHub 저장소를 가져오는데 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('Error fetching repositories:', error)
      setIsOnline(false)
      if (forceRefresh) {
        showNotification('error', '네트워크 오류가 발생했습니다. 연결을 확인해 주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshFromGitHub = async () => {
    setIsRefreshing(true)
    try {
      await fetchRepositories(true)
    } finally {
      setIsRefreshing(false)
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
        showNotification('success', '저장소 데이터가 성공적으로 저장되었습니다.')
      } else {
        showNotification('error', result.message || '저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving repositories:', error)
      showNotification('error', '저장 중 네트워크 오류가 발생했습니다.')
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
      showOnHomepage: newRepo.showOnHomepage,
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
      url: '',
      showOnHomepage: false
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

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return '알 수 없음'
    
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 30) return `${diffDays}일 전`
    return formatDate(dateString)
  }

  const getDataSourceInfo = () => {
    switch (dataSource) {
      case 'github-api':
        return { 
          label: 'GitHub API (실시간)', 
          icon: Github, 
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200' 
        }
      case 'cache':
        return { 
          label: '캐시된 데이터', 
          icon: Database, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200' 
        }
      default:
        return { 
          label: '기본 데이터', 
          icon: Database, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200' 
        }
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <Github size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <p className="text-foreground-secondary font-medium">GitHub 저장소 데이터를 불러오는 중...</p>
          <p className="text-sm text-foreground-secondary mt-2">잠시만 기다려주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <AdminTitle
          title="GitHub 저장소 관리"
          description="개발 프로젝트와 GitHub 저장소 정보를 관리합니다."
        />
        <div className="flex items-center gap-3 flex-wrap">
          {/* Data Source Indicator */}
          {(() => {
            const sourceInfo = getDataSourceInfo()
            const IconComponent = sourceInfo.icon
            return (
              <div className={`px-3 py-1.5 rounded-lg border text-sm flex items-center gap-2 ${sourceInfo.bgColor}`}>
                <IconComponent size={14} className={sourceInfo.color} />
                <span className={sourceInfo.color}>{sourceInfo.label}</span>
                {isOnline ? <Wifi size={12} className="text-green-500" /> : <WifiOff size={12} className="text-red-500" />}
              </div>
            )
          })()}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-foreground-secondary">
              업데이트: {formatRelativeTime(lastUpdated)}
            </div>
          )}

          {/* GitHub Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshFromGitHub}
            disabled={isRefreshing}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'GitHub에서 가져오는 중...' : 'GitHub에서 새로고침'}
          </motion.button>

          {/* Preview/Edit Toggle */}
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
            {isPreviewMode ? '편집 모드' : '홈페이지 미리보기'}
          </motion.button>

          {/* Save Button */}
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

      {/* GitHub Integration Status */}
      {dataSource === 'github-api' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-green-800">
            <Github size={16} />
            <span className="font-medium">GitHub API 연결됨</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            실시간으로 GitHub에서 저장소 데이터를 가져오고 있습니다. 데이터는 5분마다 자동으로 캐시됩니다.
          </p>
        </motion.div>
      )}

      {dataSource === 'cache' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-blue-800">
            <Database size={16} />
            <span className="font-medium">캐시된 데이터 사용 중</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            GitHub API에서 가져온 캐시된 데이터를 사용하고 있습니다. 새로고침 버튼을 클릭하여 최신 데이터를 가져올 수 있습니다.
          </p>
        </motion.div>
      )}

      {dataSource === 'default' && !isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 text-yellow-800">
            <WifiOff size={16} />
            <span className="font-medium">오프라인 모드</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            GitHub API에 연결할 수 없어 기본 데이터를 사용하고 있습니다. 네트워크 연결을 확인한 후 새로고침해 주세요.
          </p>
        </motion.div>
      )}

      {isPreviewMode ? (
        // Preview Mode - Show actual homepage UI
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Preview Header */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Eye size={16} />
              <span className="font-medium">홈페이지 미리보기</span>
            </div>
            <p className="text-sm text-blue-700">
              아래는 실제 홈페이지에서 나타날 GitHub 저장소 섹션의 모습입니다. 
              '홈페이지 노출'이 활성화된 저장소만 표시됩니다.
            </p>
          </div>

          {/* Actual Homepage Section Preview */}
          <div className="bg-background-secondary p-8 rounded-lg border border-border">
            <div className="max-w-6xl mx-auto">
              {/* Section Title (as it appears on homepage) */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-medium mb-4">코드 예제 & GitHub</h2>
                <p className="text-foreground-secondary max-w-2xl mx-auto">
                  실제 프로젝트에서 사용한 코드 패턴과 GitHub 저장소를 통해 
                  개발 역량과 코드 품질을 확인해보세요.
                </p>
              </div>

              {/* GitHub Repositories Section */}
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-center">GitHub 저장소</h3>
                </div>
                
                {repositories.filter(repo => repo.showOnHomepage && repo.isActive).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {repositories
                      .filter(repo => repo.showOnHomepage && repo.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((repo, index) => (
                        <GitHubCard
                          key={repo.id}
                          repo={{
                            name: repo.name,
                            description: repo.description,
                            language: repo.language,
                            stars: repo.stars,
                            forks: repo.forks,
                            lastUpdated: repo.lastUpdated,
                            url: repo.url
                          }}
                          delay={index * 0.1}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                        <Github size={24} className="text-foreground-secondary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">표시할 저장소가 없습니다</h3>
                      <p className="text-foreground-secondary text-sm">
                        홈페이지에 표시할 저장소를 선택하려면 편집 모드로 전환하세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Monitor size={16} className="text-gray-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-800 mb-1">
                  현재 홈페이지에 표시되는 저장소: {repositories.filter(repo => repo.showOnHomepage && repo.isActive).length}개
                </div>
                <div className="text-xs text-gray-600">
                  편집 모드에서 각 저장소의 "홈페이지 노출" 토글을 사용하여 표시 여부를 변경할 수 있습니다.
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
          {/* Repository Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-primary p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{repositories.length}</div>
              <div className="text-sm text-foreground-secondary">총 저장소</div>
            </div>
            <div className="card-primary p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {repositories.reduce((sum, repo) => sum + repo.stars, 0)}
              </div>
              <div className="text-sm text-foreground-secondary">총 스타</div>
            </div>
            <div className="card-primary p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {repositories.reduce((sum, repo) => sum + repo.forks, 0)}
              </div>
              <div className="text-sm text-foreground-secondary">총 포크</div>
            </div>
          </div>

          {/* Add New Repository */}
          <div className="card-primary p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">수동으로 저장소 추가</h3>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">선택사항</div>
            </div>
            <p className="text-sm text-foreground-secondary mb-4">
              GitHub API로 자동 동기화되지 않은 저장소나 추가 정보가 필요한 저장소를 수동으로 추가할 수 있습니다.
            </p>
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
              
              {/* Homepage Display Option */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-foreground-secondary" />
                    <span className="text-sm font-medium">홈페이지에 표시</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewRepo({ ...newRepo, showOnHomepage: !newRepo.showOnHomepage })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      newRepo.showOnHomepage 
                        ? 'bg-green-600' 
                        : 'bg-foreground-muted'
                    }`}
                  >
                    <motion.span
                      animate={{
                        translateX: newRepo.showOnHomepage ? 20 : 4,
                      }}
                      className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                    />
                  </motion.button>
                </div>
                <p className="text-xs text-foreground-secondary mt-1">
                  이 저장소를 홈페이지의 GitHub 섹션에 표시할지 선택하세요
                </p>
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
                        {repo.showOnHomepage && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                            <Home size={10} />
                            <span>홈페이지 노출</span>
                          </div>
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
                  <div className="grid grid-cols-3 gap-4 mb-4">
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

                  {/* Homepage Display Toggle */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor size={16} className="text-foreground-secondary" />
                        <span className="text-sm font-medium">홈페이지 노출</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateRepository(repo.id, 'showOnHomepage', !repo.showOnHomepage)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          repo.showOnHomepage 
                            ? 'bg-green-600' 
                            : 'bg-foreground-muted'
                        }`}
                      >
                        <motion.span
                          animate={{
                            translateX: repo.showOnHomepage ? 20 : 4,
                          }}
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                        />
                      </motion.button>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-1">
                      이 저장소를 홈페이지의 GitHub 섹션에 표시합니다
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
              notification.type === 'success' 
                ? 'bg-green-600 text-white' 
                : notification.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <span className="text-xl">✅</span>}
              {notification.type === 'error' && <span className="text-xl">❌</span>}
              {notification.type === 'info' && <span className="text-xl">ℹ️</span>}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}