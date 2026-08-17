# 🚀 Deployment Guide

Complete guide for deploying the Anti-Inflammatory Diet Tracker to production.

## Quick Start: Deploy to Vercel

### 1. Create GitHub Repository

```bash
# Create repo on GitHub
# Name: diet-tracker-app (or similar)
# Make it public or private

# Add remote to local repo
git remote add origin https://github.com/YOUR_USERNAME/diet-tracker-app.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel

**Option A: Via Vercel Website**
1. Go to https://vercel.com/new
2. Select "Next.js"
3. Import from GitHub
4. Select your repository
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Custom Domain (Optional)
- Go to Vercel Dashboard
- Settings → Domains
- Add your custom domain
- Follow DNS setup instructions

## 📋 Pre-Deployment Checklist

- [ ] All changes committed to git
- [ ] No uncommitted changes: `git status`
- [ ] TypeScript errors resolved: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Tested locally: `pnpm dev`
- [ ] README updated
- [ ] MAINTENANCE.md updated
- [ ] Commit message is clear

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

The project includes two automated workflows:

#### 1. **Build & Test** (`.github/workflows/build-and-test.yml`)
Runs on every push and pull request:
- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Next.js build
- ✅ CodeQL security analysis
- ✅ Runs on Node 18 & 20

#### 2. **Deploy** (`.github/workflows/deploy.yml`)
Runs on push to main:
- ✅ Builds project
- ✅ Deploys to Vercel (production)
- ✅ Creates preview for PRs

### Setting Up CI/CD

```bash
# Workflows are already in .github/workflows/
# They'll activate after first push to GitHub

# To enable Vercel auto-deploy:
# 1. Go to Vercel Dashboard
# 2. Select your project
# 3. Settings → Git
# 4. Ensure GitHub integration is connected
```

## 🔐 Secrets Management

### Vercel Secrets
If you need Vercel environment variables:

```bash
# Add via CLI
vercel env add SECRET_NAME
# Then select: Production / Preview / Development

# Or via Dashboard:
# Project Settings → Environment Variables → Add
```

For this diet tracker, no secrets are needed (client-side only).

## 📊 Environment Configurations

### Development
```bash
pnpm dev
# http://localhost:3000
```

### Preview (Staging)
```bash
vercel
# Creates unique URL: https://diet-tracker-abc123.vercel.app
```

### Production
```bash
vercel --prod
# Deploys to main domain
```

## 🚀 Deployment Process

### Manual Deploy

**Preview Deploy:**
```bash
# From project root
vercel

# Output:
# Preview: https://diet-tracker-[hash].vercel.app
```

**Production Deploy:**
```bash
# Must be on main branch
git checkout main
git pull origin main

vercel --prod

# Output:
# Production: https://diet-tracker.vercel.app
```

### Auto Deploy (Recommended)

With GitHub integration:
1. Make changes on feature branch
2. Create Pull Request
3. GitHub Actions runs tests
4. Vercel creates preview URL
5. Merge to main
6. Vercel auto-deploys to production

## 📈 Monitoring Deployments

### Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select "diet-tracker-app"
3. View:
   - Recent deployments
   - Build times
   - Error logs
   - Function analytics

### View Build Logs
```bash
# Via CLI
vercel logs [deployment-url]

# View specific deployment
vercel inspect [deployment-url]

# Follow logs in real-time
vercel logs [url] --follow
```

### Rollback Deployment
```bash
# List deployments
vercel ls

# Find previous good deployment
# Click "Promote to Production" in Vercel Dashboard
# Or via CLI:
vercel promote [deployment-url]
```

## 🐛 Troubleshooting Deployments

### Build Fails

**Check logs:**
```bash
vercel logs [deployment-url] --follow
```

**Common Issues:**

| Error | Fix |
|-------|-----|
| `npm ERR! 404` | Check package name in package.json |
| `TypeScript error` | Run `pnpm type-check` locally |
| `Cannot find module` | Run `pnpm install` again |
| `Out of memory` | Usually temporary, retry deploy |

**Clear Vercel Cache:**
1. Go to Vercel Dashboard
2. Settings → Advanced
3. Click "Clear Build Cache"
4. Redeploy

### Preview URL Not Working

- Wait 5-10 seconds for deployment
- Refresh page
- Check deployment status in Vercel Dashboard
- View build logs for errors

### Production is Broken

**Quick Fix:**
```bash
# Revert to previous commit
git revert <bad-commit>
git push origin main
# Vercel auto-deploys
```

**Via Vercel Dashboard:**
1. Deployments tab
2. Find previous good deployment
3. Click menu → "Promote to Production"

## 📝 Deployment Workflow

### Feature Branch → Main → Production

```
1. Create feature branch
   git checkout -b feat/update-diet-plan

2. Make changes
   # Edit lib/diet-plan.ts
   
3. Test locally
   pnpm dev
   
4. Commit
   git add .
   git commit -m "Update meal plan"
   
5. Push to GitHub
   git push origin feat/update-diet-plan
   
6. Create Pull Request
   # GitHub Actions runs tests
   # Vercel creates preview URL
   
7. Review & Merge
   git checkout main
   git pull origin main
   # Vercel auto-deploys to production
```

## 🔗 Important Links

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repository | https://github.com/YOUR_USERNAME/diet-tracker-app |
| Live Site | (your custom domain or vercel URL) |
| Analytics | https://vercel.com/analytics |

## ✅ Post-Deployment Checklist

After deployment:

- [ ] Visit live URL
- [ ] Load main page
- [ ] Test day selector
- [ ] Test meal checkboxes
- [ ] Check localStorage works
- [ ] Test on mobile
- [ ] No console errors
- [ ] Performance is acceptable

## 📊 Performance Metrics

### Expected Performance

| Metric | Target | Typical |
|--------|--------|---------|
| FCP (First Contentful Paint) | < 1s | 0.8s |
| LCP (Largest Contentful Paint) | < 2.5s | 1.5s |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.05 |
| Build time | < 2m | ~60s |

### Monitor Performance
```bash
# Run Lighthouse audit
vercel inspect --json [deployment-url]

# Check Core Web Vitals
# Vercel Dashboard → Analytics
```

## 🔄 Scheduled Tasks

If you add backend functionality later:

```bash
# Cron jobs via Vercel
# Edit vercel.json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 0 * * *"
  }]
}
```

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## 🎯 Next Steps

1. **Set up GitHub repo** → Push code
2. **Connect Vercel** → Auto-deploy enabled
3. **Add custom domain** → Professional URL
4. **Monitor performance** → Use Vercel Analytics
5. **Scale if needed** → Pro plan for more resources

## 🆘 Need Help?

1. Check Vercel logs: `vercel logs [url]`
2. Review GitHub Actions: Workflows tab
3. Check build output in Vercel Dashboard
4. See MAINTENANCE.md for common issues
5. Refer to official docs

---

**Last Updated:** August 17, 2026
**Deployment Platform:** Vercel
**Repository:** GitHub
