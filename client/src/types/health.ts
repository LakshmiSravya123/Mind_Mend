export interface HealthMetric {
  id: string;
  userId: string;
  heartRate?: number;
  sleepHours?: number;
  steps?: number;
  stressLevel?: number;
  timestamp?: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  score: number;
  confidence: number;
  factors?: string;
  timestamp?: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  isFromUser: number;
  timestamp?: Date;
}

export interface Insight {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  data?: string;
  isRead: number;
  timestamp?: Date;
}

export interface MoodPattern {
  period: string;
  averageMood: number;
  dominantMood: string;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
}

export interface MoodCorrelation {
  factor: string;
  correlation: number;
  significance: string;
  description: string;
}

export type MoodType = 'happy' | 'calm' | 'neutral' | 'stressed' | 'sad';

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: '#10B981',
  calm: '#3B82F6',
  neutral: '#F59E0B',
  stressed: '#EF4444',
  sad: '#8B5CF6'
};

export const MOOD_LABELS: Record<MoodType, string> = {
  happy: 'Happy',
  calm: 'Calm',
  neutral: 'Neutral',
  stressed: 'Stressed',
  sad: 'Sad'
};
