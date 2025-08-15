import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import JsonLd from "@/components/JsonLd";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "개발자 포트폴리오 | Flutter & Spring Boot 전문 개발자",
  description: "사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자입니다. 모바일과 백엔드 개발의 경계를 넘나들며, 사용자 중심의 기술 솔루션을 설계하고 구현합니다.",
  keywords: ["Flutter 개발자", "Spring Boot 개발자", "모바일 앱 개발", "백엔드 개발", "Kotlin", "Docker", "Kubernetes", "크로스플랫폼"],
  authors: [{ name: "Developer Portfolio" }],
  creator: "Developer Portfolio",
  publisher: "Developer Portfolio",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://developer-portfolio.com",
    title: "개발자 포트폴리오 | Flutter & Spring Boot 전문 개발자",
    description: "사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자입니다.",
    siteName: "Developer Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "개발자 포트폴리오 | Flutter & Spring Boot 전문 개발자",
    description: "사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자입니다.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className="antialiased min-h-screen bg-background"
      >
        {/* Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          메인 콘텐츠로 이동
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
