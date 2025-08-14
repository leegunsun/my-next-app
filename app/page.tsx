"use client"

import * as React from "react"
import { useState } from "react"

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-lg font-medium">Portfolio</div>
          <div className="flex items-center gap-6">
            <a href="#about" className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all">About</a>
            <a href="#portfolio" className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all">Portfolio</a>
            <a href="#skills" className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all">Skills</a>
            <a href="#contact" className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image Placeholder */}
            <div className="w-32 h-32 bg-background-secondary rounded-full mx-auto mb-8 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">Dev</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
              사용자의 문제를 구조적으로 해결하는<br />
              <span className="text-primary">Flutter & Spring Boot</span> 개발자
            </h1>
            
            <p className="text-lg text-foreground-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
              모바일과 백엔드 개발의 경계를 넘나들며, 사용자 중심의 기술 솔루션을 
              설계하고 구현합니다. 문제 해결을 통한 가치 창출에 집중합니다.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 text-base rounded-md font-medium transition-all">
                이력서 다운로드
              </button>
              <a href="#portfolio" className="bg-transparent text-foreground hover:bg-overlay-hover px-6 py-3 text-base rounded-md font-medium transition-all border border-border">
                프로젝트 보기
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <a href="#" className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all">
                <span className="text-sm font-medium">GH</span>
              </a>
              <a href="#" className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all">
                <span className="text-sm font-medium">LI</span>
              </a>
              <a href="#" className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all">
                <span className="text-sm font-medium">BL</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-medium mb-12 text-center">About Me</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* About Content */}
              <div className="space-y-6">
                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-4">전문 분야</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Flutter 모바일 앱 개발</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent-success rounded-full"></div>
                      <span>Spring Boot 백엔드 API 개발</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent-purple rounded-full"></div>
                      <span>Docker & Kubernetes 컨테이너 운영</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
                      <span>MSSQL 데이터베이스 설계</span>
                    </div>
                  </div>
                </div>

                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-4">개발 철학</h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    단순히 기능을 구현하는 것을 넘어, 사용자의 실제 문제를 이해하고 
                    그 본질적 해결책을 찾는 것이 진정한 개발이라고 믿습니다. 
                    기술은 도구이며, 목적은 사용자의 삶을 더 편리하고 가치있게 만드는 것입니다.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium">경력 타임라인</h3>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-8">
                    <div className="relative flex items-start gap-6">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2 relative z-10"></div>
                      <div className="bg-background-secondary rounded-2xl p-6 flex-1">
                        <div className="text-sm text-foreground-secondary">2023 - Present</div>
                        <h4 className="font-medium mb-2">Senior Flutter Developer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Flutter 기반 크로스플랫폼 앱 개발 및 Spring Boot API 연동
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start gap-6">
                      <div className="w-3 h-3 bg-accent-success rounded-full mt-2 relative z-10"></div>
                      <div className="bg-background-secondary rounded-2xl p-6 flex-1">
                        <div className="text-sm text-foreground-secondary">2022 - 2023</div>
                        <h4 className="font-medium mb-2">Backend Developer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Spring Boot, Kotlin 기반 RESTful API 설계 및 구현
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start gap-6">
                      <div className="w-3 h-3 bg-accent-purple rounded-full mt-2 relative z-10"></div>
                      <div className="bg-background-secondary rounded-2xl p-6 flex-1">
                        <div className="text-sm text-foreground-secondary">2021 - 2022</div>
                        <h4 className="font-medium mb-2">DevOps Engineer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Docker 컨테이너화 및 Kubernetes 클러스터 운영
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-medium mb-12 text-center">포트폴리오</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project Card 1 */}
              <div className="bg-background rounded-3xl p-6 hover:shadow-lg transition-all group">
                <div className="h-48 bg-background-tertiary rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">Flutter</span>
                    </div>
                    <div className="text-sm text-foreground-secondary">모바일 앱</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-3">E-Commerce 모바일 앱</h3>
                <p className="text-foreground-secondary text-sm mb-4 leading-relaxed">
                  Flutter로 개발한 크로스플랫폼 쇼핑 앱. Spring Boot API와 연동하여 
                  실시간 결제 처리 및 주문 관리 시스템 구현.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">Flutter</span>
                  <span className="px-3 py-1 text-xs bg-accent-success/10 text-accent-success rounded-full">Dart</span>
                  <span className="px-3 py-1 text-xs bg-accent-warning/10 text-accent-warning rounded-full">REST API</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all">
                    Live Demo
                  </button>
                  <button className="bg-transparent text-foreground-secondary hover:text-foreground px-4 py-2 text-sm transition-all">
                    GitHub
                  </button>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-background rounded-3xl p-6 hover:shadow-lg transition-all group">
                <div className="h-48 bg-background-tertiary rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-success rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">Spring</span>
                    </div>
                    <div className="text-sm text-foreground-secondary">백엔드 API</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-3">실시간 알림 시스템</h3>
                <p className="text-foreground-secondary text-sm mb-4 leading-relaxed">
                  Spring Boot와 WebSocket을 활용한 실시간 푸시 알림 시스템. 
                  Redis 캐싱으로 성능 최적화 구현.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-xs bg-accent-success/10 text-accent-success rounded-full">Spring Boot</span>
                  <span className="px-3 py-1 text-xs bg-accent-purple/10 text-accent-purple rounded-full">Kotlin</span>
                  <span className="px-3 py-1 text-xs bg-accent-info/10 text-accent-info rounded-full">WebSocket</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all">
                    API Docs
                  </button>
                  <button className="bg-transparent text-foreground-secondary hover:text-foreground px-4 py-2 text-sm transition-all">
                    GitHub
                  </button>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="bg-background rounded-3xl p-6 hover:shadow-lg transition-all group">
                <div className="h-48 bg-background-tertiary rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-purple rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">K8s</span>
                    </div>
                    <div className="text-sm text-foreground-secondary">DevOps</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-3">컨테이너 오케스트레이션</h3>
                <p className="text-foreground-secondary text-sm mb-4 leading-relaxed">
                  Docker 컨테이너화 및 Kubernetes 클러스터 구성. 
                  CI/CD 파이프라인으로 자동 배포 구현.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-xs bg-accent-purple/10 text-accent-purple rounded-full">Docker</span>
                  <span className="px-3 py-1 text-xs bg-accent-info/10 text-accent-info rounded-full">Kubernetes</span>
                  <span className="px-3 py-1 text-xs bg-accent-warning/10 text-accent-warning rounded-full">CI/CD</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all">
                    Architecture
                  </button>
                  <button className="bg-transparent text-foreground-secondary hover:text-foreground px-4 py-2 text-sm transition-all">
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-medium mb-12 text-center">기술 스택</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Skills Categories */}
              <div className="space-y-8">
                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                    Frontend & Mobile
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Flutter</span>
                        <span className="text-sm text-foreground-secondary">90%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Dart</span>
                        <span className="text-sm text-foreground-secondary">85%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">React/Next.js</span>
                        <span className="text-sm text-foreground-secondary">75%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent-success rounded-full"></div>
                    Backend & Database
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Spring Boot</span>
                        <span className="text-sm text-foreground-secondary">85%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-success rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Kotlin</span>
                        <span className="text-sm text-foreground-secondary">80%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-success rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">MSSQL</span>
                        <span className="text-sm text-foreground-secondary">75%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-success rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent-purple rounded-full"></div>
                    DevOps & Cloud
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Docker</span>
                        <span className="text-sm text-foreground-secondary">80%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-purple rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Kubernetes</span>
                        <span className="text-sm text-foreground-secondary">70%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-purple rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">GitHub Actions</span>
                        <span className="text-sm text-foreground-secondary">75%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full">
                        <div className="h-2 bg-accent-purple rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background-secondary rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6">최근 학습 중</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-info rounded-full"></div>
                      <span className="text-sm">GraphQL API 설계</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-warning rounded-full"></div>
                      <span className="text-sm">Microservices Architecture</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Flutter Web 최적화</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-medium mb-12 text-center">연락하기</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-background rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6">함께 작업하고 싶으시다면</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">@</span>
                      </div>
                      <div>
                        <div className="font-medium">이메일</div>
                        <div className="text-foreground-secondary text-sm">developer@example.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-success rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">GH</span>
                      </div>
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-foreground-secondary text-sm">github.com/developer</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-info rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">LI</span>
                      </div>
                      <div>
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-foreground-secondary text-sm">linkedin.com/in/developer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-background rounded-3xl p-8">
                <h3 className="text-xl font-medium mb-6">메시지 보내기</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">이름</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    <input 
                      type="email" 
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">메시지</label>
                    <textarea 
                      rows={4}
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="메시지를 입력하세요"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-md font-medium transition-all"
                  >
                    메시지 보내기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-foreground-secondary mb-4">
              © 2025 Developer Portfolio. Flutter & Spring Boot로 만드는 더 나은 세상.
            </p>
            <div className="flex items-center justify-center gap-6">
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}