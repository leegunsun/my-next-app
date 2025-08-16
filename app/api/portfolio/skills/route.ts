import { NextRequest, NextResponse } from 'next/server'
import { SkillCategory } from '../../../../lib/types/portfolio'

// In-memory storage for development (in production, you'd use a proper database)
let skillsDataStore: SkillCategory[] | null = null

// Default skills data
const getDefaultSkillsData = (): SkillCategory[] => [
  {
    id: 'frontend-mobile',
    name: 'Frontend & Mobile',
    color: 'primary',
    skills: [
      { id: 'flutter', name: 'Flutter', percentage: 90, color: 'primary' },
      { id: 'dart', name: 'Dart', percentage: 85, color: 'primary' },
      { id: 'react', name: 'React/Next.js', percentage: 75, color: 'primary' }
    ],
    isActive: true,
    order: 1
  },
  {
    id: 'backend-database',
    name: 'Backend & Database',
    color: 'success',
    skills: [
      { id: 'spring-boot', name: 'Spring Boot', percentage: 85, color: 'success' },
      { id: 'kotlin', name: 'Kotlin', percentage: 80, color: 'success' },
      { id: 'mssql', name: 'MSSQL', percentage: 75, color: 'success' }
    ],
    isActive: true,
    order: 2
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud',
    color: 'purple',
    skills: [
      { id: 'docker', name: 'Docker', percentage: 80, color: 'purple' },
      { id: 'kubernetes', name: 'Kubernetes', percentage: 70, color: 'purple' },
      { id: 'github-actions', name: 'GitHub Actions', percentage: 75, color: 'purple' }
    ],
    isActive: true,
    order: 3
  }
]

export async function GET() {
  try {
    // If no data exists, return default data
    const data = skillsDataStore || getDefaultSkillsData()
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Skills retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skills'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const skillData: Omit<SkillCategory, 'id'> = body
    
    // Generate new ID and create skill category
    const newSkillCategory: SkillCategory = {
      id: Date.now().toString(),
      ...skillData
    }

    // Initialize store if needed and add new category
    if (!skillsDataStore) {
      skillsDataStore = getDefaultSkillsData()
    }
    skillsDataStore.push(newSkillCategory)

    return NextResponse.json({
      success: true,
      data: newSkillCategory,
      message: 'Skill category created successfully'
    })
  } catch (error) {
    console.error('Error creating skill category:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create skill category'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedData: SkillCategory[] = body

    // Store the updated skills data
    skillsDataStore = updatedData

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Skills updated successfully'
    })
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update skills'
    }, { status: 500 })
  }
}