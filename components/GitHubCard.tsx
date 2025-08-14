"use client"

import { motion } from "framer-motion"
import { Star, GitFork, ExternalLink, Calendar } from "lucide-react"

interface GitHubRepo {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  url: string
}

interface GitHubCardProps {
  repo: GitHubRepo
  delay?: number
}

export default function GitHubCard({ repo, delay = 0 }: GitHubCardProps) {
  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      "Dart": "bg-blue-500",
      "Kotlin": "bg-purple-500",
      "TypeScript": "bg-blue-600",
      "JavaScript": "bg-yellow-500",
      "Docker": "bg-blue-400",
      "Python": "bg-green-500",
      "Java": "bg-red-500"
    }
    return colors[language] || "bg-gray-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="card-interactive h-full bg-background"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-primary group-hover:text-foreground transition-colors">
            {repo.name}
          </h3>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-foreground-secondary hover:text-foreground transition-colors"
            aria-label={`${repo.name} GitHub 저장소 열기`}
          >
            <ExternalLink size={16} />
          </motion.a>
        </div>

        {/* Description */}
        <p className="text-foreground-secondary text-sm mb-4 leading-relaxed line-clamp-3">
          {repo.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-foreground-secondary">
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork size={14} />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{repo.lastUpdated}</span>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
          <span className="text-sm text-foreground-secondary">{repo.language}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}