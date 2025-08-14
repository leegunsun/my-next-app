"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { experiences } from "@/lib/data/portfolio"
import type { Experience } from "@/lib/data/portfolio"
import { formatDate, formatDateKo } from "@/lib/utils"

interface ExperienceSectionProps {
  currentLang: string
}

interface TimelineItemProps {
  experience: Experience
  currentLang: string
  isLast?: boolean
}

function TimelineItem({ experience, currentLang, isLast }: TimelineItemProps) {
  const isKorean = currentLang === "ko"
  
  return (
    <div className="relative flex gap-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-px h-full bg-border" />
      )}
      
      {/* Timeline dot */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-xl">
                {isKorean ? experience.titleKo : experience.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {isKorean ? formatDateKo(experience.startDate) : formatDate(experience.startDate)}
                {" - "}
                {experience.endDate 
                  ? (isKorean ? formatDateKo(experience.endDate) : formatDate(experience.endDate))
                  : (isKorean ? "현재" : "Present")
                }
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="font-semibold text-primary">
                {isKorean ? experience.companyKo : experience.company}
              </div>
              <div className="text-sm text-muted-foreground">
                {isKorean ? experience.locationKo : experience.location}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Description */}
            <div className="space-y-2">
              {(isKorean ? experience.descriptionKo : experience.description).map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            {/* Technologies */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                {isKorean ? "사용 기술:" : "Technologies:"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ExperienceSection({ currentLang }: ExperienceSectionProps) {
  const isKorean = currentLang === "ko"

  return (
    <section id="experience" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isKorean ? "경력 사항" : "Work Experience"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isKorean 
              ? "다양한 프로젝트와 팀에서 쌓아온 개발 경험을 소개합니다."
              : "My professional journey and the experiences that shaped my development skills."
            }
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              experience={experience}
              currentLang={currentLang}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                {isKorean ? "년 경력" : "Years Experience"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">20+</div>
              <div className="text-sm text-muted-foreground">
                {isKorean ? "완료한 프로젝트" : "Projects Completed"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">
                {isKorean ? "사용 기술" : "Technologies Used"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}