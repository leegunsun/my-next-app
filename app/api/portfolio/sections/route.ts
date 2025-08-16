import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, doc, getDoc, setDoc, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore'
import { PortfolioSection, PortfolioSectionSettings } from '../../../../lib/types/portfolio'

// Default portfolio sections
const getDefaultSections = (): PortfolioSection[] => [
  {
    id: 'about',
    title: 'About Me 관리',
    description: '개인 소개, 전문 분야, 개발 철학 관리',
    icon: 'User',
    color: 'bg-primary',
    href: '/admin/portfolio/about',
    homeSection: 'about',
    isActive: true,
    showInNavigation: true,
    showInAdminGrid: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'projects',
    title: '포트폴리오 프로젝트',
    description: '프로젝트 목록 및 상세 정보 관리',
    icon: 'Target',
    color: 'bg-accent-success',
    href: '/admin/portfolio/projects',
    homeSection: 'portfolio',
    isActive: true,
    showInNavigation: true,
    showInAdminGrid: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skills',
    title: '기술 스택 관리',
    description: '기술 카테고리와 숙련도 관리',
    icon: 'Settings',
    color: 'bg-accent-purple',
    href: '/admin/portfolio/skills',
    homeSection: 'skills',
    isActive: true,
    showInNavigation: true,
    showInAdminGrid: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'code-examples',
    title: '코드 예제 관리',
    description: '코드 스니펫과 예제 관리',
    icon: 'Code',
    color: 'bg-accent-warning',
    href: '/admin/portfolio/code-examples',
    homeSection: 'code-examples',
    isActive: true,
    showInNavigation: true,
    showInAdminGrid: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'github-repos',
    title: 'GitHub 저장소',
    description: 'GitHub 레포지토리 정보 관리',
    icon: 'Github',
    color: 'bg-accent-info',
    href: '/admin/portfolio/github-repos',
    homeSection: 'code-examples', // GitHub repos are part of code examples section
    isActive: true,
    showInNavigation: false, // Not shown separately in navigation
    showInAdminGrid: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const getDefaultSettings = (): PortfolioSectionSettings => ({
  navigationOrder: ['about', 'projects', 'skills', 'code-examples'],
  enabledSections: ['about', 'projects', 'skills', 'code-examples', 'github-repos'],
  customSections: [],
  lastUpdated: new Date().toISOString()
})

// GET - Retrieve all sections and settings
export async function GET() {
  try {
    // Get section settings
    const settingsDocRef = doc(db, 'portfolio-section-settings', 'main')
    const settingsDoc = await getDoc(settingsDocRef)
    
    let settings: PortfolioSectionSettings
    if (!settingsDoc.exists()) {
      settings = getDefaultSettings()
    } else {
      settings = settingsDoc.data() as PortfolioSectionSettings
    }

    // Get all sections from collection
    const sectionsCollection = collection(db, 'portfolio-sections')
    const q = query(sectionsCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    let sections: PortfolioSection[]
    if (snapshot.empty) {
      // Initialize with default sections
      sections = getDefaultSections()
      
      // Save default sections to Firestore
      const savePromises = sections.map(section => {
        const sectionDocRef = doc(sectionsCollection, section.id)
        return setDoc(sectionDocRef, section)
      })
      await Promise.all(savePromises)
      
      // Save default settings
      await setDoc(settingsDocRef, settings)
    } else {
      sections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioSection[]
    }

    return NextResponse.json({
      success: true,
      data: {
        sections,
        settings
      },
      message: 'Portfolio sections retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching portfolio sections:', error)
    
    // Fallback to default data
    return NextResponse.json({
      success: true,
      data: {
        sections: getDefaultSections(),
        settings: getDefaultSettings()
      },
      message: 'Default portfolio sections retrieved (database error)'
    })
  }
}

// PUT - Update sections and settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { sections, settings } = body

    if (!sections || !settings) {
      return NextResponse.json({
        success: false,
        message: 'Sections and settings are required'
      }, { status: 400 })
    }

    // Update sections
    const sectionsCollection = collection(db, 'portfolio-sections')
    const sectionPromises = sections.map((section: PortfolioSection) => {
      const sectionData = {
        ...section,
        updatedAt: new Date().toISOString()
      }
      const sectionDocRef = doc(sectionsCollection, section.id)
      return setDoc(sectionDocRef, sectionData)
    })

    // Update settings
    const settingsData: PortfolioSectionSettings = {
      ...settings,
      lastUpdated: new Date().toISOString()
    }
    const settingsDocRef = doc(db, 'portfolio-section-settings', 'main')
    const settingsPromise = setDoc(settingsDocRef, settingsData)

    // Execute all updates
    await Promise.all([...sectionPromises, settingsPromise])

    return NextResponse.json({
      success: true,
      data: {
        sections,
        settings: settingsData
      },
      message: 'Portfolio sections updated successfully'
    })
  } catch (error) {
    console.error('Error updating portfolio sections:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update portfolio sections'
    }, { status: 500 })
  }
}

// POST - Add new custom section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sectionData: Omit<PortfolioSection, 'id' | 'createdAt' | 'updatedAt'> = body

    // Validate required fields
    if (!sectionData.title || !sectionData.description || !sectionData.icon) {
      return NextResponse.json({
        success: false,
        message: 'Title, description, and icon are required'
      }, { status: 400 })
    }

    // Generate new section
    const timestamp = Date.now()
    const newSection: PortfolioSection = {
      id: `custom-${timestamp}`,
      ...sectionData,
      href: sectionData.href || `/admin/portfolio/custom/${timestamp}`,
      isActive: sectionData.isActive !== undefined ? sectionData.isActive : true,
      showInNavigation: sectionData.showInNavigation !== undefined ? sectionData.showInNavigation : true,
      showInAdminGrid: sectionData.showInAdminGrid !== undefined ? sectionData.showInAdminGrid : true,
      order: sectionData.order || 99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save to Firestore
    const sectionsCollection = collection(db, 'portfolio-sections')
    const sectionDocRef = doc(sectionsCollection, newSection.id)
    await setDoc(sectionDocRef, newSection)

    return NextResponse.json({
      success: true,
      data: newSection,
      message: 'Custom section created successfully'
    })
  } catch (error) {
    console.error('Error creating custom section:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create custom section'
    }, { status: 500 })
  }
}

// DELETE - Remove custom section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('id')
    
    if (!sectionId) {
      return NextResponse.json({
        success: false,
        message: 'Section ID is required'
      }, { status: 400 })
    }

    // Only allow deletion of custom sections
    if (!sectionId.startsWith('custom-')) {
      return NextResponse.json({
        success: false,
        message: 'Only custom sections can be deleted'
      }, { status: 403 })
    }

    // Check if section exists before deletion
    const sectionsCollection = collection(db, 'portfolio-sections')
    const sectionDocRef = doc(sectionsCollection, sectionId)
    const sectionDoc = await getDoc(sectionDocRef)
    
    if (!sectionDoc.exists()) {
      return NextResponse.json({
        success: false,
        message: 'Section not found'
      }, { status: 404 })
    }

    // Delete from Firestore
    await deleteDoc(sectionDocRef)

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete section'
    }, { status: 500 })
  }
}