"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { AboutMeData } from '../../../../lib/types/portfolio'

export default function AboutManagementPage() {
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<string | null>(null)
  const [newSpecialty, setNewSpecialty] = useState({ name: '', color: 'primary' })
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const colorOptions = [
    { value: 'primary', label: 'Primary', class: 'bg-primary' },
    { value: 'accent-success', label: 'Success', class: 'bg-accent-success' },
    { value: 'accent-purple', label: 'Purple', class: 'bg-accent-purple' },
    { value: 'accent-warning', label: 'Warning', class: 'bg-accent-warning' },
    { value: 'accent-info', label: 'Info', class: 'bg-accent-info' }
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
          className="space-y-8"
        >
          <div className="card-primary p-8">
            <h2 className="text-2xl font-semibold mb-4">{aboutData.title}</h2>
            <h3 className="text-xl text-gradient-flutter mb-4">{aboutData.heroTitle}</h3>
            <p className="text-foreground-secondary mb-6 leading-relaxed">{aboutData.heroSubtitle}</p>
            <p className="text-foreground-secondary leading-relaxed">{aboutData.description}</p>
          </div>
          
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-4">전문 분야</h3>
            <div className="space-y-3">
              {aboutData.specialties.map((specialty) => (
                <div key={specialty.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 bg-${specialty.color} rounded-full`}></div>
                  <span>{specialty.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-4">개발 철학</h3>
            <p className="text-foreground-secondary leading-relaxed">{aboutData.philosophy}</p>
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
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-6">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">섹션 제목</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">히어로 타이틀</label>
                <input
                  type="text"
                  value={aboutData.heroTitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroTitle: e.target.value })}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">히어로 서브타이틀</label>
                <textarea
                  rows={3}
                  value={aboutData.heroSubtitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroSubtitle: e.target.value })}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">상세 설명</label>
                <textarea
                  rows={4}
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">개발 철학</label>
                <textarea
                  rows={4}
                  value={aboutData.philosophy}
                  onChange={(e) => setAboutData({ ...aboutData, philosophy: e.target.value })}
                  className="w-full p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-6">전문 분야</h3>
            
            {/* Add New Specialty */}
            <div className="flex gap-3 mb-6 p-4 bg-background-secondary rounded-lg">
              <input
                type="text"
                placeholder="새 전문 분야 입력"
                value={newSpecialty.name}
                onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                className="flex-1 p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                value={newSpecialty.color}
                onChange={(e) => setNewSpecialty({ ...newSpecialty, color: e.target.value })}
                className="p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addSpecialty}
                className="bg-primary text-white p-2 rounded-lg flex items-center gap-2"
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
                  <div className={`w-4 h-4 bg-${specialty.color} rounded-full flex-shrink-0`}></div>
                  
                  {editingSpecialty === specialty.id ? (
                    <>
                      <input
                        type="text"
                        value={specialty.name}
                        onChange={(e) => updateSpecialty(specialty.id, 'name', e.target.value)}
                        className="flex-1 p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        onBlur={() => setEditingSpecialty(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingSpecialty(null)}
                        autoFocus
                      />
                      <select
                        value={specialty.color}
                        onChange={(e) => updateSpecialty(specialty.id, 'color', e.target.value)}
                        className="p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {colorOptions.map(color => (
                          <option key={color.value} value={color.value}>{color.label}</option>
                        ))}
                      </select>
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