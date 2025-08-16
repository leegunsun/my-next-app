import { NextRequest, NextResponse } from 'next/server'
import { GitHubRepository } from '../../../../lib/types/portfolio'
import { fetchGitHubRepositories, checkGitHubAPIHealth } from '../../../../lib/utils/github-api'

// In-memory storage for development (in production, you'd use a proper database)
let githubReposDataStore: GitHubRepository[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// GitHub username to fetch repositories from
const GITHUB_USERNAME = 'leegunsun'

// Default GitHub repositories data
const getDefaultGitHubReposData = (): GitHubRepository[] => [
  {
    id: 'flutter-ecommerce',
    name: 'flutter-ecommerce-app',
    description: 'Flutter로 구현한 크로스플랫폼 전자상거래 앱. Provider 패턴과 API 연동으로 상태 관리 최적화.',
    language: 'Dart',
    stars: 42,
    forks: 8,
    lastUpdated: '2024-01-15',
    url: 'https://github.com/developer/flutter-ecommerce-app',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'spring-notification',
    name: 'spring-boot-notification-api',
    description: 'Spring Boot와 WebSocket을 활용한 실시간 알림 시스템. Redis 캐싱과 JWT 인증 구현.',
    language: 'Kotlin',
    stars: 35,
    forks: 12,
    lastUpdated: '2024-01-10',
    url: 'https://github.com/developer/spring-boot-notification-api',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'k8s-deployment',
    name: 'kubernetes-deployment-configs',
    description: 'Production 환경을 위한 Kubernetes 배포 설정 파일과 CI/CD 파이프라인 구성.',
    language: 'Docker',
    stars: 28,
    forks: 6,
    lastUpdated: '2024-01-08',
    url: 'https://github.com/developer/kubernetes-deployment-configs',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'react-portfolio',
    name: 'react-portfolio-website',
    description: 'Next.js와 TypeScript로 구현한 반응형 포트폴리오 웹사이트. Tailwind CSS와 Framer Motion 적용.',
    language: 'TypeScript',
    stars: 18,
    forks: 4,
    lastUpdated: '2024-01-05',
    url: 'https://github.com/developer/react-portfolio-website',
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'microservices-architecture',
    name: 'microservices-spring-cloud',
    description: 'Spring Cloud를 활용한 마이크로서비스 아키텍처 구현. API Gateway, Service Discovery 포함.',
    language: 'Java',
    stars: 52,
    forks: 15,
    lastUpdated: '2023-12-28',
    url: 'https://github.com/developer/microservices-spring-cloud',
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    const useReal = searchParams.get('real') !== 'false' // Default to true
    
    const now = Date.now()
    const shouldFetchFromAPI = useReal && (
      forceRefresh || 
      !githubReposDataStore || 
      (now - lastFetchTime) > CACHE_DURATION
    )
    
    if (shouldFetchFromAPI) {
      try {
        // Check GitHub API health first
        const isAPIHealthy = await checkGitHubAPIHealth()
        
        if (isAPIHealthy) {
          const realRepos = await fetchGitHubRepositories(GITHUB_USERNAME)
          
          if (realRepos.length > 0) {
            githubReposDataStore = realRepos
            lastFetchTime = now
            
            return NextResponse.json({
              success: true,
              data: realRepos,
              message: `GitHub repositories retrieved successfully from API (${realRepos.length} repos)`,
              source: 'github-api',
              lastUpdated: new Date().toISOString()
            })
          }
        }
        
        // If API fetch failed, fall back to cached or default data
        console.warn('GitHub API fetch failed, falling back to cached/default data')
      } catch (error) {
        console.error('Error fetching from GitHub API:', error)
        // Continue to fallback
      }
    }
    
    // Return cached data or default data
    const data = githubReposDataStore || getDefaultGitHubReposData()
    
    return NextResponse.json({
      success: true,
      data,
      message: `GitHub repositories retrieved from ${githubReposDataStore ? 'cache' : 'default data'}`,
      source: githubReposDataStore ? 'cache' : 'default',
      lastUpdated: lastFetchTime > 0 ? new Date(lastFetchTime).toISOString() : null
    })
  } catch (error) {
    console.error('Error in GET /api/portfolio/github-repos:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch GitHub repositories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const repoData: Omit<GitHubRepository, 'id'> = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Generate new ID and create repository
    const newRepo: GitHubRepository = {
      id: Date.now().toString(),
      ...repoData
    }

    // Initialize store if needed and add new repository
    if (!githubReposDataStore) {
      githubReposDataStore = getDefaultGitHubReposData()
    }
    githubReposDataStore.push(newRepo)

    return NextResponse.json({
      success: true,
      data: newRepo,
      message: 'GitHub repository created successfully'
    })
  } catch (error) {
    console.error('Error creating GitHub repository:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create GitHub repository'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedData: GitHubRepository[] = body

    // Store the updated GitHub repositories data
    githubReposDataStore = updatedData

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'GitHub repositories updated successfully'
    })
  } catch (error) {
    console.error('Error updating GitHub repositories:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update GitHub repositories'
    }, { status: 500 })
  }
}