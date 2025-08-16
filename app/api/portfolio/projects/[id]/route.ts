import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../lib/firebase/config'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { PortfolioProject } from '../../../../../lib/types/portfolio'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectDoc = doc(db, 'portfolio-projects', params.id)
    const docSnap = await getDoc(projectDoc)
    
    if (!docSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 })
    }

    const project = { id: docSnap.id, ...docSnap.data() } as PortfolioProject
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch project'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const projectData: Partial<PortfolioProject> = {
      ...body,
      updatedAt: new Date().toISOString()
    }

    const projectDoc = doc(db, 'portfolio-projects', params.id)
    await updateDoc(projectDoc, projectData)
    
    const updatedDocSnap = await getDoc(projectDoc)
    const updatedProject = { id: updatedDocSnap.id, ...updatedDocSnap.data() } as PortfolioProject

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update project'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectDoc = doc(db, 'portfolio-projects', params.id)
    await deleteDoc(projectDoc)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete project'
    }, { status: 500 })
  }
}