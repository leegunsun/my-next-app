import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, getDocs, orderBy, query, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore'
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

    const messageData: Omit<Message, 'id'> = {
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

// GET - Get all messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(messagesQuery)
    const messages: Message[] = []
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}