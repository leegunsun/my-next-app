"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { checkAnalyticsSupport, trackPageView } from '@/lib/analytics'

interface AnalyticsContextType {
  isAnalyticsReady: boolean
  isSupported: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  isAnalyticsReady: false,
  isSupported: false
})

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        const supported = await checkAnalyticsSupport()
        setIsSupported(supported)
        
        if (supported) {
          // Analytics가 이미 firebase.ts에서 초기화되었는지 확인
          // 약간의 지연을 두어 초기화 완료를 기다림
          setTimeout(() => {
            setIsAnalyticsReady(true)
          }, 1000)
        }
      } catch (error) {
        console.error('Analytics initialization error:', error)
        setIsSupported(false)
        setIsAnalyticsReady(false)
      }
    }

    initializeAnalytics()
  }, [])

  useEffect(() => {
    // 페이지 변경 시 페이지뷰 추적 (Analytics가 준비된 경우에만)
    if (pathname && isAnalyticsReady) {
      trackPageView(pathname)
    }
  }, [pathname, isAnalyticsReady])

  return (
    <AnalyticsContext.Provider value={{ isAnalyticsReady, isSupported }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }
  return context
}