# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS. Features a Notion-based CMS for blog posts and projects, GitHub API integration, markdown rendering with custom embeds, and PWA capabilities.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Content Management System

The site uses **Notion as a CMS** through a custom NestJS backend:
- Backend fetches content from Notion API
- Frontend displays markdown content with rich embeds
- Content types: Projects, Blogs, Experiences, Progress Reports
- Each content item has a Notion page ID passed via query params: `?id={notion_page_id}`

### State Management

Three Zustand stores handle UI state:
1. **Pathname Store** (`src/hooks/use-pathname-store.ts`) - Tracks current route for conditional rendering
2. **Custom Banner Store** (`src/hooks/useCustomBanner.ts`) - Manages dynamic banner images per page
3. **Navigation Store** (`src/hooks/use-navbar-items.ts`) - Controls active navigation highlighting

State management is intentionally lightweight - only UI concerns, no complex data management.

### Data Fetching Pattern

**Component-level fetching** without React Query/SWR:
- API wrappers in `src/app/api/` (blogs.ts, projects.ts, experience.ts)
- Manual `useEffect` + `useState` pattern in components
- Error handling with Sonner toast notifications
- Backend URL: `import.meta.env.VITE_API_URL`

**GitHub Integration:**
- Singleton Octokit client in `src/lib/octokit.ts`
- Fetches repository and language data
- Token: `import.meta.env.VITE_TOKEN`

### Routing Structure

React Router v6 with all main routes wrapped in `BaseLayout`:
- Static routes: `/`, `/about`, `/services`, `/projects`, `/blogs`, `/experiences`, `/progress-report`, `/guest-book`
- Dynamic routes: `/blogs/view/:title?id={notion_id}`, `/projects/view/:title?id={notion_id}`
- Standalone: `/sandbox` (dev), `/skillset`

Slugs use kebab-case format derived from title strings.

### Layout System

**BaseLayout** (`src/app/layouts/baselayout.tsx`) wraps all routes:
```
BaseLayout
├── Banner (conditional, varies by pathname)
│   └── Background (animated canvas with dynamic images)
│       └── Theme Toggle (floating button)
├── Outlet (route content)
└── Footer
```

Banner size and visibility controlled by pathname store.

### Markdown Rendering

Rich markdown system in `src/app/_components/readPage/`:
- **react-markdown** with **rehype-raw** (HTML support) + **rehype-sanitize** (XSS protection)
- **remark-gfm** for GitHub-flavored markdown
- Custom renderers for:
  - YouTube embeds (auto-detects video URLs)
  - Twitter/X embeds (react-twitter-widgets)
  - Syntax highlighting (react-syntax-highlighter with Prism)
- Styling via Tailwind Typography plugin + custom `src/css/markdown.css`

### Styling & Animation

**Tailwind CSS** with:
- Dark mode via `class` strategy
- Path alias: `@/` → `./src`
- Utility function: `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge)
- Plugins: `tailwindcss-animate`, `@tailwindcss/typography`, `tailwind-scrollbar`

**Framer Motion** for animations:
- Page transitions
- Staggered list animations
- Scroll-triggered reveals (`whileInView`)
- Spring physics for smooth interactions
- Heavily used in home page and card components

**Theme System:**
- Context provider in `src/components/providers/theme-provider.tsx`
- localStorage persistence
- Modes: light, dark, system

### Component Organization

```
src/
├── app/
│   ├── _components/      # Shared page-level components (lists, cards)
│   ├── api/              # Axios API wrappers
│   ├── layouts/          # Layout components
│   └── module/           # Feature modules (one per page)
├── components/
│   ├── ui/               # shadcn/ui components (Radix UI primitives)
│   ├── card/             # Custom card variants
│   ├── providers/        # Context providers
│   └── constant/         # Static data and meta info
├── hooks/                # Custom React hooks
└── lib/                  # Utilities (octokit, retry, utils)
```

**shadcn/ui**: Uses Radix UI primitives styled with Tailwind. Components follow compound component pattern (e.g., Card + CardContent + CardFooter).

### Environment Variables

Required in `.env`:
- `VITE_API_URL` - Backend API base URL (NestJS server)
- `VITE_TOKEN` - GitHub personal access token
- `VITE_WEBHOOK_CONTACT` - Discord webhook URL for contact form
- `VITE_MODE` - development/production

Note: `VITE_TOKEN` is explicitly defined in `vite.config.ts` to ensure availability.

### PWA Features

- Service worker registration in `src/hooks/app.ts`
- Installable on mobile/desktop
- Offline-capable
- `vite-plugin-pwa` configured in Vite config
- Manifest.json in public directory

### Key Integrations

1. **Discord Webhooks** - Contact form submissions sent to Discord
2. **Vercel Analytics** - Conditionally loaded in production (src/main.tsx)
3. **GitHub API** - Repository data via Octokit
4. **Notion API** - Content management (via backend)

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- ES2020 target
- Bundler module resolution
- No unused locals/parameters enforced

## Common Patterns

**Data Fetching Component:**
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProjects()
    .then(res => setData(res))
    .catch(err => toast.error('Failed to load'))
    .finally(() => setLoading(false));
}, []);
```

**Framer Motion List Animation:**
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div variants={cardVariants}>...</motion.div>
  ))}
</motion.div>
```

**Route with Query Params:**
```tsx
// Route: /projects/view/:title
// URL: /projects/view/my-project?id=abc123
const { title } = useParams();
const [searchParams] = useSearchParams();
const id = searchParams.get('id');
```

## Important Notes

- **Backend dependency**: This frontend requires a running NestJS backend that interfaces with Notion API
- **GitHub token**: Some features require valid `VITE_TOKEN` for public repo access
- **Build process**: Always run TypeScript compilation before Vite build (`npm run build` does both)
- **Module pattern**: Each page is self-contained in `src/app/module/{feature}/` directory
- **No testing**: No test suite currently configured
- **Deployment**: Optimized for Vercel deployment
