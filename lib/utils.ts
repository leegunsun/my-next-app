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
export function downloadResume() {
  // Track download event
  trackDownload('Developer_Resume.pdf')
  
  // In a real application, this would download an actual PDF file
  // For demo purposes, we'll create a placeholder action
  const link = document.createElement('a')
  link.href = '/resume.pdf' // This should be a real PDF file in the public folder
  link.download = 'Developer_Resume.pdf'
  link.click()
  
  // Show notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('이력서 다운로드', {
      body: '이력서 다운로드가 시작되었습니다.',
      icon: '/favicon.ico'
    })
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