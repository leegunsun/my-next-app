"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/ProjectCard"
import { projects } from "@/lib/data/portfolio"
import type { Project } from "@/lib/data/portfolio"
import type { PortfolioProject } from "@/lib/types/portfolio"

interface ProjectsSectionProps {
  currentLang: string
}

interface ProjectCardProps {
  project: Project
  currentLang: string
}

function OriginalProjectCard({ project, currentLang }: ProjectCardProps) {
  const isKorean = currentLang === "ko"
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={isKorean ? project.titleKo : project.title}
          width={600}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">
          {isKorean ? project.titleKo : project.title}
        </CardTitle>
        <CardDescription>
          {isKorean ? project.descriptionKo : project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {isKorean ? project.longDescriptionKo : project.longDescription}
        </p>
      </CardContent>
      
      <CardFooter className="gap-2">
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </Button>
        )}
        
        {project.liveUrl && (
          <Button size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {isKorean ? "라이브 데모" : "Live Demo"}
            </a>
          </Button>
        )}\n      </CardFooter>
    </Card>
  )
}

export function ProjectsSection({ currentLang }: ProjectsSectionProps) {
  const isKorean = currentLang === "ko"
  const [filter, setFilter] = React.useState<string>("all")
  const [portfolioProjects, setPortfolioProjects] = React.useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  const categories = ["all", "mobile", "backend", "devops"]
  const categoryLabels = {
    all: isKorean ? "전체" : "All",
    mobile: isKorean ? "모바일" : "Mobile",
    backend: isKorean ? "백엔드" : "Backend",
    devops: isKorean ? "데브옵스" : "DevOps"
  }
  
  // Fetch portfolio projects from Firebase
  React.useEffect(() => {
    const fetchPortfolioProjects = async () => {
      try {
        const response = await fetch('/api/portfolio/projects')
        const result = await response.json()
        if (result.success) {
          setPortfolioProjects(result.data.filter((project: PortfolioProject) => project.isActive))
        }
      } catch (error) {
        console.error('Error fetching portfolio projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPortfolioProjects()
  }, [])
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => 
        project.technologies.some(tech => {
          if (filter === "mobile") return ["Flutter", "Dart", "React Native"].includes(tech)
          if (filter === "backend") return ["Spring Boot", "Kotlin", "Node.js", "Python"].includes(tech)
          if (filter === "devops") return ["Docker", "Kubernetes", "AWS", "CI/CD"].includes(tech)
          return false
        })
      )
  
  const filteredPortfolioProjects = filter === "all"
    ? portfolioProjects
    : portfolioProjects.filter(project =>
        project.tags.some(tag => {
          if (filter === "mobile") return ["Flutter", "Dart", "React Native"].includes(tag)
          if (filter === "backend") return ["Spring Boot", "Kotlin", "Node.js", "Python"].includes(tag)
          if (filter === "devops") return ["Docker", "Kubernetes", "AWS", "CI/CD"].includes(tag)
          return false
        })
      )

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isKorean ? "프로젝트" : "Projects"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isKorean 
              ? "제가 개발한 프로젝트들을 소개합니다. 각 프로젝트는 실제 문제를 해결하기 위해 만들어졌습니다."
              : "Here are some of the projects I've worked on. Each project was built to solve real-world problems."
            }
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </Button>
          ))}
        </div>

        {/* Portfolio Projects Grid (Firebase) */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-background-secondary rounded-3xl p-6 h-96">
                  <div className="h-48 bg-background-tertiary rounded-2xl mb-6"></div>
                  <div className="h-6 bg-background-tertiary rounded mb-3"></div>
                  <div className="h-4 bg-background-tertiary rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-background-tertiary rounded-full"></div>
                    <div className="h-6 w-20 bg-background-tertiary rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPortfolioProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPortfolioProjects
              .sort((a, b) => a.order - b.order)
              .map((project, index) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  icon={project.icon}
                  iconBg={project.iconBg}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                  delay={index * 0.1}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-foreground-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {isKorean ? "프로젝트를 준비 중입니다" : "Projects Coming Soon"}
              </h3>
              <p className="text-foreground-secondary text-sm">
                {isKorean 
                  ? "관리자가 새로운 프로젝트를 추가하고 있습니다."
                  : "New projects are being added by the admin."
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Original Projects Grid (Static data) - Show if no Firebase projects */}
        {!isLoading && filteredPortfolioProjects.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <OriginalProjectCard
                key={project.id}
                project={project}
                currentLang={currentLang}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              {isKorean ? "더 많은 프로젝트 보기" : "View More on GitHub"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}