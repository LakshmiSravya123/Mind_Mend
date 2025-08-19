#!/bin/bash

# MoodSync GitHub Setup Script
# This script helps you push your project to GitHub using a personal access token

echo "🚀 MoodSync GitHub Setup"
echo "========================"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "📋 Before we start, make sure you have:"
echo "1. Created a GitHub repository named 'moodsync'"
echo "2. Generated a personal access token with 'repo' permissions"
echo "3. Your GitHub username"
echo ""

# Get user inputs
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your personal access token: " GITHUB_TOKEN
read -p "Enter your full name: " USER_NAME
read -p "Enter your email: " USER_EMAIL

echo ""
echo "🔧 Setting up Git configuration..."

# Configure Git
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"

echo "✅ Git configured"

# Clean up any existing git repository
if [ -d ".git" ]; then
    echo "🧹 Removing existing Git repository..."
    rm -rf .git
fi

echo "📦 Initializing new Git repository..."

# Initialize Git repository
git init

# Add all files
echo "📁 Adding all project files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
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

# Add remote repository
echo "🔗 Adding GitHub remote repository..."
git remote add origin https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/moodsync.git

# Set main branch and push
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your MoodSync project has been uploaded to GitHub!"
    echo "📍 Repository URL: https://github.com/$GITHUB_USERNAME/moodsync"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Visit your repository: https://github.com/$GITHUB_USERNAME/moodsync"
    echo "2. Add topics: ai, health, mood-analysis, react, typescript, openai"
    echo "3. Consider deploying to Vercel or Netlify"
    echo "4. Share your project with the community!"
else
    echo ""
    echo "❌ Error occurred during push. Please check:"
    echo "1. Your GitHub username is correct"
    echo "2. Your personal access token has 'repo' permissions"
    echo "3. The repository 'moodsync' exists on your GitHub account"
    echo "4. Your internet connection is stable"
fi

echo ""
echo "🔐 Security reminder: Keep your personal access token secure and never share it!"