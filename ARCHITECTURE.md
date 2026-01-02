# Architecture Documentation

## Project Overview

This is a Next.js 14+ application built with the App Router architecture, designed to help users check eligibility for medical cards based on their U.S. state. The application emphasizes server-side rendering, static generation, and a clean component-based architecture.

## Technology Stack

### Core Technologies
- **Next.js 15.1.3**: React framework with App Router
- **React 18.3.1**: UI library
- **TypeScript 5.x**: Type safety and better developer experience
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Formik**: Form state and validation management
- **Yup**: Schema-based form validation

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **PostCSS & Autoprefixer**: CSS processing

## Architecture Decisions

### 1. Next.js App Router

**Why App Router?**
- Modern file-based routing system
- Built-in server components by default
- Better performance with selective client components
- Native support for layouts and nested routing
- Improved data fetching patterns

**Trade-offs:**
- Steeper learning curve compared to Pages Router
- Some third-party libraries may not be fully compatible yet
- More verbose file structure

### 2. Static Site Generation (SSG)

**Benefits:**
- Faster page loads (pre-rendered at build time)
- Better SEO
- Reduced server load
- CDN-friendly

### 3. File-Based Data Storage

**Current Implementation:**
- Submissions stored in `/data/submissions.json`
- States data in `/data/states.json`

**Why This Approach?**
- Simple for demo/prototype
- No database setup required
- Easy to inspect and debug
- Version control friendly

**Production Recommendations:**
- Migrate to MongoDB
- Implement proper indexing for queries
- Add data backup strategies

### 4. Component Structure

- Reusable, single-purpose components
- Mix of server and client components

**Component Categories:**

1. **Server Components** (default):
   - Layout components (Navbar, Footer)
   - Page components with data fetching
   - Better for SEO and performance

2. **Client Components** ('use client'):
   - Interactive forms (StateSelector, FormInput)
   - Components with hooks or event handlers
   - State management components

**Trade-offs:**
- Server components can't use React hooks

### 5. Form Handling & Validation

**Current Approach (Updated):**
- **Formik** for form state management
- **Yup** for schema-based validation
- Client-side validation before submission
- Server-side validation in API route
- Automatic error messages

**Benefits of Formik + Yup:**
- Reduces boilerplate code significantly
- Built-in field-level validation
- Touch-tracking (only show errors for touched fields)
- Form-level validation
- Easy to reuse validation schemas
- Better error messages and UX

### 6. Authentication & Authorization

**Session-Based Approach:**
- React Context API for state management
- Credentials stored in JSON (demo only)
- localStorage for session persistence
- Protected routes using higher-order components
- Login API endpoint for credential validation

### Authentication Architecture

#### 1. Context Setup (context/AuthContext.tsx)
```typescript
interface AuthSession {
  username: string;
  role: 'admin';
  loginTime: string;
}

// useAuth() hook provides:
- isAuthenticated: boolean
- isLoading: boolean
- session: AuthSession | null
- login(username, password): Promise<void>
- logout(): void
```

#### 2. Login API (app/api/auth/login/route.ts)
- Validates username and password against data/admin.json
- Returns user info (password excluded)
- Stores HTTP status 401 if credentials invalid
- Server-side validation prevents unauthorized access

#### 3. Route Protection (components/AdminProtected.tsx)
```typescript
// Wraps protected routes like /admin/submissions
- Checks isAuthenticated from useAuth()
- Shows loading spinner during auth check
- Redirects to /admin/login if not authenticated
- Only renders children if authenticated
```

#### 4. Login Flow Diagram
```
1. User visits /admin/login
   ↓
2. Login form with Formik + Yup validation
   (client-side: username min 3, password min 6)
   ↓
3. User submits credentials
   ↓
4. POST /api/auth/login (server validates)
   ↓
5. If valid → Return user info → Store in localStorage
   If invalid → Return 401 error → Show error message
   ↓
6. AuthContext.login() stores session
   ↓
7. All components subscribed to useAuth() re-render
   ↓
8. AdminProtected component detects isAuthenticated = true
   ↓
9. Redirect to /admin/submissions
```

#### 5. Session Management
```typescript
// Session stored in localStorage under 'adminSession'
{
  username: "admin",
  role: "admin",
  loginTime: "2024-01-15T10:30:00Z"
}

// Session persists across:
- Page reloads
- Browser tab switches
- Browser restart (until manual logout)
```


## Data Flow

### 1. Home Page Flow
```
User Action → StateSelector Component → 
Navigation → /state/[slug]
```

### 2. Application Form Flow
```
User navigates to /state/[slug]/apply → 
Form rendered with Formik wrapper → 
User fills form (real-time Formik validation) → 
Field-level errors show on blur/touch → 
User submits → 
Yup schema validates all fields → 
If valid: POST /api/eligibility → 
Server validates again → 
Save to submissions.json → 
Redirect to success page
```

### 3. Admin Login Flow
```
User visits /admin/login → 
Login page loads (public route) → 
Form with Formik + Yup validation → 
User enters credentials → 
Client validation (username min 3, password min 6) → 
POST /api/auth/login → 
Server reads /data/admin.json → 
Validates username + password match → 
If valid: return user info → 
Client stores session in localStorage → 
AuthContext.session updated → 
useAuth() hook triggered → 
All components subscribed to context re-render → 
Redirect to /admin/submissions
```

### 4. Protected Admin Dashboard Flow
```
User accesses /admin/submissions → 
AdminProtected component wraps page → 
Checks isAuthenticated from useAuth() → 
If not authenticated: 
  → Show loading spinner → 
  → Redirect to /admin/login → 
If authenticated:
  → Fetch /data/submissions.json → 
  → Render submissions table → 
  → Show LogoutButton with user info
```

### 2. Application Submission Flow
```
User fills form → 
Client validation → 
POST /api/eligibility → 
Server validation → 
Save to JSON → 
Redirect to success page
```

### 3. Admin Dashboard Flow
```
Page load → 
Server component fetches submissions → 
Renders table → 
Auto-updates on page refresh
```

## API Design

### POST /api/auth/login

**Endpoint for admin authentication**

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@medicalcard.com",
  "role": "admin"
}
```

**Response (Error):**
```json
{
  "error": "Invalid username or password"
}
```

**Validation:**
- Both username and password required
- Matches credentials in `/data/admin.json`
- Returns 401 Unauthorized if no match
- Password NOT included in response
- HTTP-only in production

### POST /api/eligibility

**Endpoint for application submissions**

**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "age": number,
  "medicalCondition": "string",
  "state": "string",
  "agreedToPrivacy": boolean
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "submissionId": "unique-id"
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

**Validation Rules:**
- All fields required
- Email format validation
- Age between 18-120
- Privacy agreement must be true

### GET /api/eligibility

**Response:**
```json
{
  "submissions": [...]
}
```

## SEO Strategy

### 1. Static Metadata
- Root layout has default metadata
- Each page can override with specific metadata

### 2. Dynamic Metadata
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const state = statesData.find((s) => s.slug === params.slug);
  
  return {
    title: `${state.name} Medical Card Eligibility`,
    description: `Check eligibility for ${state.name}...`,
  };
}
```

### 3. SEO Benefits
- Pre-rendered HTML for crawlers
- Optimized meta tags
- Clean URL structure
- Fast page loads

## Complete File Structure

```
medical-card-eligibility/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with AuthProvider, Navbar, Footer
│   ├── page.tsx                      # Home page with StateSelector
│   ├── globals.css                   # Tailwind CSS directives
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts          # POST /api/auth/login (credential validation)
│   │   └── eligibility/
│   │       └── route.ts              # POST /api/eligibility (form submission)
│   ├── state/
│   │   └── [slug]/                   # Dynamic state pages (SSG with generateStaticParams)
│   │       ├── page.tsx              # State details and requirements
│   │       ├── not-found.tsx         # Custom 404 for invalid state
│   │       ├── apply/
│   │       │   └── page.tsx          # Application form (Formik + Yup validation)
│   │       └── success/
│   │           └── page.tsx          # Success confirmation page
│   └── admin/
│       ├── login/
│       │   └── page.tsx              # Admin login page (public route)
│       └── submissions/
│           └── page.tsx              # Admin dashboard (protected by AdminProtected)
├── components/
│   ├── Navbar.tsx                    # Navigation bar with login link
│   ├── Footer.tsx                    # Footer component
│   ├── StateSelector.tsx             # Dropdown for state selection
│   ├── FormInput.tsx                 # Formik-integrated input/textarea component
│   ├── LogoutButton.tsx              # Logout button for admin header
│   └── AdminProtected.tsx            # HOC protecting admin routes
├── context/
│   └── AuthContext.tsx               # Authentication state management (React Context)
├── types/
│   ├── index.ts                      # State data types
│   └── auth.ts                       # Authentication types (AuthSession, AdminUser)
├── data/
│   ├── states.json                   # US states with medical card requirements
│   ├── admin.json                    # Admin credentials (demo only)
│   └── submissions.json              # Form submissions storage
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore file
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── package.json                      # Dependencies and scripts
├── ARCHITECTURE.md                   # This file
└── README.md                         # Project documentation
```

**Key Directories:**
- `app/` - All routes and API endpoints using App Router
- `components/` - Reusable UI components
- `context/` - Global state management (authentication)
- `data/` - JSON data files (no database required)
- `types/` - TypeScript interfaces and types

## Performance Considerations

### 1. Code Splitting
- Automatic route-based splitting
- Client components loaded separately
- Reduced initial bundle size

### 2. Image Optimization
- Could use Next.js Image component
- Automatic lazy loading
- WebP format conversion

### 3. Caching
- Static pages cached at CDN
- 24-hour revalidation for state pages
- Browser caching for assets

2. **Integration Tests:**
   - API route testing
   - Form submission flow
   - Navigation testing

### Build Configuration

```bash
# Production build
npm run build
