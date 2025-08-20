# MoodSync - AI Health Companion

A comprehensive health monitoring and mood analysis application that leverages AI to provide personalized insights based on biometric data. MoodSync combines real-time health metrics tracking with intelligent mood analysis and an AI-powered chat companion.

!(https://mind-meld-lakshmisravyave.replit.app)

## Features

### 🏥 Health Monitoring
- **Real-time Metrics**: Track heart rate, sleep duration, daily steps, and stress levels
- **Device Integration**: Ready for Apple Watch, Fitbit, and other wearable devices
- **Automatic Data Generation**: Simulated health data with realistic patterns

### 🧠 AI-Powered Mood Analysis
- **Smart Detection**: Analyze mood from biometric data using GPT-4o
- **Pattern Recognition**: Identify emotional trends and correlations
- **Confidence Scoring**: AI provides confidence levels for mood assessments

### 📊 Visual Analytics
- **Interactive Timeline**: View mood patterns over 7 days, 30 days, or 3 months
- **Color-Coded Moods**: Visual representation with distinct colors for each emotional state
- **Health Correlations**: See how physical metrics impact emotional well-being

### 🤖 AI Companion
- **24/7 Support**: Intelligent chat companion for mental wellness guidance
- **Personalized Advice**: Context-aware recommendations based on your data
- **Quick Actions**: Breathing exercises, walking motivation, and calming music suggestions

### 💡 Smart Insights
- **Pattern Detection**: AI identifies trends in your health and mood data
- **Recommendations**: Personalized suggestions for improving well-being
- **Alerts**: Proactive notifications for concerning patterns

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **OpenAI GPT-4o** for AI features
- **PostgreSQL** with Drizzle ORM
- **In-memory storage** for development

### Development
- **Vite** for build tooling
- **ESBuild** for fast compilation
- **Replit** for deployment and hosting

## Getting Started

### Prerequisites
- Node.js 20 or higher
- OpenAI API key
- PostgreSQL database (optional for production)

### Installation

1. **Clone the repository**
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
   ```
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## API Endpoints

### Health Metrics
- `GET /api/health/metrics` - Fetch health metrics
- `GET /api/health/metrics/latest` - Get latest health reading
- `POST /api/health/simulate` - Generate new simulated data

### Mood Analysis
- `GET /api/mood/current` - Get current mood analysis
- `GET /api/mood/entries` - Fetch mood history
- `POST /api/mood/analyze` - Analyze mood from health data
- `GET /api/mood/correlations` - Get health-mood correlations

### AI Chat
- `GET /api/chat/messages` - Fetch chat history
- `POST /api/chat/messages` - Send message to AI companion

### Insights
- `GET /api/insights` - Get AI-generated insights
- `POST /api/insights/generate` - Generate new insights

## Mood States

MoodSync recognizes five primary emotional states:

| Mood | Color | Description |
|------|-------|-------------|
| 😊 Happy | Green | Positive, energetic, optimistic |
| 😌 Calm | Blue | Relaxed, peaceful, centered |
| 😐 Neutral | Yellow | Balanced, stable, neither positive nor negative |
| 😰 Stressed | Red | Anxious, tense, overwhelmed |
| 😢 Sad | Purple | Low energy, melancholic, withdrawn |

## Device Integration

MoodSync is designed to work with popular health devices:

- **Apple Watch**: Heart rate, activity, sleep data
- **Fitbit**: Steps, heart rate, sleep tracking
- **Smartphone**: Basic activity and sleep patterns
- **Manual Entry**: Users can input data manually

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy & Security

- All health data is processed locally or through secure APIs
- OpenAI integration follows privacy best practices
- No personal health data is stored permanently without consent
- All API communications are encrypted

## Support

For support, questions, or feature requests:

- 📧 Email: lakshmisravya.vedantham@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/LakshmiSravya123/Mind_Mend/)


## Roadmap

- [ ] Mobile app for iOS and Android
- [ ] Real device integration APIs
- [ ] Advanced analytics and reporting
- [ ] Social features and mood sharing
- [ ] Integration with healthcare providers
- [ ] Wearable device SDK

---

Built with ❤️ for better mental health and wellness awareness.
