"use client"

import React from 'react'
import { Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AnimatedSection from '../AnimatedSection'

interface AdminHeaderProps {
  title: string
  description?: string
}

export default function AdminHeader({ 
  title, 
  description
}: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <>
      {/* Header Content */}
      <section className="pb-8 bg-background-secondary border-b border-border">
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