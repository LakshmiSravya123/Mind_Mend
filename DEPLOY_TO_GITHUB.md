# Deploy MoodSync to GitHub

This guide will help you add your MoodSync project to GitHub manually.

## Step 1: Create a New GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `moodsync` (or your preferred name)
   - **Description**: `AI-powered health companion for mood analysis and wellness tracking`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Download Your Project Files

Since you're working in Replit, you'll need to download your project files:

### Option A: Download as ZIP
1. In Replit, click the three dots menu (⋯) next to "Files"
2. Select "Download as ZIP"
3. Extract the ZIP file on your computer

### Option B: Use Replit's Git Integration
1. Open the Shell in Replit
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MoodSync AI health companion"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/moodsync.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Manual Upload (if downloading files)

If you downloaded the files, follow these steps:

1. **Clone the empty repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/moodsync.git
   cd moodsync
   ```

2. **Copy your project files** into the cloned directory

3. **Add and commit files**:
   ```bash
   git add .
   git commit -m "feat: initial commit - MoodSync AI health companion

   - Complete health monitoring and mood analysis platform
   - AI-powered mood detection from biometric data using GPT-4o
   - Real-time health metrics tracking (heart rate, sleep, steps, stress)
   - Interactive mood timeline with visual charts
   - AI chat companion for wellness support
   - Personalized insights and recommendations
   - Modern React frontend with TypeScript
   - Express backend with OpenAI integration
   - Responsive design with Tailwind CSS and shadcn/ui components"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin main
   ```

## Step 4: Set up Repository Settings

Once your code is on GitHub:

1. **Add topics/tags** (in repository settings):
   - `ai`
   - `health`
   - `mood-analysis`
   - `react`
   - `typescript`
   - `openai`
   - `wellness`
   - `mental-health`

2. **Enable GitHub Pages** (optional):
   - Go to Settings > Pages
   - Choose source: Deploy from a branch
   - Select branch: main
   - Folder: / (root)

3. **Set up branch protection** (recommended):
   - Go to Settings > Branches
   - Add rule for `main` branch
   - Enable "Require pull request reviews"

## Step 5: Configure Environment Variables

For deployment, you'll need to set up environment variables:

### For Vercel/Netlify:
1. Add environment variable: `OPENAI_API_KEY`
2. Set the value to your OpenAI API key

### For Railway/Render:
1. Add environment variable: `OPENAI_API_KEY`
2. Set the build command: `npm run build`
3. Set the start command: `npm start`

## Step 6: Update replit.md

Add GitHub information to your project documentation:

```markdown
## Repository Information
- **GitHub**: https://github.com/YOUR_USERNAME/moodsync
- **License**: MIT
- **Main Branch**: main
- **Issues**: https://github.com/YOUR_USERNAME/moodsync/issues
```

## Available Scripts in package.json

Make sure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "preview": "vite preview"
  }
}
```

## Deployment Options

### 1. Vercel (Recommended for frontend)
```bash
npm i -g vercel
vercel --prod
```

### 2. Railway (Full-stack)
- Connect your GitHub repository
- Deploy automatically on push

### 3. Render (Full-stack)
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`

### 4. Replit (Current)
- Your app is already running on Replit
- Can be accessed via your Replit URL

## Post-Deployment Checklist

- [ ] Repository is public/private as desired
- [ ] README.md displays correctly
- [ ] All environment variables are set
- [ ] Application builds successfully
- [ ] All features work in production
- [ ] OpenAI API integration works
- [ ] Health data simulation works
- [ ] Chat companion responds properly

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in package.json
2. **API errors**: Verify OPENAI_API_KEY is set correctly
3. **Module not found**: Ensure all imports use correct paths
4. **TypeScript errors**: Run `npm run build` to check for type errors

### Need Help?

- Check the [GitHub documentation](https://docs.github.com)
- Review [deployment guides](https://docs.github.com/en/pages)
- Create an issue in your repository for project-specific problems

---

Your MoodSync project is now ready for GitHub! 🚀