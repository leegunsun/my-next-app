import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Developer Portfolio | Flutter & Spring Boot Specialist",
  description: "사용자의 문제를 구조적으로 해결하는 Flutter & Spring Boot 개발자 포트폴리오",
  keywords: ["Flutter", "Spring Boot", "Dart", "Kotlin", "Full-Stack Developer", "Mobile Development", "Backend Development"],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "Developer Portfolio | Flutter & Spring Boot Specialist",
    description: "문제 해결 중심의 개발자 포트폴리오 - Flutter, Spring Boot, Kotlin 전문",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
