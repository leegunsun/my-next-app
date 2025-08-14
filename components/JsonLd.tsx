export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Developer",
    "jobTitle": "Flutter & Spring Boot Developer",
    "description": "사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자입니다.",
    "url": "https://developer-portfolio.com",
    "image": "https://developer-portfolio.com/profile-image.jpg",
    "sameAs": [
      "https://github.com/developer",
      "https://linkedin.com/in/developer"
    ],
    "knowsAbout": [
      "Flutter",
      "Spring Boot", 
      "Kotlin",
      "Docker",
      "Kubernetes",
      "Mobile Development",
      "Backend Development"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer"
    },
    "alumniOf": {
      "@type": "Organization", 
      "name": "Computer Science"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Software Developer",
      "occupationLocation": {
        "@type": "Country",
        "name": "South Korea"
      },
      "skills": "Flutter, Spring Boot, Kotlin, Docker, Kubernetes"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}