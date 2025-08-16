import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore'
import { GitHubRepository } from '../../../../lib/types/portfolio'

export async function GET() {
  try {
    const githubReposCollection = collection(db, 'portfolio-github-repos')
    const q = query(githubReposCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Return default GitHub repos if none exist
      const defaultRepos: GitHubRepository[] = [
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
        }
      ]

      return NextResponse.json({
        success: true,
        data: defaultRepos,
        message: 'Default GitHub repositories retrieved'
      })
    }

    const repos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GitHubRepository[]

    return NextResponse.json({
      success: true,
      data: repos,
      message: 'GitHub repositories retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch GitHub repositories'
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

    const githubReposCollection = collection(db, 'portfolio-github-repos')
    const docRef = await addDoc(githubReposCollection, repoData)
    const newRepo = { id: docRef.id, ...repoData }

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