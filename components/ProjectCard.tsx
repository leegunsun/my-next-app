"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  icon: string
  iconBg: string
  liveUrl?: string
  githubUrl?: string
  delay?: number
}

export default function ProjectCard({
  title,
  description,
  tags,
  icon,
  iconBg,
  liveUrl,
  githubUrl,
  delay = 0
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="card-interactive bg-background rounded-3xl p-6 h-full"
      >
        {/* Project Icon */}
        <div className="h-48 bg-background-tertiary rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className={`w-16 h-16 ${iconBg} rounded-full mx-auto mb-3 flex items-center justify-center`}>
              <span className="text-sm font-medium text-white">{icon}</span>
            </div>
            <div className="text-sm text-foreground-secondary">프로젝트</div>
          </motion.div>
          
          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/5 flex items-center justify-center"
          >
            <div className="flex gap-3">
              {liveUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white"
                >
                  <ExternalLink size={16} />
                </motion.button>
              )}
              {githubUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background"
                >
                  <Github size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Project Info */}
        <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground-secondary text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1 * index, duration: 0.3 }}
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          {liveUrl && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
            >
              <ExternalLink size={14} />
              Live Demo
            </motion.button>
          )}
          {githubUrl && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent text-foreground-secondary hover:text-foreground px-4 py-2 text-sm transition-all flex items-center gap-2"
            >
              <Github size={14} />
              GitHub
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}