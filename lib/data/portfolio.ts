export interface Project {
  id: string
  title: string
  titleKo: string
  description: string
  descriptionKo: string
  longDescription: string
  longDescriptionKo: string
  technologies: string[]
  image: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  startDate: string
  endDate?: string
}

export interface Experience {
  id: string
  title: string
  titleKo: string
  company: string
  companyKo: string
  location: string
  locationKo: string
  startDate: string
  endDate?: string
  description: string[]
  descriptionKo: string[]
  technologies: string[]
}

export interface Skill {
  name: string
  category: string
  level: number
  description?: string
  descriptionKo?: string
}

export const projects: Project[] = [
  {
    id: "flutter-ecommerce",
    title: "Flutter E-commerce App",
    titleKo: "Flutter 이커머스 앱",
    description: "Full-featured e-commerce mobile application with payment integration",
    descriptionKo: "결제 시스템이 통합된 완전한 기능의 이커머스 모바일 애플리케이션",
    longDescription: "A comprehensive e-commerce solution built with Flutter, featuring user authentication, product catalog, shopping cart, payment processing with Stripe, and order management. Implemented clean architecture with BLoC pattern for state management.",
    longDescriptionKo: "Flutter로 구축된 포괄적인 이커머스 솔루션으로, 사용자 인증, 상품 카탈로그, 장바구니, Stripe를 통한 결제 처리, 주문 관리 기능을 포함합니다. BLoC 패턴을 사용한 상태 관리로 클린 아키텍처를 구현했습니다.",
    technologies: ["Flutter", "Dart", "Firebase", "Stripe", "BLoC", "REST API"],
    image: "/next.svg", // placeholder
    githubUrl: "https://github.com/username/flutter-ecommerce",
    liveUrl: "https://play.google.com/store/apps/details?id=com.example.ecommerce",
    featured: true,
    startDate: "2024-01-01",
    endDate: "2024-03-15"
  },
  {
    id: "spring-boot-api",
    title: "Spring Boot Microservices API",
    titleKo: "Spring Boot 마이크로서비스 API",
    description: "Scalable microservices architecture with Docker deployment",
    descriptionKo: "Docker 배포를 포함한 확장 가능한 마이크로서비스 아키텍처",
    longDescription: "A robust microservices system built with Spring Boot, featuring user management, product catalog, order processing, and payment services. Implemented with Docker containerization, Kubernetes orchestration, and comprehensive monitoring.",
    longDescriptionKo: "Spring Boot로 구축된 견고한 마이크로서비스 시스템으로, 사용자 관리, 상품 카탈로그, 주문 처리, 결제 서비스를 포함합니다. Docker 컨테이너화, Kubernetes 오케스트레이션, 포괄적인 모니터링을 구현했습니다.",
    technologies: ["Spring Boot", "Kotlin", "Docker", "Kubernetes", "PostgreSQL", "Redis", "RabbitMQ"],
    image: "/vercel.svg", // placeholder
    githubUrl: "https://github.com/username/spring-microservices",
    featured: true,
    startDate: "2023-09-01",
    endDate: "2024-01-30"
  },
  {
    id: "kubernetes-deployment",
    title: "Kubernetes DevOps Pipeline",
    titleKo: "Kubernetes DevOps 파이프라인",
    description: "Automated CI/CD pipeline with monitoring and logging",
    descriptionKo: "모니터링과 로깅을 포함한 자동화된 CI/CD 파이프라인",
    longDescription: "Complete DevOps solution implementing GitOps practices with ArgoCD, automated testing, security scanning, and deployment to Kubernetes clusters. Includes comprehensive monitoring with Prometheus and Grafana.",
    longDescriptionKo: "ArgoCD를 사용한 GitOps 방식, 자동화된 테스트, 보안 스캔, Kubernetes 클러스터 배포를 구현한 완전한 DevOps 솔루션입니다. Prometheus와 Grafana를 통한 포괄적인 모니터링을 포함합니다.",
    technologies: ["Kubernetes", "ArgoCD", "Prometheus", "Grafana", "Helm", "GitLab CI", "Terraform"],
    image: "/globe.svg", // placeholder
    githubUrl: "https://github.com/username/k8s-devops",
    featured: true,
    startDate: "2023-06-01",
    endDate: "2023-08-30"
  }
]

export const experiences: Experience[] = [
  {
    id: "senior-developer",
    title: "Senior Full-Stack Developer",
    titleKo: "시니어 풀스택 개발자",
    company: "Tech Solutions Inc.",
    companyKo: "테크 솔루션즈",
    location: "Seoul, South Korea",
    locationKo: "대한민국 서울",
    startDate: "2023-01-01",
    description: [
      "Led development of microservices architecture serving 100K+ daily active users",
      "Mentored junior developers and conducted code reviews",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Optimized database queries improving application performance by 40%"
    ],
    descriptionKo: [
      "일일 활성 사용자 100K+ 를 지원하는 마이크로서비스 아키텍처 개발을 주도",
      "주니어 개발자 멘토링 및 코드 리뷰 수행",
      "배포 시간을 60% 단축하는 CI/CD 파이프라인 구현",
      "데이터베이스 쿼리 최적화로 애플리케이션 성능 40% 향상"
    ],
    technologies: ["Spring Boot", "Kotlin", "Flutter", "Dart", "Kubernetes", "Docker", "PostgreSQL"]
  },
  {
    id: "flutter-developer",
    title: "Mobile App Developer",
    titleKo: "모바일 앱 개발자",
    company: "Mobile Innovations Ltd.",
    companyKo: "모바일 이노베이션즈",
    location: "Busan, South Korea",
    locationKo: "대한민국 부산",
    startDate: "2021-06-01",
    endDate: "2022-12-31",
    description: [
      "Developed cross-platform mobile applications using Flutter",
      "Implemented real-time features using WebSocket and Firebase",
      "Collaborated with design team to create pixel-perfect UI/UX",
      "Published 5+ apps on Google Play Store and Apple App Store"
    ],
    descriptionKo: [
      "Flutter를 사용하여 크로스 플랫폼 모바일 애플리케이션 개발",
      "WebSocket과 Firebase를 사용한 실시간 기능 구현",
      "디자인 팀과 협업하여 픽셀 완벽한 UI/UX 제작",
      "Google Play 스토어 및 Apple App Store에 5개 이상의 앱 출시"
    ],
    technologies: ["Flutter", "Dart", "Firebase", "WebSocket", "REST API", "SQLite"]
  }
]

export const skills: Skill[] = [
  { name: "Flutter", category: "Mobile", level: 95, description: "Cross-platform mobile development", descriptionKo: "크로스 플랫폼 모바일 개발" },
  { name: "Dart", category: "Language", level: 90, description: "Primary language for Flutter development", descriptionKo: "Flutter 개발을 위한 주요 언어" },
  { name: "Spring Boot", category: "Backend", level: 85, description: "Java/Kotlin web framework", descriptionKo: "Java/Kotlin 웹 프레임워크" },
  { name: "Kotlin", category: "Language", level: 80, description: "Modern JVM language", descriptionKo: "현대적인 JVM 언어" },
  { name: "Docker", category: "DevOps", level: 75, description: "Containerization platform", descriptionKo: "컨테이너화 플랫폼" },
  { name: "Kubernetes", category: "DevOps", level: 70, description: "Container orchestration", descriptionKo: "컨테이너 오케스트레이션" },
  { name: "PostgreSQL", category: "Database", level: 80, description: "Relational database management", descriptionKo: "관계형 데이터베이스 관리" },
  { name: "Redis", category: "Database", level: 75, description: "In-memory data structure store", descriptionKo: "인메모리 데이터 구조 저장소" }
]