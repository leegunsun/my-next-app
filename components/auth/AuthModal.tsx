"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, UserPlus, Eye, EyeOff, UserX } from 'lucide-react'
import { signInWithGoogle, signInWithEmail, createAccount, signInAnonymous } from '../../lib/firebase/auth'
import { Portal } from '../Portal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

type AuthMethod = 'select' | 'email' | 'google' | 'anonymous'
type AuthMode = 'signin' | 'signup'

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'signin' 
}) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select')
  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setAuthMethod('select')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    
    // Clear any previous errors
    console.log('🔐 Attempting Google login...')
    
    const { error } = await signInWithGoogle()
    if (error) {
      console.error('❌ Google login error:', error)
      setError(error)
      
      // Show helpful suggestion for COOP issues
      if (error.includes('팝업') || error.includes('Cross-Origin')) {
        setTimeout(() => {
          setError(error + '\n\n💡 팁: 이메일 로그인이 더 안정적입니다.')
        }, 100)
      }
    } else {
      console.log('✅ Google login successful')
      handleClose()
    }
    setLoading(false)
  }

  const handleAnonymousAuth = async () => {
    setLoading(true)
    setError('')
    const { error } = await signInAnonymous()
    if (error) {
      setError(error)
    } else {
      handleClose()
    }
    setLoading(false)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (authMode === 'signup' && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    const authFunction = authMode === 'signup' ? createAccount : signInWithEmail
    const { error } = await authFunction(email, password)
    
    if (error) {
      setError(error)
    } else {
      handleClose()
    }
    setLoading(false)
  }

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">로그인 방법 선택</h2>
        <p className="text-foreground-secondary">편리한 방법으로 로그인하세요</p>
      </div>

      {/* Google Login */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-70"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google로 계속하기
      </motion.button>

      {/* Email/Password */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setAuthMethod('email')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-medium transition-opacity"
      >
        <Mail size={20} />
        이메일로 계속하기
      </motion.button>

      {/* Anonymous */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnonymousAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background-secondary hover:bg-background-tertiary border border-border rounded-lg font-medium transition-colors disabled:opacity-70"
      >
        <UserX size={20} />
        익명으로 계속하기
      </motion.button>

      <div className="text-center text-sm text-foreground-secondary mt-6">
        익명 로그인 시 일부 기능이 제한될 수 있습니다
      </div>
    </div>
  )

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAuthMethod('select')}
          className="p-2 hover:bg-background-secondary rounded-md transition-colors"
        >
          <X size={20} />
        </motion.button>
        <h2 className="text-2xl font-medium">
          {authMode === 'signup' ? '회원가입' : '로그인'}
        </h2>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2">비밀번호</label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              minLength={6}
              className="w-full pl-10 pr-12 py-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password for Signup */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-accent-error/10 border border-accent-error/20 rounded-lg text-accent-error text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-medium transition-opacity disabled:opacity-70"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
              처리 중...
            </>
          ) : (
            <>
              {authMode === 'signup' ? <UserPlus size={20} /> : <User size={20} />}
              {authMode === 'signup' ? '회원가입' : '로그인'}
            </>
          )}
        </motion.button>

        {/* Toggle Mode */}
        <div className="text-center text-sm">
          <span className="text-foreground-secondary">
            {authMode === 'signup' ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'signup' ? 'signin' : 'signup')
              setError('')
            }}
            className="ml-2 text-primary hover:underline font-medium"
          >
            {authMode === 'signup' ? '로그인' : '회원가입'}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border p-6"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-background-secondary rounded-md transition-colors"
              >
                <X size={20} />
              </motion.button>

              {/* Content */}
              {authMethod === 'select' ? renderMethodSelection() : renderEmailForm()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  )
}