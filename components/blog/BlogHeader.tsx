"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, Lightbulb, Code } from 'lucide-react'
import AnimatedSection from '../AnimatedSection'

export default function BlogHeader() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-accent-purple rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-accent-purple rounded-full mx-auto mb-8 flex items-center justify-center"
            >
              <PenTool size={32} className="text-white" />
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-medium mb-6">
              개발 인사이트
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg text-foreground-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
              일하면서 배우고 느낀 점들을 기록합니다. 
              기술적 도전과 문제 해결 과정, 그리고 개발자로서의 성장 이야기를 공유합니다.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-3 bg-background-secondary rounded-2xl border border-border"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Code size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">기술적 인사이트</div>
                  <div className="text-sm text-foreground-secondary">실전 개발 경험</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-3 bg-background-secondary rounded-2xl border border-border"
              >
                <div className="w-10 h-10 bg-accent-success/10 rounded-full flex items-center justify-center">
                  <Lightbulb size={20} className="text-accent-success" />
                </div>
                <div className="text-left">
                  <div className="font-medium">학습과 성장</div>
                  <div className="text-sm text-foreground-secondary">지속적인 발전</div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}