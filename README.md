# Internship Training Frontend - Next.js Application

## Overview
This is the frontend application for the internship training program. It demonstrates:
- Next.js App Router best practices
- TypeScript for type safety
- JWT authentication integration
- Protected routes and middleware
- Component-based architecture
- API service layer pattern

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Axios for API calls
- Lucide React for icons

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Backend API running (see backend repository)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your backend URL

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/      # Authentication pages (login, register)
│   └── (dashboard)/ # Protected dashboard pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── auth/        # Auth-specific components
│   └── layout/      # Layout components (navbar, sidebar)
├── lib/             # Utilities and services
│   ├── api/         # API client and functions
│   ├── auth/        # Auth context and token management
│   └── utils/       # Helper functions
└── types/           # TypeScript type definitions
```

## Features

### Authentication
- Login with email and password
- JWT token management (access + refresh)
- Automatic token refresh on expiration
- Protected routes via middleware
- Auth context for global state

### UI Components
- Reusable Button, Input, Card components
- Loading states and error handling
- Responsive design with Tailwind CSS

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/<feature-name>` - Feature branches
- `bugfix/<bug-name>` - Bug fix branches

### Commit Convention
```
feat: add login form validation
fix: resolve token refresh infinite loop
docs: update setup instructions
style: format code with prettier
refactor: extract auth logic to context
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with conventional commits
3. Run linting: `npm run lint`
4. Check formatting: `npm run format:check`
5. Type check: `npm run type-check`
6. Build test: `npm run build`
7. Push and create PR to `develop`
8. Request code review
9. Merge after approval

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Internship Training Platform
```

See `.env.local.example` for complete list.

## Authentication Flow

1. User submits login form
2. Frontend calls `/api/auth/login/` on backend
3. Backend returns JWT access + refresh tokens
4. Frontend stores tokens in localStorage
5. Frontend includes access token in API request headers
6. Middleware protects routes by checking token presence
7. Axios interceptor automatically refreshes expired tokens

## Adding New Features

### Creating a New Page
```typescript
// src/app/(dashboard)/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

### Creating a New API Function
```typescript
// src/lib/api/feature.ts
import apiClient from './client';

export const featureApi = {
  getData: async () => {
    const response = await apiClient.get('/api/feature/');
    return response.data;
  },
};
```

### Creating a Reusable Component
```typescript
// src/components/ui/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

## Learning Objectives
- Understand Next.js App Router architecture
- Implement client-side authentication
- Manage API calls with Axios
- Write type-safe TypeScript code
- Follow component composition patterns
- Practice Git workflow and code review

## Troubleshooting

### CORS Errors
Ensure backend has frontend URL in `CORS_ALLOWED_ORIGINS`.

### Token Refresh Loop
Check backend JWT settings and token expiration times.

### Build Errors
Run `npm run type-check` to identify TypeScript errors.

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support
For issues or questions, create an issue in the repository or contact your mentor.
