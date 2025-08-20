import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, getDocs, orderBy, query, Timestamp, limit, startAfter, where, getCountFromServer, doc, getDoc } from 'firebase/firestore'
import { sendFCMNotification } from '@/lib/firebase/fcm'

export interface Message {
  id?: string
  name: string
  email: string
  message: string
  createdAt: Timestamp
  status: 'unread' | 'read' | 'replied'
  adminNotes?: string
}

// POST - Create new message
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: Timestamp.now(),
      status: 'unread'
    }

    const docRef = await addDoc(collection(db, 'messages'), messageData)
    
    // Send FCM notification to admin
    try {
      await sendFCMNotification({
        title: '새 메시지 도착',
        body: `${name}님으로부터 새 메시지가 도착했습니다.`,
        data: {
          type: 'new_message',
          messageId: docRef.id,
          senderName: name,
          senderEmail: email
        }
      })
    } catch (fcmError) {
      console.error('FCM notification failed:', fcmError)
      // Don't fail the message creation if FCM fails
    }

    return NextResponse.json({
      success: true,
      messageId: docRef.id,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET - Get paginated messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status') || 'all'
    const lastDocId = searchParams.get('lastDocId')
    
    // Validate pagination parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    let messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    )

    // Add status filter if specified
    if (statusFilter !== 'all') {
      messagesQuery = query(
        collection(db, 'messages'),
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc')
      )
    }

    // Add pagination
    if (lastDocId && page > 1) {
      // Get the last document for cursor-based pagination
      const lastDocRef = doc(db, 'messages', lastDocId)
      const lastDocSnap = await getDoc(lastDocRef)
      if (lastDocSnap.exists()) {
        messagesQuery = query(messagesQuery, startAfter(lastDocSnap), limit(pageSize))
      } else {
        messagesQuery = query(messagesQuery, limit(pageSize))
      }
    } else {
      messagesQuery = query(messagesQuery, limit(pageSize))
    }

    // Get messages
    const querySnapshot = await getDocs(messagesQuery)
    const messages: Message[] = []
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })

    // Get total count for pagination metadata
    let countQuery = query(collection(db, 'messages'))
    if (statusFilter !== 'all') {
      countQuery = query(
        collection(db, 'messages'),
        where('status', '==', statusFilter)
      )
    }
    
    const countSnapshot = await getCountFromServer(countQuery)
    const totalCount = countSnapshot.data().count
    const totalPages = Math.ceil(totalCount / pageSize)
    
    // Get unread count for notification badge
    const unreadQuery = query(
      collection(db, 'messages'),
      where('status', '==', 'unread')
    )
    const unreadCountSnapshot = await getCountFromServer(unreadQuery)
    const unreadCount = unreadCountSnapshot.data().count

    const hasNext = messages.length === pageSize && page < totalPages
    const hasPrevious = page > 1
    const lastDocInPage = messages.length > 0 ? messages[messages.length - 1].id : null

    return NextResponse.json({
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize,
        hasNext,
        hasPrevious,
        lastDocId: lastDocInPage,
        unreadCount
      }
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}