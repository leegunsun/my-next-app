"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { personalInfo } from "@/lib/data/content"

interface HeroSectionProps {
  currentLang: string
}

export function HeroSection({ currentLang }: HeroSectionProps) {
  const isKorean = currentLang === "ko"

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient-bg">
        {/* Primary gradient orb */}
        <div className="absolute top-20 left-1/4 w-96 h-96 hero-gradient-orb rounded-full opacity-60"></div>
        
        {/* Secondary gradient orb */}
        <div className="absolute bottom-20 right-1/4 w-80 h-80 hero-gradient-orb-secondary rounded-full opacity-50"></div>
        
        {/* Accent gradient orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 hero-gradient-orb-accent rounded-full opacity-40"></div>
        
        {/* Floating sparkle elements */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-primary rounded-full sparkle-effect opacity-70"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-accent-purple rounded-full sparkle-effect opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-accent-blend rounded-full sparkle-effect opacity-80" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="floating-element">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent-purple to-accent-blend bg-clip-text text-transparent animate-on-scroll">
                {isKorean ? personalInfo.nameKo : personalInfo.name}
              </h1>
            </div>
            
            <div className="floating-element-reverse">
              <h2 className="text-xl md:text-2xl text-foreground-secondary mb-6 animate-on-scroll" style={{animationDelay: '0.2s'}}>
                {isKorean ? personalInfo.titleKo : personalInfo.title}
              </h2>
            </div>
            
            <div className="floating-element">
              <p className="text-lg md:text-xl mb-8 leading-relaxed text-foreground animate-on-scroll" style={{animationDelay: '0.4s'}}>
                {isKorean ? personalInfo.taglineKo : personalInfo.tagline}
              </p>
            </div>
            
            <div className="floating-element-reverse">
              <p className="text-foreground-secondary mb-8 max-w-2xl leading-relaxed animate-on-scroll" style={{animationDelay: '0.6s'}}>
                {isKorean ? personalInfo.bioKo : personalInfo.bio}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-on-scroll floating-element" style={{animationDelay: '0.8s'}}>
              <Button size="lg" asChild className="group relative overflow-hidden">
                <a href="#projects" className="relative z-10">
                  <span className="relative z-10">{isKorean ? "프로젝트 보기" : "View Projects"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-blend opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="glass-effect group hover:glass-effect border-primary/20">
                <a href="#contact" className="relative z-10">
                  {isKorean ? "연락하기" : "Get in Touch"}
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start mt-8 animate-on-scroll floating-element-reverse" style={{animationDelay: '1s'}}>
              <Button variant="ghost" size="icon" asChild className="glass-effect hover:bg-primary/10 group floating-element">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="glass-effect hover:bg-accent-purple/10 group floating-element-reverse" style={{animationDelay: '0.2s'}}>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="glass-effect hover:bg-accent-blend/10 group floating-element" style={{animationDelay: '0.4s'}}>
                <a href={`mailto:${personalInfo.email}`}>
                  <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative floating-element">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl relative">
                <Image
                  src={personalInfo.avatar}
                  alt={isKorean ? personalInfo.nameKo : personalInfo.name}
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                  priority
                />
                
                {/* Glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-full"></div>
              </div>
              
              {/* Enhanced floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 glass-effect rounded-full flex items-center justify-center floating-element-reverse shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 glass-effect rounded-full flex items-center justify-center floating-element shadow-lg">
                <span className="text-3xl">💻</span>
              </div>
              
              {/* Additional floating tech icons */}
              <div className="absolute top-1/4 -left-8 w-8 h-8 glass-effect rounded-full flex items-center justify-center floating-element opacity-80 shadow-md" style={{animationDelay: '1s'}}>
                <span className="text-lg">⚡</span>
              </div>
              
              <div className="absolute bottom-1/3 -right-6 w-10 h-10 glass-effect rounded-full flex items-center justify-center floating-element-reverse opacity-70 shadow-md" style={{animationDelay: '2s'}}>
                <span className="text-xl">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}