// Portfolio content management types

export interface AboutMeData {
  id: string
  title: string
  heroTitle: string
  heroSubtitle: string
  philosophy: string
  specialties: Array<{
    id: string
    name: string
    color: string
  }>
  profileImage?: string
  isActive: boolean
  updatedAt: string
}

export interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  color: string
  isActive: boolean
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  tags: string[]
  icon: string
  iconBg: string
  liveUrl?: string
  githubUrl?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface SkillCategory {
  id: string
  name: string
  color: string
  skills: Array<{
    id: string
    name: string
    percentage: number
    color: string
  }>
  isActive: boolean
  order: number
}

export interface CodeExample {
  id: string
  title: string
  language: string
  code: string
  description?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface GitHubRepository {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  url: string
  isActive: boolean
  showOnHomepage: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Portfolio Section Management Types
export interface PortfolioSection {
  id: string
  title: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind CSS class
  href: string
  homeSection: string // Home page section ID (about, portfolio, skills, code-examples, contact)
  isActive: boolean
  showInNavigation: boolean
  showInAdminGrid: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface PortfolioSectionSettings {
  navigationOrder: string[] // Array of section IDs in display order
  enabledSections: string[] // Array of active section IDs
  customSections: PortfolioSection[] // User-added custom sections
  lastUpdated: string
}

export interface PortfolioContent {
  aboutMe: AboutMeData
  timeline: TimelineItem[]
  projects: PortfolioProject[]
  skillCategories: SkillCategory[]
  codeExamples: CodeExample[]
  githubRepos: GitHubRepository[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  message: string
}

// Resume Management Types
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  address: string
  linkedin?: string
  github?: string
  website?: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string // YYYY-MM format
  endDate: string | null // null for current job
  description: string
  achievements: string[]
  technologies: string[]
  isActive: boolean
  order: number
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string // YYYY-MM format
  endDate: string // YYYY-MM format
  gpa?: string
  description?: string
  isActive: boolean
  order: number
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string // YYYY-MM format
  expiryDate?: string // YYYY-MM format
  credentialId?: string
  credentialUrl?: string
  description?: string
  isActive: boolean
  order: number
}

export interface Language {
  id: string
  name: string
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic'
  description?: string
  isActive: boolean
  order: number
}

export interface ResumeData {
  id: string
  personalInfo: PersonalInfo
  workExperiences: WorkExperience[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
  templateStyle: 'modern' | 'classic' | 'minimal'
  isActive: boolean
  createdAt: string
  updatedAt: string
}