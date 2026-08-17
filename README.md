# 🥗 Anti-Inflammatory Diet Tracker

A beautiful, interactive Next.js web application for managing a 7-day anti-inflammatory vegetarian diet plan with automatic meal progression, day navigation, and next-day preparation tracking.

## ✨ Features

### Core Functionality
- **📅 Day Selector** — Jump to any day (today through next 7 days)
- **✅ Meal Checkboxes** — Mark meals as completed with persistent storage
- **🔄 Progressive Disclosure** — Next meal only shows after previous is checked (today only)
- **📊 Progress Tracking** — Visual progress bar showing daily completion percentage
- **🌙 Tomorrow's Prep** — Automatic detection and display of items to soak/prepare overnight
- **⏰ Real-time Clock** — Live time display in the UI
- **🎯 Auto Date Detection** — Automatically shows current day on load

### User Experience
- **🎨 Beautiful Gradient UI** — Modern design with colorful gradients and food emojis
- **📱 Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **💾 Persistent Storage** — Meal completion status saved in browser localStorage
- **🎉 Completion Messages** — Celebratory message when all daily meals are completed
- **💡 Daily Tips** — 6 actionable health tips displayed at the bottom

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+ (or npm/yarn)

### Installation

```bash
# Clone or download the project
cd diet-tracker-app

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Deploy to Vercel
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 📋 Project Structure

```
diet-tracker-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── DietTrackerClient.tsx   # Main component
├── lib/
│   └── diet-plan.ts            # Diet plan data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Next.js Config
- React 18.3.1
- TypeScript support
- Tailwind CSS for styling
- SWC minification enabled

### Environment Setup
No environment variables required for the basic diet tracker. All data is stored locally in the browser.

## 📖 Usage

### Viewing the Diet Plan
1. Open the app at `http://localhost:3000`
2. The current day is selected automatically
3. Scroll through your meals for the day

### Tracking Progress
1. Click the checkbox next to each meal when completed
2. Your progress is automatically saved to browser localStorage
3. Progress bar updates in real-time
4. All 7 meals completed = celebration message 🎉

### Viewing Other Days
1. Click any day in the "📅 Select a Day" section
2. View that day's meal plan
3. See tomorrow's preparation items automatically

### Next Day Preparation
- Items that need to be soaked overnight are highlighted
- Shows the first meal time for the next day
- Perfect for meal planning the evening before

## 🛠️ Editing the Diet Plan

### Adding a Meal
Edit `lib/diet-plan.ts`:

```typescript
{
  id: 'mon-8',      // Unique ID
  name: 'Late Drink',
  time: '10:00 PM',
  icon: '🌙',
  items: [
    'Warm milk with turmeric - 200 ml'
  ]
}
```

### Updating Quantities
```typescript
// From:
'Brown rice - 75 gm'

// To:
'Brown rice - 100 gm'
```

### Changing Items
Simply edit the items array for any meal.

### Adding New Days (if needed)
Extend the `dietPlan` object with a new day:

```typescript
thursday: [
  // meals...
]
```

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build test
pnpm build

# Run dev server and test manually
pnpm dev
```

### Testing Checklist
- [ ] All days load correctly
- [ ] Checkboxes save state
- [ ] Progress bar updates
- [ ] localStorage persists on reload
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Completion message shows

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers on iOS/Android

## 🔐 Security & Privacy

- ✅ No backend server required
- ✅ No external API calls
- ✅ All data stored locally
- ✅ No tracking or analytics
- ✅ Safe to use on any device
- ✅ No user authentication needed

## 📚 Technologies Used

- **Next.js 16** — React framework
- **React 18** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **localStorage** — Client-side persistence

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy
```

**GitHub Pages:**
```bash
# Update next.config.ts with export settings
pnpm build
# Deploy ./out folder
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Meals not saving | Enable localStorage in browser settings |
| Build fails | Run `pnpm install` and `pnpm type-check` |
| Styling broken | Clear `.next` folder and rebuild |
| Slow performance | Check browser for heavy extensions |

## 🔄 CI/CD Pipeline

When you push to GitHub:
1. GitHub Actions runs tests
2. Vercel auto-deploys on merge to main
3. Preview URL provided for pull requests

## 📝 Development Notes

### State Management
- Uses React hooks (`useState`, `useEffect`)
- Client-side only
- localStorage for persistence

### Performance
- Minimal re-renders
- No API calls
- Fast page load
- ~2-3s initial load (includes hydration)

### Future Enhancements
- [ ] Cloud sync across devices
- [ ] Export as PDF
- [ ] Shopping list generator
- [ ] Nutritional information
- [ ] Dark mode
- [ ] Multi-language support
- [ ] User accounts

## 📞 Support & Maintenance

For issues or updates:
1. See `docs/` folder for detailed guides
2. Check the troubleshooting section
3. Review browser console for errors
4. Verify all dependencies are installed

## 📄 File Reference

- `app/DietTrackerClient.tsx` — Main component (520 lines)
- `lib/diet-plan.ts` — 7-day meal plan data
- `app/page.tsx` — Root page component
- `app/layout.tsx` — Root layout with metadata
- `app/globals.css` — Global Tailwind styles

## 🔗 Live Demo

**Coming Soon:** Will be deployed to Vercel

## 📅 Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | Aug 17, 2026 | Initial release |

## 📜 License

This project is open source. Feel free to use and modify for personal use.

---

**Built with ❤️ for health and wellness**

**Created:** August 17, 2026  
**Last Updated:** August 17, 2026  
**Maintainer:** Easwar Saminathan
