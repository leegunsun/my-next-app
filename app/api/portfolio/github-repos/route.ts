import { NextRequest, NextResponse } from 'next/server'
import { GitHubRepository } from '../../../../lib/types/portfolio'
import { fetchGitHubRepositories, checkGitHubAPIHealth } from '../../../../lib/utils/github-api'
import { saveGitHubRepositories, loadGitHubRepositories, checkFirestoreAvailability } from '../../../../lib/firebase/github-repos'

// In-memory cache for performance (backed by Firestore for persistence)
let githubReposDataStore: GitHubRepository[] | null = null
let lastFetchTime: number = 0
let lastFirestoreSync: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache
const FIRESTORE_SYNC_INTERVAL = 1 * 60 * 1000 // 1 minute sync interval

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
    showOnHomepage: true, // Featured repository
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
    showOnHomepage: true, // Featured repository
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
    showOnHomepage: true, // Featured repository
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
    showOnHomepage: false, // Not featured on homepage
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
    showOnHomepage: false, // Not featured on homepage
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
    const homepageOnly = searchParams.get('homepage') === 'true' // Filter for homepage display only
    
    const now = Date.now()
    
    // Check if we should sync with Firestore first
    const shouldSyncFirestore = !githubReposDataStore || (now - lastFirestoreSync) > FIRESTORE_SYNC_INTERVAL
    
    if (shouldSyncFirestore) {
      try {
        const firestoreData = await loadGitHubRepositories()
        if (firestoreData.success && firestoreData.repositories.length > 0) {
          // Preserve existing non-Firestore data if available
          const existingRepos: { [key: string]: GitHubRepository } = {}
          if (githubReposDataStore) {
            githubReposDataStore.forEach(repo => {
              existingRepos[repo.name] = repo
            })
          }
          
          // Merge Firestore data with existing data, preserving Firestore settings
          const mergedData = firestoreData.repositories.map(firestoreRepo => {
            const existing = existingRepos[firestoreRepo.name]
            return existing ? {
              ...existing, // Keep GitHub API metadata (stars, forks, etc.)
              ...firestoreRepo, // Override with Firestore settings
              updatedAt: firestoreRepo.updatedAt // Use Firestore update time for admin settings
            } : firestoreRepo
          })
          
          githubReposDataStore = mergedData
          lastFirestoreSync = now
          console.log('🔄 Synced with Firestore:', mergedData.length, 'repositories')
        }
      } catch (error) {
        console.warn('⚠️ Failed to sync with Firestore, continuing with cache:', error)
      }
    }
    
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
            // Preserve existing showOnHomepage settings from Firestore/cache
            const existingSettings: { [key: string]: { showOnHomepage: boolean; order: number } } = {}
            
            if (githubReposDataStore) {
              githubReposDataStore.forEach(repo => {
                existingSettings[repo.name] = {
                  showOnHomepage: repo.showOnHomepage,
                  order: repo.order
                }
              })
            }
            
            // Apply preserved settings to new GitHub data
            const mergedRepos = realRepos.map(repo => ({
              ...repo,
              showOnHomepage: existingSettings[repo.name]?.showOnHomepage ?? repo.showOnHomepage,
              order: existingSettings[repo.name]?.order ?? repo.order
            }))
            
            githubReposDataStore = mergedRepos
            lastFetchTime = now
            
            // Filter for homepage display if requested
            let responseData = mergedRepos
            if (homepageOnly) {
              responseData = mergedRepos.filter(repo => repo.showOnHomepage && repo.isActive)
                .sort((a, b) => a.order - b.order)
            }
            
            return NextResponse.json({
              success: true,
              data: responseData,
              message: `GitHub repositories retrieved successfully from API (${mergedRepos.length} repos)${homepageOnly ? ', filtered for homepage' : ''}`,
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
    
    // Return Firestore data, cached data, or default data
    let data = githubReposDataStore || getDefaultGitHubReposData()
    let dataSource = 'default'
    
    if (githubReposDataStore) {
      dataSource = 'firestore-cache'
    }
    
    // Filter for homepage display if requested
    if (homepageOnly) {
      data = data.filter(repo => repo.showOnHomepage && repo.isActive)
        .sort((a, b) => a.order - b.order) // Sort by order for homepage display
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: `GitHub repositories retrieved from ${dataSource}${homepageOnly ? ' (homepage only)' : ''}`,
      source: dataSource,
      lastUpdated: lastFetchTime > 0 ? new Date(lastFetchTime).toISOString() : null
    })
  } catch (error) {
    console.error('Error in GET /api/portfolio/github-repos:', error)
    return NextResponse.json({
      success: false,
      message: 'GitHub 저장소 데이터를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요.',
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
      message: 'GitHub 저장소가 성공적으로 추가되었습니다.'
    })
  } catch (error) {
    console.error('Error creating GitHub repository:', error)
    return NextResponse.json({
      success: false,
      message: 'GitHub 저장소 생성 중 오류가 발생했습니다. 다시 시도해 주세요.'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedData: GitHubRepository[] = body

    // Validate data structure
    if (!Array.isArray(updatedData)) {
      return NextResponse.json({
        success: false,
        message: '잘못된 데이터 형식입니다. 저장소 배열이 필요합니다.'
      }, { status: 400 })
    }

    // Check if Firestore is available
    const isFirestoreAvailable = await checkFirestoreAvailability()
    
    if (isFirestoreAvailable) {
      // Save to Firestore
      const saveResult = await saveGitHubRepositories(updatedData)
      
      if (saveResult.success) {
        // Update in-memory cache after successful Firestore save
        githubReposDataStore = updatedData
        lastFirestoreSync = Date.now()
        
        return NextResponse.json({
          success: true,
          data: updatedData,
          message: 'Firebase에 성공적으로 저장되었습니다! 페이지를 새로고침해도 데이터가 유지됩니다.',
          source: 'firestore'
        })
      } else {
        // Firestore save failed, but update cache anyway as fallback
        githubReposDataStore = updatedData
        
        return NextResponse.json({
          success: false,
          data: updatedData,
          message: `Firebase 저장에 실패했지만 임시 캐시에는 저장되었습니다. 서버 재시작 시 데이터가 손실될 수 있습니다. (오류: ${saveResult.error})`,
          source: 'cache-only'
        }, { status: 207 }) // 207 Multi-Status: partial success
      }
    } else {
      // Firestore not available, save to cache only
      githubReposDataStore = updatedData
      
      return NextResponse.json({
        success: false,
        data: updatedData,
        message: 'Firebase에 연결할 수 없어 임시 캐시에만 저장되었습니다. 서버 재시작 시 데이터가 손실될 수 있습니다.',
        source: 'cache-only'
      }, { status: 207 }) // 207 Multi-Status: partial success
    }
  } catch (error) {
    console.error('Error updating GitHub repositories:', error)
    return NextResponse.json({
      success: false,
      message: `GitHub 저장소 업데이트 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}