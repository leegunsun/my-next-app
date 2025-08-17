"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { navigationItems } from "@/lib/data/content"

interface HeaderProps {
  currentLang: string
  onLanguageChange: (lang: string) => void
}

export function Header({ currentLang, onLanguageChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = currentLang === "ko" ? navigationItems.ko : navigationItems.en

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 overflow-hidden ${
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    }`}>
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between min-w-0 gap-4 sm:gap-6 lg:gap-8">
          {/* Left section - Logo */}
          <div className="flex-shrink-0">
            <Link href="#home" className="font-bold text-xl hover:text-primary transition-colors">
              Portfolio
            </Link>
          </div>

          {/* Center section - Navigation */}
          <div className="flex-1 min-w-0 max-w-2xl mx-4 sm:mx-6 lg:mx-8">
            <div className="flex items-center justify-center overflow-x-auto scrollbar-hide scroll-smooth">
              <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 px-2" style={{ minWidth: 'max-content' }}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right section - Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <LanguageToggle 
              currentLang={currentLang} 
              onLanguageChange={onLanguageChange} 
            />
            <ThemeToggle />
          </div>
        </div>

      </nav>
    </header>
  )
}