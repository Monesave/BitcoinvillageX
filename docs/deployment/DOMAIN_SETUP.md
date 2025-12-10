# Complete Deployment Guide: GitHub to Production

This comprehensive guide walks you through the entire process of deploying BitcoinVillageX from your local machine to production, including pushing to GitHub, deploying frontend and backend, and connecting your GoDaddy domain.

## 📋 Complete Deployment Workflow

Follow these steps in order to deploy your entire application:

1. **Push Project to GitHub** (Step 0)
2. **Deploy Frontend to Vercel** (Step 1)
3. **Deploy Backend to Railway** (Step 2)
4. **Configure GoDaddy DNS** (Step 3)
5. **Update Supabase Configuration** (Step 4)
6. **Test Everything** (Step 5)

---

## Step 0: Push Project to GitHub

Before deploying, you need to push your code to GitHub so hosting platforms can access it.

### 0.1: Initialize Git Repository (if not already done)

```bash
# Navigate to your project directory
cd /Users/patrickenin/Desktop/BitcoinvillageX

# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### 0.2: Create GitHub Repository

1. **Go to GitHub**:
   - Visit [github.com](https://github.com)
   - Sign in to your account
   - Click the **+** icon in the top right → **New repository**

2. **Create New Repository**:
   - **Repository name**: `BitcoinvillageX` (or your preferred name)
   - **Description**: "Bitcoin-only micro-economy platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
   - Click **Create repository**

3. **Copy the repository URL** (you'll need this in the next step)
   - It will look like: `https://github.com/yourusername/BitcoinvillageX.git`

### 0.3: Add Files and Push to GitHub

```bash
# Make sure you're in the project root directory
cd /Users/patrickenin/Desktop/BitcoinvillageX

# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status

# Commit your changes
git commit -m "Initial commit: BitcoinVillageX project"

# Add GitHub as remote (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/BitcoinvillageX.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you get authentication errors, you may need to:
- Set up a Personal Access Token (GitHub → Settings → Developer settings → Personal access tokens)
- Or use GitHub CLI: `gh auth login`

### 0.4: Verify GitHub Push

1. Go to your GitHub repository page
2. Verify all files are present:
   - `frontend/` folder
   - `backend/` folder
   - `supabase/` folder
   - `package.json` files
   - Documentation files

**✅ Step 0 Complete**: Your code is now on GitHub and ready for deployment!

---

## 🎯 Quick Start for GoDaddy Users

**Just bought your domain from GoDaddy?** Here's the fastest path:

1. **Push to GitHub** (Step 0 above) ✅
2. **Deploy Frontend to Vercel** (Step 1 below)
3. **Deploy Backend to Railway** (Step 2 below)
4. **Configure DNS in GoDaddy** (Step 3 below)
5. **Update Supabase** (Step 4 below)
6. **Test** (Step 5 below)

**Need detailed instructions?** Continue reading below.

## Overview

Your application consists of:
- **Frontend**: React/Vite app (runs on port 5173 in dev)
- **Backend**: Express/Node.js API (runs on port 3000 in dev)

You'll need to deploy both services and connect them to your domain.

## GoDaddy Domain Setup

If you just purchased your domain from GoDaddy, follow these steps to connect it to your application.

### Accessing Your GoDaddy Domain

1. **Log in to GoDaddy**:
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account
   - You should see your newly purchased domain in the dashboard

2. **Navigate to DNS Management**:
   - Click on **My Products** (or **Domains**)
   - Find your domain and click on it
   - Click on **DNS** (or **Manage DNS**)
   - You'll see the DNS Management page with existing records

### Understanding GoDaddy's DNS Interface

GoDaddy's DNS page shows:
- **A Records**: Point to IP addresses
- **CNAME Records**: Point to other domain names
- **MX Records**: For email (you can leave these)
- **TXT Records**: For verification (you can leave these)

**Important**: You'll be adding/modifying records here to point your domain to your hosting providers.

---

## Deployment Options

### Recommended Setup

**Option 1: Vercel (Frontend) + Railway (Backend)** ⭐ Recommended
- **Frontend**: Vercel (free tier, excellent for React/Vite)
- **Backend**: Railway (free tier, easy Node.js deployment)

**Option 2: Netlify (Frontend) + Render (Backend)**
- **Frontend**: Netlify (free tier, good for static sites)
- **Backend**: Render (free tier, similar to Railway)

**Option 3: All-in-One: Fly.io or Render**
- Deploy both frontend and backend on the same platform

---

## Step 1: Deploy Frontend to Vercel

### Prerequisites
- ✅ Code pushed to GitHub (Step 0)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- ✅ Supabase project set up (see `docs/SUPABASE_SETUP.md`)

### 1.1: Create Vercel Project

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click **"Add New..."** → **"Project"**

2. **Import GitHub Repository**:
   - Click **"Import Git Repository"**
   - Authorize Vercel to access your GitHub account (if first time)
   - Find and select your `BitcoinvillageX` repository
   - Click **"Import"**

3. **Configure Project Settings**:
   - **Project Name**: `bitcoinvillagex` (or your preferred name)
   - **Framework Preset**: Select **"Vite"** (Vercel should auto-detect)
   - **Root Directory**: Click **"Edit"** and set to `frontend`
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Click "Deploy"** (don't add environment variables yet - we'll do that after)

### 1.2: Add Environment Variables

After the initial deployment completes:

1. **Go to Project Settings**:
   - In your Vercel project dashboard
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

2. **Add Frontend Environment Variables**:
   Click **"Add New"** for each variable:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://your-project-ref.supabase.co
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: VITE_BACKEND_URL
   Value: https://your-app.railway.app
   Note: We'll update this after deploying backend (Step 2)
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: VITE_STRIKE_VERIFICATION_ADDRESS
   Value: orukka@strike.me
   Environment: Production, Preview, Development (select all)
   ```

   **Where to find Supabase values**:
   - Go to your Supabase Dashboard
   - Navigate to **Settings** → **API**
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - This ensures environment variables are included

### 1.3: Add Custom Domain (After Backend is Deployed)

**Wait until after Step 2 (Backend Deployment)** before adding your custom domain. For now, note your Vercel URL: `https://your-app.vercel.app`

**✅ Step 1 Complete**: Frontend is deployed! Continue to Step 2.

### Using Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd frontend
   netlify deploy --prod
   ```
   
   Or use web interface:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Set **Base directory** to `frontend`
   - Set **Build command** to `npm run build`
   - Set **Publish directory** to `frontend/dist`

3. **Add Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel (above)

---

## Step 2: Deploy Backend to Railway

### Prerequisites
- ✅ Code pushed to GitHub (Step 0)
- ✅ Frontend deployed to Vercel (Step 1)
- ✅ Railway account (sign up at [railway.app](https://railway.app) if needed)
- ✅ Supabase project set up

### 2.1: Create Railway Project

1. **Go to Railway Dashboard**:
   - Visit [railway.app](https://railway.app)
   - Sign up or log in (you can use GitHub to sign in)

2. **Create New Project**:
   - Click **"New Project"** button
   - Select **"Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub account (if first time)
   - Select your `BitcoinvillageX` repository
   - Click **"Deploy Now"**

3. **Configure Service**:
   - Railway will auto-detect Node.js
   - Click on the service that was created
   - Go to **Settings** tab
   - Scroll to **Root Directory**
   - Click **"Change"** and set to: `backend`
   - Click **"Save"**

4. **Configure Build Settings**:
   - Go to **Settings** → **Deploy**
   - **Start Command**: `npm start` (uses `tsx` to run TypeScript directly without compilation)
   - Railway will automatically run `npm install` and `npm run build`
   - **Note**: The backend is configured to use `tsx` at runtime instead of compiling TypeScript. This is a temporary workaround until database types are fully generated from Supabase. The code will run correctly despite TypeScript type warnings.
   - **Important**: Make sure `tsx` is in `dependencies` (not just `devDependencies`) for Railway deployment.

### 2.2: Add Environment Variables

1. **Go to Variables Tab**:
   - In your Railway service dashboard
   - Click **Variables** tab
   - Click **"New Variable"** for each one

2. **Add Backend Environment Variables**:

   **Required Variables**:
   ```
   NODE_ENV = production
   PORT = 3000
   FRONTEND_URL = https://your-app.vercel.app
   Note: Update this to your custom domain after Step 3
   ```

   ```
   SUPABASE_URL = https://your-project-ref.supabase.co
   ```

   ```
   SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
   Important: This is the SECRET key, not the anon key!
   ```

   **Optional Variables** (add if you're using these features):
   ```
   VERIFF_API_KEY = your_veriff_api_key
   VERIFF_API_URL = https://stationapi.veriff.com/v1
   VERIFF_CALLBACK_URL = https://your-app.railway.app/api/verification/webhook
   VERIFF_WEBHOOK_SECRET = your_veriff_webhook_secret
   ```

   ```
   STRIKE_API_KEY = your_strike_api_key
   STRIKE_RECEIVER_HANDLE = orukka@strike.me
   ```

   ```
   ADMIN_EMAILS = admin@example.com,another@example.com
   ```

   **Where to find Supabase values**:
   - Go to Supabase Dashboard → **Settings** → **API**
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

3. **Railway will automatically redeploy** when you add variables

### 2.3: Get Railway Domain

1. **Generate Domain**:
   - In Railway service dashboard
   - Go to **Settings** → **Networking**
   - Under **Public Networking**, click **"Generate Domain"**
   - Railway will create a domain like: `your-app-production.up.railway.app`
   - **Copy this domain** - you'll need it for:
     - Frontend `VITE_BACKEND_URL` environment variable
     - GoDaddy DNS configuration

2. **Test Backend**:
   - Visit: `https://your-app-production.up.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"...","uptime":...}`

### 2.4: Update Frontend Environment Variable

Now that you have your backend URL:

1. **Go back to Vercel**:
   - Open your Vercel project
   - Go to **Settings** → **Environment Variables**
   - Find `VITE_BACKEND_URL`
   - Click **Edit**
   - Update value to: `https://your-app-production.up.railway.app`
   - Click **Save**

2. **Redeploy Frontend**:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**

**✅ Step 2 Complete**: Backend is deployed! Continue to Step 3.

### Using Render

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure:
     - **Name**: `bitcoinvillagex-backend`
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

3. **Add Environment Variables** (same as Railway above)

4. **Deploy**: Render will automatically deploy

---

## Step 3: Configure Custom Domain on GoDaddy

### Prerequisites
- ✅ Frontend deployed to Vercel (Step 1)
- ✅ Backend deployed to Railway (Step 2)
- ✅ GoDaddy account with your domain

### 3.1: Add Domain to Vercel (Frontend)

1. **Go to Vercel Project**:
   - Open your Vercel project dashboard
   - Click **Settings** tab
   - Click **Domains** in the left sidebar

2. **Add Your Domain**:
   - Click **"Add Domain"** button
   - Enter your domain: `yourdomain.com` (replace with your actual domain)
   - Click **"Add"**
   - Vercel will show you DNS configuration options

3. **Choose DNS Configuration Method**:
   - **Option A**: Use Vercel's nameservers (easiest - recommended)
   - **Option B**: Add DNS records manually in GoDaddy

4. **Note the DNS Information**:
   - If using Option A: Vercel will show 4 nameservers
   - If using Option B: Vercel will show A record IP addresses and CNAME values

### 3.2: Add Custom Domain to Railway (Backend)

1. **Go to Railway Service**:
   - Open your Railway service dashboard
   - Go to **Settings** → **Networking**

2. **Add Custom Domain**:
   - Under **Custom Domains**, click **"Add Domain"**
   - Enter subdomain: `api.yourdomain.com` (or `backend.yourdomain.com`)
   - Click **"Add"**
   - Railway will show you the CNAME target (e.g., `your-app-production.up.railway.app`)
   - **Copy this CNAME target** - you'll need it for GoDaddy

### 3.3: Configure DNS in GoDaddy

Now configure your GoDaddy DNS to point to your hosting providers.

#### Option A: Use Vercel Nameservers (Easiest - Recommended)

This method lets Vercel manage all DNS records:

1. **Get Vercel Nameservers**:
   - In Vercel → Settings → Domains
   - After adding your domain, you'll see nameservers like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
     - `ns3.vercel-dns.com`
     - `ns4.vercel-dns.com`

2. **Update Nameservers in GoDaddy**:
   - Log into [GoDaddy](https://godaddy.com)
   - Go to **My Products** → Click on your domain
   - Click **DNS** (or **Manage DNS**)
   - Scroll down to **Nameservers** section
   - Click **"Change"** button
   - Select **"Custom"** (not "GoDaddy Nameservers")
   - Delete the existing nameservers
   - Add Vercel's 4 nameservers one by one:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
     - `ns3.vercel-dns.com`
     - `ns4.vercel-dns.com`
   - Click **"Save"**

3. **Add Backend CNAME in Vercel DNS**:
   - Go back to Vercel → Settings → Domains
   - Click on your domain
   - Click **"DNS Records"** tab
   - Click **"Add Record"**
   - **Type**: CNAME
   - **Name**: `api` (or `backend`)
   - **Value**: Railway's CNAME target (from Step 3.2)
   - Click **"Save"**

4. **Wait 15-30 minutes** for nameserver changes to propagate

#### Option B: Add DNS Records Manually in GoDaddy

If you want to keep using GoDaddy's DNS management:

1. **Log into GoDaddy**:
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account
   - Go to **My Products** → Click on your domain
   - Click **DNS** (or **Manage DNS**)

2. **Add A Record for Root Domain** (`yourdomain.com`):
   - Click **"Add"** button
   - **Type**: Select `A` from dropdown
   - **Name**: `@` (or leave blank - GoDaddy uses `@` for root domain)
   - **Value**: Vercel's IP address (shown in Vercel dashboard, e.g., `76.76.21.21`)
     - **Important**: Get the exact IP from Vercel → Settings → Domains → Your Domain
   - **TTL**: `600` (or leave default)
   - Click **"Save"**

3. **Add CNAME Record for www** (`www.yourdomain.com`):
   - Click **"Add"** button
   - **Type**: Select `CNAME` from dropdown
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com` (or the value Vercel shows)
   - **TTL**: `600`
   - Click **"Save"**

4. **Add CNAME Record for API** (`api.yourdomain.com`):
   - Click **"Add"** button
   - **Type**: Select `CNAME` from dropdown
   - **Name**: `api` (or `backend` if you prefer)
   - **Value**: Railway's CNAME target (e.g., `your-app-production.up.railway.app`)
     - **Important**: Don't include `https://` or trailing slashes!
     - Just the domain: `your-app-production.up.railway.app`
   - **TTL**: `600`
   - Click **"Save"**

5. **Verify DNS Records**:
   Your GoDaddy DNS should now have:
   ```
   Type    Name    Value                              TTL
   A       @       76.76.21.21                        600
   CNAME   www     cname.vercel-dns.com               600
   CNAME   api     your-app-production.up.railway.app  600
   ```

6. **Wait 15-30 minutes** for DNS propagation

### 3.4: Verify Domain Configuration

1. **Check Vercel Domain Status**:
   - Go to Vercel → Settings → Domains
   - Your domain should show "Valid Configuration" after DNS propagates
   - SSL certificate will be automatically provisioned (takes 5-10 minutes)

2. **Check Railway Domain Status**:
   - Go to Railway → Settings → Networking
   - Your custom domain should show as "Active" after DNS propagates

**✅ Step 3 Complete**: Domains are configured! Continue to Step 4.

---

### For Frontend (Vercel)

1. **Add Domain in Vercel**:
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com` or `www.yourdomain.com`)
   - Vercel will show DNS records to add

2. **Configure DNS in GoDaddy**:
   
   **Option A: Use Vercel's Nameservers** (Easiest - Recommended)
   
   This method lets Vercel manage all DNS records:
   
   1. In Vercel dashboard, after adding your domain, you'll see nameservers like:
      - `ns1.vercel-dns.com`
      - `ns2.vercel-dns.com`
      - `ns3.vercel-dns.com`
      - `ns4.vercel-dns.com`
   
   2. In GoDaddy:
      - Go to your domain's **DNS** page
      - Scroll down to find **Nameservers** section
      - Click **Change** button
      - Select **Custom** (not "GoDaddy Nameservers")
      - Delete the existing nameservers
      - Add Vercel's 4 nameservers one by one
      - Click **Save**
   
   3. **Wait 15-30 minutes** for nameserver changes to propagate
   
   **Option B: Add DNS Records in GoDaddy** (Keep GoDaddy DNS)
   
   If you want to keep using GoDaddy's DNS management:
   
   1. In Vercel dashboard, after adding your domain, note the DNS records shown
   
   2. In GoDaddy DNS Management:
      - Scroll to the **Records** section
      - You'll see existing A and CNAME records
      
   3. **For root domain** (`yourdomain.com`):
      - Find any existing A record with Name `@`
      - Click the **pencil icon** to edit, or delete and create new
      - **Type**: A
      - **Name**: `@` (or leave blank - GoDaddy uses `@` for root)
      - **Value**: Vercel's IP address (shown in Vercel dashboard, e.g., `76.76.21.21`)
      - **TTL**: `600` (or leave default)
      - Click **Save**
   
   4. **For www subdomain** (`www.yourdomain.com`):
      - Click **Add** button
      - **Type**: CNAME
      - **Name**: `www`
      - **Value**: `cname.vercel-dns.com` (or the value Vercel shows)
      - **TTL**: `600` (or leave default)
      - Click **Save**
   
   **Note**: GoDaddy may show a warning about CNAME on root domain. For root domain, use A records. For subdomains, use CNAME.

3. **Wait for DNS propagation** (5 minutes to 48 hours, usually 15-30 minutes)

4. **SSL Certificate**: Vercel automatically provisions SSL certificates

### For Frontend (Netlify)

1. **Add Domain in Netlify**:
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain

2. **Configure DNS**:
   - Netlify will show DNS records
   - Add A record or CNAME as shown in Netlify dashboard

### For Backend (Railway)

1. **Add Custom Domain**:
   - Go to your service → Settings → Networking
   - Click "Generate Domain" or "Add Custom Domain"
   - Enter subdomain (e.g., `api.yourdomain.com`)
   - Railway will show you the CNAME target (e.g., `your-app.railway.app`)

2. **Configure DNS in GoDaddy**:
   
   **Add CNAME Record for API Subdomain**:
   
   1. In GoDaddy DNS Management page:
      - Scroll to the **Records** section
      - Click the **Add** button
   
   2. Fill in the form:
      - **Type**: Select `CNAME` from dropdown
      - **Name**: `api` (this creates `api.yourdomain.com`)
      - **Value**: Railway's domain (e.g., `your-app.railway.app`)
        - **Important**: Don't include `https://` or trailing slashes
        - Just the domain name: `your-app.railway.app`
      - **TTL**: `600` (or leave default - 1 hour)
   
   3. Click **Save**
   
   4. **Verify**: You should see a new CNAME record:
      ```
      Type: CNAME
      Name: api
      Value: your-app.railway.app
      ```
   
   **Alternative**: If you prefer a different subdomain name:
   - Use `backend` instead of `api` in the Name field
   - This creates `backend.yourdomain.com`

### For Backend (Render)

1. **Add Custom Domain**:
   - Go to your service → Settings → Custom Domains
   - Click "Add Custom Domain"
   - Enter subdomain (e.g., `api.yourdomain.com`)
   - Render will show you the DNS record to add

2. **Configure DNS in GoDaddy**:
   
   **Add CNAME Record**:
   
   1. In GoDaddy DNS Management:
      - Click **Add** button
      - **Type**: `CNAME`
      - **Name**: `api`
      - **Value**: The domain Render provides (e.g., `your-app.onrender.com`)
      - **TTL**: `600`
      - Click **Save**
   
   **Note**: Render may also provide an A record. If so, use that instead of CNAME for better performance.

---

## Step 4: Update Environment Variables with Custom Domains

After your domains are configured and DNS has propagated, update environment variables to use your custom domains.

### 4.1: Update Frontend Environment Variables (Vercel)

1. **Go to Vercel**:
   - Open your project → **Settings** → **Environment Variables**

2. **Update VITE_BACKEND_URL**:
   - Find `VITE_BACKEND_URL`
   - Click **Edit**
   - Change from: `https://your-app-production.up.railway.app`
   - Change to: `https://api.yourdomain.com` (your custom backend domain)
   - Click **Save**

3. **Redeploy Frontend**:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**

### 4.2: Update Backend Environment Variables (Railway)

1. **Go to Railway**:
   - Open your service → **Variables** tab

2. **Update FRONTEND_URL**:
   - Find `FRONTEND_URL`
   - Click **Edit** (or delete and recreate)
   - Change from: `https://your-app.vercel.app`
   - Change to: `https://yourdomain.com` (your custom frontend domain)
   - Click **Save**

3. **Update VERIFF_CALLBACK_URL** (if using Veriff):
   - Find `VERIFF_CALLBACK_URL`
   - Update to: `https://api.yourdomain.com/api/verification/webhook`

4. **Railway will automatically redeploy** when you update variables

**✅ Step 4 Complete**: Environment variables updated! Continue to Step 5.

---

## Step 5: Update Supabase Configuration

Update Supabase to allow authentication from your production domain.

### 5.1: Update Supabase Site URL and Redirect URLs

1. **Go to Supabase Dashboard**:
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Authentication Settings**:
   - Click **Authentication** in the left sidebar
   - Click **URL Configuration**

3. **Update Site URL**:
   - Find **Site URL** field
   - Change from: `http://localhost:5173`
   - Change to: `https://yourdomain.com` (your custom domain)
   - Click **Save**

4. **Update Redirect URLs**:
   - Scroll to **Redirect URLs** section
   - Click **"Add URL"** and add each of these:
     ```
     https://yourdomain.com/**
     https://yourdomain.com/dashboard
     https://yourdomain.com/auth/callback
     https://yourdomain.com/login
     https://yourdomain.com/signup
     ```
   - **Keep localhost URLs** for local development:
     ```
     http://localhost:5173/**
     http://localhost:5173/dashboard
     http://localhost:5173/auth/callback
     ```
   - Click **Save**

### 5.2: Update Google OAuth (if using Google Sign-In)

1. **Go to Google Cloud Console**:
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Sign in to your account

2. **Navigate to OAuth Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (the one you use for Supabase)
   - Click to edit it

3. **Update Authorized JavaScript Origins**:
   - In **Authorized JavaScript origins**, click **"Add URI"**
   - Add: `https://yourdomain.com`
   - Click **Save**

4. **Update Authorized Redirect URIs**:
   - In **Authorized redirect URIs**, verify you have:
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
   - This should already be there, but verify it's correct
   - Click **Save**

**✅ Step 5 Complete**: Supabase is configured! Continue to Step 6.

---

## Step 6: Test Your Complete Deployment

Now test everything end-to-end to ensure your full-stack application is working.

### 6.1: Test DNS Propagation

Before testing, verify DNS has propagated:

1. **Check DNS Propagation**:
   - Visit [whatsmydns.net](https://www.whatsmydns.net)
   - Enter your domain: `yourdomain.com`
   - Select **A** record type
   - Check if it shows Vercel's IP address globally
   - Repeat for `api.yourdomain.com` with **CNAME** record type

2. **Wait if Needed**:
   - If DNS hasn't propagated everywhere, wait 15-30 more minutes
   - You can still test using the Vercel/Railway URLs in the meantime

### 6.2: Test Frontend

1. **Visit Your Domain**:
   - Open browser and go to: `https://yourdomain.com`
   - You should see your BitcoinVillageX homepage

2. **Check SSL Certificate**:
   - Look for the padlock icon (🔒) in the address bar
   - Should show "Secure" or "Connection is secure"
   - If not, wait 5-10 minutes for SSL to provision

3. **Check Browser Console**:
   - Open Developer Tools (F12 or Cmd+Option+I)
   - Go to **Console** tab
   - Look for any errors (red messages)
   - Common issues:
     - CORS errors → Check backend `FRONTEND_URL` environment variable
     - API connection errors → Check `VITE_BACKEND_URL` environment variable

4. **Test Navigation**:
   - Click through different pages (Marketplace, Services, etc.)
   - Verify the futuristic design loads correctly
   - Check that bottom navigation appears on mobile/tablet

### 6.3: Test Backend

1. **Test Health Endpoint**:
   - Visit: `https://api.yourdomain.com/health`
   - Should return JSON:
     ```json
     {
       "status": "ok",
       "timestamp": "2024-01-01T00:00:00.000Z",
       "uptime": 123.45
     }
     ```

2. **Test API Endpoints** (optional):
   - Test marketplace listings: `https://api.yourdomain.com/api/marketplace/listings`
   - Test services listings: `https://api.yourdomain.com/api/services/listings`
   - Should return JSON responses (may be empty if no data yet)

### 6.4: Test Authentication Flow

1. **Test Sign Up**:
   - Go to `https://yourdomain.com/signup`
   - Try creating a new account
   - Verify you receive confirmation (if email confirmation is enabled)
   - Check that profile is created in Supabase

2. **Test Login**:
   - Go to `https://yourdomain.com/login`
   - Log in with your credentials
   - Verify you're redirected to dashboard
   - Check that session persists

3. **Test OAuth** (if configured):
   - Try "Sign in with Google" button
   - Verify OAuth flow completes
   - Check that user is created/logged in

### 6.5: Test Full Application Features

1. **Test Marketplace**:
   - Navigate to Marketplace page
   - Test search functionality
   - Test filters (category, price, location, country)
   - Verify listings display with BTC/Sats prices
   - Check responsive design on mobile/tablet

2. **Test Services**:
   - Navigate to Services page
   - Test all filters
   - Verify service cards display correctly
   - Check price formatting (BTC and Sats)

3. **Test User Profile**:
   - Go to Profile page
   - Verify user information displays
   - Test profile editing (if implemented)

4. **Test on Different Devices**:
   - **Mobile**: Open on your phone, test touch interactions
   - **Tablet**: Test on iPad or tablet device
   - **Desktop**: Test on computer browser
   - Verify bottom navigation appears on mobile/tablet
   - Verify header navigation appears on desktop

### 6.6: Common Issues and Fixes

**Issue: "Site can't be reached" or DNS error**
- **Fix**: Wait longer for DNS propagation (up to 48 hours, usually 15-30 min)
- **Check**: Verify DNS records in GoDaddy are correct

**Issue: SSL Certificate not active**
- **Fix**: Wait 5-10 minutes after adding domain
- **Check**: Vercel/Railway dashboards show SSL status

**Issue: CORS errors in browser console**
- **Fix**: Verify `FRONTEND_URL` in backend matches your domain exactly
- **Check**: No trailing slashes in URLs

**Issue: API calls failing**
- **Fix**: Verify `VITE_BACKEND_URL` in frontend matches your backend domain
- **Check**: Backend is running and accessible at `/health` endpoint

**Issue: Authentication not working**
- **Fix**: Verify Supabase Site URL and Redirect URLs include your domain
- **Check**: OAuth redirect URIs updated if using Google OAuth

**✅ Step 6 Complete**: Your application is fully deployed and tested!

---

## 🎉 Deployment Complete!

Your BitcoinVillageX application is now live at:
- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://api.yourdomain.com`

### Next Steps

1. ✅ Monitor error logs in Vercel and Railway dashboards
2. ✅ Set up monitoring/alerting (optional)
3. ✅ Configure backups for Supabase database
4. ✅ Review security settings
5. ✅ Share your application with users!

### Quick Reference

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
- **GoDaddy DNS**: [dcc.godaddy.com](https://dcc.godaddy.com)

---

## DNS Configuration Summary

At your domain registrar, you'll typically need:

### For Frontend (Main Domain)
```
Type: A or CNAME
Name: @ (or www)
Value: [Your hosting provider's IP or domain]
```

### For Backend (Subdomain)
```
Type: CNAME
Name: api (or backend)
Value: [Your backend hosting provider's domain]
```

### Example DNS Records in GoDaddy

If using Vercel for frontend and Railway for backend, your GoDaddy DNS records should look like:

**Option 1: Using Vercel Nameservers** (Recommended)
- Change nameservers to Vercel's (see Option A above)
- Vercel manages all DNS records automatically
- You still need to add the `api` CNAME in Vercel's DNS settings

**Option 2: Using GoDaddy DNS** (Manual Management)

In GoDaddy's DNS Management page, you should have:

```
Type    Name    Value                      TTL
A       @       76.76.21.21                600    (Vercel IP - check Vercel dashboard)
CNAME   www     cname.vercel-dns.com       600    (Vercel)
CNAME   api     your-app.railway.app       600    (Railway backend)
```

**GoDaddy Interface Notes**:
- The `@` symbol represents your root domain (`yourdomain.com`)
- Leave Name blank or use `@` for root domain A records
- For subdomains, just use the subdomain name (e.g., `www`, `api`)
- TTL (Time To Live) can be left at default (usually 600 seconds or 1 hour)
- Changes may take 15-30 minutes to propagate globally

---

## Troubleshooting

### Domain Not Resolving

1. **Check DNS propagation**:
   - Use [whatsmydns.net](https://www.whatsmydns.net) to check global DNS
   - Enter your domain and select record type (A or CNAME)
   - Wait 15-30 minutes after adding DNS records in GoDaddy
   - **GoDaddy-specific**: Changes can take up to 48 hours, but usually work within 30 minutes

2. **Verify DNS records in GoDaddy**:
   - Go back to GoDaddy DNS Management page
   - Verify records are saved correctly:
     - Check for typos in values
     - Ensure record types are correct (A for IPs, CNAME for domains)
     - Make sure you didn't accidentally add `https://` or trailing slashes
   - **Common GoDaddy mistake**: Adding `http://` or `https://` in the Value field - remove these!

3. **Check hosting platform**:
   - Verify domain is added in hosting dashboard (Vercel/Railway)
   - Check for any domain verification requirements
   - Some platforms need you to verify domain ownership first

4. **GoDaddy-specific issues**:
   - **Nameserver changes**: If you changed nameservers, wait longer (up to 48 hours)
   - **DNS not updating**: Try clearing your browser cache or using incognito mode
   - **Record not showing**: Refresh the GoDaddy DNS page - changes save immediately but may take a moment to appear

### SSL Certificate Issues

- Most platforms (Vercel, Netlify, Railway) auto-provision SSL
- Wait 5-10 minutes after adding domain for SSL to provision
- Check hosting dashboard for SSL status

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches your actual frontend domain
- Check backend CORS configuration allows your domain
- Verify no trailing slashes in URLs

### Environment Variables Not Working

- **Redeploy** after adding/updating environment variables
- Check variable names match exactly (case-sensitive)
- Verify variables are set for correct environment (production)

### Supabase Authentication Not Working

- Verify Site URL and Redirect URLs in Supabase dashboard
- Check that your domain is in the allowed list
- Ensure OAuth redirect URIs are updated if using OAuth

---

## 📝 Complete Deployment Checklist

Use this checklist to track your progress through the entire deployment process:

### Step 0: GitHub Setup
- [ ] Git repository initialized locally
- [ ] GitHub account created/signed in
- [ ] New repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Verified all files are on GitHub

### Step 1: Frontend Deployment (Vercel)
- [ ] Vercel account created/signed in
- [ ] Project created from GitHub repository
- [ ] Root directory set to `frontend`
- [ ] Build settings configured (Vite, build command, output directory)
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_BACKEND_URL` (temporary Railway URL)
  - [ ] `VITE_STRIKE_VERIFICATION_ADDRESS`
- [ ] Initial deployment successful
- [ ] Frontend accessible at Vercel URL

### Step 2: Backend Deployment (Railway)
- [ ] Railway account created/signed in
- [ ] Project created from GitHub repository
- [ ] Root directory set to `backend`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `FRONTEND_URL` (temporary Vercel URL)
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] Other API keys (if using)
- [ ] Railway domain generated
- [ ] Backend health check passes at Railway URL

### Step 3: Domain Configuration
- [ ] Domain added to Vercel (frontend)
- [ ] Custom domain added to Railway (backend: `api.yourdomain.com`)
- [ ] GoDaddy DNS configured:
  - [ ] Option A: Nameservers changed to Vercel's OR
  - [ ] Option B: DNS records added manually:
    - [ ] A record for root domain
    - [ ] CNAME for www subdomain
    - [ ] CNAME for api subdomain
- [ ] DNS records verified in GoDaddy
- [ ] Waited 15-30 minutes for DNS propagation
- [ ] DNS propagation checked with whatsmydns.net

### Step 4: Environment Variables Update
- [ ] `VITE_BACKEND_URL` updated in Vercel to `https://api.yourdomain.com`
- [ ] `FRONTEND_URL` updated in Railway to `https://yourdomain.com`
- [ ] Frontend redeployed with updated variables
- [ ] Backend automatically redeployed (Railway)

### Step 5: Supabase Configuration
- [ ] Supabase Site URL updated to `https://yourdomain.com`
- [ ] Redirect URLs added for production domain
- [ ] Localhost URLs kept for development
- [ ] Google OAuth updated (if using):
  - [ ] Authorized JavaScript origins updated
  - [ ] Redirect URIs verified

### Step 6: Testing
- [ ] Frontend loads at `https://yourdomain.com`
- [ ] SSL certificate active (padlock icon visible)
- [ ] Backend health check: `https://api.yourdomain.com/health`
- [ ] No CORS errors in browser console
- [ ] Authentication tested:
  - [ ] Sign up works
  - [ ] Login works
  - [ ] OAuth works (if configured)
- [ ] Marketplace page loads and filters work
- [ ] Services page loads and filters work
- [ ] Prices display in BTC and Sats
- [ ] Responsive design tested:
  - [ ] Mobile view works
  - [ ] Tablet view works
  - [ ] Desktop view works
- [ ] Bottom navigation appears on mobile/tablet
- [ ] Header navigation appears on desktop

### 🎉 Deployment Complete!
- [ ] All features working end-to-end
- [ ] Application accessible to users
- [ ] Monitoring set up (optional)

---

## Next Steps

After your domain is connected:

1. ✅ Test all features on production domain
2. ✅ Monitor error logs in hosting dashboards
3. ✅ Set up monitoring/alerting (optional)
4. ✅ Configure backups (if needed)
5. ✅ Review security settings
6. ✅ Update any hardcoded URLs in code

---

## Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Render Docs**: [render.com/docs](https://render.com/docs)

