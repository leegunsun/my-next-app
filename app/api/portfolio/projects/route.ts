import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, getDocs, addDoc, orderBy, query, Timestamp } from 'firebase/firestore'
import { PortfolioProject } from '../../../../lib/types/portfolio'

export async function GET() {
  try {
    const projectsCollection = collection(db, 'portfolio-projects')
    const q = query(projectsCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Return default projects if none exist
      const defaultProjects: PortfolioProject[] = [
        {
          id: 'project-1',
          title: 'E-Commerce 모바일 앱',
          description: 'Flutter로 개발한 크로스플랫폼 쇼핑 앱. Spring Boot API와 연동하여 실시간 결제 처리 및 주문 관리 시스템 구현.',
          tags: ['Flutter', 'Dart', 'REST API'],
          icon: 'Flutter',
          iconBg: 'bg-primary',
          liveUrl: '#',
          githubUrl: '#',
          isActive: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'project-2',
          title: '실시간 알림 시스템',
          description: 'Spring Boot와 WebSocket을 활용한 실시간 푸시 알림 시스템. Redis 캐싱으로 성능 최적화 구현.',
          tags: ['Spring Boot', 'Kotlin', 'WebSocket'],
          icon: 'Spring',
          iconBg: 'bg-accent-success',
          liveUrl: '#',
          githubUrl: '#',
          isActive: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'project-3',
          title: '컨테이너 오케스트레이션',
          description: 'Docker 컨테이너화 및 Kubernetes 클러스터 구성. CI/CD 파이프라인으로 자동 배포 구현.',
          tags: ['Docker', 'Kubernetes', 'CI/CD'],
          icon: 'K8s',
          iconBg: 'bg-accent-purple',
          liveUrl: '#',
          githubUrl: '#',
          isActive: true,
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      return NextResponse.json({
        success: true,
        data: defaultProjects,
        message: 'Default projects retrieved'
      })
    }

    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PortfolioProject[]

    return NextResponse.json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        message: 'Title and description are required'
      }, { status: 400 })
    }

    const projectData = {
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      icon: body.icon || 'Project',
      iconBg: body.iconBg || 'bg-primary',
      liveUrl: body.liveUrl || '',
      githubUrl: body.githubUrl || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 99,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const projectsCollection = collection(db, 'portfolio-projects')
    const docRef = await addDoc(projectsCollection, projectData)
    
    // Return the created project with the generated ID
    const newProject = { 
      id: docRef.id, 
      ...projectData,
      // Convert Timestamp to ISO string for response
      createdAt: projectData.createdAt.toDate().toISOString(),
      updatedAt: projectData.updatedAt.toDate().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    })
  } catch (error: unknown) {
    console.error('Error creating project:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      success: false,
      message: `Failed to create project: ${errorMessage}`
    }, { status: 500 })
  }
}

