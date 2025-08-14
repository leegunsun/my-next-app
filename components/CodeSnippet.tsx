"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"

interface CodeSnippetProps {
  code: string
  language: string
  title?: string
  className?: string
}

export default function CodeSnippet({ code, language, title, className = "" }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative rounded-lg bg-background-tertiary border border-border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-secondary border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-accent-error rounded-full"></div>
            <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
            <div className="w-3 h-3 bg-accent-success rounded-full"></div>
          </div>
          {title && <span className="text-sm font-medium">{title}</span>}
          <span className="text-xs text-foreground-secondary bg-background-tertiary px-2 py-1 rounded">
            {language}
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 text-xs text-foreground-secondary hover:text-foreground transition-colors rounded"
          aria-label="코드 복사"
        >
          {copied ? (
            <>
              <Check size={14} className="text-accent-success" />
              <span className="text-accent-success">복사됨!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>복사</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code Content */}
      <div className="p-4">
        <pre className="text-sm leading-relaxed overflow-x-auto">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </motion.div>
  )
}