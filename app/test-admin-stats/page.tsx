"use client"

import React from 'react'
import AdminNavigation from '../../components/admin/AdminNavigation'
import { useAdminStats } from '../../hooks/useAdminStats'

export default function TestAdminStatsPage() {
  const { stats, refetch } = useAdminStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Background with Subtle Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary/30 to-background-tertiary/20 pointer-events-none" />
      
      {/* Test AdminNavigation with dynamic stats */}
      <div className="flex relative z-10">
        {/* Sidebar Navigation with Dynamic Stats */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-0 h-screen">
            <AdminNavigation variant="sidebar" className="h-full glass-effect border-r border-border/50" />
          </div>
        </div>
        
        {/* Test content */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Stats Test</h1>
          <p className="text-foreground-secondary mb-6">
            이 페이지는 관리자 통계의 동적 데이터 로딩을 테스트하기 위한 페이지입니다.
          </p>
          
          <div className="bg-background-secondary p-6 rounded-lg mb-6">
            <h3 className="font-medium mb-4">현재 통계 상태:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>로딩 상태:</strong> {stats.loading ? '로딩 중...' : '완료'}
              </div>
              <div>
                <strong>게시물 수:</strong> {stats.loading ? '...' : stats.totalPosts}개
              </div>
              <div>
                <strong>읽지 않은 메시지 수:</strong> {stats.loading ? '...' : stats.unreadMessages}개
              </div>
              {stats.error && (
                <div className="text-accent-error">
                  <strong>오류:</strong> {stats.error}
                </div>
              )}
            </div>
            
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              통계 새로고침
            </button>
          </div>
          
          <div className="bg-background-secondary p-6 rounded-lg">
            <h3 className="font-medium mb-4">개선 사항:</h3>
            <ul className="text-foreground-secondary space-y-2 text-sm">
              <li>✅ 하드코딩된 값 (게시물: 12, 메시지: 5) 제거</li>
              <li>✅ useAdminStats 훅으로 실시간 데이터 가져오기</li>
              <li>✅ 로딩 상태와 에러 처리 추가</li>
              <li>✅ 회전하는 로딩 애니메이션 구현</li>
              <li>✅ 실제 Firebase 데이터베이스 연동</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}