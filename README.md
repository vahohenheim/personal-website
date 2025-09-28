# 🚀 Personal Website - Valentin Bourreau

> Modern, multilingual personal website built with Next.js 15 and TypeScript, showcasing professional experience, skills, and projects.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Installation](#-installation)
- [🔧 Development](#-development)
- [🏗️ Build & Deployment](#️-build--deployment)
- [📁 Project Structure](#-project-structure)
- [🌍 Internationalization](#-internationalization)
- [🎨 Styling](#-styling)
- [📱 Progressive Web App](#-progressive-web-app)
- [🔍 SEO & Analytics](#-seo--analytics)
- [🧪 Testing & Quality](#-testing--quality)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Features
- **📱 Responsive Design** - Mobile-first approach with beautiful animations
- **🌍 Multilingual Support** - French and English with Next International
- **🌙 Dark/Light Mode** - Theme switcher with system preference detection
- **⚡ Performance Optimized** - Next.js 15 with Turbopack for lightning-fast builds
- **📊 Professional Resume** - Interactive CV with downloadable PDF
- **🎨 Modern UI** - Shadcn/ui components with Tailwind CSS v4
- **🚀 PWA Ready** - Progressive Web App with offline capabilities
- **📈 Analytics** - Vercel Analytics integration

### 🔧 Technical Features
- **💾 Type-Safe Database** - Drizzle ORM with PostgreSQL
- **🔐 Authentication** - NextAuth.js v5 integration ready
- **📱 Drag & Drop** - DnD Kit for interactive elements
- **📊 Data Visualization** - Recharts for beautiful charts
- **🎭 Animations** - Framer Motion for smooth interactions
- **🛡️ Form Validation** - Zod schema validation
- **🎯 Accessibility** - WCAG compliant with Radix UI primitives

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org) with App Router
- **Language:** [TypeScript 5](https://typescriptlang.org)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com)
- **Icons:** [Lucide React](https://lucide.dev) + [Tabler Icons](https://tabler.io/icons)
- **Animations:** [Framer Motion](https://framer.com/motion)

### Backend & Database
- **Database:** [PostgreSQL](https://postgresql.org) with [Vercel Postgres](https://vercel.com/storage/postgres)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Authentication:** [NextAuth.js v5](https://authjs.dev)

### Development & Deployment
- **Build Tool:** [Turbopack](https://turbo.build/pack)
- **Linting:** [ESLint 9](https://eslint.org) + [TypeScript ESLint](https://typescript-eslint.io)
- **Formatting:** [Prettier](https://prettier.io) with Tailwind plugin
- **Deployment:** [Vercel](https://vercel.com)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)

### Additional Libraries
- **Internationalization:** [Next International](https://github.com/QuiiBz/next-international)
- **Theme Management:** [Next Themes](https://github.com/pacocoursey/next-themes)
- **Drag & Drop:** [DnD Kit](https://dndkit.com)
- **Charts:** [Recharts](https://recharts.org)
- **Form Validation:** [Zod](https://zod.dev)
- **Date Handling:** [Date-fns](https://date-fns.org) + [Day.js](https://dayjs.gitee.io)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski)
- **PWA:** [Next PWA](https://github.com/shadowwalker/next-pwa)

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18.17+ ([Download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com))

### System Requirements
- **Node.js:** 18.17 or later
- **macOS, Windows (including WSL), and Linux** are supported

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/valentinbourreau/personal-website.git
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables in `.env.local`:
   ```env
   # Database (optional for basic usage)
   POSTGRES_URL="postgresql://..."

   # Authentication (optional)
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Analytics (optional)
   VERCEL_ANALYTICS_ID="your-analytics-id"
   ```

## 🔧 Development

### Start the development server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint and fix issues |
| `npm run lint:check` | Check for linting issues without fixing |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### Development Features
- **⚡ Hot Reload** - Instant updates with Turbopack
- **🔧 TypeScript** - Full type checking and IntelliSense
- **🎨 Tailwind CSS** - Utility-first styling with JIT compilation
- **📱 Responsive Preview** - Test on different screen sizes

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy!

### Alternative Deployment Options
- **Netlify:** Connect your repository and deploy
- **Railway:** One-click deployment with database
- **Docker:** Use the included Dockerfile for containerization

## 📁 Project Structure

```
personal-website/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 [locale]/                 # Internationalized routes
│   │   ├── 📄 layout.tsx            # Locale-specific layout
│   │   ├── 📄 page.tsx              # Home page
│   │   └── 📁 resume/               # Resume section
│   ├── 📁 constants/                # Application constants
│   ├── 📁 fonts/                    # Custom fonts (Geist)
│   ├── 📁 helpers/                  # Utility functions
│   ├── 📁 models/                   # TypeScript interfaces
│   ├── 📁 utils/                    # Shared utilities
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout
│   ├── 📄 manifest.ts               # PWA manifest
│   ├── 📄 robots.ts                 # SEO robots.txt
│   └── 📄 sitemap.ts                # SEO sitemap
├── 📁 components/                   # React components
│   ├── 📁 ui/                       # Shadcn/ui components
│   ├── 📁 icons/                    # Custom icon components
│   └── 📁 [feature]/                # Feature-specific components
├── 📁 lib/                          # Library configurations
│   └── 📁 utils/                    # Utility functions
├── 📁 locales/                      # Internationalization
│   ├── 📄 en.ts                     # English translations
│   └── 📄 fr.ts                     # French translations
├── 📁 public/                       # Static assets
│   ├── 📁 experiences/              # Experience images
│   ├── 📁 social-networks/          # Social media icons
│   └── 📄 avatar.png                # Profile picture
├── 📄 components.json               # Shadcn/ui configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 next.config.ts                # Next.js configuration
├── 📄 middleware.ts                 # Next.js middleware
└── 📄 package.json                  # Dependencies and scripts
```

## 🌍 Internationalization

The website supports multiple languages using **Next International**.

### Supported Languages
- 🇺🇸 **English** (default)
- 🇫🇷 **French**

### Adding a New Language

1. **Create translation file**
   ```bash
   touch locales/es.ts  # For Spanish
   ```

2. **Add translations**
   ```typescript
   // locales/es.ts
   export default {
     "metadata": {
       "title": "Ingeniero Frontend Senior | valentin bourreau",
       "description": "..."
     },
     // ... other translations
   }
   ```

3. **Update middleware**
   ```typescript
   // middleware.ts
   export default createI18nMiddleware({
     locales: ['en', 'fr', 'es'],
     defaultLocale: 'en'
   })
   ```

### Translation Structure
```typescript
{
  "metadata": {        // SEO metadata
    "title": "...",
    "description": "..."
  },
  "header": {          // Navigation
    "menu": { ... }
  },
  "home": {            // Home page content
    "title": "...",
    "summary": "..."
  },
  "resume": {          // Resume section
    "experiences": { ... },
    "skills": { ... }
  }
}
```

## 🎨 Styling

### Tailwind CSS v4
This project uses the latest **Tailwind CSS v4** with modern features:

- **🎨 CSS-first Configuration** - Configuration in CSS, not JS
- **⚡ Lightning Fast** - Oxide engine for instant compilation
- **🔧 Modern Syntax** - `@theme` and `@variant` directives
- **📱 Container Queries** - Native container query support

### Design System
- **🎨 Color Palette** - Semantic color tokens with dark/light mode
- **📝 Typography** - Geist Sans and Geist Mono fonts
- **📐 Spacing** - Consistent spacing scale
- **🎭 Animations** - Custom animations with Tailwind Animate

### Component Library
Built with **Shadcn/ui** components:
- ✅ Accessible by default (Radix UI primitives)
- 🎨 Customizable design tokens
- 📱 Mobile-optimized components
- 🎭 Beautiful animations

## 📱 Progressive Web App

The website is a fully functional PWA with:

### Features
- **📱 Installable** - Add to home screen on mobile/desktop
- **⚡ Fast Loading** - Service worker caching
- **📴 Offline Support** - Core functionality works offline
- **🔔 Push Notifications** - Ready for notification features

### PWA Capabilities
- **📊 App-like Experience** - Full-screen mode
- **🎨 Custom Theme** - Branded splash screen and icons
- **📱 Responsive** - Optimized for all devices
- **⚡ Performance** - Lighthouse score 95+

## 🔍 SEO & Analytics

### SEO Optimization
- **📊 Structured Data** - JSON-LD markup for rich snippets
- **🌐 Meta Tags** - Comprehensive Open Graph and Twitter Cards
- **🗺️ XML Sitemap** - Auto-generated with Next.js
- **🤖 Robots.txt** - Search engine guidelines
- **📱 Mobile-First** - Mobile-optimized for better rankings

### Analytics
- **📈 Vercel Analytics** - Privacy-friendly analytics
- **🎯 Performance Monitoring** - Core Web Vitals tracking
- **👥 User Insights** - Page views and user interactions

## 🧪 Testing & Quality

### Code Quality Tools
- **🔍 ESLint 9** - Modern linting with flat config
- **💅 Prettier** - Consistent code formatting
- **📘 TypeScript** - Type safety and better DX
- **🎨 Tailwind CSS IntelliSense** - Class name validation

### Performance
- **⚡ Lighthouse Score** - 95+ across all metrics
- **📦 Bundle Analysis** - Optimized chunk sizes
- **🖼️ Image Optimization** - Next.js Image component
- **⚡ Code Splitting** - Automatic route-based splitting

### Best Practices
- **♿ Accessibility** - WCAG 2.1 AA compliance
- **🔒 Security** - CSP headers and security best practices
- **📱 Performance** - Optimized Core Web Vitals
- **🌱 Sustainability** - Efficient code and minimal carbon footprint

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   npm run lint
   npm run format:check
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention
We use [Conventional Commits](https://conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Maintenance tasks

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Meaningful commit messages**
- **Component documentation**

## 📞 Support & Contact

### Getting Help
- **🐛 Bug Reports:** [Open an issue](https://github.com/valentinbourreau/personal-website/issues)
- **💡 Feature Requests:** [Start a discussion](https://github.com/valentinbourreau/personal-website/discussions)
- **📧 Contact:** [valentin@example.com](mailto:valentin@example.com)

### Professional Links
- **🌐 Website:** [valentinbourreau.com](https://valentinbourreau.com)
- **💼 LinkedIn:** [linkedin.com/in/valentinbourreau](https://linkedin.com/in/valentinbourreau)
- **🐙 GitHub:** [github.com/valentinbourreau](https://github.com/valentinbourreau)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Valentin Bourreau](https://valentinbourreau.com)**

*Senior Front-end Engineer | React, Next.js, TypeScript Expert*

[🌐 Website](https://valentinbourreau.com) • [💼 LinkedIn](https://linkedin.com/in/valentinbourreau) • [🐙 GitHub](https://github.com/valentinbourreau)

</div>