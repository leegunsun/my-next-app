import { NextRequest, NextResponse } from 'next/server'
import { sendFCMNotification } from '@/lib/firebase/fcm'

export interface ResumeDownloadNotificationRequest {
  userAgent?: string
  timestamp?: string
  downloadPath?: string
}

// POST - Send FCM notification when resume is downloaded
export async function POST(request: NextRequest) {
  try {
    const { userAgent, timestamp, downloadPath } = await request.json() as ResumeDownloadNotificationRequest
    
    // Get client information
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Unknown'
    
    const currentTime = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // Send FCM notification to admin
    try {
      await sendFCMNotification({
        title: '📄 이력서 다운로드 알림',
        body: `${currentTime}에 누군가 이력서를 다운로드했습니다.`,
        data: {
          type: 'resume_download',
          timestamp: timestamp || currentTime,
          clientIP: clientIP.substring(0, 20), // IP 정보 제한
          userAgent: userAgent?.substring(0, 100) || 'Unknown', // User Agent 정보 제한
          downloadPath: downloadPath || '/resume.pdf',
          notificationTime: new Date().toISOString()
        },
        clickAction: '/',
        icon: '/favicon.ico'
      })

      console.log('📤 Resume download FCM notification sent successfully:', {
        timestamp: currentTime,
        clientIP: clientIP.substring(0, 10) + '...',
        hasUserAgent: !!userAgent
      })

      return NextResponse.json({
        success: true,
        message: 'Resume download notification sent successfully'
      })

    } catch (fcmError) {
      console.error('❌ FCM notification failed:', fcmError)
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send FCM notification',
        details: fcmError instanceof Error ? fcmError.message : 'Unknown FCM error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Error in resume download notification endpoint:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Health check for the endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: 'resume-download-notification',
    status: 'active',
    purpose: 'Send FCM notifications when resume is downloaded',
    timestamp: new Date().toISOString()
  })
}