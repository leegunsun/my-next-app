import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, doc, getDocs, setDoc, orderBy, query } from 'firebase/firestore'
import { SkillCategory } from '../../../../lib/types/portfolio'

// In-memory data store for skills
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
    const skillsCollection = collection(db, 'portfolio-skills')
    const q = query(skillsCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // If no data exists in Firestore, return default data
      const defaultData = getDefaultSkillsData()
      
      return NextResponse.json({
        success: true,
        data: defaultData,
        message: 'Default skills data retrieved (no data in database)'
      })
    }

    const skills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SkillCategory[]
    
    return NextResponse.json({
      success: true,
      data: skills,
      message: 'Skills retrieved successfully from database'
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    
    // Fallback to default data if Firebase fails
    const defaultData = getDefaultSkillsData()
    return NextResponse.json({
      success: true,
      data: defaultData,
      message: 'Default skills data retrieved (database error)'
    })
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

    // Clear existing data and save new data to Firestore
    const skillsCollection = collection(db, 'portfolio-skills')
    
    // Save each skill category to Firestore
    const savePromises = updatedData.map(skill => {
      const skillDocRef = doc(skillsCollection, skill.id)
      return setDoc(skillDocRef, skill)
    })
    
    await Promise.all(savePromises)

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Skills saved successfully to database'
    })
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save skills to database'
    }, { status: 500 })
  }
}