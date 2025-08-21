import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ResumeData } from '../../../../lib/types/portfolio'

// Default resume data
const getDefaultResumeData = (): ResumeData => ({
  id: 'default',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  workExperiences: [
    {
      id: '1',
      company: 'Example Company',
      position: 'Senior Flutter Developer',
      startDate: '2023-01',
      endDate: null,
      description: 'Flutter 기반 크로스플랫폼 모바일 앱 개발 및 Spring Boot API 연동',
      achievements: [
        '앱 성능 30% 향상',
        '사용자 만족도 95% 달성',
        'CI/CD 파이프라인 구축'
      ],
      technologies: ['Flutter', 'Dart', 'Spring Boot', 'REST API'],
      isActive: true,
      order: 1
    },
    {
      id: '2',
      company: 'Tech Solutions',
      position: 'Backend Developer',
      startDate: '2022-01',
      endDate: '2022-12',
      description: 'Spring Boot, Kotlin 기반 RESTful API 설계 및 구현',
      achievements: [
        'API 응답속도 40% 개선',
        '마이크로서비스 아키텍처 도입',
        '테스트 커버리지 90% 달성'
      ],
      technologies: ['Spring Boot', 'Kotlin', 'PostgreSQL', 'Docker'],
      isActive: true,
      order: 2
    }
  ],
  education: [
    {
      id: '1',
      institution: '한국대학교',
      degree: '학사',
      field: '컴퓨터공학과',
      startDate: '2018-03',
      endDate: '2022-02',
      gpa: '3.8/4.5',
      description: '소프트웨어 공학, 데이터베이스, 알고리즘 전공',
      isActive: true,
      order: 1
    }
  ],
  certifications: [
    {
      id: '1',
      name: '정보처리기사',
      issuer: '한국산업인력공단',
      issueDate: '2022-06',
      credentialId: 'IT-12345678',
      description: '정보시스템 개발 및 운영 관련 자격증',
      isActive: true,
      order: 1
    }
  ],
  languages: [
    {
      id: '1',
      name: '한국어',
      proficiency: 'native',
      description: '모국어',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      name: '영어',
      proficiency: 'intermediate',
      description: '업무 상 의사소통 가능',
      isActive: true,
      order: 2
    }
  ],
  templateStyle: 'modern',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

export async function GET() {
  try {
    const resumeDocRef = doc(db, 'portfolio-resume', 'resume')
    const resumeDoc = await getDoc(resumeDocRef)
    
    if (!resumeDoc.exists()) {
      // If no data exists in Firestore, return default data
      const defaultData = getDefaultResumeData()
      
      return NextResponse.json({
        success: true,
        data: defaultData,
        message: 'Default resume data retrieved (no data in database)'
      })
    }

    const data = resumeDoc.data() as ResumeData
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Resume data retrieved successfully from database'
    })
  } catch (error) {
    console.error('Error fetching resume data:', error)
    
    // Fallback to default data if Firebase fails
    const defaultData = getDefaultResumeData()
    return NextResponse.json({
      success: true,
      data: defaultData,
      message: 'Default resume data retrieved (database error)'
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const resumeData: ResumeData = {
      ...body,
      id: 'resume',
      updatedAt: new Date().toISOString()
    }

    // Save to Firestore
    const resumeDocRef = doc(db, 'portfolio-resume', 'resume')
    await setDoc(resumeDocRef, resumeData)

    return NextResponse.json({
      success: true,
      data: resumeData,
      message: 'Resume data saved successfully to database'
    })
  } catch (error) {
    console.error('Error updating resume data:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save resume data to database'
    }, { status: 500 })
  }
}