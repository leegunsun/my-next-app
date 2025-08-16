import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, getDocs, addDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore'
import { SkillCategory } from '../../../../lib/types/portfolio'

export async function GET() {
  try {
    const skillsCollection = collection(db, 'portfolio-skills')
    const q = query(skillsCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Return default skills if none exist
      const defaultSkills: SkillCategory[] = [
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

      return NextResponse.json({
        success: true,
        data: defaultSkills,
        message: 'Default skills retrieved'
      })
    }

    const skills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SkillCategory[]

    return NextResponse.json({
      success: true,
      data: skills,
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

    const skillsCollection = collection(db, 'portfolio-skills')
    const docRef = await addDoc(skillsCollection, skillData)
    const newSkillCategory = { id: docRef.id, ...skillData }

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
    const { id, ...skillData } = body

    const skillDoc = doc(db, 'portfolio-skills', id)
    await updateDoc(skillDoc, skillData)
    
    const updatedDocSnap = await getDocs(query(collection(db, 'portfolio-skills')))
    const updatedSkillCategory = updatedDocSnap.docs.find(d => d.id === id)
    
    if (!updatedSkillCategory) {
      throw new Error('Updated skill category not found')
    }

    return NextResponse.json({
      success: true,
      data: { id: updatedSkillCategory.id, ...updatedSkillCategory.data() } as SkillCategory,
      message: 'Skill category updated successfully'
    })
  } catch (error) {
    console.error('Error updating skill category:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update skill category'
    }, { status: 500 })
  }
}