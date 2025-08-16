import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { AboutMeData } from '../../../../lib/types/portfolio'

export async function GET() {
  try {
    const aboutDoc = doc(db, 'portfolio', 'about')
    const docSnap = await getDoc(aboutDoc)
    
    if (!docSnap.exists()) {
      // Return default data if none exists
      const defaultData: AboutMeData = {
        id: 'about',
        title: 'About Me',
        heroTitle: '사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자',
        heroSubtitle: '모바일과 백엔드 개발의 경계를 넘나들며, 사용자 중심의 기술 솔루션을 설계하고 구현합니다.',
        description: '단순히 기능을 구현하는 것을 넘어, 사용자의 실제 문제를 이해하고 그 본질적 해결책을 찾는 것이 진정한 개발이라고 믿습니다.',
        philosophy: '기술은 도구이며, 목적은 사용자의 삶을 더 편리하고 가치있게 만드는 것입니다.',
        specialties: [
          { id: '1', name: 'Flutter 모바일 앱 개발', color: 'primary' },
          { id: '2', name: 'Spring Boot 백엔드 API 개발', color: 'accent-success' },
          { id: '3', name: 'Docker & Kubernetes 컨테이너 운영', color: 'accent-purple' },
          { id: '4', name: 'MSSQL 데이터베이스 설계', color: 'accent-warning' }
        ],
        isActive: true,
        updatedAt: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        data: defaultData,
        message: 'Default about data retrieved'
      })
    }

    const data = docSnap.data() as AboutMeData
    return NextResponse.json({
      success: true,
      data,
      message: 'About data retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch about data'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const aboutData: AboutMeData = {
      ...body,
      updatedAt: new Date().toISOString()
    }

    const aboutDoc = doc(db, 'portfolio', 'about')
    await setDoc(aboutDoc, aboutData)

    return NextResponse.json({
      success: true,
      data: aboutData,
      message: 'About data updated successfully'
    })
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update about data'
    }, { status: 500 })
  }
}