# 📁 Project Structure Guide

> **Developer Portfolio Website** - A comprehensive Next.js application with clean architecture and modern development practices.

## 🏗️ Architecture Overview

This project follows **Domain-Driven Design** principles with a clean separation of concerns, optimized for maintainability, scalability, and developer experience.

```
my-next-app/
├── 📁 app/                     # Next.js App Router (Pages & API Routes)
├── 📁 components/              # React Components (Reusable UI)
├── 📁 lib/                     # Business Logic & Utilities
├── 📁 hooks/                   # Custom React Hooks
├── 📁 contexts/                # React Context Providers
├── 📁 public/                  # Static Assets
├── 📁 tests/                   # Playwright E2E Tests
├── 📁 docs/                    # 📚 Documentation
├── 📁 scripts/                 # 🔧 Build & Utility Scripts
└── 📄 [config files]          # Project Configuration
```

---

## 📂 Directory Structure Deep Dive

### 🎯 `/app` - Next.js App Router
**Purpose**: Pages, layouts, and API endpoints using Next.js 13+ App Router architecture.

```
app/
├── 📁 admin/                   # Admin Dashboard Routes
│   ├── 📄 layout.tsx          # Admin layout with navigation
│   ├── 📁 messages/           # Message management
│   ├── 📁 portfolio/          # Portfolio content management
│   └── 📁 posts/              # Blog post management
├── 📁 api/                    # API Routes (RESTful)
│   ├── 📁 messages/           # Message CRUD operations
│   ├── 📁 portfolio/          # Portfolio data endpoints
│   └── 📁 notifications/      # Push notification handlers
├── 📁 blog/                   # Blog functionality
│   ├── 📄 page.tsx            # Blog listing page
│   └── 📁 [id]/              # Dynamic blog post pages
├── 📁 dev-gate/              # Development access control
│   ├── 📄 auth-service.ts     # Authentication logic
│   ├── 📄 firestore-config.ts # Firestore configuration
│   └── 📁 components/         # Dev-gate specific components
├── 📄 layout.tsx              # Root layout (theme, providers)
├── 📄 page.tsx               # Homepage
└── 📄 globals.css            # Global styles & CSS variables
```

**Key Features**:
- ✅ **App Router**: Modern Next.js routing with server components
- ✅ **API Routes**: RESTful endpoints with proper HTTP methods
- ✅ **Dynamic Routes**: Blog posts with slug-based routing
- ✅ **Layouts**: Nested layouts for admin and public areas
- ✅ **Development Gate**: Access control during development phase

### 🧩 `/components` - React Components
**Purpose**: Reusable UI components organized by domain and complexity.

```
components/
├── 📁 ui/                     # Base UI Components
│   ├── 📄 button.tsx          # Button variants & states
│   ├── 📄 card.tsx            # Card layouts
│   ├── 📄 badge.tsx           # Status badges
│   ├── 📄 select.tsx          # Custom select dropdown
│   └── 📄 pagination.tsx      # Pagination controls
├── 📁 sections/               # Page Sections
│   ├── 📄 hero-section.tsx    # Landing hero section
│   ├── 📄 contact-section.tsx # Contact form section
│   ├── 📄 projects-section.tsx # Projects showcase
│   ├── 📄 skills-section.tsx  # Skills & technologies
│   └── 📄 experience-section.tsx # Work experience
├── 📁 admin/                  # Admin-Specific Components
│   ├── 📄 AdminHeader.tsx     # Admin dashboard header
│   ├── 📄 AdminNavigation.tsx # Admin sidebar navigation
│   ├── 📄 PostEditor.tsx      # Rich text blog post editor
│   ├── 📄 MessageFilters.tsx  # Message filtering controls
│   └── 📄 FCMSetup.tsx        # Firebase messaging setup
├── 📁 auth/                   # Authentication Components
│   ├── 📄 AuthModal.tsx       # Login/signup modal
│   ├── 📄 LoginButton.tsx     # Authentication trigger
│   └── 📄 ProtectedRoute.tsx  # Route protection wrapper
├── 📁 blog/                   # Blog-Specific Components  
│   ├── 📄 BlogPostCard.tsx    # Blog post preview card
│   ├── 📄 BlogFilters.tsx     # Category filtering
│   └── 📄 BlogHeader.tsx      # Blog section header
├── 📁 mobile-bridge/          # Mobile App Integration
│   └── 📄 MobileBridgeStatus.tsx # Mobile connection status
├── 📄 header.tsx              # Main site header
├── 📄 footer.tsx              # Main site footer
├── 📄 theme-provider.tsx      # Theme context provider
├── 📄 theme-toggle.tsx        # Dark/light mode toggle
├── 📄 language-toggle.tsx     # I18n language switcher
└── 📄 analytics-provider.tsx  # Analytics wrapper
```

**Design Principles**:
- 🎨 **Component Hierarchy**: Base UI → Composed Sections → Domain-Specific
- 🔄 **Reusability**: Generic components with prop-based customization
- 📱 **Responsive**: Mobile-first design with breakpoint considerations
- ♿ **Accessibility**: WCAG 2.1 compliance with proper ARIA attributes
- 🎭 **Theming**: Support for dark/light modes via CSS custom properties

### 📚 `/lib` - Business Logic & Utilities
**Purpose**: Core application logic, services, and utility functions.

```
lib/
├── 📁 firebase/               # Firebase Integration
│   ├── 📄 config.ts           # Firebase app configuration
│   ├── 📄 auth.ts             # Authentication utilities
│   ├── 📄 firestore.ts        # Database operations
│   ├── 📄 admin.ts            # Admin SDK operations
│   ├── 📄 fcm.ts              # Push notifications
│   └── 📄 github-repos.ts     # GitHub integration
├── 📁 data/                   # Static Data & Content
│   ├── 📄 content.ts           # Personal info, skills, experience
│   └── 📄 portfolio.ts        # Project portfolio data
├── 📁 utils/                  # Helper Functions
│   ├── 📄 github-api.ts       # GitHub API utilities
│   └── [other utilities]
├── 📁 services/               # Business Logic Services
│   └── 📄 portfolioService.ts # Portfolio data management
├── 📁 types/                  # TypeScript Definitions
│   └── 📄 portfolio.ts        # Portfolio-related types
├── 📁 mobile-bridge/          # Mobile App Communication
│   ├── 📄 mobile-bridge.ts    # Bridge implementation
│   ├── 📄 types.ts            # Mobile bridge types
│   └── 📄 use-mobile-bridge.ts # React hook wrapper
├── 📄 utils.ts                # General utility functions
├── 📄 analytics.ts            # Analytics integration
└── 📄 firebase.ts             # Legacy Firebase export
```

**Architecture Patterns**:
- 🏗️ **Service Layer**: Business logic separated from UI components
- 🔧 **Utilities**: Pure functions for common operations
- 📊 **Data Layer**: Static content and dynamic data management
- 🌉 **Integration Layer**: External service integrations (Firebase, GitHub)
- 🎯 **Type Safety**: Comprehensive TypeScript definitions

### 🪝 `/hooks` - Custom React Hooks
**Purpose**: Reusable stateful logic and side effects.

```
hooks/
├── 📄 use-media-query.ts      # Responsive breakpoint detection
└── 📄 useAdminStats.ts        # Admin dashboard statistics
```

**Hook Patterns**:
- 📱 **Responsive Hooks**: Media query and viewport detection
- 📊 **Data Hooks**: API data fetching and state management
- 🎨 **UI Hooks**: Component behavior and interaction logic
- ⚡ **Performance Hooks**: Memoization and optimization

### 🌍 `/contexts` - React Context Providers
**Purpose**: Global state management and shared data.

```
contexts/
└── 📄 AuthContext.tsx         # User authentication state
```

**Context Design**:
- 🔐 **Authentication**: User session and permissions
- 🎨 **Theme**: Dark/light mode global state
- 🌐 **Language**: I18n locale and translation state
- 📊 **Application State**: Cross-component shared data

### 🌐 `/public` - Static Assets
**Purpose**: Static files served directly by Next.js.

```
public/
├── 📄 favicon.ico             # Site favicon
├── 📄 site.webmanifest        # PWA manifest
├── 📄 firebase-messaging-sw.js # FCM service worker
├── 📁 icons/                  # Icon assets
├── 📁 images/                 # Image assets
├── 📁 uploads/                # User-uploaded files
│   └── 📁 resumes/           # Resume PDFs
├── 📄 resume.pdf             # Current resume
└── [SVG icons]               # Various icon files
```

**Asset Organization**:
- 🖼️ **Images**: Optimized images with proper formats (WebP, SVG)
- 📄 **Documents**: PDFs and downloadable files
- 🎨 **Icons**: SVG icons for performance and scalability
- 📱 **PWA Assets**: Manifest and service worker files

### 🧪 `/tests` - End-to-End Testing
**Purpose**: Playwright tests for critical user journeys.

```
tests/
├── 📄 homepage.spec.ts        # Homepage functionality tests
├── 📄 blog.spec.ts            # Blog feature tests
└── 📄 admin.spec.ts           # Admin panel tests
```

**Testing Strategy**:
- 🌐 **Cross-Browser**: Chrome, Firefox, Safari testing
- 📱 **Mobile Testing**: Responsive design validation
- 🔐 **Authentication**: Login flows and protected routes
- ⚡ **Performance**: Load times and JavaScript errors
- ♿ **Accessibility**: A11y compliance testing

### 📚 `/docs` - Documentation
**Purpose**: Project documentation, guides, and references.

```
docs/
├── 📄 PROJECT_STRUCTURE.md    # This document
├── 📄 ADMIN_DESIGN_SYSTEM.md  # Admin UI design system
├── 📄 MESSAGES_SETUP.md       # Message system setup
├── 📄 GOOGLE_LOGIN_TROUBLESHOOTING.md # Auth troubleshooting
└── [other documentation]
```

### 🔧 `/scripts` - Build & Utility Scripts
**Purpose**: Automation scripts for development and deployment.

```
scripts/
├── 📄 build.ps1               # Windows build script
├── 📄 deploy-firestore-indexes.js # Firestore index deployment
├── 📄 install-deps.bat        # Dependency installation
└── [other scripts]
```

---

## 🎯 Development Guidelines

### 📝 Naming Conventions

#### Files & Directories
- **Components**: PascalCase (`BlogPostCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMediaQuery.ts`)
- **Utilities**: camelCase (`portfolio.ts`)
- **Pages**: lowercase (`[id]/page.tsx`)
- **Directories**: kebab-case (`mobile-bridge/`)

#### Code Style
- **Variables**: camelCase (`isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Components**: PascalCase (`BlogPostCard`)
- **Props Interfaces**: PascalCase with Props suffix (`BlogPostCardProps`)

### 🏗️ Component Design Patterns

#### Composition Pattern
```typescript
// ✅ Good - Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Monolithic components
<CardWithTitleAndContent title="Title" content="Content" />
```

#### Props Interface Pattern
```typescript
// ✅ Good - Clear props interface
interface BlogPostCardProps {
  post: BlogPost
  showExcerpt?: boolean
  onRead?: (postId: string) => void
}

export function BlogPostCard({ post, showExcerpt = true, onRead }: BlogPostCardProps) {
  // Component implementation
}
```

### 🎨 Styling Guidelines

#### CSS Custom Properties (Theming)
```css
:root {
  --primary-color: #3b82f6;
  --background: #ffffff;
  --foreground: #0f172a;
}

[data-theme="dark"] {
  --primary-color: #60a5fa;
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

#### Tailwind CSS Usage
- ✅ Use utility classes for spacing, colors, typography
- ✅ Create component classes for complex components
- ✅ Use responsive prefixes (`md:`, `lg:`) for breakpoints
- ❌ Avoid inline styles unless absolutely necessary

### 🔐 Security Best Practices

#### Environment Variables
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables only
- ✅ Keep sensitive keys server-side only
- ❌ Never commit `.env.local` to version control
- ✅ Use `.env.example` for documentation

#### Authentication
- ✅ Validate all API requests
- ✅ Use proper session management
- ✅ Implement CSRF protection
- ✅ Sanitize all user inputs

---

## 🚀 Development Workflow

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### 2. Building & Testing
```bash
# Production build
npm run build

# Start production server
npm start

# Run E2E tests
npm run test:headed
```

### 3. Code Quality Checks
```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint
npm run lint

# Prettier (if configured)
npx prettier --check .
```

---

## 📋 Maintenance Guidelines

### Regular Tasks
- 🔄 **Dependencies**: Update monthly (`npm audit`, `npm outdated`)
- 🧹 **Code Cleanup**: Remove unused imports, dead code
- 📊 **Performance**: Monitor bundle size and Core Web Vitals
- 🔒 **Security**: Regular security audits and updates

### Monitoring
- 🚨 **Error Tracking**: Monitor production errors
- 📈 **Analytics**: Track user behavior and performance
- 🔍 **Logging**: Implement structured logging for debugging

---

## 🎯 Future Improvements

### Architecture Enhancements
- [ ] Implement state management (Zustand/Redux Toolkit)
- [ ] Add API middleware for request/response intercepting
- [ ] Implement progressive web app (PWA) features
- [ ] Add internationalization (i18n) support

### Performance Optimizations
- [ ] Implement code splitting and lazy loading
- [ ] Add image optimization and CDN integration
- [ ] Implement service worker for offline support
- [ ] Add edge functions for dynamic content

### Developer Experience
- [ ] Add Storybook for component documentation
- [ ] Implement automated code formatting (Prettier)
- [ ] Add pre-commit hooks (Husky + lint-staged)
- [ ] Implement CI/CD pipeline

---

## 📞 Support & Resources

### Documentation
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://typescriptlang.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Playwright**: [playwright.dev](https://playwright.dev)

### Project-Specific Documentation
- 📁 `docs/ADMIN_DESIGN_SYSTEM.md` - Admin interface guidelines
- 📁 `docs/MESSAGES_SETUP.md` - Message system configuration
- 📁 `docs/GOOGLE_LOGIN_TROUBLESHOOTING.md` - Authentication issues

---

**✨ This project structure is optimized for:**
- 🔧 **Maintainability**: Clear separation of concerns
- 🚀 **Scalability**: Modular architecture
- 👥 **Team Collaboration**: Consistent conventions
- 🔒 **Security**: Built-in security practices
- ⚡ **Performance**: Optimized loading and rendering
- 🧪 **Quality**: Comprehensive testing strategy

*Last updated: $(new Date().toISOString().split('T')[0])*