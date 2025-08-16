"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff, GripVertical } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { SkillCategory } from '../../../../lib/types/portfolio'

export default function SkillsManagementPage() {
  const [skillsData, setSkillsData] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', color: 'primary' })
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 50, color: 'primary' })
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const colorOptions = [
    { value: 'primary', label: 'Primary', class: 'bg-primary' },
    { value: 'success', label: 'Success', class: 'bg-accent-success' },
    { value: 'purple', label: 'Purple', class: 'bg-accent-purple' },
    { value: 'warning', label: 'Warning', class: 'bg-accent-warning' },
    { value: 'info', label: 'Info', class: 'bg-accent-info' }
  ]

  useEffect(() => {
    fetchSkillsData()
  }, [])

  const fetchSkillsData = async () => {
    try {
      const response = await fetch('/api/portfolio/skills')
      const result = await response.json()
      if (result.success) {
        setSkillsData(result.data)
      }
    } catch (error) {
      console.error('Error fetching skills data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/portfolio/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillsData)
      })
      
      const result = await response.json()
      if (result.success) {
        setSkillsData(result.data)
        alert('저장되었습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving skills data:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const addCategory = () => {
    if (!newCategory.name.trim()) return
    
    const category: SkillCategory = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      color: newCategory.color,
      skills: [],
      isActive: true,
      order: skillsData.length + 1
    }
    
    setSkillsData([...skillsData, category])
    setNewCategory({ name: '', color: 'primary' })
  }

  const removeCategory = (categoryId: string) => {
    setSkillsData(skillsData.filter(cat => cat.id !== categoryId))
  }

  const updateCategory = (categoryId: string, field: keyof SkillCategory, value: any) => {
    setSkillsData(skillsData.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ))
  }

  const addSkillToCategory = (categoryId: string) => {
    if (!newSkill.name.trim()) return
    
    const skill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      percentage: newSkill.percentage,
      color: newSkill.color
    }
    
    setSkillsData(skillsData.map(cat => 
      cat.id === categoryId 
        ? { ...cat, skills: [...cat.skills, skill] }
        : cat
    ))
    
    setNewSkill({ name: '', percentage: 50, color: 'primary' })
  }

  const removeSkillFromCategory = (categoryId: string, skillId: string) => {
    setSkillsData(skillsData.map(cat => 
      cat.id === categoryId 
        ? { ...cat, skills: cat.skills.filter(skill => skill.id !== skillId) }
        : cat
    ))
  }

  const updateSkill = (categoryId: string, skillId: string, field: string, value: any) => {
    setSkillsData(skillsData.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat, 
            skills: cat.skills.map(skill => 
              skill.id === skillId ? { ...skill, [field]: value } : skill
            )
          }
        : cat
    ))
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
          title="기술 스택 관리"
          description="개발 기술과 숙련도를 카테고리별로 관리합니다."
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
          className="space-y-6"
        >
          {skillsData.map((category) => (
            <div key={category.id} className="card-primary p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 bg-${category.color} rounded-full`}></div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
              <div className="grid gap-4">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-background-secondary rounded-full h-2">
                        <div 
                          className={`h-2 bg-${skill.color} rounded-full transition-all duration-300`}
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-foreground-secondary w-8 text-right">
                        {skill.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        // Edit Mode
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Add New Category */}
          <div className="card-primary p-6">
            <h3 className="text-xl font-semibold mb-4">새 기술 카테고리 추가</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="카테고리 이름 (예: Frontend & Mobile)"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="p-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addCategory}
                className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                추가
              </motion.button>
            </div>
          </div>

          {/* Existing Categories */}
          <AnimatePresence>
            {skillsData.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-primary p-6"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 bg-${category.color} rounded-full`}></div>
                    {editingCategory === category.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                          className="text-xl font-semibold bg-background-secondary border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                          onBlur={() => setEditingCategory(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingCategory(null)}
                          autoFocus
                        />
                        <select
                          value={category.color}
                          onChange={(e) => updateCategory(category.id, 'color', e.target.value)}
                          className="p-2 bg-background-secondary border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {colorOptions.map(color => (
                            <option key={color.value} value={color.value}>{color.label}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                      className="p-2 text-foreground-secondary hover:text-primary"
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeCategory(category.id)}
                      className="p-2 text-foreground-secondary hover:text-accent-error"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Add New Skill */}
                <div className="bg-background-secondary p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="기술 이름"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSkill.percentage}
                        onChange={(e) => setNewSkill({ ...newSkill, percentage: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm w-8 text-right">{newSkill.percentage}%</span>
                    </div>
                    <select
                      value={newSkill.color}
                      onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                      className="p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addSkillToCategory(category.id)}
                      className="bg-accent-success text-white p-2 rounded flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      추가
                    </motion.button>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      layout
                      className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg"
                    >
                      <div className={`w-3 h-3 bg-${skill.color} rounded-full`}></div>
                      
                      {editingSkill === `${category.id}-${skill.id}` ? (
                        <>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(category.id, skill.id, 'name', e.target.value)}
                            className="flex-1 p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.percentage}
                              onChange={(e) => updateSkill(category.id, skill.id, 'percentage', parseInt(e.target.value))}
                              className="w-20"
                            />
                            <span className="text-sm w-8 text-right">{skill.percentage}%</span>
                          </div>
                          <select
                            value={skill.color}
                            onChange={(e) => updateSkill(category.id, skill.id, 'color', e.target.value)}
                            className="p-2 bg-background border border-border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {colorOptions.map(color => (
                              <option key={color.value} value={color.value}>{color.label}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-background rounded-full h-2">
                              <div 
                                className={`h-2 bg-${skill.color} rounded-full transition-all duration-300`}
                                style={{ width: `${skill.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm w-8 text-right">{skill.percentage}%</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingSkill(editingSkill === `${category.id}-${skill.id}` ? null : `${category.id}-${skill.id}`)}
                            className="p-1 text-foreground-secondary hover:text-primary"
                          >
                            <Edit2 size={14} />
                          </motion.button>
                        </>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeSkillFromCategory(category.id, skill.id)}
                        className="p-1 text-foreground-secondary hover:text-accent-error"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}