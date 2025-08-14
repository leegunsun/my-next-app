"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError ? (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      ) : (
        <div 
          className="w-full h-full bg-background-secondary flex items-center justify-center"
          role="img"
          aria-label={alt}
        >
          <span className="text-foreground-muted text-sm">이미지를 불러올 수 없습니다</span>
        </div>
      )}
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-background-secondary animate-pulse" />
      )}
    </div>
  )
}