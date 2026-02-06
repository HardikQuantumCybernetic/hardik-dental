# 🦷 Hardik Dental - Dental Clinic Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, full-stack dental clinic management system built with React, TypeScript, and Supabase. This open-source application provides comprehensive patient management, appointment scheduling, feedback collection, and administrative tools for dental practices.

> **🌟 Star this repo** if you find it useful! Your support helps us improve and maintain this project.

## ✨ Features

### Patient Management
- Complete patient records with medical history
- Patient demographics and insurance information
- Patient-specific financial tracking
- WhatsApp integration for direct patient communication
- PDF generation for patient records

### Appointment System
- Intuitive appointment scheduling
- Real-time appointment status updates
- Doctor assignment and scheduling
- Multiple appointment types and services
- Calendar-based visualization

### Financial Management
- Track treatment costs and payments
- Patient payment history
- Outstanding balances tracking
- Financial reporting

### Admin Dashboard
- Comprehensive dashboard with analytics
- Patient management interface
- Appointment management
- Feedback and message management
- Reports and analytics

### Patient Features
- Patient portal with dashboard
- Appointment history
- Feedback submission
- Contact form

### Authentication & Authorization
- Clerk-based authentication
- Role-based access control (Admin, Doctor, Staff, Patient)
- Secure session management

### Additional Features
- AI-powered chatbot for patient queries
- Real-time updates via Supabase subscriptions
- Responsive design for all devices
- PWA support for mobile installation
- SEO optimized

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Routing
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations
- **React Three Fiber** - 3D graphics

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Edge Functions
  - Authentication

### Additional Tools
- **Clerk** - Authentication provider
- **jsPDF** - PDF generation
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **Recharts** - Data visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** - Package manager
- **Git** - Version control
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Clerk Account** - [Sign up](https://clerk.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HardikQuantumCybernetic/hardik-dental.git
cd hardik-dental
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Project name: `hardik-dental`
   - Database password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"
5. Wait for the project to be provisioned

#### Get Supabase Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

#### Update Supabase Client Configuration

Open `src/integrations/supabase/client.ts` and update the credentials:

```typescript
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_ANON_KEY";
```

### 4. Set Up Database Schema

#### Run Database Migrations

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Push the database schema:
```bash
supabase db push
```

Alternatively, you can manually run the SQL migrations from `docs/supabase-schema.sql`:

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `docs/supabase-schema.sql`
3. Paste and execute the SQL

#### Verify Database Setup

The database includes these tables:
- `patients` - Patient information
- `appointments` - Appointment scheduling
- `doctors` - Doctor profiles
- `services` - Available services
- `patient_services` - Patient treatment tracking
- `patient_financials` - Financial records
- `feedback` - Patient feedback and messages
- `treatments` - Treatment records
- `user_roles` - Role-based access control

### 5. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your Publishable Key from API Keys section
4. Update `src/main.tsx`:

```typescript
const PUBLISHABLE_KEY = 'YOUR_CLERK_PUBLISHABLE_KEY';
```

5. Configure authentication providers in Clerk:
   - Enable Email/Password
   - Enable OAuth providers (optional): Google, GitHub, etc.

6. Set up redirect URLs in Clerk:
   - Add your development URL: `http://localhost:8080`
   - Add your production URL after deployment

### 6. Configure Environment (Optional)

For Supabase Edge Functions, you may need to set up secrets:

```bash
supabase secrets set OPENAI_API_KEY=your_key_here
supabase secrets set CLERK_SECRET_KEY=your_key_here
```

### 7. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Initialize Netlify**:
```bash
netlify init
```

4. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Deploy**:
```bash
netlify deploy --prod
```

6. **Configure Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add your Clerk Publishable Key (if needed in build process)

### Option 2: Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configure Project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add required variables

### Option 3: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. **Update vite.config.ts** (set base path):
```typescript
export default defineConfig({
  base: '/hardik-dental/',
  // ... other config
});
```

4. **Deploy**:
```bash
npm run deploy
```

### Option 4: Docker Deployment

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY netlify.toml /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build Docker Image**:
```bash
docker build -t hardik-dental .
```

3. **Run Container**:
```bash
docker run -p 80:80 hardik-dental
```

### Option 5: Traditional Web Hosting

1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web host
3. Configure your web server to:
   - Serve `index.html` for all routes (SPA routing)
   - Enable HTTPS
   - Set proper cache headers

Example Apache `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Example Nginx configuration:
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/hardik-dental;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 🔒 Security Setup

### Supabase Row Level Security (RLS)

The project includes RLS policies for data security. Ensure they're enabled:

1. Go to Supabase Dashboard → Authentication → Policies
2. Verify all tables have RLS enabled
3. Review and adjust policies as needed

### Setting Up Admin Access

The admin panel uses Supabase authentication with role-based access control. Follow these steps to create an admin account:

#### Step 1: Create an Admin User in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Users**
3. Click **Add User** (or **Invite User**)
4. Fill in the admin credentials:
   - **Email**: Enter the admin email address (e.g., `admin@yourdomain.com`)
   - **Password**: Enter a strong password
   - **Auto Confirm User**: Toggle ON (optional, but recommended for testing)
5. Click **Create User** or **Send Invitation**
6. **Copy the User ID** (UUID) - you'll need this in the next step

#### Step 2: Assign Admin Role

1. Go to **SQL Editor** in your Supabase Dashboard
2. Run the following SQL query to grant admin access:

```sql
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID copied from Step 1
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

Example:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin');
```

3. Execute the query

#### Step 3: Access the Admin Panel

1. Navigate to your application's admin login page (e.g., `https://yourdomain.com/admin`)
2. Sign in using the admin credentials you created in Step 1
3. You should now have full access to the admin dashboard

#### Verifying Admin Access

To verify an admin user exists, run:
```sql
SELECT ur.*, au.email 
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

#### Removing Admin Access

To revoke admin access:
```sql
DELETE FROM user_roles 
WHERE user_id = 'USER_ID_HERE' AND role = 'admin';
```

#### Security Best Practices

- Use strong, unique passwords for admin accounts
- Limit the number of admin users
- Regularly audit admin access using the verification query
- Enable Multi-Factor Authentication (MFA) in Supabase for admin accounts
- Never share admin credentials

### API Security Features

The application implements production-grade API security:

#### 1. Rate Limiting
All API endpoints are protected with rate limiting to prevent abuse:
- **Default**: 100 requests per minute per user
- **Configurable** via environment variables:
  - `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)
  - `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: 60000)
- **Response Headers**: Includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **HTTP 429**: Returned when limit exceeded with `Retry-After` header

#### 2. Authentication & Authorization
- **JWT Verification**: All protected endpoints require valid JWT tokens
- **Token Validation**: Tokens are verified against Supabase Auth on every request
- **Role-Based Access**: Admin, Doctor, Staff, and Patient roles with appropriate permissions
- **HTTP 401/403**: Returned for unauthenticated/unauthorized requests

#### 3. CORS Configuration
Strict Cross-Origin Resource Sharing policy:
- **Whitelisted Origins Only**: Requests from unauthorized origins are blocked
- **Environment-Specific**: Different origins for development and production
- **Credentials Support**: Properly configured for authenticated requests
- **No Wildcards**: `Access-Control-Allow-Origin: *` is NOT used for authenticated endpoints

**Allowed Origins** (configurable in edge functions):
- Production: Your Supabase domain
- Development: `localhost:3000`, `localhost:5173`, `localhost:8080`

To add production domains, update `ALLOWED_ORIGINS` in `supabase/functions/chat-with-gemini/index.ts`.

#### 4. Input Validation
- Message length limits (max 2000 characters)
- Type validation on all inputs
- Sanitized error messages (no internal details exposed)

#### Configuring Rate Limits

Set rate limit environment variables in Supabase:
```bash
supabase secrets set RATE_LIMIT_MAX_REQUESTS=50
supabase secrets set RATE_LIMIT_WINDOW_MS=30000
```

## 📱 PWA Configuration

The app is configured as a Progressive Web App (PWA):

- Service Worker is in `public/sw.js`
- Manifest is in `public/site.webmanifest`
- Icons are in `public/` directory

Users can install the app on their devices for a native-like experience.

## 🧪 Testing

### Run Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📚 Project Structure

```
hardik-dental/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Shared components
│   │   ├── contact/     # Contact form components
│   │   ├── optimized/   # Performance-optimized components
│   │   ├── seo/         # SEO components
│   │   └── ui/          # UI component library (shadcn)
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party integrations
│   │   └── supabase/    # Supabase client & types
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
├── docs/                # Documentation
└── package.json
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 18+)

**Supabase Connection Issues**
- Verify credentials in `src/integrations/supabase/client.ts`
- Check Supabase project status
- Ensure RLS policies are correct

**Clerk Authentication Issues**
- Verify publishable key in `src/main.tsx`
- Check redirect URLs in Clerk dashboard
- Ensure authentication is enabled

**Database Errors**
- Run migrations: `supabase db push`
- Check table structure in Supabase dashboard
- Verify RLS policies are not blocking queries

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Hardik Dattatray Jadhav ](https://github.com/HardikQuantumCybernetic)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend by [Supabase](https://supabase.com/)
- Authentication by [Clerk](https://clerk.com/)

## 📧 Support

For support, email hardikjadhav307@gmail.com or open an issue in the repository.

## 🔗 Links

- [Live Demo](https://hardik306-72.lovable.app)
- [Documentation](https://github.com/HardikQuantumCybernetic/hardik-dental)
- [Bug Reports](https://github.com/HardikQuantumCybernetic/hardik-dental/issues)
- [Feature Requests](https://github.com/HardikQuantumCybernetic/hardik-dental/issues)

## 📊 Project Status

This project is actively maintained and open for contributions. Current priorities:

- ✅ Core patient management
- ✅ Appointment scheduling with time slot blocking
- ✅ WhatsApp integration for notifications
- ✅ Admin dashboard with analytics
- 🔄 Email notification system (planned)
- 🔄 SMS reminders (planned)
- 🔄 Multi-language support (planned)

---

Made with ❤️ by the Hardik Dental team

**Open Source** • **MIT Licensed** • **Built with Lovable**
