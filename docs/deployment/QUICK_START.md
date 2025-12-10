# Quick Start: Complete Deployment Guide

## 🚀 Complete Workflow: From Local to Production

Follow these steps in order to deploy your entire BitcoinVillageX application:

### Step 0: Push to GitHub
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/BitcoinvillageX.git
git branch -M main
git push -u origin main
```

### Step 1: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variables (see checklist below)
5. Deploy

### Step 2: Deploy Backend to Railway
1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub repository
3. Set **Root Directory** to `backend`
4. Add environment variables (see checklist below)
5. Generate domain and note the URL

### Step 3: Configure GoDaddy DNS
- **Option A (Easiest)**: Change nameservers to Vercel's
- **Option B**: Add DNS records manually:
  - A record: `@` → Vercel IP
  - CNAME: `www` → `cname.vercel-dns.com`
  - CNAME: `api` → Railway domain

### Step 4: Update Environment Variables
- Update `VITE_BACKEND_URL` in Vercel to use `api.yourdomain.com`
- Update `FRONTEND_URL` in Railway to use `yourdomain.com`

### Step 5: Update Supabase
- Site URL: `https://yourdomain.com`
- Redirect URLs: Add `https://yourdomain.com/**`

### Step 6: Test Everything
- Visit `https://yourdomain.com`
- Test authentication, marketplace, services
- Verify on mobile, tablet, and desktop

**For detailed step-by-step instructions, see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)**

---

## What You'll Need

- ✅ Domain name (already purchased from GoDaddy)
- ✅ GoDaddy account access
- ✅ GitHub repository (or code ready to deploy)
- ✅ Supabase project set up
- ✅ Environment variables ready

---

## Environment Variables Checklist

### Frontend (Vercel/Netlify)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_BACKEND_URL` (your backend URL)
- [ ] `VITE_STRIKE_VERIFICATION_ADDRESS`

### Backend (Railway/Render)
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` (your frontend domain)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VERIFF_API_KEY` (if using)
- [ ] `STRIKE_API_KEY` (if using)
- [ ] Other API keys as needed

---

## Testing Checklist

After deployment:

- [ ] Frontend loads at `https://yourdomain.com`
- [ ] Backend health check: `https://api.yourdomain.com/health`
- [ ] Can sign up/login
- [ ] No CORS errors in browser console
- [ ] SSL certificate is active (green lock icon)

---

For detailed instructions, see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)

