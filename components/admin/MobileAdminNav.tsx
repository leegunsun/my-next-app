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
    icon: FileText
  },
  {
    href: '/admin/messages', 
    label: '메시지 관리',
    icon: MessageSquare
  },
  {
    href: '/admin/posts/new',
    label: '새 글 작성',
    icon: FileText
  },
  {
    href: '/',
    label: '홈으로',
    icon: Home
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 right-4 z-50 bg-accent-blend text-primary-foreground p-3 rounded-full shadow-lg"
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
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-background-card border-l border-border z-50 shadow-xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-8 mt-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blend rounded-lg flex items-center justify-center">
                      <Settings size={20} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">관리자 패널</h2>
                      <p className="text-sm text-foreground-secondary">모바일 메뉴</p>
                    </div>
                  </div>
                </div>

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
                            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                              isActive
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'hover:bg-background-secondary text-foreground-secondary hover:text-foreground'
                            }`}
                          >
                            <Icon size={20} className={isActive ? 'text-primary' : ''} />
                            <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                              {item.label}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary rounded-full ml-auto"
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