# Contributing to MoodSync

Thank you for your interest in contributing to MoodSync! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors
- Respect privacy and health data sensitivity

## Getting Started

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/moodsync.git
   cd moodsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── services/           # Business logic services
│   ├── routes.ts           # API route definitions
│   └── storage.ts          # Data storage layer
├── shared/                 # Shared types and schemas
└── docs/                   # Documentation
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix issues in existing functionality
- ✨ **New features**: Add new capabilities to MoodSync
- 📖 **Documentation**: Improve or add documentation
- 🎨 **UI/UX improvements**: Enhance user interface and experience
- 🔧 **Refactoring**: Improve code quality and maintainability
- 🧪 **Testing**: Add or improve test coverage

### Before You Start

1. **Check existing issues**: Look for related issues or discussions
2. **Create an issue**: For new features, create an issue to discuss the proposal
3. **Assign yourself**: Comment on the issue to avoid duplicate work

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run dev          # Test locally
   npm run build        # Verify build works
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new mood detection algorithm"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We use conventional commits for clear commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add heart rate variability analysis`
- `fix: resolve mood timeline rendering issue`
- `docs: update API documentation for chat endpoints`

### Code Style Guidelines

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### React Components
- Use functional components with hooks
- Add `data-testid` attributes for interactive elements
- Follow the existing component structure
- Use proper TypeScript types for props

#### CSS/Styling
- Use Tailwind CSS utilities
- Follow existing design system patterns
- Use CSS custom properties for mood colors
- Ensure responsive design

### Health Data Considerations

When working with health-related features:

- **Privacy First**: Never log or expose personal health data
- **Accuracy**: Ensure mood analysis is based on scientific principles
- **Transparency**: Make AI decision-making processes clear to users
- **Ethical AI**: Avoid bias in mood analysis algorithms

### Testing

- Add unit tests for new utility functions
- Test React components with user interactions
- Verify API endpoints work correctly
- Test mood analysis accuracy with sample data

### Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation for new endpoints
- Include examples in code comments

## Pull Request Process

1. **Fill out the PR template** with all required information
2. **Ensure all checks pass** (linting, building, tests)
3. **Request review** from maintainers
4. **Address feedback** promptly and professionally
5. **Keep PR focused** on a single feature or fix

### PR Review Criteria

- Code quality and style consistency
- Functionality works as described
- No breaking changes (unless discussed)
- Documentation is updated
- Tests are included where appropriate

## Questions and Support

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Report bugs through GitHub Issues
- 📧 **Email**: Contact maintainers at contribute@moodsync.com

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project README
- Release notes for significant contributions

Thank you for helping make MoodSync better for everyone! 🙏