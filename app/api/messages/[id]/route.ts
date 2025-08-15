import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'

// PUT - Update message status or admin notes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, adminNotes } = await request.json()
    const { id: messageId } = await params

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const updateData: { status?: string; adminNotes?: string } = {}
    
    if (status) {
      if (!['unread', 'read', 'replied'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    await updateDoc(doc(db, 'messages', messageId), updateData)

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully'
    })

  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: messageId } = await params

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Check if message exists
    const messageDoc = await getDoc(doc(db, 'messages', messageId))
    if (!messageDoc.exists()) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    await deleteDoc(doc(db, 'messages', messageId))

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}