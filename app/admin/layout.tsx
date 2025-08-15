"use client"

import React from 'react'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireMaster={true}>
      {children}
    </ProtectedRoute>
  )
}