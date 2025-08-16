"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, Save, X, ExternalLink, Github } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { PortfolioProject } from '../../../../lib/types/portfolio'
import { CustomSelect, SelectOption } from '../../../../components/ui/select'

interface ProjectFormData {
  title: string
  description: string
  tags: string[]
  icon: string
  iconBg: string
  liveUrl: string
  githubUrl: string
  isActive: boolean
  order: number
}

const iconOptions: SelectOption[] = [
  { id: 'flutter', name: 'Flutter', value: 'Flutter' },
  { id: 'spring', name: 'Spring Boot', value: 'Spring' },
  { id: 'react', name: 'React', value: 'React' },
  { id: 'vue', name: 'Vue.js', value: 'Vue' },
  { id: 'angular', name: 'Angular', value: 'Angular' },
  { id: 'node', name: 'Node.js', value: 'Node' },
  { id: 'python', name: 'Python', value: 'Python' },
  { id: 'docker', name: 'Docker', value: 'Docker' },
  { id: 'k8s', name: 'Kubernetes', value: 'K8s' }
]

const iconBgOptions: SelectOption[] = [
  { id: 'primary', name: 'Primary', value: 'bg-primary' },
  { id: 'success', name: 'Success', value: 'bg-accent-success' },
  { id: 'purple', name: 'Purple', value: 'bg-accent-purple' },
  { id: 'warning', name: 'Warning', value: 'bg-accent-warning' },
  { id: 'info', name: 'Info', value: 'bg-accent-info' },
  { id: 'error', name: 'Error', value: 'bg-accent-error' }
]

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    tags: [],
    icon: 'Flutter',
    iconBg: 'bg-primary',
    liveUrl: '',
    githubUrl: '',
    isActive: true,
    order: 1
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio/projects')
      const result = await response.json()
      if (result.success) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingProject ? `/api/portfolio/projects/${editingProject.id}` : '/api/portfolio/projects'
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchProjects()
        resetForm()
        alert(editingProject ? '프로젝트가 수정되었습니다.' : '프로젝트가 추가되었습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/portfolio/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchProjects()
        alert('프로젝트가 삭제되었습니다.')
      } else {
        alert('삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tags: [],
      icon: 'Flutter',
      iconBg: 'bg-primary',
      liveUrl: '',
      githubUrl: '',
      isActive: true,
      order: projects.length + 1
    })
    setTagInput('')
    setEditingProject(null)
    setIsCreating(false)
  }

  const startEdit = (project: PortfolioProject) => {
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags,
      icon: project.icon,
      iconBg: project.iconBg,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      isActive: project.isActive,
      order: project.order
    })
    setEditingProject(project)
    setIsCreating(true)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <AdminTitle
          title="프로젝트 관리"
          description="포트폴리오 프로젝트를 추가, 수정, 삭제할 수 있습니다."
        />
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-4 text-lg rounded-2xl font-medium transition-all shadow-lg flex items-center gap-3"
        >
          <Plus size={20} />
          새 프로젝트 추가
        </motion.button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card-primary p-6 group hover:shadow-lg transition-all duration-300"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${project.iconBg} rounded-lg flex items-center justify-center text-white font-medium shadow-md`}>
                  {project.icon}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEdit(project)}
                    className="p-2 text-foreground-secondary hover:text-primary hover:bg-background-secondary rounded"
                  >
                    <Edit2 size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-foreground-secondary hover:text-accent-error hover:bg-background-secondary rounded"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>

              {/* Project Content */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{project.title}</h3>
              <p className="text-sm text-foreground-secondary mb-4 line-clamp-3 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-background-secondary text-xs rounded-full border border-border"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 bg-background-secondary text-xs rounded-full border border-border">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
                  >
                    <ExternalLink size={14} />
                    Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-foreground-secondary hover:text-foreground text-sm"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
              </div>

              {/* Status */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    project.isActive 
                      ? 'bg-accent-success/10 text-accent-success' 
                      : 'bg-foreground-muted/10 text-foreground-muted'
                  }`}>
                    {project.isActive ? '활성화' : '비활성화'}
                  </span>
                  <span className="text-foreground-secondary">
                    순서: {project.order}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-background-card border border-border/30 shadow-elevated rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="p-3 text-foreground-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                    placeholder="프로젝트 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 설명</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm resize-none"
                    placeholder="프로젝트에 대한 상세 설명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    label="아이콘"
                    options={iconOptions}
                    value={formData.icon}
                    onChange={(value) => setFormData({ ...formData, icon: value })}
                    placeholder="아이콘 선택"
                  />

                  <CustomSelect
                    label="아이콘 배경색"
                    options={iconBgOptions}
                    value={formData.iconBg}
                    onChange={(value) => setFormData({ ...formData, iconBg: value })}
                    placeholder="배경색 선택"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">기술 태그</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                      placeholder="태그 입력 후 Enter"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTag}
                      className="bg-accent-blend text-primary-foreground hover:opacity-90 px-6 py-3 rounded-2xl font-medium transition-all shadow-md"
                    >
                      추가
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-background-secondary border border-border rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-foreground-secondary hover:text-accent-error"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">라이브 URL (선택)</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL (선택)</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">순서</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                    />
                  </div>

                  <CustomSelect
                    label="상태"
                    options={[
                      { id: 'active', name: '활성화', value: 'true' },
                      { id: 'inactive', name: '비활성화', value: 'false' }
                    ]}
                    value={formData.isActive.toString()}
                    onChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                    placeholder="상태 선택"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingProject ? '수정' : '추가'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="bg-background-secondary text-foreground hover:bg-background-tertiary px-8 py-3 rounded-2xl font-medium transition-all border border-border"
                >
                  취소
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}