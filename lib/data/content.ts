export interface PersonalInfo {
  name: string
  nameKo: string
  title: string
  titleKo: string
  tagline: string
  taglineKo: string
  bio: string
  bioKo: string
  email: string
  github: string
  linkedin: string
  blog?: string
  location: string
  locationKo: string
  avatar: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export const personalInfo: PersonalInfo = {
  name: "Your Name",
  nameKo: "김개발",
  title: "Full-Stack Developer",
  titleKo: "풀스택 개발자",
  tagline: "Building scalable solutions with Flutter & Spring Boot",
  taglineKo: "Flutter와 Spring Boot로 확장 가능한 솔루션을 구축하는 개발자",
  bio: "Passionate full-stack developer with 5+ years of experience in mobile and web development. Specialized in Flutter for cross-platform mobile apps and Spring Boot for robust backend services. Love solving complex problems with clean, maintainable code.",
  bioKo: "5년 이상의 모바일 및 웹 개발 경험을 가진 열정적인 풀스택 개발자입니다. 크로스 플랫폼 모바일 앱을 위한 Flutter와 견고한 백엔드 서비스를 위한 Spring Boot를 전문으로 합니다. 깔끔하고 유지보수 가능한 코드로 복잡한 문제를 해결하는 것을 좋아합니다.",
  email: "developer@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  blog: "https://blog.example.com",
  location: "Seoul, South Korea",
  locationKo: "대한민국 서울",
  avatar: "/next.svg" // placeholder - replace with /images/profile.jpg
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: personalInfo.github,
    icon: "github"
  },
  {
    name: "LinkedIn",
    url: personalInfo.linkedin,
    icon: "linkedin"
  },
  {
    name: "Email",
    url: `mailto:${personalInfo.email}`,
    icon: "mail"
  }
]

export const navigationItems = {
  en: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact" }
  ],
  ko: [
    { name: "홈", href: "#home" },
    { name: "소개", href: "#about" },
    { name: "경력", href: "#experience" },
    { name: "프로젝트", href: "#projects" },
    { name: "기술", href: "#skills" },
    { name: "블로그", href: "/blog" },
    { name: "연락처", href: "#contact" }
  ]
}