"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    title: '글 관리',
    href: '/admin/posts',
    icon: FileText
  },
  {
    title: '메시지 관리',
    href: '/admin/messages', 
    icon: MessageSquare
  },
  {
    title: '통계',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background border-r border-border min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">관리자 패널</h2>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}