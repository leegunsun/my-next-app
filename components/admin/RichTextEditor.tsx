"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Format text with HTML tags
  const formatText = (tag: string, argument?: string) => {
    const textarea = editorRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let replacement = ''
    
    switch (tag) {
      case 'bold':
        replacement = `<strong>${selectedText || '텍스트'}</strong>`
        break
      case 'italic':
        replacement = `<em>${selectedText || '텍스트'}</em>`
        break
      case 'underline':
        replacement = `<u>${selectedText || '텍스트'}</u>`
        break
      case 'h1':
        replacement = `<h1>${selectedText || '제목 1'}</h1>`
        break
      case 'h2':
        replacement = `<h2>${selectedText || '제목 2'}</h2>`
        break
      case 'h3':
        replacement = `<h3>${selectedText || '제목 3'}</h3>`
        break
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || '항목 1'}</li>\n  <li>항목 2</li>\n</ul>`
        break
      case 'ol':
        replacement = `<ol>\n  <li>${selectedText || '항목 1'}</li>\n  <li>항목 2</li>\n</ol>`
        break
      case 'blockquote':
        replacement = `<blockquote>${selectedText || '인용문'}</blockquote>`
        break
      case 'code':
        if (selectedText.includes('\n')) {
          replacement = `<pre><code>${selectedText || '코드'}</code></pre>`
        } else {
          replacement = `<code>${selectedText || '코드'}</code>`
        }
        break
      case 'link':
        const url = argument || prompt('링크 URL을 입력하세요:', 'https://')
        if (url) {
          replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || '링크 텍스트'}</a>`
        }
        break
      default:
        return
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + replacement.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const insertLineBreak = () => {
    const textarea = editorRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newValue = value.substring(0, start) + '\n\n' + value.substring(start)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 2)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = editorRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const newValue = value.substring(0, start) + '  ' + value.substring(start)
      onChange(newValue)

      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2)
      }, 0)
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatText('bold')
          break
        case 'i':
          e.preventDefault()
          formatText('italic')
          break
        case 'k':
          e.preventDefault()
          formatText('link')
          break
        case 'Enter':
          e.preventDefault()
          insertLineBreak()
          break
      }
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic (Ctrl+I)' },
    { icon: Underline, action: () => formatText('underline'), title: 'Underline' },
    { divider: true },
    { icon: Heading1, action: () => formatText('h1'), title: 'Heading 1' },
    { icon: Heading2, action: () => formatText('h2'), title: 'Heading 2' },
    { icon: Heading3, action: () => formatText('h3'), title: 'Heading 3' },
    { divider: true },
    { icon: List, action: () => formatText('ul'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => formatText('ol'), title: 'Numbered List' },
    { icon: Quote, action: () => formatText('blockquote'), title: 'Quote' },
    { divider: true },
    { icon: Code, action: () => formatText('code'), title: 'Code' },
    { icon: Link, action: () => formatText('link'), title: 'Link (Ctrl+K)' },
  ]

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background-secondary">
      {/* Toolbar */}
      <div className="border-b border-border p-3 bg-background-tertiary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((button, index) => (
              button.divider ? (
                <div key={index} className="w-px h-6 bg-border mx-1" />
              ) : (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={button.action}
                  title={button.title}
                  className="p-2 hover:bg-background-secondary rounded-md transition-colors"
                  type="button"
                >
                  <button.icon size={16} />
                </motion.button>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreview(!isPreview)}
              className={`
                flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all
                ${isPreview 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background-secondary hover:bg-background text-foreground-secondary'
                }
              `}
              type="button"
            >
              {isPreview ? <Edit size={14} /> : <Eye size={14} />}
              {isPreview ? '편집' : '미리보기'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 min-h-[300px] prose prose-sm max-w-none
              prose-headings:font-medium prose-headings:text-foreground
              prose-p:text-foreground-secondary prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-medium
              prose-code:bg-background-tertiary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-background-tertiary prose-pre:border prose-pre:border-border
              prose-blockquote:border-l-primary prose-blockquote:bg-background-tertiary prose-blockquote:rounded-r
              prose-ul:text-foreground-secondary prose-ol:text-foreground-secondary
              prose-li:text-foreground-secondary
            "
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-foreground-muted">내용을 입력하세요...</p>' }}
          />
        ) : (
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent border-none outline-none resize-none min-h-[300px] font-mono text-sm leading-relaxed"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="border-t border-border p-2 bg-background-tertiary text-xs text-foreground-secondary">
        <div className="flex items-center justify-between">
          <div>
            {value.length} 문자
            {value && ` · ${value.split(/\s+/).filter(word => word.length > 0).length} 단어`}
          </div>
          <div className="flex items-center gap-4">
            <span>Ctrl+B: Bold</span>
            <span>Ctrl+I: Italic</span>
            <span>Ctrl+K: Link</span>
            <span>Tab: Indent</span>
          </div>
        </div>
      </div>
    </div>
  )
}