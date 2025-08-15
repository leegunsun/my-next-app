"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import AdminNavigation from '../../components/admin/AdminNavigation'
import MobileAdminNav from '../../components/admin/MobileAdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireMaster={true}>
      <div className="min-h-screen bg-background">
        {/* Enhanced Background with Subtle Gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary/30 to-background-tertiary/20 pointer-events-none" />
        
        {/* Breadcrumb Navigation with Animation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AdminNavigation variant="breadcrumb" />
        </motion.div>
        
        {/* Main Layout with Sidebar */}
        <div className="flex relative z-10">
          {/* Sidebar Navigation with Glass Effect */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-80 flex-shrink-0 hidden lg:block"
          >
            <div className="sticky top-0 h-screen">
              <AdminNavigation variant="sidebar" className="h-full glass-effect border-r border-border/50" />
            </div>
          </motion.div>
          
          {/* Main Content with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.div>
        </div>

        {/* Mobile Navigation with Enhanced Styling */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MobileAdminNav />
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}