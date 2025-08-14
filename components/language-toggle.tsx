"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  currentLang: string
  onLanguageChange: (lang: string) => void
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLang === "en" ? "ko" : "en")}
      className="h-9 px-3 font-medium"
    >
      {currentLang === "en" ? "한국어" : "English"}
    </Button>
  )
}