# BitcoinVillageX Frontend

React/TypeScript frontend application for BitcoinVillageX - A Bitcoin-only micro-economy platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Supabase** - Authentication and database client

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your actual credentials:

```env
# Supabase Configuration (Required for authentication and database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
VITE_BACKEND_URL=http://localhost:3000

# Strike Verification Address (for Verified Villager payments)
VITE_STRIKE_VERIFICATION_ADDRESS=orukka@strike.me
```

**Note:** The app will run with placeholder values if `.env` is not configured, but authentication and database features won't work.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## What Works Without Supabase

✅ **UI/UX Testing:**
- All pages and navigation
- Home page with hero section
- Login/Signup page UI
- Marketplace, Services, Bounties, Crowdfunding pages
- Header and Footer
- Responsive design

❌ **What Requires Supabase:**
- User authentication (login/signup)
- Protected routes (will redirect to login)
- Database operations
- User profiles
- Wallet functionality

## Getting Real Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy your:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public Key → `VITE_SUPABASE_ANON_KEY`
5. Update your `.env` file with these values
6. Run the database migrations (see main README.md in project root)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without emitting files

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── common/     # Common UI components (Header, Footer, Layout, etc.)
│   │   ├── marketplace/
│   │   ├── services/
│   │   ├── bounties/
│   │   ├── crowdfunding/
│   │   ├── profile/
│   │   └── admin/
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Marketplace.tsx
│   │   ├── Services.tsx
│   │   ├── Bounties.tsx
│   │   ├── Crowdfunding.tsx
│   │   ├── Profile.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   │   └── supabase.ts
│   ├── store/          # Zustand stores
│   │   ├── authStore.ts
│   │   └── walletStore.ts
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── styles/         # Global styles
├── public/             # Static assets
├── .env.example        # Environment variables template
└── package.json
```

## Features

### ✅ Completed
- Authentication UI (Google, Email)
- Protected routes
- Responsive design (mobile-first)
- Type-safe API calls
- State management with Zustand
- Data fetching with React Query
- Basic page structure

### ⏭️ In Progress / TODO
- [ ] Implement marketplace listings
- [ ] Add service listings
- [ ] Build bounty system
- [ ] Create crowdfunding campaigns
- [ ] Add profile management
- [ ] Integrate Lightning payments
- [ ] Implement Strike payment for verification
- [ ] Implement Verriff verification
- [ ] Add platform fee deduction system (2.5%)

## Testing the Frontend

### Test UI Components

1. **Home Page:**
   - Visit `http://localhost:5173`
   - Check hero section, four pillars, and CTA sections

2. **Navigation:**
   - Click through all menu items
   - Test responsive menu on mobile

3. **Auth Pages:**
   - Visit `/login` and `/signup`
   - UI should render correctly
   - Buttons won't work without Supabase configured

4. **Protected Routes:**
   - Try visiting `/dashboard` or `/profile`
   - Should redirect to `/login` if not authenticated

### Test with Real Supabase

Once you have Supabase configured:

1. **Sign Up:**
   - Go to `/signup`
   - Try email/password signup
   - Or use Google OAuth

2. **Login:**
   - Go to `/login`
   - Sign in with your credentials

3. **Protected Routes:**
   - After login, you should access `/dashboard` and `/profile`

## Troubleshooting

### Port Already in Use

If port 5173 is taken, Vite will automatically use the next available port.

### Module Not Found Errors

Make sure you've run `npm install` in the frontend directory.

### Supabase Connection Errors

If you see Supabase errors, check:
1. Your `.env` file exists and has correct values
2. You've restarted the dev server after adding `.env`
3. Your Supabase project is active

### TypeScript Errors

Run `npm run type-check` to see detailed TypeScript errors.

### Node Version Warning

Supabase packages require Node >= 20.0.0. If you're on Node 18, the app should still work but consider upgrading for best compatibility.

## Development Workflow

1. **Start Development:**
   ```bash
   npm run dev
   ```

2. **Type Checking:**
   ```bash
   npm run type-check
   ```

3. **Linting:**
   ```bash
   npm run lint
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database migrations
3. ✅ Configure environment variables
4. ⏭️ Test authentication flow
5. ⏭️ Build out feature pages (Marketplace, Services, etc.)
6. ⏭️ Integrate Lightning payments
7. ⏭️ Implement Strike payment for verification
8. ⏭️ Add platform fee deduction system (2.5%)

## Related Documentation

- Main project README: `../README.md`
- Payment model: `../PAYMENT_MODEL.md`
- Database schema: `../supabase/migrations/`
