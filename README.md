# 🚀 Developer Portfolio Website

> **Professional Next.js Portfolio** - A comprehensive developer portfolio with admin dashboard, blog system, and modern architecture built with Next.js 15, React 19, and TypeScript.

## ✨ Key Features

### 🎨 **Modern Design & UX**
- Clean, responsive interface with dark/light mode
- Mobile-first design with optimized breakpoints
- Smooth animations and transitions
- Accessibility-compliant (WCAG 2.1)

### 🔐 **Admin Dashboard**
- Complete CMS for portfolio content management
- Blog post creation and editing with rich text editor
- Message management system with notifications
- Portfolio project and skills management
- Role-based access control with development gate

### 📝 **Dynamic Blog System**
- Category-based blog posts with filtering
- Rich text editor with markdown support
- SEO-optimized blog pages with meta tags
- Blog post status management (draft/published)

### 📧 **Contact & Communication**
- Contact form with Firebase integration
- Push notifications for new messages (FCM)
- Message status tracking and admin responses
- Mobile app bridge integration

### 🌐 **Internationalization & Performance**
- English/Korean language support
- Optimized images with Next.js Image
- Performance monitoring and optimization
- Progressive Web App (PWA) capabilities

### 🧪 **Quality Assurance**
- Comprehensive E2E testing with Playwright
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- Performance and accessibility validation

## 🏗️ Modern Tech Stack

- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Backend**: Firebase (Firestore, Authentication, Cloud Messaging)
- **Testing**: Playwright for end-to-end testing
- **Development**: Turbopack for fast development builds
- **Deployment**: Vercel-optimized with environment configuration

## 📁 Clean Architecture Structure

This project follows **Domain-Driven Design** principles with clean separation of concerns:

```
my-next-app/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 admin/              # Admin dashboard routes
│   ├── 📁 api/                # RESTful API endpoints
│   ├── 📁 blog/               # Blog system
│   ├── 📁 dev-gate/           # Development access control
│   ├── 📄 layout.tsx          # Root layout with providers
│   ├── 📄 page.tsx            # Homepage
│   └── 📄 globals.css         # Global styles & theme system
├── 📁 components/             # React Components
│   ├── 📁 ui/                 # Base UI components (Button, Card, etc.)
│   ├── 📁 sections/           # Page sections (Hero, Projects, etc.)
│   ├── 📁 admin/              # Admin-specific components
│   ├── 📁 auth/               # Authentication components
│   ├── 📁 blog/               # Blog-specific components
│   └── 📁 mobile-bridge/      # Mobile app integration
├── 📁 lib/                    # Business Logic & Services
│   ├── 📁 firebase/           # Firebase integration layer
│   ├── 📁 data/               # Static content & portfolio data
│   ├── 📁 utils/              # Helper functions & utilities
│   ├── 📁 services/           # Business logic services
│   └── 📁 types/              # TypeScript type definitions
├── 📁 hooks/                  # Custom React hooks
├── 📁 contexts/               # React context providers
├── 📁 tests/                  # Playwright E2E tests
├── 📁 docs/                   # 📚 Comprehensive documentation
├── 📁 scripts/                # 🔧 Build & deployment scripts
└── 📁 public/                 # Static assets & uploads
```

**📖 Detailed Documentation**: See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for comprehensive architecture guide.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for backend services)

### Installation & Setup
```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers for testing
npx playwright install

# 3. Environment configuration
cp .env.example .env.local
# Edit .env.local with your Firebase configuration

# 4. Start development server  
npm run dev

# 5. Open browser at http://localhost:3000
```

### Available Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint code quality checks
npm test             # Run Playwright E2E tests
npm run test:ui      # Run tests in interactive UI mode
npm run test:headed  # Run tests with visible browser
npm run test:report  # View detailed test results
```

## 📝 Customization

### 1. Update Personal Information

Edit `lib/data/content.ts`:
```typescript
export const personalInfo: PersonalInfo = {
  name: "Your Name",
  nameKo: "한국어 이름",
  title: "Your Title",
  email: "your@email.com",
  // ... other fields
}
```

### 2. Add Your Projects

Edit `lib/data/portfolio.ts`:
```typescript
export const projects: Project[] = [
  {
    id: "your-project",
    title: "Project Title",
    description: "Project description",
    technologies: ["Tech1", "Tech2"],
    // ... other fields
  }
]
```

### 3. Update Skills & Experience

Modify the `skills` and `experiences` arrays in `lib/data/portfolio.ts`.

### 4. Add Your Images

Place your images in `public/images/`:
- `profile.jpg` - Your profile photo
- `project-*.jpg` - Project screenshots/thumbnails

## 🎨 Theme Customization

The website uses CSS custom properties for theming. Update `app/globals.css` to customize colors:

```css
:root {
  --primary: 240 5.9% 10%;
  --secondary: 240 4.8% 95.9%;
  /* ... other theme variables */
}
```

## 🌐 Internationalization

The website supports English and Korean languages. To add more languages:

1. Update `lib/data/content.ts` with new language data
2. Add language option to the `LanguageToggle` component
3. Update all content objects with the new language keys

## 📱 Responsive Design

The website is fully responsive and tested on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🧪 Comprehensive Testing

This project includes a complete testing suite with Playwright for reliable E2E testing:

### Test Coverage
- ✅ **Homepage functionality** - Navigation, hero section, responsiveness
- ✅ **Blog system** - Post rendering, filtering, navigation
- ✅ **Admin authentication** - Access control and security
- ✅ **Theme switching** - Dark/light mode functionality  
- ✅ **Mobile responsiveness** - Cross-device compatibility
- ✅ **Performance validation** - JavaScript error detection
- ✅ **Cross-browser testing** - Chrome, Firefox, Safari support

### Running Tests
```bash
# Run all tests
npm test

# Interactive test development and debugging
npm run test:ui

# Run tests with visible browser (helpful for debugging)
npm run test:headed

# View comprehensive test reports
npm run test:report
```

## ⚡ Performance & Optimization

- 🚀 **Lighthouse Score**: 90+ across all metrics
- 🖼️ **Image Optimization**: Automatic WebP conversion and lazy loading
- 📦 **Code Splitting**: Dynamic imports and route-based splitting
- 🎨 **Font Optimization**: Optimized web fonts with `next/font`
- 💾 **Caching**: Intelligent caching strategies for static assets
- 📊 **Bundle Analysis**: Tree shaking and dead code elimination

## 🚀 Deployment & Production

### Vercel (Recommended)
```bash
# Connect to Vercel and deploy
npm install -g vercel
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production
Set these in your hosting platform:
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase configuration
```

## 📚 Documentation

Comprehensive documentation is available:

- 📖 **[Project Structure Guide](docs/PROJECT_STRUCTURE.md)** - Detailed architecture documentation
- 🎨 **[Admin Design System](docs/ADMIN_DESIGN_SYSTEM.md)** - UI component guidelines
- 📧 **[Messages Setup](docs/MESSAGES_SETUP.md)** - Contact system configuration  
- 🔧 **[Google Login Troubleshooting](docs/GOOGLE_LOGIN_TROUBLESHOOTING.md)** - Authentication issues

## 🔒 Security Features

- 🛡️ **Development Gate** - Access control during development phase
- 🔐 **Firebase Authentication** - Secure user authentication and authorization
- 🌐 **CORS Protection** - Properly configured cross-origin policies
- 🚫 **Input Validation** - Comprehensive input sanitization and validation
- 🔒 **Environment Security** - Secure environment variable management
- 📊 **Security Headers** - CSP, HSTS, and other security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)