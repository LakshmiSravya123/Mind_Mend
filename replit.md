# MoodSync - AI Health Companion

## Overview

MoodSync is a comprehensive health monitoring and mood analysis application that leverages AI to provide personalized insights based on biometric data. The application combines real-time health metrics tracking (heart rate, sleep, steps, stress levels) with intelligent mood analysis and an AI-powered chat companion. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and OpenAI for AI-powered mood analysis and conversational features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing modern component patterns and hooks for state management. The UI leverages shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. The application uses Wouter for client-side routing and TanStack Query for server state management and caching. Tailwind CSS provides utility-first styling with a custom design system including mood-specific color schemes and gradients.

### Backend Architecture
The server implements a RESTful API using Express.js with TypeScript. The application follows a modular service-oriented architecture with separate services for health data simulation, mood analysis, and OpenAI integration. The storage layer is abstracted through an interface-based approach, currently implemented with in-memory storage but designed to easily switch to database persistence. The server includes middleware for request logging, error handling, and development tooling.

### Data Management
The application uses Drizzle ORM for database schema definition and migrations, configured for PostgreSQL with Neon Database support. The schema defines five main entities: users, health metrics, mood entries, chat messages, and insights. The current implementation includes a demo mode with simulated data and a MemStorage implementation for development, while production is configured for PostgreSQL persistence.

### AI Integration
The system integrates OpenAI's GPT-4o model for two primary functions: mood analysis from biometric data and conversational AI companion features. The mood analysis service processes health metrics to determine emotional states, confidence levels, and contributing factors. The chat system provides contextual responses and wellness guidance based on user interactions and health data patterns.

### Real-time Features
The application implements real-time data updates through React Query's polling mechanisms, automatically refreshing health metrics and mood data at regular intervals. The health data simulator generates realistic biometric readings with time-of-day and day-of-week variations to provide dynamic, contextually appropriate data.

## External Dependencies

- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless) with Drizzle ORM for schema management and queries
- **AI Services**: OpenAI API for mood analysis and conversational AI features using GPT-4o model
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens and mood-based color schemes
- **Charts**: Recharts library for data visualization and mood timeline displays
- **Development**: Vite for build tooling and development server, with Replit-specific plugins for integration
- **Form Management**: React Hook Form with Zod validation for type-safe form handling
- **State Management**: TanStack Query for server state, caching, and synchronization
- **Date Handling**: date-fns library for date manipulation and formatting

## Repository Information

- **GitHub**: Ready for deployment to GitHub with comprehensive documentation
- **License**: MIT License for open-source distribution
- **Documentation**: Complete README.md, CONTRIBUTING.md, and deployment guides included
- **Environment**: .env.example provided for easy setup
- **Deployment**: Compatible with Vercel, Netlify, Railway, Render, and other platforms