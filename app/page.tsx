"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Mail, Github, Linkedin, ExternalLink, ChevronDown, CheckCircle } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import SkillProgress from "../components/SkillProgress"
import ProjectCard from "../components/ProjectCard"
import CodeSnippet from "../components/CodeSnippet"
import GitHubCard from "../components/GitHubCard"
import { downloadResume, submitContactForm, requestNotificationPermission, type ContactFormData } from "../lib/utils"

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero")
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

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission()
  }, [])

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
    }
    
    setIsSubmitting(false)
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  // Sample GitHub repositories
  const githubRepos = [
    {
      name: "flutter-ecommerce-app",
      description: "Flutter로 구현한 크로스플랫폼 전자상거래 앱. Provider 패턴과 API 연동으로 상태 관리 최적화.",
      language: "Dart",
      stars: 42,
      forks: 8,
      lastUpdated: "2024-01-15",
      url: "https://github.com/developer/flutter-ecommerce-app"
    },
    {
      name: "spring-boot-notification-api",
      description: "Spring Boot와 WebSocket을 활용한 실시간 알림 시스템. Redis 캐싱과 JWT 인증 구현.",
      language: "Kotlin",
      stars: 35,
      forks: 12,
      lastUpdated: "2024-01-10",
      url: "https://github.com/developer/spring-boot-notification-api"
    },
    {
      name: "kubernetes-deployment-configs",
      description: "Production 환경을 위한 Kubernetes 배포 설정 파일과 CI/CD 파이프라인 구성.",
      language: "Docker",
      stars: 28,
      forks: 6,
      lastUpdated: "2024-01-08",
      url: "https://github.com/developer/kubernetes-deployment-configs"
    }
  ]

  // Sample code snippets
  const codeExamples = [
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
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-lg font-medium bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"
          >
            Portfolio
          </motion.div>
          <div className="flex items-center gap-6">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#about" 
              className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              About
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#portfolio" 
              className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              Portfolio
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#skills" 
              className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              Skills
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#code-examples" 
              className="bg-transparent text-foreground-secondary hover:bg-overlay-hover hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-all"
            >
              Code
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#contact" 
              className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-all"
            >
              Contact
            </motion.a>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden" aria-label="소개">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.02 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple rounded-full blur-3xl"
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
              className="w-32 h-32 bg-background-secondary rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg border border-border"
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
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-medium leading-tight mb-6"
            >
              사용자의 문제를 구조적으로 해결하는<br />
              <span className="text-gradient-primary">Flutter & Spring Boot</span> 개발자
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-foreground-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
            >
              모바일과 백엔드 개발의 경계를 넘나들며, 사용자 중심의 기술 솔루션을 
              설계하고 구현합니다. 문제 해결을 통한 가치 창출에 집중합니다.
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
                onClick={downloadResume}
                className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 text-base rounded-md font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <Download size={20} />
                이력서 다운로드
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#portfolio"
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
                whileHover={{ scale: 1.1, y: -3 }}
                href="#"
                className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all shadow-sm border border-border"
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -3 }}
                href="#"
                className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all shadow-sm border border-border"
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -3 }}
                href="#"
                className="w-12 h-12 bg-background-secondary hover:bg-background-tertiary rounded-full flex items-center justify-center transition-all shadow-sm border border-border"
              >
                <ExternalLink size={18} />
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
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Flutter 모바일 앱 개발</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-accent-success rounded-full"></div>
                      <span>Spring Boot 백엔드 API 개발</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-accent-purple rounded-full"></div>
                      <span>Docker & Kubernetes 컨테이너 운영</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
                      <span>MSSQL 데이터베이스 설계</span>
                    </motion.div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.2} className="card-primary">
                  <h3 className="text-xl font-medium mb-4">개발 철학</h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    단순히 기능을 구현하는 것을 넘어, 사용자의 실제 문제를 이해하고 
                    그 본질적 해결책을 찾는 것이 진정한 개발이라고 믿습니다. 
                    기술은 도구이며, 목적은 사용자의 삶을 더 편리하고 가치있게 만드는 것입니다.
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

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 bg-background-secondary" aria-label="포트폴리오">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">포트폴리오</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectCard
                title="E-Commerce 모바일 앱"
                description="Flutter로 개발한 크로스플랫폼 쇼핑 앱. Spring Boot API와 연동하여 실시간 결제 처리 및 주문 관리 시스템 구현."
                tags={["Flutter", "Dart", "REST API"]}
                icon="Flutter"
                iconBg="bg-primary"
                liveUrl="#"
                githubUrl="#"
                delay={0.1}
              />
              
              <ProjectCard
                title="실시간 알림 시스템"
                description="Spring Boot와 WebSocket을 활용한 실시간 푸시 알림 시스템. Redis 캐싱으로 성능 최적화 구현."
                tags={["Spring Boot", "Kotlin", "WebSocket"]}
                icon="Spring"
                iconBg="bg-accent-success"
                liveUrl="#"
                githubUrl="#"
                delay={0.2}
              />
              
              <ProjectCard
                title="컨테이너 오케스트레이션"
                description="Docker 컨테이너화 및 Kubernetes 클러스터 구성. CI/CD 파이프라인으로 자동 배포 구현."
                tags={["Docker", "Kubernetes", "CI/CD"]}
                icon="K8s"
                iconBg="bg-accent-purple"
                liveUrl="#"
                githubUrl="#"
                delay={0.3}
              />
            </div>
          </div>
        </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20" aria-label="기술 스택">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-medium">기술 스택</h2>
            </AnimatedSection>
            
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
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-accent-info rounded-full"></div>
                      <span className="text-sm">GraphQL API 설계</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-accent-warning rounded-full"></div>
                      <span className="text-sm">Microservices Architecture</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
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
          </div>
        </div>
        </section>

        {/* Code Examples & GitHub */}
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {codeExamples.map((example, index) => (
                    <CodeSnippet
                      key={example.title}
                      title={example.title}
                      language={example.language}
                      code={example.code}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>

              {/* GitHub Repositories */}
              <div>
                <AnimatedSection delay={0.2} className="mb-8">
                  <h3 className="text-2xl font-medium text-center">GitHub 저장소</h3>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {githubRepos.map((repo, index) => (
                    <GitHubCard
                      key={repo.name}
                      repo={repo}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

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
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 group cursor-pointer hover:bg-background-secondary p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail size={20} className="text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">이메일</div>
                        <div className="text-foreground-secondary text-sm">developer@example.com</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-4 group cursor-pointer hover:bg-background-secondary p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-accent-success rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
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
                      transition={{ delay: 0.4 }}
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
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-md font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-foreground-muted text-background cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:opacity-90'
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
                © 2025 Developer Portfolio. Flutter & Spring Boot로 만드는 더 나은 세상.
              </p>
              <div className="flex items-center justify-center gap-6">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#" 
                  className="text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  GitHub
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#" 
                  className="text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#" 
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
    </div>
  )
}