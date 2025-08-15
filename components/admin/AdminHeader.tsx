"use client"

import React from 'react'
import { ArrowLeft, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { LoginButton } from '../auth/LoginButton'
import Link from 'next/link'
import AnimatedSection from '../AnimatedSection'

interface AdminHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
}

export default function AdminHeader({ 
  title, 
  description, 
  showBackButton = true,
  backUrl = '/blog'
}: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href={backUrl} className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                <ArrowLeft size={20} />
                돌아가기
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-foreground-secondary" />
              <span className="font-medium">관리자</span>
            </div>
          </div>
          
          <LoginButton variant="minimal" showUserInfo={true} />
        </div>
      </nav>

      {/* Header Content */}
      <section className="pt-16 pb-8 bg-background-secondary border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto pt-8">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center">
                  <Settings size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium">{title}</h1>
                  {description && (
                    <p className="text-foreground-secondary mt-1">{description}</p>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {user && (
              <AnimatedSection delay={0.1}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground-secondary">로그인:</span>
                  <span className="font-medium">{user.displayName || user.email}</span>
                  <span className="px-2 py-1 bg-accent-success/20 text-accent-success rounded-full text-xs">
                    Master
                  </span>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </>
  )
}