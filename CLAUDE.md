# Blog

This is an Blog application

## Project Overview

Configure the blog project as a pnpm 10.23.0-based monorepo (workspace). When separating and reusing switches, manage dependencies between apps consistently.

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
blog/
├── apps/
│   └── blog/                # blog application(Next.js)
├── packages/
│   ├── ui/                 # common ui componend or shadcn ui comoponent
│   ├── utils/              # common utility functions
│   └── config/             # shared config (ESLint, TSConfig, Tailwind ...)
├── package.json            # root package.json (private: true)
├── pnpm-workspace.yaml     # workspace
├── pnpm-lock.yaml
├── tsconfig.base.json      # common typescript config
└── .npmrc
```

## UI Component Rules

### React Components

- All React components must use **shadcn/ui** as the base component library
- Styling must be done exclusively with **Tailwind CSS** — no inline styles, no CSS modules, no styled-components
- Install shadcn/ui components via CLI: `pnpm dlx shadcn@latest add <component>`
- Shadcn components live in `packages/ui/src/components/ui/`
- Custom components built on top of shadcn must also use Tailwind utility classes only
- Do not override shadcn component internals — extend via `className` prop and `cn()` utility
- Use `cn()` (from `packages/ui/src/lib/utils.ts`) for conditional class merging
- Tailwind config must be shared from `packages/config/tailwind/`
- Dark mode support required via Tailwind's `dark:` variant — never hardcode color values

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge
