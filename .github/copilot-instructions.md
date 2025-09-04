# GitHub Copilot Instructions for Master Prompt Editor

**ALWAYS follow these instructions first and fallback to additional search and context gathering only when the information here is incomplete or found to be in error.**

## Project Overview

Master Prompt Editor is a React/TypeScript monorepo implementing an AI Orchestrator platform with a Master Prompt Editor and Advanced AI Toolkit. The repository contains three main components: a React frontend, an Express backend server, and a simple HTML client, plus shared TypeScript definitions.

## Critical Build Requirements

### NEVER CANCEL Build Operations
- **NEVER CANCEL any build command** - All builds must complete fully
- Frontend build: Takes ~2-3 seconds. Set timeout to 120+ seconds minimum
- Full build (all components): Takes ~6-7 seconds. Set timeout to 300+ seconds minimum  
- Dependency installation: Takes ~10 seconds. Set timeout to 180+ seconds minimum
- Linting: Takes ~2 seconds. Set timeout to 60+ seconds minimum

### Build Dependencies and Order
**CRITICAL**: Shared types MUST be built before the server compilation:
```bash
tsc --build src/types
```
This step is REQUIRED before any server build operations.

## Working Effectively

### Bootstrap and Install Dependencies
```bash
npm run install:all
```
- Installs root, server, and client dependencies simultaneously
- Takes approximately 10 seconds
- NEVER CANCEL - wait for completion

### Build All Components
```bash
# Build shared types first (REQUIRED)
tsc --build src/types

# Build everything
npm run build:all
```
- Frontend build: TypeScript compilation + Vite production build (~2-3 seconds)
- Server build: TypeScript compilation (~2 seconds)  
- Client build: Copy static files (~1 second)
- Total time: ~6-7 seconds
- **NEVER CANCEL** - Set timeout to 300+ seconds

### Development Servers
Start all development servers concurrently:
```bash
npm run dev
```
This starts:
- **Frontend**: http://localhost:3000 (React/Vite)
- **Backend**: http://localhost:3001 (Express/TypeScript)
- **Client**: http://localhost:8080 (Simple HTTP server)

Alternatively, start individually:
```bash
npm run dev:frontend  # Port 3000
npm run dev:server    # Port 3001  
npm run dev:client    # Port 8080
```

### Linting
```bash
npm run lint:all
```
- Runs ESLint across all TypeScript/React files
- Takes ~2 seconds
- May show warnings but should not fail builds
- NEVER CANCEL - Set timeout to 60+ seconds
- **Expected warnings** (acceptable): deprecated packages, TypeScript version compatibility

## Validation Requirements

### MANDATORY: End-to-End Application Testing
After making changes, ALWAYS validate by:

1. **Start the application**:
   ```bash
   npm run dev:frontend
   ```

2. **Navigate and test core functionality**:
   - Visit http://localhost:3000 or http://localhost:3000/public/index.html
   - Click "Master Prompt Editor" - should navigate to prompt editor page
   - Click "Advanced AI Toolkit" - should navigate to AI toolkit page  
   - Click "Dashboard" - should return to main dashboard
   - Verify navigation works and no console errors occur

3. **Test backend API**:
   ```bash
   npm run dev:server
   curl http://localhost:3001/health  # Should return {"status":"ok"}
   curl http://localhost:3001/api/prompts  # Should return []
   ```

4. **Test keyboard shortcuts**:
   - Press Ctrl+/ to verify shortcuts panel appears

5. **Test production build** (optional):
   ```bash
   npm run preview  # Starts preview server on port 4173
   ```

### Pre-Commit Validation
ALWAYS run these commands before committing:
```bash
# Build shared types first
tsc --build src/types

# Full build to catch compilation errors
npm run build:all

# Lint to catch style issues
npm run lint:all

# Start frontend and test navigation manually
npm run dev:frontend
```

### Security Testing (Optional)
For comprehensive security validation, refer to `SECURITY_TESTING_GUIDE.md`:
```bash
# Test rate limiting, input validation, CORS, security headers
# See SECURITY_TESTING_GUIDE.md for detailed security test procedures
```

## Repository Structure

```
. # Root Directory (React/TypeScript frontend)
├── src/                    # Main frontend source
│   ├── components/         # React components (layout/, ui/)
│   ├── pages/             # Application pages (Dashboard, PromptEditor, AIToolkit, Settings)
│   ├── context/           # React Context for state management
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions and API calls
│   ├── types/             # Shared TypeScript definitions (CRITICAL: Build first)
│   └── styles/            # Global styles
├── server/                # Backend Express server
│   ├── src/               # Server source code
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic services
│   │   ├── data/          # Mock data stores
│   │   └── config/        # Configuration files
│   └── package.json       # Backend dependencies
├── client/                # Simple HTML/JS client
│   └── src/               # Static HTML, CSS, JS files
├── public/                # Static assets (index.html)
└── package.json           # Root monorepo configuration
```

## Environment Configuration

### Vite Environment Variables
The frontend uses Vite, so environment variables must use `import.meta.env` syntax:
```typescript
// Correct for Vite
const API_URL = import.meta.env.VITE_API_URL || '/api';

// WRONG - causes runtime errors
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

### Node.js Version
- Requires Node.js 20.x (specified in CI pipeline)
- TypeScript 5.4.5+
- Uses ES modules (type: "module" in package.json)

## Common Issues and Solutions

### TypeScript Compilation Errors
- **Shared types not built**: Run `tsc --build src/types` first
- **Circular dependencies**: Check imports between types and components
- **Missing types**: Ensure all TypeScript files have proper type annotations
- **Missing Vite types**: If you see `Property 'env' does not exist on type 'ImportMeta'`, the `vite-env.d.ts` file may be missing from the project root. This file should contain:
  ```typescript
  /// <reference types="vite/client" />
  
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  ```
- **Missing Toast imports**: Components using `showToast` need to import and use the `useToast` hook:
  ```typescript
  import { useToast } from '../../../context/toastContextHelpers';
  const { showToast } = useToast();
  ```

### Linting Warnings
Current known issues (acceptable, do not prevent builds):
- **TypeScript version warning**: Using TypeScript 5.9.2 which is newer than officially supported by @typescript-eslint
- **Explicit any usage**: server/src/middleware/auditLogging.ts has intentional `any` type usage
- **Control character regex**: server/src/middleware/validation.ts uses control character patterns for security filtering
- **React hooks exhaustive-deps**: Some components have missing dependencies in useCallback arrays
- These issues are documented and do not prevent successful builds or deployments

### Runtime Errors
- **Process not defined**: Use `import.meta.env` instead of `process.env` in frontend code
- **White screen**: Check browser console for errors and ensure all imports resolve correctly

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Sets up Node.js 20.x
2. Runs `npm run install:all`
3. Builds shared types: `tsc --build src/types`
4. Builds all projects: `npm run build:all`  
5. Runs linting: `npm run lint:all` (continues on error)
6. Uploads build artifacts

## Key Technologies

- **Frontend**: React 18, TypeScript, Vite, React Router
- **Backend**: Express, TypeScript, ts-node-dev for development
- **Client**: Static HTML/CSS/JS served by Python HTTP server
- **Build**: TypeScript compiler, Vite, concurrent execution with concurrently
- **Linting**: ESLint with TypeScript and React plugins

## Important Notes

- **No test suite currently exists** - validation is manual through running the application
- **Environment variables**: Use `VITE_` prefix for frontend, standard names for backend
- **Port configuration**: Frontend (3000), Backend (3001), Client (8080), Preview (4173)
- **CORS enabled**: Backend allows cross-origin requests for development
- **Security headers**: CSP and security headers configured in index.html

## Common Commands and Expected Outputs

### Repository Root Structure
```
.
├── .github/             # GitHub workflows and templates
├── src/                 # Frontend source (React/TypeScript)
├── server/              # Backend Express server
├── client/              # Simple HTML/JS client
├── public/              # Static assets
├── package.json         # Root dependencies and scripts
├── README.md            # Project documentation
├── SECURITY_TESTING_GUIDE.md  # Security validation procedures
└── vite.config.ts       # Vite build configuration
```

### Build Artifacts Locations
After building:
- Frontend: `dist/` (Vite production build)
- Server: `server/dist/` (Compiled TypeScript)
- Client: `client/dist/` (Copied static files)
- Types: `src/types/dist/` (Compiled shared types)

### Expected API Responses
```bash
curl http://localhost:3001/health
# Returns: {"status":"ok","timestamp":"...","version":"1.0.0"}

curl http://localhost:3001/api/prompts  
# Returns: []
```

---

**Remember**: ALWAYS build shared types first, NEVER cancel long-running operations, and manually validate application functionality after changes.