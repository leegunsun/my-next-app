"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  FileText, 
  MessageSquare, 
  Home,
  Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const mobileNavItems = [
  {
    href: '/admin/posts',
    label: '게시물 관리',
    icon: FileText,
    description: '블로그 게시물 관리'
  },
  {
    href: '/admin/messages', 
    label: '메시지 관리',
    icon: MessageSquare,
    description: '연락 메시지 확인'
  },
  {
    href: '/admin/posts/new',
    label: '새 글 작성',
    icon: FileText,
    description: '새로운 블로그 작성'
  },
  {
    href: '/',
    label: '홈으로',
    icon: Home,
    description: '메인 사이트로 이동'
  }
]

export const MobileAdminNav: React.FC = () => {
  const { user, isMaster } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Don't render if user is not a master
  if (!user || !isMaster) {
    return null
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Admin Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 right-4 z-50 bg-accent-blend text-primary-foreground p-3 rounded-2xl shadow-lg glass-effect backdrop-blur-sm"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={toggleMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-background-card border-l border-border/30 z-50 shadow-xl glass-effect backdrop-blur-md"
            >
              <div className="p-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="mb-8 mt-12"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
                      <Settings size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">관리자 패널</h2>
                      <p className="text-sm text-foreground-secondary">모바일 메뉴</p>
                    </div>
                  </div>
                  
                  {/* Decorative Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mt-4 origin-left"
                  />
                </motion.div>

                {/* Navigation Items */}
                <nav className="space-y-3">
                  {mobileNavItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={item.href} onClick={toggleMenu}>
                          <motion.div
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 rounded-2xl transition-all glass-effect backdrop-blur-sm ${
                              isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-md'
                                : 'hover:bg-background-secondary/50 text-foreground-secondary hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/30'
                            }`}
                          >
                            <Icon size={20} className={isActive ? 'text-primary' : 'group-hover:text-foreground'} />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                                {item.label}
                              </div>
                              <div className="text-xs text-foreground-muted line-clamp-1">
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary rounded-full"
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileAdminNav