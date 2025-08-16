"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, Palette } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { AboutMeData } from '../../../../lib/types/portfolio'
import { CustomSelect, SelectOption } from '../../../../components/ui/select'


export default function AboutManagementPage() {
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<string | null>(null)
  const [newSpecialty, setNewSpecialty] = useState({ name: '', color: 'primary' })
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Color options formatted for CustomSelect
  const colorOptions: SelectOption[] = [
    { 
      id: 'primary', 
      name: 'Primary (파란색)', 
      value: 'primary',
      icon: <div className="w-4 h-4 bg-primary rounded-full" />
    },
    { 
      id: 'success', 
      name: 'Success (초록색)', 
      value: 'accent-success',
      icon: <div className="w-4 h-4 bg-accent-success rounded-full" />
    },
    { 
      id: 'purple', 
      name: 'Purple (보라색)', 
      value: 'accent-purple',
      icon: <div className="w-4 h-4 bg-accent-purple rounded-full" />
    },
    { 
      id: 'warning', 
      name: 'Warning (노란색)', 
      value: 'accent-warning',
      icon: <div className="w-4 h-4 bg-accent-warning rounded-full" />
    },
    { 
      id: 'info', 
      name: 'Info (하늘색)', 
      value: 'accent-info',
      icon: <div className="w-4 h-4 bg-accent-info rounded-full" />
    }
  ]

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/portfolio/about')
      const result = await response.json()
      if (result.success) {
        setAboutData(result.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!aboutData) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/portfolio/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      })
      
      const result = await response.json()
      if (result.success) {
        setAboutData(result.data)
        alert('저장되었습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving about data:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const addSpecialty = () => {
    if (!aboutData || !newSpecialty.name.trim()) return
    
    const specialty = {
      id: Date.now().toString(),
      name: newSpecialty.name.trim(),
      color: newSpecialty.color
    }
    
    setAboutData({
      ...aboutData,
      specialties: [...aboutData.specialties, specialty]
    })
    
    setNewSpecialty({ name: '', color: 'primary' })
  }

  const removeSpecialty = (id: string) => {
    if (!aboutData) return
    
    setAboutData({
      ...aboutData,
      specialties: aboutData.specialties.filter(s => s.id !== id)
    })
  }

  const updateSpecialty = (id: string, field: 'name' | 'color', value: string) => {
    if (!aboutData) return
    
    setAboutData({
      ...aboutData,
      specialties: aboutData.specialties.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    })
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

  if (!aboutData) return null

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <AdminTitle
          title="About Me 관리"
          description="개인 소개 및 전문 분야 정보를 관리합니다."
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
        // Preview Mode - Matching actual homepage layout
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* About Me Section Title */}
          <div className="text-center">
            <h2 className="text-3xl font-medium">About Me</h2>
          </div>
          
          {/* Two Column Layout like homepage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - About Content */}
            <div className="space-y-6">
              {/* Specialties Card */}
              <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
                <h3 className="text-xl font-medium mb-4">전문 분야</h3>
                <div className="space-y-3">
                  {aboutData.specialties.map((specialty, index) => {
                    const colorStyle = {
                      backgroundColor: specialty.color === 'primary' ? 'rgb(90, 169, 255)' :
                                      specialty.color === 'accent-success' ? 'rgb(108, 210, 143)' :
                                      specialty.color === 'accent-purple' ? 'rgb(196, 167, 245)' :
                                      specialty.color === 'accent-warning' ? 'rgb(245, 158, 11)' :
                                      specialty.color === 'accent-info' ? 'rgb(122, 180, 245)' : 'rgb(90, 169, 255)'
                    };
                    return (
                      <motion.div 
                        key={specialty.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={colorStyle}
                        ></div>
                        <span>{specialty.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Philosophy Card */}
              <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
                <h3 className="text-xl font-medium mb-4">개발 철학</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {aboutData.philosophy}
                </p>
              </div>
            </div>

            {/* Right Column - Timeline */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium">경력 타임라인</h3>
              
              <div className="relative">
                {/* Timeline Line */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute left-6 top-0 w-0.5 bg-border"
                />
                
                {/* Timeline Items - Sample data for preview */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="relative flex items-start gap-6 group"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="w-3 h-3 bg-primary rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                    >
                      <div className="text-sm text-foreground-secondary">2023 - Present</div>
                      <h4 className="font-medium mb-2">Senior Flutter Developer</h4>
                      <p className="text-foreground-secondary text-sm">
                        Flutter 기반 크로스플랫폼 앱 개발 및 Spring Boot API 연동
                      </p>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative flex items-start gap-6 group"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                      className="w-3 h-3 bg-accent-success rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                    >
                      <div className="text-sm text-foreground-secondary">2022 - 2023</div>
                      <h4 className="font-medium mb-2">Backend Developer</h4>
                      <p className="text-foreground-secondary text-sm">
                        Spring Boot, Kotlin 기반 RESTful API 설계 및 구현
                      </p>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    className="relative flex items-start gap-6 group"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                      className="w-3 h-3 bg-accent-purple rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                    >
                      <div className="text-sm text-foreground-secondary">2021 - 2022</div>
                      <h4 className="font-medium mb-2">DevOps Engineer</h4>
                      <p className="text-foreground-secondary text-sm">
                        Docker 컨테이너화 및 Kubernetes 클러스터 운영
                      </p>
                    </motion.div>
                  </motion.div>
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
          {/* Basic Information */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-semibold mb-6">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">섹션 제목</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">히어로 타이틀</label>
                <input
                  type="text"
                  value={aboutData.heroTitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroTitle: e.target.value })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">히어로 서브타이틀</label>
                <textarea
                  rows={3}
                  value={aboutData.heroSubtitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroSubtitle: e.target.value })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">상세 설명</label>
                <textarea
                  rows={4}
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">개발 철학</label>
                <textarea
                  rows={4}
                  value={aboutData.philosophy}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy: e.target.value })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-semibold mb-6">전문 분야</h3>
            
            {/* Add New Specialty */}
            <div className="flex gap-3 mb-6 p-4 bg-background-secondary rounded-lg">
              <input
                type="text"
                placeholder="새 전문 분야 입력"
                value={newSpecialty.name}
                onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                className="flex-1 p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
              />
              <CustomSelect
                value={newSpecialty.color}
                onChange={(value) => setNewSpecialty({ ...newSpecialty, color: value })}
                options={colorOptions}
                placeholder="색상 선택"
                className="min-w-[180px]"
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={addSpecialty}
                className="bg-accent-blend text-primary-foreground hover:opacity-90 px-4 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <Plus size={16} />
                추가
              </motion.button>
            </div>

            {/* Existing Specialties */}
            <div className="space-y-3">
              {aboutData.specialties.map((specialty) => (
                <motion.div
                  key={specialty.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg"
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: specialty.color === 'primary' ? 'rgb(90, 169, 255)' :
                                      specialty.color === 'accent-success' ? 'rgb(108, 210, 143)' :
                                      specialty.color === 'accent-purple' ? 'rgb(196, 167, 245)' :
                                      specialty.color === 'accent-warning' ? 'rgb(245, 158, 11)' :
                                      specialty.color === 'accent-info' ? 'rgb(122, 180, 245)' : 'rgb(90, 169, 255)'
                    }}
                  ></div>
                  
                  {editingSpecialty === specialty.id ? (
                    <>
                      <input
                        type="text"
                        value={specialty.name}
                        onChange={(e) => updateSpecialty(specialty.id, 'name', e.target.value)}
                        className="flex-1 p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                        onBlur={() => setEditingSpecialty(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingSpecialty(null)}
                        autoFocus
                      />
                      <CustomSelect
                        value={specialty.color}
                        onChange={(value) => updateSpecialty(specialty.id, 'color', value)}
                        options={colorOptions}
                        placeholder="색상 선택"
                        className="min-w-[180px]"
                      />
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{specialty.name}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingSpecialty(specialty.id)}
                        className="p-1 text-foreground-secondary hover:text-primary"
                      >
                        <Edit2 size={14} />
                      </motion.button>
                    </>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeSpecialty(specialty.id)}
                    className="p-1 text-foreground-secondary hover:text-accent-error"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}