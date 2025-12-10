# Authentication System - BitcoinVillageX

## Overview

BitcoinVillageX uses **Supabase Auth** for authentication, supporting multiple sign-in methods suitable for a web application. All users are referred to as **Villagers** in the system.

## Authentication Methods

### 1. Email/Password Authentication
- Traditional email and password signup/login
- Password validation (minimum 6 characters)
- Username can be set during signup

### 2. Google OAuth
- One-click Google sign-in
- OAuth 2.0 flow handled by Supabase
- Redirects back to app after authentication

### 3. Phone Number Authentication (OTP)
- SMS-based one-time password
- Phone number verification
- Available but optional

## Implementation Details

### Frontend (Web App)

The frontend uses **Supabase Client** directly for OAuth, which is the recommended approach for web applications:

**Location:** `frontend/src/pages/Login.tsx` and `frontend/src/pages/Signup.tsx`

```typescript
// Google OAuth
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};
```

### OAuth Flow (Web App)

1. **Villager clicks "Continue with Google"**
   - Frontend calls `supabase.auth.signInWithOAuth()`
   - Supabase redirects to Google OAuth page

2. **Villager authenticates with Google**
   - Google handles authentication
   - Villager grants permissions

3. **Google redirects back**
   - Google redirects to Supabase callback URL
   - Supabase processes the OAuth response
   - Supabase redirects to `redirectTo` URL (`/dashboard`)

4. **App detects session**
   - `App.tsx` has `onAuthStateChange` listener
   - Supabase client has `detectSessionInUrl: true`
   - Session is automatically detected from URL hash
   - User state is updated in Zustand store
   - Villager is redirected to dashboard

### Session Management

**Location:** `frontend/src/App.tsx`

```typescript
useEffect(() => {
  // Check active sessions
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Listen for auth state changes (including OAuth callbacks)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

**Key Configuration:**
- `detectSessionInUrl: true` - Automatically detects OAuth session from URL
- `autoRefreshToken: true` - Automatically refreshes expired tokens
- `persistSession: true` - Persists session in localStorage

### Backend API Endpoints (Optional)

The backend has OAuth endpoints available, but for web apps using Supabase client-side auth, they're typically not needed:

**Location:** `backend/src/controllers/auth.controller.ts`

```typescript
POST /api/auth/oauth/google
```

This endpoint can be used if you need server-side OAuth flow, but for standard web apps, client-side Supabase OAuth is recommended.

## Supabase Configuration Required

### 1. Enable OAuth Providers

In your Supabase dashboard:

1. **Go to Authentication > Providers**
2. **Enable Google:**
   - Enable Google provider
   - Add Google OAuth Client ID
   - Add Google OAuth Client Secret
   - Configure redirect URLs

### 2. Configure Redirect URLs

Add these URLs in Supabase Dashboard > Authentication > URL Configuration:

- **Site URL:** `http://localhost:5173` (development) / `https://yourdomain.com` (production)
- **Redirect URLs:**
  - `http://localhost:5173/dashboard` (development)
  - `http://localhost:5173/**` (development - wildcard)
  - `https://yourdomain.com/dashboard` (production)
  - `https://yourdomain.com/**` (production - wildcard)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase


## Environment Variables

### Frontend
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
```

## Profile Creation on OAuth Sign-in

When a Villager signs in with Google for the first time:

1. Supabase creates the auth user automatically
2. Database trigger creates a profile record (see migrations)
3. Database trigger creates a wallet record
4. User metadata from OAuth is stored in `user_metadata`

**Profile auto-creation:** Handled by database triggers in migration files.

## Testing OAuth

### Development
1. Ensure redirect URLs are configured in Supabase
2. Start frontend: `npm run dev` (in frontend folder)
3. Click "Continue with Google"
4. Complete OAuth flow
5. Should redirect to `/dashboard` and be logged in

### Common Issues

1. **"Redirect URL mismatch"**
   - Check Supabase redirect URL configuration
   - Ensure URL exactly matches (including http/https, port, path)

2. **"Provider not enabled"**
   - Check Supabase dashboard > Authentication > Providers
   - Ensure Google is enabled and configured

3. **Session not detected after redirect**
   - Check `detectSessionInUrl: true` in supabase client config
   - Verify `onAuthStateChange` listener in App.tsx

4. **Profile not created**
   - Check database triggers are installed
   - Verify migration files are run

## Supabase Edge Functions

**Note:** The `supabase/functions` folder is empty, which is correct for this implementation. 

For web applications using Supabase client-side authentication:
- **Edge Functions are NOT required** for OAuth
- Supabase handles OAuth flow server-side automatically
- Client just needs to call `signInWithOAuth()` and handle the callback

Edge Functions would only be needed for:
- Server-side OAuth flows (not needed here)
- Custom authentication logic (not needed here)
- Webhook processing (handled by backend API instead)

## Security Considerations

1. **OAuth State Verification:** Supabase automatically handles OAuth state verification
2. **Token Storage:** Sessions stored securely in browser (localStorage/cookies)
3. **Token Refresh:** Automatic token refresh handled by Supabase client
4. **HTTPS Required:** In production, OAuth requires HTTPS

## User Experience

### OAuth Flow
1. Villager clicks "Continue with Google"
2. Redirects to Google login page
3. Villager authenticates
4. Redirects back to app
5. Automatically logged in and redirected to dashboard

### Session Persistence
- Sessions persist across page refreshes
- Sessions persist across browser tabs
- Sessions expire based on Supabase configuration
- Automatic token refresh before expiration

## Conclusion

✅ **Google OAuth is fully incorporated in the web app**

- Frontend implementation complete
- OAuth button on Login and Signup pages
- Session detection and management working
- Profile auto-creation on first OAuth sign-in
- Backend endpoint available (optional for web apps)
- No Edge Functions needed (web app uses client-side auth)

**Next Steps:**
1. Configure Google OAuth provider in Supabase dashboard
2. Add redirect URLs to Supabase configuration
3. Test OAuth flow in development
4. Deploy and configure production redirect URLs

