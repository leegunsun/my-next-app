"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  id: string
  name: string
  value: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  className,
  disabled = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRef.current) {
      const focusedElement = optionsRef.current.children[focusedIndex] as HTMLElement
      focusedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex, isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value)
          setIsOpen(false)
          setFocusedIndex(-1)
        } else {
          setIsOpen(!isOpen)
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex(prev => (prev + 1) % options.length)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(options.length - 1)
        } else {
          setFocusedIndex(prev => prev <= 0 ? options.length - 1 : prev - 1)
        }
        break
    }
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      
      <div
        ref={selectRef}
        className="relative"
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className={cn(
            "w-full p-3 text-left glass-effect border border-border/50 rounded-2xl",
            "focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none",
            "transition-all duration-200 ease-in-out",
            "flex items-center justify-between gap-3",
            "hover:border-primary/50 hover:shadow-md",
            "group relative overflow-hidden backdrop-blur-sm",
            disabled && "opacity-50 cursor-not-allowed",
            isOpen && "ring-2 ring-primary/60 border-primary/50 shadow-lg bg-background/98"
          )}
        >
          {/* Simplified hover effect without gradient overlay */}
          
          <div className="flex items-center gap-3 relative z-10">
            {selectedOption?.icon && (
              <div className="text-foreground-secondary">
                {selectedOption.icon}
              </div>
            )}
            <span className={cn(
              "text-sm",
              selectedOption ? "text-foreground" : "text-foreground-secondary"
            )}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-foreground-secondary relative z-10"
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={optionsRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full left-0 right-0 mt-2 z-[9999]",
                "bg-background/95 border border-border/30 rounded-2xl shadow-xl",
                "backdrop-blur-sm",
                "max-h-60 overflow-y-auto scrollbar-thin"
              )}
            >
              <div className="p-1">
                {options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "w-full p-3 text-left text-sm rounded-xl",
                      "flex items-center justify-between gap-3",
                      "transition-all duration-150",
                      "hover:bg-primary/10 hover:text-primary hover:shadow-sm",
                      focusedIndex === index && "bg-primary/10 text-primary",
                      option.value === value && "bg-primary/20 text-primary font-medium shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && (
                        <div className={cn(
                          "transition-colors",
                          option.value === value ? "text-primary" : "text-foreground-secondary"
                        )}>
                          {option.icon}
                        </div>
                      )}
                      <span>{option.name}</span>
                    </div>
                    
                    {option.value === value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary"
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CustomSelect