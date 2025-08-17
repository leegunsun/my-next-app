"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Download, Mail, Github, Linkedin, ExternalLink, ChevronDown, CheckCircle } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import SkillProgress from "../components/SkillProgress"
import ProjectCard from "../components/ProjectCard"
import CodeSnippet from "../components/CodeSnippet"
import GitHubCard from "../components/GitHubCard"
import AdminNavigation from "../components/admin/AdminNavigation"
import CustomSection from "../components/CustomSection"
import { downloadResume, submitContactForm, requestNotificationPermission, processHtmlForGradientText, type ContactFormData } from "../lib/utils"
import type { GitHubRepository, PortfolioProject, AboutMeData, SkillCategory, CodeExample, PortfolioSection, PortfolioSectionSettings } from "../lib/types/portfolio"
import { useAnalytics } from "../lib/analytics"

export default function Home() {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ""
  })
  const [githubRepos, setGithubRepos] = useState<GitHubRepository[]>([])
  const [isLoadingRepos, setIsLoadingRepos] = useState(true)
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null)
  const [skillsData, setSkillsData] = useState<SkillCategory[]>([])
  const [codeExamplesData, setCodeExamplesData] = useState<CodeExample[]>([])
  const [sectionsData, setSectionsData] = useState<{sections: PortfolioSection[], settings: PortfolioSectionSettings} | null>(null)
  const [isLoadingAbout, setIsLoadingAbout] = useState(true)
  const [isLoadingSkills, setIsLoadingSkills] = useState(true)
  const [isLoadingCodeExamples, setIsLoadingCodeExamples] = useState(true)
  const [isLoadingSections, setIsLoadingSections] = useState(true)

  // Analytics Hook 사용
  const { 
    trackButtonClick, 
    trackCustomEvent, 
    trackContactFormSubmit: trackContactFormSubmitAnalytics 
  } = useAnalytics()

  const fetchAboutData = useCallback(async () => {
    try {
      setIsLoadingAbout(true)
      const response = await fetch('/api/portfolio/about')
      const result = await response.json()
      
      if (result.success && result.data) {
        setAboutData(result.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setIsLoadingAbout(false)
    }
  }, [])

  const fetchSkillsData = useCallback(async () => {
    try {
      setIsLoadingSkills(true)
      const response = await fetch('/api/portfolio/skills')
      const result = await response.json()
      
      if (result.success && result.data) {
        setSkillsData(result.data)
      }
    } catch (error) {
      console.error('Error fetching skills data:', error)
    } finally {
      setIsLoadingSkills(false)
    }
  }, [])

  const fetchCodeExamplesData = useCallback(async () => {
    try {
      setIsLoadingCodeExamples(true)
      const response = await fetch('/api/portfolio/code-examples')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Only show active code examples, sorted by order
        const activeExamples = result.data
          .filter((example: CodeExample) => example.isActive)
          .sort((a: CodeExample, b: CodeExample) => (a.order || 99) - (b.order || 99))
        setCodeExamplesData(activeExamples)
      }
    } catch (error) {
      console.error('Error fetching code examples data:', error)
    } finally {
      setIsLoadingCodeExamples(false)
    }
  }, [])

  const fetchSectionSettings = useCallback(async () => {
    try {
      setIsLoadingSections(true)
      const response = await fetch('/api/portfolio/sections')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Store the complete data object with sections and settings
        setSectionsData(result.data)
        console.log('📋 Portfolio sections loaded:', result.data)
      }
    } catch (error) {
      console.error('Error fetching section settings:', error)
    } finally {
      setIsLoadingSections(false)
    }
  }, [])

  // Fallback GitHub repositories (used when API fails)
  const fallbackGithubRepos = useMemo(() => [
    {
      id: "fallback-1",
      name: "flutter-ecommerce-app",
      description: "Flutter로 구현한 크로스플랫폼 전자상거래 앱. Provider 패턴과 API 연동으로 상태 관리 최적화.",
      language: "Dart",
      stars: 42,
      forks: 8,
      lastUpdated: "2024-01-15",
      url: "https://github.com/developer/flutter-ecommerce-app",
      isActive: true,
      showOnHomepage: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "fallback-2",
      name: "spring-boot-notification-api",
      description: "Spring Boot와 WebSocket을 활용한 실시간 알림 시스템. Redis 캐싱과 JWT 인증 구현.",
      language: "Kotlin",
      stars: 35,
      forks: 12,
      lastUpdated: "2024-01-10",
      url: "https://github.com/developer/spring-boot-notification-api",
      isActive: true,
      showOnHomepage: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "fallback-3",
      name: "kubernetes-deployment-configs",
      description: "Production 환경을 위한 Kubernetes 배포 설정 파일과 CI/CD 파이프라인 구성.",
      language: "Docker",
      stars: 28,
      forks: 6,
      lastUpdated: "2024-01-08",
      url: "https://github.com/developer/kubernetes-deployment-configs",
      isActive: true,
      showOnHomepage: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ], [])

  // Fallback portfolio projects (used when API fails)
  const fallbackProjects = useMemo(() => [
    {
      id: 'project-1',
      title: 'E-Commerce 모바일 앱',
      description: 'Flutter로 개발한 크로스플랫폼 쇼핑 앱. Spring Boot API와 연동하여 실시간 결제 처리 및 주문 관리 시스템 구현.',
      tags: ['Flutter', 'Dart', 'REST API'],
      icon: 'Flutter',
      iconBg: 'bg-primary',
      liveUrl: '#',
      githubUrl: '#',
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'project-2',
      title: '실시간 알림 시스템',
      description: 'Spring Boot와 WebSocket을 활용한 실시간 푸시 알림 시스템. Redis 캐싱으로 성능 최적화 구현.',
      tags: ['Spring Boot', 'Kotlin', 'WebSocket'],
      icon: 'Spring',
      iconBg: 'bg-accent-success',
      liveUrl: '#',
      githubUrl: '#',
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'project-3',
      title: '컨테이너 오케스트레이션',
      description: 'Docker 컨테이너화 및 Kubernetes 클러스터 구성. CI/CD 파이프라인으로 자동 배포 구현.',
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      icon: 'K8s',
      iconBg: 'bg-accent-purple',
      liveUrl: '#',
      githubUrl: '#',
      isActive: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ], [])

  const fetchGitHubRepos = useCallback(async () => {
    try {
      setIsLoadingRepos(true)
      const response = await fetch('/api/portfolio/github-repos?homepage=true')
      const result = await response.json()
      
      if (result.success) {
        setGithubRepos(result.data.length > 0 ? result.data : fallbackGithubRepos)
      } else {
        console.error('Failed to fetch GitHub repos:', result.message)
        setGithubRepos(fallbackGithubRepos)
      }
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      setGithubRepos(fallbackGithubRepos)
    } finally {
      setIsLoadingRepos(false)
    }
  }, [fallbackGithubRepos])

  const fetchPortfolioProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true)
      const response = await fetch('/api/portfolio/projects')
      const result = await response.json()
      
      if (result.success && result.data.length > 0) {
        // Only show active projects, sorted by order
        const activeProjects = result.data
          .filter((project: PortfolioProject) => project.isActive)
          .sort((a: PortfolioProject, b: PortfolioProject) => (a.order || 99) - (b.order || 99))
        setPortfolioProjects(activeProjects)
      } else {
        console.log('No portfolio projects found or API error, using fallback data')
        setPortfolioProjects(fallbackProjects)
      }
    } catch (error) {
      console.error('Error fetching portfolio projects:', error)
      setPortfolioProjects(fallbackProjects)
    } finally {
      setIsLoadingProjects(false)
    }
  }, [fallbackProjects])

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission()
    
    // Fetch all data for homepage
    fetchAboutData()
    fetchSkillsData()
    fetchCodeExamplesData()
    fetchSectionSettings()
    fetchGitHubRepos()
    fetchPortfolioProjects()
  }, [fetchAboutData, fetchSkillsData, fetchCodeExamplesData, fetchSectionSettings, fetchGitHubRepos, fetchPortfolioProjects])

  // Debug: Log section integration status
  useEffect(() => {
    if (sectionsData && !isLoadingSections) {
      const customSections = sectionsData.sections?.filter((s) => s.id.startsWith('custom-')) || []
      console.log('🔄 Section Integration Status:', {
        sectionsLoaded: !!sectionsData,
        totalSections: sectionsData.sections?.length || 0,
        activeSections: sectionsData.sections?.filter((s) => s.isActive).length || 0,
        navigationSections: sectionsData.sections?.filter((s) => s.showInNavigation && s.isActive).length || 0,
        customSections: customSections.length,
        activeCustomSections: customSections.filter((s) => s.isActive).length,
        customSectionDetails: customSections.map((s) => ({
          id: s.id,
          title: s.title,
          isActive: s.isActive,
          showInNavigation: s.showInNavigation,
          homeSection: s.homeSection,
          order: s.order
        })),
        settings: sectionsData.settings
      })
    }
  }, [sectionsData, isLoadingSections])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    const result = await submitContactForm(contactForm)
    
    setSubmitStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    })
    
    if (result.success) {
      setContactForm({ name: "", email: "", message: "" })
      // 연락처 폼 제출 추적
      trackContactFormSubmitAnalytics()
    }
    
    setIsSubmitting(false)
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  // Get active sections for navigation
  const getActiveSections = () => {
    if (!sectionsData || !sectionsData.sections) {
      // Fallback navigation items when section settings are not loaded
      return [
        { 
          id: 'about', 
          homeSection: 'about', 
          title: 'About', 
          description: 'About section', 
          icon: 'User', 
          color: 'primary', 
          href: '#about', 
          showInNavigation: true, 
          isActive: true, 
          showInAdminGrid: true, 
          order: 1, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        },
        { 
          id: 'projects', 
          homeSection: 'portfolio', 
          title: 'Portfolio', 
          description: 'Portfolio section', 
          icon: 'Briefcase', 
          color: 'primary', 
          href: '#portfolio', 
          showInNavigation: true, 
          isActive: true, 
          showInAdminGrid: true, 
          order: 2, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        },
        { 
          id: 'skills', 
          homeSection: 'skills', 
          title: 'Skills', 
          description: 'Skills section', 
          icon: 'Code', 
          color: 'primary', 
          href: '#skills', 
          showInNavigation: true, 
          isActive: true, 
          showInAdminGrid: true, 
          order: 3, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        },
        { 
          id: 'code-examples', 
          homeSection: 'code-examples', 
          title: 'Code', 
          description: 'Code examples section', 
          icon: 'Terminal', 
          color: 'primary', 
          href: '#code-examples', 
          showInNavigation: true, 
          isActive: true, 
          showInAdminGrid: true, 
          order: 4, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        }
      ]
    }
    
    return sectionsData.sections
      .filter((section: PortfolioSection) => section.showInNavigation && section.isActive)
      .sort((a: PortfolioSection, b: PortfolioSection) => (a.order || 99) - (b.order || 99))
  }

  // Render navigation items dynamically
  const renderNavigationItems = () => {
    const activeSections = getActiveSections()
    const navigationItems = []

    // Show loading indicator if sections are still loading
    if (isLoadingSections) {
      navigationItems.push(
        <div key="loading" className="flex items-center gap-2 px-3 py-2">
          <div className="animate-spin w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full"></div>
          <span className="text-sm text-foreground-secondary">Loading...</span>
        </div>
      )
    } else {
      // Add sections that are active and should show in navigation
      activeSections.forEach((section: PortfolioSection) => {
        const navItem = getNavigationItem(section)
        if (navItem) {
          navigationItems.push(navItem)
        }
      })
    }

    // Always add Blog and Contact (not managed by section system)
    navigationItems.push(
      <motion.a 
        key="blog"
        whileHover={{ scale: 1.05 }}
        href="/blog"
        onClick={() => trackButtonClick('nav_blog', 'navigation')}
        className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
      >
        Blog
      </motion.a>,
      <motion.a 
        key="contact"
        whileHover={{ scale: 1.05 }}
        href="#contact"
        onClick={() => trackButtonClick('nav_contact', 'navigation')}
        className="bg-accent-blend text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all"
      >
        Contact
      </motion.a>
    )

    return navigationItems
  }

  // Get navigation item for a section
  const getNavigationItem = (section: PortfolioSection) => {
    const navConfig = {
      'about': { href: '#about', label: 'About', trackId: 'nav_about' },
      'portfolio': { href: '#portfolio', label: 'Portfolio', trackId: 'nav_portfolio' },
      'skills': { href: '#skills', label: 'Skills', trackId: 'nav_skills' },
      'code-examples': { href: '#code-examples', label: 'Code', trackId: 'nav_code' }
    }

    // Handle custom sections
    if (section.id.startsWith('custom-')) {
      const displayLabel = section.title.replace(' 관리', '')
      const sectionAnchor = section.homeSection || section.id
      
      return (
        <motion.a 
          key={section.id}
          whileHover={{ scale: 1.05 }}
          href={`#${sectionAnchor}`}
          onClick={() => trackButtonClick(`nav_${section.id}`, 'navigation')}
          className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
        >
          {displayLabel}
        </motion.a>
      )
    }

    // Handle default sections
    const config = navConfig[section.homeSection as keyof typeof navConfig]
    if (!config) return null

    // Use section title from admin settings if available, otherwise use config label
    const displayLabel = section.title && section.title !== section.id ? 
      (section.title.includes('관리') ? config.label : section.title) : 
      config.label

    return (
      <motion.a 
        key={section.homeSection}
        whileHover={{ scale: 1.05 }}
        href={config.href}
        onClick={() => trackButtonClick(config.trackId, 'navigation')}
        className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
      >
        {displayLabel}
      </motion.a>
    )
  }

  // Check if a section should be rendered
  const shouldRenderSection = (sectionId: string) => {
    if (!sectionsData || !sectionsData.sections) {
      console.log(`📄 Section ${sectionId}: Using fallback (sections not loaded)`)
      return true // Show all sections by default if settings not loaded
    }
    
    const section = sectionsData.sections.find((s: PortfolioSection) => s.homeSection === sectionId)
    const shouldRender = section ? section.isActive : true
    console.log(`📄 Section ${sectionId}:`, { found: !!section, isActive: section?.isActive, shouldRender })
    return shouldRender
  }

  // Get custom sections that should be rendered on homepage
  const getCustomSections = () => {
    if (!sectionsData || !sectionsData.sections) {
      return []
    }
    
    const customSections = sectionsData.sections
      .filter((section: PortfolioSection) => 
        section.id.startsWith('custom-') && 
        section.isActive
      )
      .sort((a: PortfolioSection, b: PortfolioSection) => (a.order || 99) - (b.order || 99))
    
    console.log('🎨 Custom sections to render:', customSections.map(s => ({
      id: s.id,
      title: s.title,
      order: s.order,
      isActive: s.isActive
    })))
    
    return customSections
  }

  // Render custom sections
  const renderCustomSections = () => {
    const customSections = getCustomSections()
    
    if (customSections.length === 0) {
      return null
    }

    return customSections.map((section: PortfolioSection, index: number) => (
      <CustomSection
        key={section.id}
        section={section}
        delay={index * 0.1}
        className={index % 2 === 0 ? "" : "bg-background-secondary"}
      />
    ))
  }

  const fallbackCodeExamples = [
    {
      title: "Flutter Provider 패턴",
      language: "dart",
      code: `class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  
  List<CartItem> get items => List.unmodifiable(_items);
  
  void addItem(Product product) {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );
    
    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(product: product, quantity: 1));
    }
    notifyListeners();
  }
  
  double get totalAmount => _items.fold(
    0.0, (sum, item) => sum + item.totalPrice,
  );
}`
    },
    {
      title: "Spring Boot WebSocket 설정",
      language: "kotlin",
      code: `@Configuration
@EnableWebSocket
class WebSocketConfig : WebSocketConfigurer {
    
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(NotificationHandler(), "/notifications")
            .setAllowedOrigins("*")
            .withSockJS()
    }
}

@Component
class NotificationHandler : TextWebSocketHandler() {
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    
    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions[session.id] = session
        logger.info("WebSocket connection established: {}", session.id)
    }
    
    fun broadcast(message: String) {
        sessions.values.forEach { session ->
            if (session.isOpen) {
                session.sendMessage(TextMessage(message))
            }
        }
    }
}`
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 w-full z-50 bg-overlay-backdrop backdrop-blur-[20px] border-b border-border shadow-sm"
        role="navigation"
        aria-label="메인 내비게이션"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left section - Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-lg font-medium bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent flex-shrink-0"
          >
            Portfolio
          </motion.div>
          
          {/* Right section - Navigation */}
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex items-center justify-end gap-6 px-2" style={{ minWidth: 'max-content' }}>
              {/* Dynamic Navigation Based on Section Settings */}
              {renderNavigationItems()}
            </div>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden" aria-label="소개">
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 hero-gradient-bg">
          {/* Left side gradient orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute top-1/2 left-10 transform -translate-y-1/2 w-[500px] h-[400px] hero-gradient-orb rounded-full"
          />
          
          {/* Right side gradient orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.12, scale: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
            className="absolute top-1/2 right-10 transform -translate-y-1/2 w-[450px] h-[350px] hero-gradient-orb-secondary rounded-full"
          />
          
          {/* Center accent gradient orb */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 3, delay: 1, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[250px] hero-gradient-orb-accent rounded-full"
          />
          
          {/* Subtle sparkle elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute top-1/4 right-1/3 w-1 h-1 bg-primary rounded-full sparkle-effect"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 2, delay: 2 }}
            className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-accent-purple rounded-full sparkle-effect"
            style={{animationDelay: '2s'}}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="absolute top-2/3 right-1/5 w-1 h-1 bg-accent-blend rounded-full sparkle-effect"
            style={{animationDelay: '4s'}}
          />
        </div>

        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              className="w-32 h-32 bg-background-secondary rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg border border-border floating-element relative"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-24 h-24 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center"
                role="img"
                aria-label="개발자 프로필 이미지"
              >
                <span className="text-2xl font-bold text-white" aria-hidden="true">Dev</span>
              </motion.div>
              
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-full"></div>
              
              {/* Floating tech icons around profile */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-2 -right-2 w-8 h-8 glass-effect rounded-full flex items-center justify-center floating-element-reverse shadow-md"
              >
                <span className="text-lg">🚀</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-2 -left-2 w-10 h-10 glass-effect rounded-full flex items-center justify-center floating-element shadow-md"
              >
                <span className="text-xl">💻</span>
              </motion.div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-medium leading-tight mb-6"
            >
              {!isLoadingAbout && aboutData ? (
                <span dangerouslySetInnerHTML={{ __html: processHtmlForGradientText(aboutData.heroTitle) }} />
              ) : (
                <>
                  사용자의 문제를 구조적으로 해결하는<br />
                  <span className="text-gradient-flutter">Flutter</span> &amp; <span className="text-gradient-spring">Spring Boot</span> 개발자
                </>
              )}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-foreground-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
            >
              {!isLoadingAbout && aboutData ? aboutData.heroSubtitle : (
                '모바일과 백엔드 개발의 경계를 넘나들며, 사용자 중심의 기술 솔루션을 설계하고 구현합니다. 문제 해결을 통한 가치 창출에 집중합니다.'
              )}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  trackButtonClick('download_resume', 'hero_section')
                  await downloadResume()
                }}
                className="bg-accent-blend text-primary-foreground hover:opacity-90 px-6 py-3 text-base rounded-md font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <Download size={20} />
                이력서 다운로드
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#portfolio"
                onClick={() => trackButtonClick('view_projects', 'hero_section')}
                className="bg-transparent text-foreground hover:bg-overlay-hover px-6 py-3 text-base rounded-md font-medium transition-all border border-border shadow-sm"
              >
                프로젝트 보기
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/leegunsun"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackButtonClick('github_hero', 'social_links')}
                className="w-12 h-12 glass-effect hover:bg-primary/10 rounded-full flex items-center justify-center transition-all shadow-lg border border-border group"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                onClick={() => trackButtonClick('linkedin_hero', 'social_links')}
                className="w-12 h-12 glass-effect hover:bg-accent-purple/10 rounded-full flex items-center justify-center transition-all shadow-lg border border-border group"
              >
                <Linkedin size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                onClick={() => trackButtonClick('external_link_hero', 'social_links')}
                className="w-12 h-12 glass-effect hover:bg-accent-blend/10 rounded-full flex items-center justify-center transition-all shadow-lg border border-border group"
              >
                <ExternalLink size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-2 text-foreground-secondary"
              >
                <span className="text-sm">스크롤하여 더 보기</span>
                <ChevronDown size={20} />
              </motion.div>
            </motion.div>
          </div>
        </div>
        </section>

        {/* About Section */}
        {shouldRenderSection('about') && (
          <section id="about" className="py-20" aria-label="소개 세부 정보">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">About Me</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* About Content */}
              <div className="space-y-6">
                <AnimatedSection delay={0.1} className="card-primary">
                  <h3 className="text-xl font-medium mb-4">전문 분야</h3>
                  <div className="space-y-3">
                    {!isLoadingAbout && aboutData && aboutData.specialties ? (
                      aboutData.specialties.map((specialty: { id: string; name: string; color: string }, index: number) => (
                        <motion.div 
                          key={specialty.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          onClick={() => trackCustomEvent('skill_click', { skill: specialty.name, section: 'about' })}
                          className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                        >
                          <div className={`w-3 h-3 rounded-full ${specialty.color === 'primary' ? 'bg-primary' : 
                            specialty.color === 'accent-success' ? 'bg-accent-success' :
                            specialty.color === 'accent-purple' ? 'bg-accent-purple' :
                            specialty.color === 'accent-warning' ? 'bg-accent-warning' : 'bg-primary'}`}></div>
                          <span>{specialty.name}</span>
                        </motion.div>
                      ))
                    ) : (
                      // Fallback content
                      <>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          onClick={() => trackCustomEvent('skill_click', { skill: 'flutter', section: 'about' })}
                          className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                        >
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span>Flutter 모바일 앱 개발</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          onClick={() => trackCustomEvent('skill_click', { skill: 'spring_boot', section: 'about' })}
                          className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                        >
                          <div className="w-3 h-3 bg-accent-success rounded-full"></div>
                          <span>Spring Boot 백엔드 API 개발</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 }}
                          onClick={() => trackCustomEvent('skill_click', { skill: 'docker_kubernetes', section: 'about' })}
                          className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                        >
                          <div className="w-3 h-3 bg-accent-purple rounded-full"></div>
                          <span>Docker & Kubernetes 컨테이너 운영</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                          onClick={() => trackCustomEvent('skill_click', { skill: 'mssql', section: 'about' })}
                          className="flex items-center gap-3 cursor-pointer hover:bg-background-tertiary p-2 rounded-lg transition-colors"
                        >
                          <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
                          <span>MSSQL 데이터베이스 설계</span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.2} className="card-primary">
                  <h3 className="text-xl font-medium mb-4">개발 철학</h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    {!isLoadingAbout && aboutData ? aboutData.philosophy : (
                      '단순히 기능을 구현하는 것을 넘어, 사용자의 실제 문제를 이해하고 그 본질적 해결책을 찾는 것이 진정한 개발이라고 믿습니다. 기술은 도구이며, 목적은 사용자의 삶을 더 편리하고 가치있게 만드는 것입니다.'
                    )}
                  </p>
                </AnimatedSection>
              </div>

              {/* Timeline */}
              <AnimatedSection delay={0.3} className="space-y-6">
                <h3 className="text-xl font-medium">경력 타임라인</h3>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute left-6 top-0 w-0.5 bg-border"
                  />
                  
                  {/* Timeline Items */}
                  <div className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="relative flex items-start gap-6 group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                        viewport={{ once: true }}
                        className="w-3 h-3 bg-primary rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                      >
                        <div className="text-sm text-foreground-secondary">2023 - Present</div>
                        <h4 className="font-medium mb-2">Senior Flutter Developer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Flutter 기반 크로스플랫폼 앱 개발 및 Spring Boot API 연동
                        </p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="relative flex items-start gap-6 group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                        viewport={{ once: true }}
                        className="w-3 h-3 bg-accent-success rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                      >
                        <div className="text-sm text-foreground-secondary">2022 - 2023</div>
                        <h4 className="font-medium mb-2">Backend Developer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Spring Boot, Kotlin 기반 RESTful API 설계 및 구현
                        </p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="relative flex items-start gap-6 group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                        viewport={{ once: true }}
                        className="w-3 h-3 bg-accent-purple rounded-full mt-2 relative z-10 group-hover:scale-150 transition-transform"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-background-secondary rounded-2xl p-6 flex-1 border border-border shadow-sm"
                      >
                        <div className="text-sm text-foreground-secondary">2021 - 2022</div>
                        <h4 className="font-medium mb-2">DevOps Engineer</h4>
                        <p className="text-foreground-secondary text-sm">
                          Docker 컨테이너화 및 Kubernetes 클러스터 운영
                        </p>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
        </section>
        )}

        {/* Portfolio Section */}
        {shouldRenderSection('portfolio') && (
          <section id="portfolio" className="py-20 bg-background-secondary" aria-label="포트폴리오">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">포트폴리오</h2>
            </AnimatedSection>
            
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-foreground-secondary">프로젝트를 불러오는 중...</p>
                </div>
              </div>
            ) : portfolioProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioProjects.map((project, index) => (
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
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📂</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">표시할 프로젝트가 없습니다</h3>
                  <p className="text-foreground-secondary text-sm">
                    관리자 페이지에서 포트폴리오 프로젝트를 추가해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>
        )}

        {/* Skills Section */}
        {shouldRenderSection('skills') && (
          <section id="skills" className="py-20" aria-label="기술 스택">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">기술 스택</h2>
            </AnimatedSection>
            
            {!isLoadingSkills && skillsData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {skillsData.map((category: SkillCategory, categoryIndex: number) => (
                  <AnimatedSection key={category.id} delay={0.1 * categoryIndex} className="card-primary">
                    <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${
                        category.color === 'primary' ? 'bg-primary' :
                        category.color === 'success' ? 'bg-accent-success' :
                        category.color === 'purple' ? 'bg-accent-purple' :
                        category.color === 'warning' ? 'bg-accent-warning' :
                        category.color === 'info' ? 'bg-accent-info' : 'bg-primary'
                      }`}></div>
                      {category.name}
                    </h3>
                    <div className="space-y-4">
                      {category.skills.map((skill: { id: string; name: string; percentage: number; color: string }, skillIndex: number) => (
                        <SkillProgress 
                          key={skill.id}
                          name={skill.name} 
                          percentage={skill.percentage} 
                          color={skill.color} 
                          delay={0.2 + skillIndex * 0.1} 
                        />
                      ))}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              // Fallback content
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Skills Categories */}
                <div className="space-y-8">
                  <AnimatedSection delay={0.1} className="card-primary">
                    <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                      Frontend & Mobile
                    </h3>
                    <div className="space-y-4">
                      <SkillProgress name="Flutter" percentage={90} color="primary" delay={0.2} />
                      <SkillProgress name="Dart" percentage={85} color="primary" delay={0.3} />
                      <SkillProgress name="React/Next.js" percentage={75} color="primary" delay={0.4} />
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={0.2} className="card-primary">
                    <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent-success rounded-full"></div>
                      Backend & Database
                    </h3>
                    <div className="space-y-4">
                      <SkillProgress name="Spring Boot" percentage={85} color="success" delay={0.2} />
                      <SkillProgress name="Kotlin" percentage={80} color="success" delay={0.3} />
                      <SkillProgress name="MSSQL" percentage={75} color="success" delay={0.4} />
                    </div>
                  </AnimatedSection>
                </div>

                <div className="space-y-8">
                  <AnimatedSection delay={0.3} className="card-primary">
                    <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent-purple rounded-full"></div>
                      DevOps & Cloud
                    </h3>
                    <div className="space-y-4">
                      <SkillProgress name="Docker" percentage={80} color="purple" delay={0.2} />
                      <SkillProgress name="Kubernetes" percentage={70} color="purple" delay={0.3} />
                      <SkillProgress name="GitHub Actions" percentage={75} color="purple" delay={0.4} />
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={0.4} className="card-primary">
                    <h3 className="text-xl font-medium mb-6">최근 학습 중</h3>
                    <div className="space-y-3">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-accent-info rounded-full"></div>
                        <span className="text-sm">GraphQL API 설계</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-accent-warning rounded-full"></div>
                        <span className="text-sm">Microservices Architecture</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">Flutter Web 최적화</span>
                      </motion.div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>
        )}

        {/* Code Examples & GitHub */}
        {shouldRenderSection('code-examples') && (
          <section id="code-examples" className="py-20 bg-background-secondary" aria-label="코드 예제 및 GitHub">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <AnimatedSection className="text-center mb-12">
                <h2 className="text-3xl font-medium mb-4">코드 예제 & GitHub</h2>
                <p className="text-foreground-secondary max-w-2xl mx-auto">
                  실제 프로젝트에서 사용한 코드 패턴과 GitHub 저장소를 통해 
                  개발 역량과 코드 품질을 확인해보세요.
                </p>
              </AnimatedSection>

              {/* Code Examples */}
              <div className="mb-16">
                <AnimatedSection delay={0.1} className="mb-8">
                  <h3 className="text-2xl font-medium text-center">코드 스니펫</h3>
                </AnimatedSection>
                
                {!isLoadingCodeExamples && codeExamplesData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {codeExamplesData.map((example) => (
                      <CodeSnippet
                        key={`admin-${example.id}`}
                        title={example.title}
                        language={example.language}
                        code={example.code}
                        className="w-full"
                      />
                    ))}
                  </div>
                ) : (
                  // Fallback content
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {fallbackCodeExamples.map((example, index) => (
                      <CodeSnippet
                        key={`fallback-${index}`}
                        title={example.title}
                        language={example.language}
                        code={example.code}
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* GitHub Repositories */}
              <div>
                <AnimatedSection delay={0.2} className="mb-8">
                  <h3 className="text-2xl font-medium text-center">GitHub 저장소</h3>
                </AnimatedSection>
                
                {isLoadingRepos ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-foreground-secondary">GitHub 저장소를 불러오는 중...</p>
                    </div>
                  </div>
                ) : githubRepos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {githubRepos.map((repo, index) => (
                      <GitHubCard
                        key={repo.name || repo.id}
                        repo={repo}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Github size={24} className="text-foreground-secondary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">표시할 저장소가 없습니다</h3>
                      <p className="text-foreground-secondary text-sm">
                        관리자 페이지에서 홈페이지에 표시할 GitHub 저장소를 선택해주세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Custom Sections */}
        {renderCustomSections()}

        {/* Contact Section */}
        <section id="contact" className="py-20" aria-label="연락처">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">연락하기</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <AnimatedSection delay={0.1} className="space-y-6">
                <div className="card-primary">
                  <h3 className="text-xl font-medium mb-6">함께 작업하고 싶으시다면</h3>
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      onClick={() => trackButtonClick('email_contact', 'contact_section')}
                      className="flex items-center gap-4 group cursor-pointer hover:bg-background-secondary p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#EA4335] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium">이메일</div>
                        <div className="text-foreground-secondary text-sm">developer@example.com</div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      onClick={() => {
                        trackButtonClick('github_contact', 'contact_section')
                        window.open("https://github.com/leegunsun", "_blank")
                      }}
                      className="flex items-center gap-4 group cursor-pointer hover:bg-background-secondary p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#24292f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Github size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-foreground-secondary text-sm">github.com/developer</div>
                      </div>
                    </motion.div>

                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      onClick={() => trackButtonClick('linkedin_contact', 'contact_section')}
                      className="flex items-center gap-4 group cursor-pointer hover:bg-background-secondary p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-accent-info rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Linkedin size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-foreground-secondary text-sm">linkedin.com/in/developer</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Contact Form */}
              <AnimatedSection delay={0.2} className="card-primary">
                <h3 className="text-xl font-medium mb-6">메시지 보내기</h3>
                
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
                      submitStatus.type === 'success' 
                        ? 'bg-accent-success/10 text-accent-success border border-accent-success/20' 
                        : 'bg-accent-error/10 text-accent-error border border-accent-error/20'
                    }`}
                    role="alert"
                    aria-live="polite"
                  >
                    {submitStatus.type === 'success' && <CheckCircle size={16} aria-hidden="true" />}
                    <span className="text-sm">{submitStatus.message}</span>
                  </motion.div>
                )}
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-2">이름</label>
                    <input 
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      required
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="이름을 입력하세요"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    <input 
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      required
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="이메일을 입력하세요"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2">메시지</label>
                    <textarea 
                      rows={4}
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      required
                      className="w-full p-3 bg-background-secondary border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="메시지를 입력하세요"
                    />
                  </motion.div>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-md font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-foreground-muted text-background cursor-not-allowed' 
                        : 'bg-accent-blend text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-background border-t-transparent rounded-full"
                        />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        메시지 보내기
                      </>
                    )}
                  </motion.button>
                </form>
              </AnimatedSection>
            </div>
          </div>
        </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-foreground-secondary mb-4">
                © 2025 Developer Portfolio. <span className="text-gradient-flutter">Flutter</span> &amp; <span className="text-gradient-spring">Spring Boot</span>로 만드는 더 나은 세상.
              </p>
              <div className="flex items-center justify-center gap-6">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  onClick={() => trackButtonClick('github_footer', 'footer')}
                  className="text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  GitHub
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  onClick={() => trackButtonClick('linkedin_footer', 'footer')}
                  className="text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  onClick={() => trackButtonClick('blog_footer', 'footer')}
                  className="text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Blog
                </motion.a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </footer>

      {/* Floating Admin Button */}
      <AdminNavigation variant="floating" />
    </div>
  )
}