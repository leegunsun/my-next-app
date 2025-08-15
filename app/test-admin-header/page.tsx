"use client"

import React from 'react'
import AdminHeader from '../../components/admin/AdminHeader'

export default function TestAdminHeaderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Background with Subtle Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary/30 to-background-tertiary/20 pointer-events-none" />
      
      {/* Test AdminHeader without authentication requirements */}
      <AdminHeader 
        title="테스트 페이지"
        description="AdminHeader 컴포넌트 개선 사항을 테스트합니다"
      />
      
      {/* Test content */}
      <div className="relative z-10 p-8 pt-16">
        <h1 className="text-2xl font-bold mb-4">AdminHeader Component Test</h1>
        <p className="text-foreground-secondary mb-4">
          이 페이지는 AdminHeader 컴포넌트의 개선 사항을 테스트하기 위한 페이지입니다.
        </p>
        
        <div className="bg-background-secondary p-4 rounded-lg">
          <h3 className="font-medium mb-2">제거된 요소들:</h3>
          <ul className="text-foreground-secondary space-y-1">
            <li>✅ 고정 내비게이션 바 (fixed navigation bar)</li>
            <li>✅ "돌아가기" 버튼 (/blog로 링크)</li>
            <li>✅ Settings 아이콘과 "관리자" 텍스트</li>
            <li>✅ LoginButton 컴포넌트</li>
          </ul>
        </div>
        
        <div className="bg-background-secondary p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-2">유지된 요소들:</h3>
          <ul className="text-foreground-secondary space-y-1">
            <li>✅ 헤더 콘텐츠 섹션 (title, description)</li>
            <li>✅ Settings 아이콘과 그라디언트 배경</li>
            <li>✅ 애니메이션 효과</li>
          </ul>
        </div>
      </div>
    </div>
  )
}