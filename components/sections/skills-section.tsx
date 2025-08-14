"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { skills } from "@/lib/data/portfolio"
import type { Skill } from "@/lib/data/portfolio"

interface SkillsSectionProps {
  currentLang: string
}

interface SkillBarProps {
  skill: Skill
  currentLang: string
}

function SkillBar({ skill, currentLang }: SkillBarProps) {
  const isKorean = currentLang === "ko"
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      {skill.description && (
        <p className="text-xs text-muted-foreground">
          {isKorean ? skill.descriptionKo : skill.description}
        </p>
      )}
    </div>
  )
}

function SkillRadar({ currentLang }: { currentLang: string }) {
  const isKorean = currentLang === "ko"
  const radarSkills = skills.slice(0, 6) // Top 6 skills for radar
  
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Radar Background */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Grid circles */}
        {[20, 40, 60, 80].map((radius) => (
          <circle
            key={radius}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Grid lines */}
        {radarSkills.map((_, index) => {
          const angle = (index * 360) / radarSkills.length
          const radians = (angle - 90) * (Math.PI / 180)
          const x2 = 100 + 80 * Math.cos(radians)
          const y2 = 100 + 80 * Math.sin(radians)
          
          return (
            <line
              key={index}
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              opacity="0.3"
            />
          )
        })}
        
        {/* Skill points and polygon */}
        <polygon
          points={radarSkills.map((skill, index) => {
            const angle = (index * 360) / radarSkills.length
            const radians = (angle - 90) * (Math.PI / 180)
            const distance = (skill.level / 100) * 80
            const x = 100 + distance * Math.cos(radians)
            const y = 100 + distance * Math.sin(radians)
            return `${x},${y}`
          }).join(' ')}
          fill="hsl(var(--primary))"
          fillOpacity="0.1"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        
        {/* Skill points */}
        {radarSkills.map((skill, index) => {
          const angle = (index * 360) / radarSkills.length
          const radians = (angle - 90) * (Math.PI / 180)
          const distance = (skill.level / 100) * 80
          const x = 100 + distance * Math.cos(radians)
          const y = 100 + distance * Math.sin(radians)
          
          return (
            <circle
              key={skill.name}
              cx={x}
              cy={y}
              r="4"
              fill="hsl(var(--primary))"
            />
          )
        })}
      </svg>
      
      {/* Skill labels */}
      <div className="absolute inset-0">
        {radarSkills.map((skill, index) => {
          const angle = (index * 360) / radarSkills.length
          const radians = (angle - 90) * (Math.PI / 180)
          const x = 50 + 45 * Math.cos(radians) // Percentage positions
          const y = 50 + 45 * Math.sin(radians)
          
          return (
            <div
              key={skill.name}
              className="absolute text-xs font-medium transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              {skill.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SkillsSection({ currentLang }: SkillsSectionProps) {
  const isKorean = currentLang === "ko"
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const categoryLabels: Record<string, { en: string; ko: string }> = {
    Mobile: { en: "Mobile Development", ko: "모바일 개발" },
    Backend: { en: "Backend Development", ko: "백엔드 개발" },
    Language: { en: "Programming Languages", ko: "프로그래밍 언어" },
    Database: { en: "Database & Storage", ko: "데이터베이스" },
    DevOps: { en: "DevOps & Infrastructure", ko: "데브옵스 및 인프라" }
  }

  return (
    <section id="skills" className="py-20 px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isKorean ? "기술 스택" : "Skills & Technologies"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isKorean 
              ? "다양한 기술을 활용하여 효율적이고 확장 가능한 솔루션을 개발합니다."
              : "I leverage diverse technologies to build efficient and scalable solutions."
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Skill Radar */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">
                {isKorean ? "기술 숙련도" : "Technical Proficiency"}
              </h3>
              <SkillRadar currentLang={currentLang} />
            </div>
          </div>

          {/* Skill Categories */}
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isKorean 
                      ? categoryLabels[category]?.ko || category
                      : categoryLabels[category]?.en || category
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySkills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      currentLang={currentLang}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Learning */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>
                {isKorean ? "최근 학습 내용" : "Recent Learning"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="font-semibold mb-2">🆕 {isKorean ? "현재 학습 중" : "Currently Learning"}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 15 App Router</li>
                    <li>• Kubernetes Advanced Patterns</li>
                    <li>• Rust Programming</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎯 {isKorean ? "다음 목표" : "Next Goals"}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• WebAssembly with Rust</li>
                    <li>• Machine Learning with Python</li>
                    <li>• Cloud Architecture Certification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}