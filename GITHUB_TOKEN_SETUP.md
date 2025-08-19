# GitHub Setup Using Personal Access Token

This guide will help you add your MoodSync project to GitHub using a personal access token for authentication.

## Step 1: Create a Personal Access Token

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click "Generate new token (classic)"
   - Note: Give it a descriptive name like "MoodSync Project Upload"
   - Expiration: Choose your preferred duration (30 days, 90 days, or custom)

3. **Select Scopes (Permissions):**
   Check these boxes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `delete:packages` (Delete packages from GitHub Package Registry)

4. **Generate and Copy Token:**
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately (it won't be shown again)
   - Save it securely (you'll need it for the next steps)

## Step 2: Create Repository on GitHub

1. **Create New Repository:**
   - Go to: https://github.com/new
   - Repository name: `moodsync`
   - Description: `AI-powered health companion for mood analysis and wellness tracking`
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Note Your Repository URL:**
   - It will be: `https://github.com/YOUR_USERNAME/moodsync.git`
   - Replace `YOUR_USERNAME` with your actual GitHub username

## Step 3: Upload Using Git Commands

Open your terminal/command prompt and run these commands:

### If you're in the Replit shell:

```bash
# Configure Git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Remove any existing git configuration if present
rm -rf .git

# Initialize new Git repository
git init

# Add all files
git add .

# Create initial commit
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

# Add remote repository (replace YOUR_USERNAME and YOUR_TOKEN)
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/moodsync.git

# Set main branch and push
git branch -M main
git push -u origin main
```

### Command Template with Token:

Replace the placeholders in this command:
```bash
git remote add origin https://YOUR_PERSONAL_ACCESS_TOKEN@github.com/YOUR_USERNAME/moodsync.git
```

**Example:**
```bash
git remote add origin https://ghp_1234567890abcdef@github.com/johndoe/moodsync.git
```

## Step 4: Alternative - Using Environment Variable

For better security, you can use an environment variable:

```bash
# Set token as environment variable
export GITHUB_TOKEN="your_personal_access_token_here"

# Use token from environment
git remote add origin https://$GITHUB_TOKEN@github.com/YOUR_USERNAME/moodsync.git
```

## Step 5: Verify Upload

After pushing, verify your repository:

1. **Check GitHub Repository:**
   - Go to: `https://github.com/YOUR_USERNAME/moodsync`
   - Verify all files are present
   - Check that README.md displays correctly

2. **Verify File Structure:**
   ```
   moodsync/
   ├── client/
   ├── server/
   ├── shared/
   ├── README.md
   ├── package.json
   ├── LICENSE
   ├── CONTRIBUTING.md
   ├── .env.example
   └── .gitignore
   ```

## Step 6: Set Repository Topics

1. **Go to your repository page**
2. **Click the gear icon next to "About"**
3. **Add topics:** `ai`, `health`, `mood-analysis`, `react`, `typescript`, `openai`, `wellness`, `mental-health`
4. **Save changes**

## Troubleshooting

### Common Issues:

1. **Authentication Failed:**
   - Verify your token has correct permissions
   - Check that token hasn't expired
   - Ensure username and repository name are correct

2. **Repository Already Exists:**
   - Use a different repository name
   - Or delete the existing repository and recreate

3. **Large Files:**
   - GitHub has file size limits (100MB per file)
   - Use Git LFS for large files if needed

4. **Permission Denied:**
   - Verify token has `repo` scope
   - Check repository visibility settings

### Security Best Practices:

1. **Never commit tokens to code**
2. **Use environment variables when possible**
3. **Set appropriate token expiration**
4. **Revoke tokens when no longer needed**

## Next Steps

After successful upload:

1. **Enable GitHub Pages** (optional)
2. **Set up branch protection rules**
3. **Configure deployment to Vercel/Netlify**
4. **Add collaborators if working in a team**
5. **Set up GitHub Actions for CI/CD**

Your MoodSync project is now on GitHub and ready for collaboration and deployment!

## Repository URL
Your live repository: `https://github.com/YOUR_USERNAME/moodsync`