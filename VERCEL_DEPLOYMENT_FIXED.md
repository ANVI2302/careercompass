# ✅ Vercel Deployment Checklist - Fixed

## Changes Made
1. ✅ Fixed hardcoded API URL in `src/lib/api.ts`
   - Changed from: `const API_URL = "http://localhost:8000/api/v1"`
   - Changed to: `const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"`

2. ✅ Created `.env.local` for local development
   - Frontend can read environment variables

3. ✅ Created `vercel.json` configuration
   - Configures build settings for Vercel
   - Sets up SPA routing (rewrites all routes to index.html)
   - Prepares environment variable injection

4. ✅ Updated backend CORS configuration in `backend/app/core/config.py`
   - Added localhost origins for development

5. ✅ Build test passed ✓

---

## 🚀 Next Steps to Deploy

### Step 1: Backend Deployment (Railway) - 5 mins
1. Go to https://railway.app/new
2. Connect GitHub repository
3. Select "career-compass" repo
4. Railway auto-detects Python
5. Set environment variables:
   ```
   SECRET_KEY=(run: openssl rand -hex 32)
   ENVIRONMENT=production
   ```
6. Deploy completes automatically
7. **Note the Railway URL**: `https://xxxxx.up.railway.app`

### Step 2: Update Backend for Production
After Railway deployment:
1. Go to your Railway project
2. Copy the deployed URL
3. Add to backend environment variables in Railway dashboard:
   ```
   BACKEND_CORS_ORIGINS=https://your-vercel-domain.vercel.app
   ```
4. Redeploy backend (or it auto-redeployswhen you update env vars)

### Step 3: Commit Changes
```bash
git add .
git commit -m "Fix Vercel deployment - use environment variables for API URL"
git push origin main
```

### Step 4: Frontend Deployment (Vercel) - 5 mins
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Select "career-compass" repository
4. Vercel auto-detects Vite configuration
5. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-railway-url.up.railway.app/api/v1
   ```
6. Click "Deploy"
7. **Your site will be live** at the provided `.vercel.app` domain

### Step 5: Test Deployment
- Frontend: https://your-site.vercel.app ✓
- Backend API: https://your-api.up.railway.app/api/v1/system/health ✓
- Login page loads: https://your-site.vercel.app/auth ✓

---

## 🔍 Verification Commands

Test locally first:
```bash
# Build the project (already tested - works ✓)
npm run build

# Check if environment variables work
echo $VITE_API_BASE_URL

# Run development server (test with Vite dev server)
npm run dev
```

---

## 📋 Files Modified/Created
- ✅ `src/lib/api.ts` - Fixed hardcoded URL
- ✅ `.env.local` - Development environment
- ✅ `.env.example` - Documentation
- ✅ `vercel.json` - Vercel configuration
- ✅ `backend/.env.example` - Backend environment guide
- ✅ `backend/app/core/config.py` - Updated CORS origins

---

## ⚠️ Important Notes

### Local Development
- Your local setup will continue to work with `npm run dev`
- Environment variable from `.env.local` will be used

### Production (Vercel + Railway)
- Frontend reads `VITE_API_BASE_URL` from Vercel environment
- Backend reads `BACKEND_CORS_ORIGINS` from Railway environment
- Both must be configured for cross-origin requests to work

### CORS Issues?
If you see CORS errors after deployment:
1. Check that `VITE_API_BASE_URL` is set in Vercel
2. Check that `BACKEND_CORS_ORIGINS` includes your Vercel domain in Railway
3. Ensure Vercel domain is exact: `https://xxxx.vercel.app`

---

## 🎯 Common Issues & Fixes

### "Cannot find module 'api'" 
- Already fixed ✓ (src/lib/api.ts updated)

### "API calls to localhost"
- Already fixed ✓ (using environment variables)

### "CORS errors on production"
- Configure BACKEND_CORS_ORIGINS in Railway
- Must match your Vercel domain exactly

### "Build fails on Vercel"
- Build succeeded locally ✓
- Check that `package.json` has all dependencies
- Verify no TypeScript errors

---

## 📞 Support

If deployment still fails:
1. Check Vercel deployment logs (in Dashboard)
2. Check Railway logs (in Dashboard)
3. Verify environment variables are set
4. Try rebuilding frontend locally: `npm run build`

---

**Status: Ready for Deployment** ✅
Build tested and working locally.
All configuration files created.
Ready to push to GitHub and deploy!
