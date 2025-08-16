// Portfolio content management types

export interface AboutMeData {
  id: string
  title: string
  heroTitle: string
  heroSubtitle: string
  description: string
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
  order: number
  createdAt: string
  updatedAt: string
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