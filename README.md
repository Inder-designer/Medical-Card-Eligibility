# Medical Card Eligibility Checker

A Next.js 14+ App Router application that helps users check eligibility for medical cards based on their U.S. state.

## 🚀 Features

- **State Selection**: Choose from multiple U.S. states with medical card programs
- **Dynamic State Pages**: Server-side generated pages with state-specific requirements
- **Application Form**: Complete form with Formik + Yup validation for eligibility checking
- **Secure Admin Dashboard**: Session-based authentication to view submitted applications
- **Admin Login**: Built-in authentication system with demo credentials
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **SEO Optimized**: Dynamic metadata for all pages

## 📋 Requirements

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd medical-card-eligibility
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## 🔐 Admin Login

The admin panel requires authentication. Use these demo credentials:

**Admin Account:**
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** admin

### Accessing the Admin Panel

1. Navigate to [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
2. Enter your credentials (username and password)
3. View all submitted applications in the dashboard
4. Click the **Logout** button to sign out

Sessions persist across page reloads and are stored in browser localStorage.

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001) (or next available port)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
medical-card-eligibility/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── login/            # Admin authentication API
│   │   │       └── route.ts
│   │   └── eligibility/          # Eligibility submission endpoint
│   │       └── route.ts
│   ├── state/[slug]/             # Dynamic state pages
│   │   ├── page.tsx              # State details page
│   │   ├── apply/                # Application form (Formik + Yup)
│   │   │   └── page.tsx
│   │   └── success/              # Success confirmation
│   │       └── page.tsx
│   ├── admin/                    # Admin panel
│   │   ├── login/                # Admin login page (public)
│   │   │   └── page.tsx
│   │   └── submissions/          # Submissions dashboard (protected)
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer component
│   ├── StateSelector.tsx         # State dropdown selector
│   ├── FormInput.tsx             # Formik-integrated input
│   ├── LogoutButton.tsx          # Logout UI component
│   └── AdminProtected.tsx        # Route protection wrapper
├── context/                      # React context
│   └── AuthContext.tsx           # Authentication state management
├── data/                         # Data files
│   ├── admin.json                # Admin credentials
│   ├── states.json               # State information
│   └── submissions.json          # Stored submissions
├── types/                        # TypeScript definitions
│   ├── auth.ts                   # Auth type definitions
│   └── index.ts                  # General types
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── README.md
└── ARCHITECTURE.md
```

## 🔑 Key Features Explained

### Static Site Generation (SSG)

State pages use `generateStaticParams` to pre-render all state pages at build time with 24-hour revalidation:

```typescript
export async function generateStaticParams() {
  return statesData.map((state) => ({
    slug: state.slug,
  }));
}

export const revalidate = 86400; // 24 hours
```

### Form Validation

Client-side and server-side validation with **Formik** and **Yup**:
- Required field checks
- Email format validation
- Age range validation (18-120)
- Medical condition description (min 10 chars)
- Privacy policy agreement

### Authentication System

Admin panel uses session-based authentication:
- Login with username and password
- Credentials validated against `/data/admin.json`
- Session stored in browser localStorage
- Protected routes using `AdminProtected` component
- Auto-logout on browser close (customizable)

### Data Storage

Submissions are stored in `/data/submissions.json` with the following structure:

```json
{
  "id": "unique-id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "medicalCondition": "Description",
  "state": "california",
  "agreedToPrivacy": true,
  "submittedAt": "2026-01-02T10:00:00.000Z"
}
```

## Available States

The application currently includes 10 states:
- California
- New York
- Florida
- Texas
- Colorado
- Arizona
- Massachusetts
- Washington
- Oregon
- Nevada

To add more states, edit `/data/states.json`.
