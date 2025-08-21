"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react'
import AdminTitle from '../../../../components/admin/AdminTitle'
import { AboutMeData, ResumeData, WorkExperience, Education, Certification, Language } from '../../../../lib/types/portfolio'
import { CustomSelect, SelectOption } from '../../../../components/ui/select'
import { processHtmlForGradientText } from '../../../../lib/utils'


export default function AboutManagementPage() {
  // Tab Management
  const [activeTab, setActiveTab] = useState<'about' | 'resumePdf' | 'resumeForm'>('about')
  
  // About Me State
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<string | null>(null)
  const [newSpecialty, setNewSpecialty] = useState({ name: '', color: 'primary' })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  // Resume PDF State
  const [resumePdfInfo, setResumePdfInfo] = useState<any>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // Resume Form State  
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoadingResume, setIsLoadingResume] = useState(true)
  const [isSavingResume, setIsSavingResume] = useState(false)
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [editingCertification, setEditingCertification] = useState<string | null>(null)
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null)

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
    fetchResumeData()
    fetchResumePdfInfo()
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

  const fetchResumeData = async () => {
    try {
      setIsLoadingResume(true)
      const response = await fetch('/api/portfolio/resume')
      const result = await response.json()
      if (result.success) {
        setResumeData(result.data)
      } else {
        // Initialize with default data if no resume exists
        const defaultResumeData: ResumeData = {
          id: 'default',
          personalInfo: {
            name: '',
            email: '',
            phone: '',
            address: '',
            summary: ''
          },
          workExperiences: [],
          education: [],
          certifications: [],
          languages: [],
          templateStyle: 'modern',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setResumeData(defaultResumeData)
      }
    } catch (error) {
      console.error('Error fetching resume data:', error)
    } finally {
      setIsLoadingResume(false)
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

  const fetchResumePdfInfo = async () => {
    try {
      setIsLoadingPdf(true)
      const response = await fetch('/api/portfolio/resume-upload')
      const result = await response.json()
      if (result.success) {
        setResumePdfInfo(result.data)
      } else {
        setResumePdfInfo(null)
      }
    } catch (error) {
      console.error('Error fetching PDF info:', error)
      setResumePdfInfo(null)
    } finally {
      setIsLoadingPdf(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/portfolio/resume-upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        setResumePdfInfo(result.data)
        alert('이력서 PDF가 성공적으로 업로드되었습니다.')
      } else {
        alert(result.message || 'PDF 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('PDF 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(file => file.type === 'application/pdf')
    
    if (pdfFile) {
      handlePdfUpload(pdfFile)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        handlePdfUpload(file)
      } else {
        alert('PDF 파일만 업로드 가능합니다.')
      }
    }
  }

  const handleResumeSave = async () => {
    if (!resumeData) return
    
    setIsSavingResume(true)
    try {
      const response = await fetch('/api/portfolio/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      })
      
      const result = await response.json()
      if (result.success) {
        setResumeData(result.data)
        alert('이력서가 저장되었습니다.')
      } else {
        alert('이력서 저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Error saving resume data:', error)
      alert('이력서 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSavingResume(false)
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

  // Resume Data Management Functions
  const addWorkExperience = () => {
    if (!resumeData) return
    
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: null,
      description: '',
      achievements: [],
      technologies: [],
      isActive: true,
      order: resumeData.workExperiences.length + 1
    }
    
    setResumeData({
      ...resumeData,
      workExperiences: [...resumeData.workExperiences, newExperience]
    })
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    if (!resumeData) return
    
    setResumeData({
      ...resumeData,
      workExperiences: resumeData.workExperiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const removeWorkExperience = (id: string) => {
    if (!resumeData) return
    
    setResumeData({
      ...resumeData,
      workExperiences: resumeData.workExperiences.filter(exp => exp.id !== id)
    })
  }

  const addEducation = () => {
    if (!resumeData) return
    
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isActive: true,
      order: resumeData.education.length + 1
    }
    
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    if (!resumeData) return
    
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    })
  }

  const removeEducation = (id: string) => {
    if (!resumeData) return
    
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    })
  }

  if (isLoading || isLoadingResume || isLoadingPdf) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground-secondary">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!aboutData || !resumeData) return null

  return (
    <div className="p-6 space-y-8">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-6">
        <AdminTitle
          title="포트폴리오 관리"
          description="개인 소개 정보와 이력서를 관리합니다."
        />
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 bg-background-secondary rounded-2xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
              }`}
            >
              About Me 관리
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('resumePdf')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'resumePdf'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
              }`}
            >
              이력서 PDF 관리
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('resumeForm')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'resumeForm'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
              }`}
            >
              이력서 양식 관리
            </motion.button>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'about' && (
              <>
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
              </>
            )}
            {activeTab === 'resumeForm' && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResumeSave}
                disabled={isSavingResume}
                className="bg-accent-blend text-primary-foreground hover:opacity-90 px-6 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {isSavingResume ? '저장 중...' : '이력서 저장'}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <>
          {isPreviewMode ? (
            // Preview Mode - Matching actual homepage layout
            <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Hero Section Preview */}
          <div className="bg-background rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-medium mb-6 text-center">홈페이지 Hero 섹션 미리보기</h3>
            
            {/* Hero Content Preview */}
            <div className="text-center space-y-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-background-secondary rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg border border-border">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">Dev</span>
                </div>
              </div>
              
              {/* Hero Title */}
              <h1 className="text-4xl md:text-5xl font-medium leading-tight">
                <span dangerouslySetInnerHTML={{ __html: processHtmlForGradientText(aboutData.heroTitle) }} />
              </h1>
              
              {/* Hero Subtitle */}
              <p className="text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
                {aboutData.heroSubtitle}
              </p>
              
              {/* Action Buttons Preview */}
              <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
                <div className="bg-accent-blend text-primary-foreground px-6 py-3 text-base rounded-md font-medium shadow-lg flex items-center gap-2">
                  <span>📥</span>
                  이력서 다운로드
                </div>
                <div className="bg-transparent text-foreground border border-border px-6 py-3 text-base rounded-md font-medium shadow-sm">
                  프로젝트 보기
                </div>
              </div>
            </div>
          </div>
          
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

              {/* Description Card (from basic info) */}
              <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
                <h3 className="text-xl font-medium mb-4">상세 설명</h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {aboutData.description}
                </p>
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
                <div className="mt-2 p-3 bg-accent-info/10 border border-accent-info/20 rounded-lg">
                  <p className="text-sm text-accent-info">
                    <strong>💡 그라데이션 텍스트 팁:</strong> Flutter와 Spring Boot 텍스트에 색상을 입히려면 다음과 같이 입력하세요:
                  </p>
                  <code className="text-xs bg-background mt-2 p-2 rounded block font-mono">
                    {`<span className="text-gradient-flutter">Flutter</span> &amp; <span className="text-gradient-spring">Spring Boot</span>`}
                  </code>
                </div>
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
        </>
      )}
      
      {/* Resume PDF Management Tab */}
      {activeTab === 'resumePdf' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Current Resume PDF Info */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-semibold mb-6">현재 이력서 PDF</h3>
            {resumePdfInfo ? (
              <div className="bg-background-secondary rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-lg">{resumePdfInfo.originalName}</h4>
                    <p className="text-sm text-foreground-secondary">
                      업로드 날짜: {new Date(resumePdfInfo.uploadDate).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      파일 크기: {(resumePdfInfo.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={resumePdfInfo.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2"
                  >
                    📄 미리보기
                  </motion.a>
                </div>
                <div className="text-sm text-accent-success">✅ 현재 활성화된 이력서입니다.</div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h4 className="text-lg font-medium mb-2">등록된 이력서가 없습니다</h4>
                <p className="text-foreground-secondary text-sm">
                  아래에서 PDF 파일을 업로드해주세요.
                </p>
              </div>
            )}
          </div>

          {/* PDF Upload Section */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-semibold mb-6">새 이력서 PDF 업로드</h3>
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-background-secondary'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-foreground-secondary">PDF를 업로드하는 중...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl">📁</div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">
                      PDF 파일을 여기에 드래그하거나 클릭하여 선택하세요
                    </h4>
                    <p className="text-foreground-secondary text-sm mb-4">
                      최대 10MB까지 업로드 가능합니다.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('pdf-upload')?.click()}
                      className="bg-accent-blend text-primary-foreground hover:opacity-90 px-6 py-3 rounded-2xl font-medium transition-all shadow-lg"
                    >
                      파일 선택
                    </motion.button>
                  </div>
                </div>
              )}
              
              {/* Hidden File Input */}
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Upload Instructions */}
            <div className="mt-6 p-4 bg-accent-info/10 border border-accent-info/20 rounded-2xl">
              <h5 className="font-medium text-accent-info mb-2">📋 업로드 안내</h5>
              <ul className="text-sm text-foreground-secondary space-y-1">
                <li>• PDF 파일만 업로드 가능합니다.</li>
                <li>• 파일 크기는 10MB 이하로 제한됩니다.</li>
                <li>• 새 파일을 업로드하면 기존 이력서가 자동으로 백업됩니다.</li>
                <li>• 업로드된 PDF는 즉시 홈페이지에 반영됩니다.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Resume Form Management Tab */}
      {activeTab === 'resumeForm' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Personal Information */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <h3 className="text-xl font-semibold mb-6">개인 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                  })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">이메일</label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                  })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">전화번호</label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">주소</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.address}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, address: e.target.value }
                  })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">요약</label>
                <textarea
                  rows={3}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                  })}
                  className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">경력 사항</h3>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={addWorkExperience}
                className="bg-accent-blend text-primary-foreground hover:opacity-90 px-4 py-2 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <Plus size={16} />
                경력 추가
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {resumeData.workExperiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-background-secondary rounded-2xl border border-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">회사명</label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => updateWorkExperience(experience.id, 'company', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">직책</label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) => updateWorkExperience(experience.id, 'position', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">시작일</label>
                      <input
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateWorkExperience(experience.id, 'startDate', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">종료일</label>
                      <input
                        type="month"
                        value={experience.endDate || ''}
                        onChange={(e) => updateWorkExperience(experience.id, 'endDate', e.target.value || null)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                        placeholder="현재 재직 시 비워두세요"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">업무 설명</label>
                    <textarea
                      rows={3}
                      value={experience.description}
                      onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                      className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeWorkExperience(experience.id)}
                      className="p-2 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">교육 사항</h3>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={addEducation}
                className="bg-accent-blend text-primary-foreground hover:opacity-90 px-4 py-2 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <Plus size={16} />
                교육 추가
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-background-secondary rounded-2xl border border-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">학교명</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">학위</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">전공</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">졸업일</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        className="w-full p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeEducation(edu.id)}
                      className="p-2 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}