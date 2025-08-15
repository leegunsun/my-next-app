import { useEffect, useCallback } from 'react'
import { analytics } from './firebase'
import { logEvent, isSupported } from 'firebase/analytics'
import type { Analytics } from 'firebase/analytics'

// Analytics 지원 여부 확인
export const checkAnalyticsSupport = async (): Promise<boolean> => {
  try {
    const supported = await isSupported()
    if (!supported) {
      console.warn('Firebase Analytics is not supported in this environment')
      return false
    }
    return true
  } catch (error) {
    console.error('Error checking Firebase Analytics support:', error)
    return false
  }
}

// Analytics 인스턴스 확인
const getAnalyticsInstance = (): Analytics | null => {
  if (typeof window === 'undefined') return null
  return analytics
}

// 페이지뷰 추적
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for page view tracking')
    return
  }
  
  try {
    logEvent(analyticsInstance, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : 'Unknown'),
      page_location: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    })
    console.log('Page view tracked:', pagePath)
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// 버튼 클릭 추적
export const trackButtonClick = (buttonName: string, location?: string) => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for button click tracking')
    return
  }
  
  try {
    logEvent(analyticsInstance, 'select_content', {
      content_type: 'button',
      item_id: buttonName,
      content_id: buttonName,
      location: location || 'unknown'
    })
    console.log('Button click tracked:', buttonName)
  } catch (error) {
    console.error('Error tracking button click:', error)
  }
}

// 커스텀 이벤트 추적
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for custom event tracking')
    return
  }
  
  try {
    // 타입 안전성을 위해 명시적 타입 캐스팅 제거
    logEvent(analyticsInstance, eventName, parameters)
    console.log('Custom event tracked:', eventName, parameters)
  } catch (error) {
    console.error('Error tracking custom event:', error)
  }
}

// 다운로드 추적
export const trackDownload = (fileName: string) => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for download tracking')
    return
  }
  
  try {
    logEvent(analyticsInstance, 'select_content', {
      content_type: 'download',
      item_id: fileName,
      content_id: fileName
    })
    console.log('Download tracked:', fileName)
  } catch (error) {
    console.error('Error tracking download:', error)
  }
}

// 연락처 폼 제출 추적
export const trackContactFormSubmit = () => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for contact form tracking')
    return
  }
  
  try {
    logEvent(analyticsInstance, 'generate_lead', {
      method: 'contact_form'
    })
    console.log('Contact form submission tracked')
  } catch (error) {
    console.error('Error tracking contact form submission:', error)
  }
}

// 프로젝트 클릭 추적
export const trackProjectClick = (projectName: string, linkType: 'github' | 'live') => {
  const analyticsInstance = getAnalyticsInstance()
  if (!analyticsInstance) {
    console.warn('Analytics not available for project click tracking')
    return
  }
  
  try {
    logEvent(analyticsInstance, 'select_content', {
      content_type: 'project_link',
      item_id: projectName,
      link_type: linkType
    })
    console.log('Project click tracked:', projectName, linkType)
  } catch (error) {
    console.error('Error tracking project click:', error)
  }
}

// React Hook for Analytics
export const useAnalytics = () => {
  const trackPageViewCallback = useCallback((pagePath: string, pageTitle?: string) => {
    trackPageView(pagePath, pageTitle)
  }, [])

  const trackButtonClickCallback = useCallback((buttonName: string, location?: string) => {
    trackButtonClick(buttonName, location)
  }, [])

  const trackCustomEventCallback = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackCustomEvent(eventName, parameters)
  }, [])

  const trackDownloadCallback = useCallback((fileName: string) => {
    trackDownload(fileName)
  }, [])

  const trackContactFormSubmitCallback = useCallback(() => {
    trackContactFormSubmit()
  }, [])

  const trackProjectClickCallback = useCallback((projectName: string, linkType: 'github' | 'live') => {
    trackProjectClick(projectName, linkType)
  }, [])

  useEffect(() => {
    // 페이지 로드 시 페이지뷰 자동 추적
    if (typeof window !== 'undefined') {
      trackPageViewCallback(window.location.pathname)
    }
  }, [trackPageViewCallback])

  return {
    trackPageView: trackPageViewCallback,
    trackButtonClick: trackButtonClickCallback,
    trackCustomEvent: trackCustomEventCallback,
    trackDownload: trackDownloadCallback,
    trackContactFormSubmit: trackContactFormSubmitCallback,
    trackProjectClick: trackProjectClickCallback
  }
}