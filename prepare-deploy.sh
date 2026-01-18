#!/bin/bash

# Career Compass - Production Deployment Preparation Script
# This script makes the necessary changes for production deployment

echo "🚀 Career Compass - Deployment Preparation"
echo "=========================================="
echo ""

# Step 1: Generate SECRET_KEY
echo "📝 Step 1: Generate Production SECRET_KEY"
echo "Run this command and save the output:"
echo ""
echo "openssl rand -hex 32"
echo ""
echo "⚠️  Set this as SECRET_KEY in Railway environment variables"
echo ""

# Step 2: Remind about CORS
echo "📝 Step 2: Update CORS Settings"
echo "After deploying frontend to Vercel:"
echo "1. Get your Vercel URL (e.g., https://career-compass-xxx.vercel.app)"
echo "2. Update backend/app/main.py line 31:"
echo "   allow_origins=[\"https://your-actual-vercel-url.vercel.app\", \"http://localhost:5173\"]"
echo ""

# Step 3: Environment Variables
echo "📝 Step 3: Set Environment Variables"
echo ""
echo "Frontend (Vercel Dashboard):"
echo "  VITE_API_BASE_URL=https://your-backend-url.railway.app/api/v1"
echo ""
echo "Backend (Railway Dashboard):"
echo "  SECRET_KEY=<generated-from-step-1>"
echo "  ENVIRONMENT=production"
echo "  ACCESS_TOKEN_EXPIRE_MINUTES=1440"
echo ""

# Step 4: Deployment Links
echo "📝 Step 4: Deployment Platforms"
echo ""
echo "Frontend (Vercel): https://vercel.com/new"
echo "Backend (Railway): https://railway.app/new"
echo ""

# Step 5: Checklist
echo "📝 Step 5: Pre-Deployment Checklist"
echo "[ ] All code committed to GitHub"
echo "[ ] SECRET_KEY generated"
echo "[ ] Frontend deployed to Vercel"
echo "[ ] Backend deployed to Railway"
echo "[ ] CORS updated with Vercel URL"
echo "[ ] Environment variables set"
echo "[ ] Test deployment working"
echo ""

echo "✅ Ready to deploy! Follow the steps above."
echo ""
echo "For detailed instructions, see:"
echo "  - DEPLOYMENT_READINESS.md (comprehensive report)"
echo "  - QUICK_DEPLOY.md (10-minute guide)"
echo "  - DEPLOYMENT_GUIDE.md (detailed guide)"
