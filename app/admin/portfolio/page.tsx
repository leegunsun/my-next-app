"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, FileText, Code, Github, User, Target, 
  ToggleLeft, ToggleRight, Plus, Eye, EyeOff, 
  GripVertical, Save, X, Check
} from 'lucide-react'
import AdminTitle from '../../../components/admin/AdminTitle'
import { PortfolioSection, PortfolioSectionSettings } from '../../../lib/types/portfolio'

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  User,
  Target,
  Settings,
  Code,
  Github,
  FileText
}

export default function PortfolioManagementPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [sections, setSections] = useState<PortfolioSection[]>([])
  const [settings, setSettings] = useState<PortfolioSectionSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  })
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  
  // New section form data
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    icon: 'FileText',
    color: 'bg-primary',
    homeSection: 'about'
  })

  // Fetch sections data
  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/portfolio/sections')
      const result = await response.json()
      
      if (result.success) {
        setSections(result.data.sections)
        setSettings(result.data.settings)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      setSaveStatus({
        type: 'error',
        message: '섹션 데이터를 불러오는 중 오류가 발생했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSection = (sectionId: string, field: 'isActive' | 'showInNavigation' | 'showInAdminGrid') => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: !section[field] }
        : section
    ))
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem(sectionId)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetSectionId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    // Reorder sections
    setSections(prev => {
      const updatedSections = [...prev]
      const draggedIndex = updatedSections.findIndex(s => s.id === draggedItem)
      const targetIndex = updatedSections.findIndex(s => s.id === targetSectionId)
      
      if (draggedIndex === -1 || targetIndex === -1) return prev

      // Remove dragged item and insert at target position
      const [draggedSection] = updatedSections.splice(draggedIndex, 1)
      updatedSections.splice(targetIndex, 0, draggedSection)

      // Update order values
      return updatedSections.map((section, index) => ({
        ...section,
        order: index + 1,
        updatedAt: new Date().toISOString()
      }))
    })

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveStatus({ type: null, message: '' })

      const response = await fetch('/api/portfolio/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections, settings })
      })

      const result = await response.json()
      
      if (result.success) {
        setSaveStatus({
          type: 'success',
          message: '섹션 설정이 성공적으로 저장되었습니다!'
        })
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error saving sections:', error)
      setSaveStatus({
        type: 'error',
        message: '저장 중 오류가 발생했습니다. 다시 시도해주세요.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSection = async () => {
    try {
      if (!newSection.title || !newSection.description) {
        setSaveStatus({
          type: 'error',
          message: '제목과 설명을 입력해주세요.'
        })
        return
      }

      const response = await fetch('/api/portfolio/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      })

      const result = await response.json()
      
      if (result.success) {
        setSections(prev => [...prev, result.data])
        setNewSection({
          title: '',
          description: '',
          icon: 'FileText',
          color: 'bg-primary',
          homeSection: 'about'
        })
        setShowAddForm(false)
        setSaveStatus({
          type: 'success',
          message: '새 섹션이 추가되었습니다!'
        })
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error adding section:', error)
      setSaveStatus({
        type: 'error',
        message: '섹션 추가 중 오류가 발생했습니다.'
      })
    }
  }

  // Filter and sort sections for display
  const activeSections = sections
    .filter(section => section.showInAdminGrid)
    .sort((a, b) => (a.order || 99) - (b.order || 99))

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <AdminTitle
          title="포트폴리오 관리"
          description="포트폴리오 페이지의 모든 콘텐츠를 관리하고 편집할 수 있습니다."
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground-secondary">섹션 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <AdminTitle
          title="포트폴리오 관리"
          description="포트폴리오 페이지의 모든 콘텐츠를 관리하고 편집할 수 있습니다."
        />
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-accent-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
          >
            <Plus size={20} />
            새 섹션 추가
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save size={20} />
            )}
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </motion.button>
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

      {/* Add Section Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-primary p-6 border-l-4 border-accent-success overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">새 섹션 추가</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="섹션 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <input
                  type="text"
                  value={newSection.description}
                  onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="섹션 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">아이콘</label>
                <select
                  value={newSection.icon}
                  onChange={(e) => setNewSection(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="FileText">FileText</option>
                  <option value="User">User</option>
                  <option value="Target">Target</option>
                  <option value="Settings">Settings</option>
                  <option value="Code">Code</option>
                  <option value="Github">Github</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">색상</label>
                <select
                  value={newSection.color}
                  onChange={(e) => setNewSection(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="bg-primary">Primary (파란색)</option>
                  <option value="bg-accent-success">Success (초록색)</option>
                  <option value="bg-accent-purple">Purple (보라색)</option>
                  <option value="bg-accent-warning">Warning (노란색)</option>
                  <option value="bg-accent-info">Info (하늘색)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-foreground-secondary hover:bg-background-secondary rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 bg-accent-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
              >
                <Plus size={16} />
                추가하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeSections.map((section, index) => {
          const Icon = iconMap[section.icon] || FileText
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(section.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative ${section.isActive ? '' : 'opacity-50'} ${
                dragOverItem === section.id ? 'ring-2 ring-primary ring-opacity-50' : ''
              } ${draggedItem === section.id ? 'opacity-30' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragEnd={handleDragEnd}
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10">
                <div className="p-2 rounded-lg bg-background-secondary/80 hover:bg-background-secondary cursor-grab active:cursor-grabbing transition-colors">
                  <GripVertical size={16} className="text-foreground-secondary" />
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleSection(section.id, 'showInNavigation')}
                  className={`p-2 rounded-lg transition-all ${
                    section.showInNavigation 
                      ? 'bg-accent-info/20 text-accent-info' 
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                  title={section.showInNavigation ? '네비게이션에서 숨기기' : '네비게이션에 표시'}
                >
                  {section.showInNavigation ? <Eye size={16} /> : <EyeOff size={16} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleSection(section.id, 'isActive')}
                  className="p-2 rounded-lg transition-all"
                  title={section.isActive ? '비활성화' : '활성화'}
                >
                  {section.isActive ? (
                    <ToggleRight size={16} className="text-accent-success" />
                  ) : (
                    <ToggleLeft size={16} className="text-gray-500" />
                  )}
                </motion.button>
              </div>

              <motion.a
                href={section.href}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block h-full"
              >
                <div className={`card-primary h-full p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${
                  section.isActive 
                    ? 'border-transparent hover:border-primary' 
                    : 'border-gray-300'
                }`}>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{
                        scale: hoveredCard === section.id ? 1.1 : 1,
                        rotate: hoveredCard === section.id ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} className="text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-2 mb-3">
                    {section.showInNavigation && (
                      <span className="text-xs bg-accent-info/20 text-accent-info px-2 py-1 rounded-full">
                        네비게이션
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      section.isActive 
                        ? 'bg-accent-success/20 text-accent-success' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {section.isActive ? '활성' : '비활성'}
                    </span>
                  </div>

                  {/* Action Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: hoveredCard === section.id ? 1 : 0,
                      x: hoveredCard === section.id ? 0 : -10
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-primary text-sm font-medium"
                  >
                    <span>관리하기</span>
                    <motion.div
                      animate={{ x: hoveredCard === section.id ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </div>
              </motion.a>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-primary p-6"
      >
        <h3 className="text-lg font-semibold mb-4">섹션 현황</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {sections.length}
            </div>
            <div className="text-sm text-foreground-secondary">
              전체 섹션
            </div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-success mb-1">
              {sections.filter(s => s.isActive).length}
            </div>
            <div className="text-sm text-foreground-secondary">
              활성 섹션
            </div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-info mb-1">
              {sections.filter(s => s.showInNavigation).length}
            </div>
            <div className="text-sm text-foreground-secondary">
              네비게이션 표시
            </div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-purple mb-1">
              {sections.filter(s => s.id.startsWith('custom-')).length}
            </div>
            <div className="text-sm text-foreground-secondary">
              커스텀 섹션
            </div>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-primary p-6 border-l-4 border-accent-info"
      >
        <div className="flex items-start gap-3">
          <FileText size={20} className="text-accent-info mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">섹션 관리 가이드</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>• <strong>활성화/비활성화</strong>: 토글 버튼으로 섹션을 활성화하거나 비활성화할 수 있습니다.</li>
              <li>• <strong>네비게이션 표시</strong>: 홈페이지 네비게이션 메뉴에 표시할지 선택할 수 있습니다.</li>
              <li>• <strong>순서 변경</strong>: 왼쪽 상단의 드래그 핸들을 이용해 섹션 순서를 변경할 수 있습니다.</li>
              <li>• <strong>새 섹션 추가</strong>: 커스텀 섹션을 추가하여 포트폴리오를 확장할 수 있습니다.</li>
              <li>• <strong>변경사항 저장</strong>: 설정을 변경한 후 반드시 '변경사항 저장' 버튼을 눌러주세요.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}