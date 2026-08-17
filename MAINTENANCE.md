# 🔧 Maintenance Guide

Quick reference for updating and maintaining the Anti-Inflammatory Diet Tracker.

## 📝 Quick Edit: Updating the Diet Plan

### Step 1: Open the Diet Plan File
```bash
code lib/diet-plan.ts
# or edit directly in your editor
```

### Step 2: Find Your Day
All days are organized by lowercase name: `monday`, `tuesday`, etc.

### Step 3: Make Changes

**Update a quantity:**
```typescript
// Find:
'Brown rice - 75 gm'

// Change to:
'Brown rice - 100 gm'
```

**Add a new item:**
```typescript
items: [
  'Brown rice - 75 gm',
  'Mixed vegetable curry - 150 gm',
  'Plain moong sprouts - 1 cup',
  'Fresh lemon juice - 1 tbsp'  // NEW ITEM
]
```

**Change a meal time:**
```typescript
// From:
{ time: '8:30 - 9:00 AM - Breakfast', ... }

// To:
{ time: '9:00 - 9:30 AM - Breakfast', ... }
```

### Step 4: Test Locally
```bash
pnpm dev
# Visit http://localhost:3000
# Verify your changes
```

### Step 5: Commit & Push
```bash
git add lib/diet-plan.ts
git commit -m "Update [day] meal plan: [what changed]"
git push origin main
# Vercel auto-deploys
```

## 🎨 Emoji Reference

Use these for each meal type:

| Emoji | Use For |
|-------|---------|
| 🌅 | Morning (on waking up) |
| 🥣 | Breakfast |
| 🍎 | Snacks (fruits, nuts) |
| 🍲 | Lunch/Main meals |
| 🍵 | Tea/Drinks/Evening |
| 🍽️ | Dinner |
| 🌙 | Bedtime |
| 🎉 | Special (cheat day) |

## 🔍 Meal ID Format

Each meal needs a unique `id`. Format: `{dayabbr}-{number}`

```
Monday:    mon-1 to mon-7
Tuesday:   tue-1 to tue-7
Wednesday: wed-1 to wed-7
Thursday:  thu-1 to thu-7
Friday:    fri-1 to fri-7
Saturday:  sat-1 to sat-7
Sunday:    sun-1 to sun-1
```

⚠️ **Don't use duplicate IDs!**

## ✅ Testing Checklist

After editing, verify:

- [ ] `pnpm dev` runs without errors
- [ ] App loads at `http://localhost:3000`
- [ ] All meals display correctly
- [ ] Day selector works
- [ ] Checkboxes save state
- [ ] No red errors in console
- [ ] Mobile looks good

## 🔄 Deployment Checklist

Before deploying:

- [ ] All changes tested locally
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] Committed with clear message
- [ ] Pushed to main: `git push origin main`
- [ ] Vercel deploys automatically
- [ ] Verify live site works

## 🚨 Common Issues

**Component not rendering:**
- Ensure `'use client'` is at the top of `DietTrackerClient.tsx`
- Check for syntax errors in diet plan

**Meals not saving:**
- Check localStorage is enabled
- Clear cache and reload
- Check browser DevTools → Application → localStorage

**TypeScript errors:**
```bash
pnpm type-check  # Shows all errors
# Fix errors, then:
pnpm dev
```

**Build fails:**
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

## 🎯 Regular Maintenance Tasks

**Weekly:**
- Check if app is still live
- Gather user feedback

**Monthly:**
- Review meals for accuracy
- Check if seasonal updates needed
- Test on different browsers

**Quarterly:**
- Update dependencies: `pnpm update`
- Review and optimize code
- Check analytics if added

## 📊 Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm type-check       # Check TypeScript
pnpm lint             # Check code style

# Deployment
vercel                # Deploy preview
vercel --prod         # Deploy production

# Git
git status            # Check what changed
git diff              # See changes
git log --oneline -5  # Recent commits
```

## 🔐 Never Do This

❌ Commit node_modules  
❌ Hardcode API keys  
❌ Use duplicate meal IDs  
❌ Delete .next folder before git commit  
❌ Skip testing before deployment  

## ✅ Always Do This

✅ Test locally first: `pnpm dev`  
✅ Check for TypeScript errors  
✅ Use meaningful commit messages  
✅ Keep diet plan data accurate  
✅ Review changes before committing  

## 📈 Performance Tips

Current performance:
- Build time: ~60 seconds
- Load time: ~2-3 seconds
- Meal check: Instant

If slowing down:
1. Check for console errors
2. Clear browser cache
3. Run `pnpm install` again
4. Restart dev server

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `lib/diet-plan.ts` | All meal data |
| `app/DietTrackerClient.tsx` | Main component |
| `package.json` | Dependencies & scripts |
| `README.md` | Overview & setup |

## 🆘 Getting Help

1. Check README.md
2. Review browser console
3. Check git history: `git log`
4. Look at similar implementations
5. Search for error messages online

## 📝 Update Log

Track your updates here:

```
Date: [YYYY-MM-DD]
Changes:
- Updated [what changed]
- Fixed [bug/issue]
- Added [feature]

Tested: ✅
Deployed: ✅
```

---

**Last Updated:** August 17, 2026
