import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, doc, getDoc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'

interface CustomSectionContent {
  id: string
  sectionId: string
  title: string
  content: string
  contentType: 'text' | 'markdown' | 'rich-text'
  metadata: {
    tags: string[]
    featured: boolean
    priority: number
    lastModified: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// GET - Retrieve custom section content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')
    
    if (!sectionId) {
      return NextResponse.json({
        success: false,
        message: 'Section ID is required'
      }, { status: 400 })
    }

    // Get content from Firestore
    const contentCollection = collection(db, 'custom-section-content')
    const q = query(contentCollection, where('sectionId', '==', sectionId))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'Content not found',
        data: null
      }, { status: 404 })
    }

    const contentDoc = snapshot.docs[0]
    const content = {
      id: contentDoc.id,
      ...contentDoc.data()
    } as CustomSectionContent

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Custom content retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching custom content:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch custom content'
    }, { status: 500 })
  }
}

// POST - Create or update custom section content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const contentData: CustomSectionContent = body

    // Validate required fields
    if (!contentData.sectionId || !contentData.title) {
      return NextResponse.json({
        success: false,
        message: 'Section ID and title are required'
      }, { status: 400 })
    }

    // Check if content already exists for this section
    const contentCollection = collection(db, 'custom-section-content')
    const q = query(contentCollection, where('sectionId', '==', contentData.sectionId))
    const snapshot = await getDocs(q)

    let docRef
    let isUpdate = false

    if (!snapshot.empty) {
      // Update existing content
      docRef = snapshot.docs[0].ref
      isUpdate = true
    } else {
      // Create new content
      docRef = doc(contentCollection, contentData.id || `content-${Date.now()}`)
    }

    const finalContentData: CustomSectionContent = {
      ...contentData,
      updatedAt: new Date().toISOString(),
      ...(isUpdate ? {} : { createdAt: new Date().toISOString() })
    }

    await setDoc(docRef, finalContentData)

    return NextResponse.json({
      success: true,
      data: finalContentData,
      message: isUpdate ? 'Custom content updated successfully' : 'Custom content created successfully'
    })
  } catch (error) {
    console.error('Error saving custom content:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save custom content'
    }, { status: 500 })
  }
}

// PUT - Update custom section content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Content ID is required'
      }, { status: 400 })
    }

    const contentCollection = collection(db, 'custom-section-content')
    const docRef = doc(contentCollection, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: 'Content not found'
      }, { status: 404 })
    }

    const updatedData = {
      ...docSnap.data(),
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    await setDoc(docRef, updatedData)

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Custom content updated successfully'
    })
  } catch (error) {
    console.error('Error updating custom content:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update custom content'
    }, { status: 500 })
  }
}

// DELETE - Remove custom section content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')
    const contentId = searchParams.get('id')
    
    if (!sectionId && !contentId) {
      return NextResponse.json({
        success: false,
        message: 'Section ID or Content ID is required'
      }, { status: 400 })
    }

    const contentCollection = collection(db, 'custom-section-content')
    
    if (contentId) {
      // Delete by content ID
      const docRef = doc(contentCollection, contentId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        return NextResponse.json({
          success: false,
          message: 'Content not found'
        }, { status: 404 })
      }

      await deleteDoc(docRef)
    } else if (sectionId) {
      // Delete by section ID
      const q = query(contentCollection, where('sectionId', '==', sectionId))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return NextResponse.json({
          success: false,
          message: 'Content not found'
        }, { status: 404 })
      }

      // Delete all content for this section
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
    }

    return NextResponse.json({
      success: true,
      message: 'Custom content deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting custom content:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete custom content'
    }, { status: 500 })
  }
}