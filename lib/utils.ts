import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { trackDownload, trackContactFormSubmit } from "./analytics"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateKo(date: Date | string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// PDF Download functionality  
export async function downloadResume() {
  try {
    // Try Firebase Storage first, fallback to local storage
    let response = await fetch('/api/portfolio/resume-upload-firebase')
    let result = await response.json()
    
    let downloadUrl = '/uploads/resumes/current-resume.pdf'
    let filename = 'Developer_Resume.pdf'
    
    // If Firebase Storage has the file, use it
    if (result.success && result.data) {
      downloadUrl = result.data.fileUrl
      filename = result.data.originalName || 'Developer_Resume.pdf'
    } else {
      // Fallback to local storage API
      response = await fetch('/api/portfolio/resume-upload')
      result = await response.json()
      
      if (result.success && result.data) {
        downloadUrl = result.data.fileUrl
        filename = result.data.originalName || 'Developer_Resume.pdf'
      } else {
        // Final fallback: Check if current-resume.pdf exists locally
        const checkResponse = await fetch('/uploads/resumes/current-resume.pdf', { method: 'HEAD' })
        if (!checkResponse.ok) {
          // If no resume exists anywhere, show message to user
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('이력서 다운로드', {
              body: '등록된 이력서가 없습니다. 관리자에게 문의해주세요.',
              icon: '/favicon.ico'
            })
          } else {
            alert('등록된 이력서가 없습니다. 관리자에게 문의해주세요.')
          }
          return
        }
      }
    }

    // Track download event
    trackDownload(filename)
    
    // Send FCM notification to admin (fire and forget)
    try {
      const notificationData = {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        downloadPath: downloadUrl,
        filename: filename
      }

      // Send FCM notification without blocking the download
      fetch('/api/notifications/resume-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      }).then(response => {
        if (response.ok) {
          console.log('✅ Resume download notification sent to admin')
        } else {
          console.warn('⚠️ Failed to send resume download notification')
        }
      }).catch(error => {
        console.warn('⚠️ Resume download notification error:', error)
      })
    } catch (error) {
      console.warn('⚠️ Failed to prepare resume download notification:', error)
    }
    
    // Download the current resume PDF
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    link.click()
    
    // Show notification to user
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('이력서 다운로드', {
        body: '이력서 다운로드가 시작되었습니다.',
        icon: '/favicon.ico'
      })
    }
  } catch (error) {
    console.error('❌ Error downloading resume:', error)
    
    // Fallback to default behavior
    const link = document.createElement('a')
    link.href = '/uploads/resumes/current-resume.pdf'
    link.download = 'Developer_Resume.pdf'
    link.click()
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('이력서 다운로드', {
        body: '이력서 다운로드가 시작되었습니다.',
        icon: '/favicon.ico'
      })
    }
  }
}

// Contact form submission
export interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Track contact form submission
    trackContactFormSubmit()
    
    // Send data to Firebase through API route
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || '메시지 전송에 실패했습니다.')
    }
    
    console.log('Contact form submitted successfully:', result)
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('메시지 전송 완료', {
        body: '메시지가 성공적으로 전송되었습니다.',
        icon: '/favicon.ico'
      })
    }
    
    return {
      success: true,
      message: '메시지가 성공적으로 전송되었습니다.'
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '메시지 전송에 실패했습니다. 다시 시도해주세요.'
    }
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

// HTML processing utility for dangerouslySetInnerHTML
export function processHtmlForGradientText(html: string): string {
  if (!html) return html
  
  // Convert className to class for proper HTML rendering
  // This is needed because dangerouslySetInnerHTML expects plain HTML, not JSX
  return html
    .replace(/className=/g, 'class=')
    .replace(/class="text-gradient-flutter"/g, 'class="text-gradient-flutter"')
    .replace(/class="text-gradient-spring"/g, 'class="text-gradient-spring"')
}

// Safe HTML renderer that ensures gradient text classes work properly
export function createSafeGradientHtml(text: string): string {
  // Process text to ensure Flutter and Spring Boot get proper gradient classes
  return text
    .replace(/Flutter/g, '<span class="text-gradient-flutter">Flutter</span>')
    .replace(/Spring Boot/g, '<span class="text-gradient-spring">Spring Boot</span>')
}