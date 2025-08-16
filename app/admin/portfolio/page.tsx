"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, FileText, Code, Github, User, Target } from 'lucide-react'
import AdminTitle from '../../../components/admin/AdminTitle'

const portfolioSections = [
  {
    id: 'about',
    title: 'About Me 관리',
    description: '개인 소개, 전문 분야, 개발 철학 관리',
    icon: User,
    color: 'bg-primary',
    href: '/admin/portfolio/about'
  },
  {
    id: 'projects',
    title: '포트폴리오 프로젝트',
    description: '프로젝트 목록 및 상세 정보 관리',
    icon: Target,
    color: 'bg-accent-success',
    href: '/admin/portfolio/projects'
  },
  {
    id: 'skills',
    title: '기술 스택 관리',
    description: '기술 카테고리와 숙련도 관리',
    icon: Settings,
    color: 'bg-accent-purple',
    href: '/admin/portfolio/skills'
  },
  {
    id: 'code-examples',
    title: '코드 예제 관리',
    description: '코드 스니펫과 예제 관리',
    icon: Code,
    color: 'bg-accent-warning',
    href: '/admin/portfolio/code-examples'
  },
  {
    id: 'github-repos',
    title: 'GitHub 저장소',
    description: 'GitHub 레포지토리 정보 관리',
    icon: Github,
    color: 'bg-accent-info',
    href: '/admin/portfolio/github-repos'
  }
]

export default function PortfolioManagementPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-8">
      <AdminTitle
        title="포트폴리오 관리"
        description="포트폴리오 페이지의 모든 콘텐츠를 관리하고 편집할 수 있습니다."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioSections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(section.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.a
                href={section.href}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block h-full"
              >
                <div className="card-primary h-full p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-transparent hover:border-primary">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{
                        scale: hoveredCard === section.id ? 1.1 : 1,
                        rotate: hoveredCard === section.id ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} className="text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: hoveredCard === section.id ? 1 : 0,
                      x: hoveredCard === section.id ? 0 : -10
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-primary text-sm font-medium"
                  >
                    <span>관리하기</span>
                    <motion.div
                      animate={{ x: hoveredCard === section.id ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </div>
              </motion.a>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-primary p-6"
      >
        <h3 className="text-lg font-semibold mb-4">포트폴리오 현황</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'About 섹션', value: '1', color: 'text-primary' },
            { label: '프로젝트', value: '3', color: 'text-accent-success' },
            { label: '기술 카테고리', value: '3', color: 'text-accent-purple' },
            { label: '코드 예제', value: '2', color: 'text-accent-warning' },
            { label: 'GitHub 저장소', value: '3', color: 'text-accent-info' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center p-4 bg-background-secondary rounded-lg"
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-foreground-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-primary p-6 border-l-4 border-accent-info"
      >
        <div className="flex items-start gap-3">
          <FileText size={20} className="text-accent-info mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">사용 가이드</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>• <strong>About Me</strong>: 개인 소개, 전문 분야, 개발 철학을 수정할 수 있습니다.</li>
              <li>• <strong>포트폴리오 프로젝트</strong>: 프로젝트 추가, 수정, 삭제 및 순서 변경이 가능합니다.</li>
              <li>• <strong>기술 스택</strong>: 기술 카테고리별로 스킬과 숙련도를 관리할 수 있습니다.</li>
              <li>• <strong>코드 예제</strong>: 코드 스니펫을 추가하고 문법 하이라이팅을 적용할 수 있습니다.</li>
              <li>• <strong>GitHub 저장소</strong>: 대표 레포지토리 정보를 관리할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}