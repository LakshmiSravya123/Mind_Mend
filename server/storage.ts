import { 
  type User, 
  type InsertUser, 
  type HealthMetric, 
  type InsertHealthMetric,
  type MoodEntry,
  type InsertMoodEntry,
  type ChatMessage,
  type InsertChatMessage,
  type Insight,
  type InsertInsight
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Health metrics methods
  getHealthMetrics(userId: string, limit?: number): Promise<HealthMetric[]>;
  getLatestHealthMetric(userId: string): Promise<HealthMetric | undefined>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  
  // Mood entry methods
  getMoodEntries(userId: string, days?: number): Promise<MoodEntry[]>;
  getLatestMoodEntry(userId: string): Promise<MoodEntry | undefined>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Chat message methods
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Insights methods
  getInsights(userId: string, limit?: number): Promise<Insight[]>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  markInsightAsRead(insightId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private healthMetrics: Map<string, HealthMetric[]> = new Map();
  private moodEntries: Map<string, MoodEntry[]> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();
  private insights: Map<string, Insight[]> = new Map();

  constructor() {
    // Initialize with demo user and data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUser: User = {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@moodsync.com',
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);

    // Initialize empty arrays for demo user
    this.healthMetrics.set(demoUser.id, []);
    this.moodEntries.set(demoUser.id, []);
    this.chatMessages.set(demoUser.id, []);
    this.insights.set(demoUser.id, []);

    // Generate some initial health metrics
    this.generateInitialHealthData(demoUser.id);
    this.generateInitialMoodData(demoUser.id);
  }

  private generateInitialHealthData(userId: string) {
    const metrics = this.healthMetrics.get(userId) || [];
    const now = new Date();
    
    // Generate last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const metric: HealthMetric = {
        id: randomUUID(),
        userId,
        heartRate: 70 + Math.floor(Math.random() * 20),
        sleepHours: 6.5 + Math.random() * 2,
        steps: 7000 + Math.floor(Math.random() * 4000),
        stressLevel: 20 + Math.floor(Math.random() * 30),
        timestamp: date
      };
      metrics.push(metric);
    }
    
    this.healthMetrics.set(userId, metrics);
  }

  private generateInitialMoodData(userId: string) {
    const entries = this.moodEntries.get(userId) || [];
    const moods = ['happy', 'calm', 'neutral', 'stressed', 'sad'];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const moodIndex = Math.floor(Math.random() * moods.length);
      const baseScore = [8.5, 7.0, 6.0, 4.5, 3.0][moodIndex];
      
      const entry: MoodEntry = {
        id: randomUUID(),
        userId,
        mood: moods[moodIndex],
        score: baseScore + (Math.random() - 0.5) * 1.5,
        confidence: 0.8 + Math.random() * 0.2,
        factors: JSON.stringify(['sleep', 'exercise', 'work']),
        timestamp: date
      };
      entries.push(entry);
    }
    
    this.moodEntries.set(userId, entries);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Initialize empty arrays for new user
    this.healthMetrics.set(id, []);
    this.moodEntries.set(id, []);
    this.chatMessages.set(id, []);
    this.insights.set(id, []);
    
    return user;
  }

  // Health metrics methods
  async getHealthMetrics(userId: string, limit = 50): Promise<HealthMetric[]> {
    const metrics = this.healthMetrics.get(userId) || [];
    return metrics
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async getLatestHealthMetric(userId: string): Promise<HealthMetric | undefined> {
    const metrics = await this.getHealthMetrics(userId, 1);
    return metrics[0];
  }

  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = randomUUID();
    const metric: HealthMetric = {
      ...insertMetric,
      id,
      heartRate: insertMetric.heartRate ?? null,
      sleepHours: insertMetric.sleepHours ?? null,
      steps: insertMetric.steps ?? null,
      stressLevel: insertMetric.stressLevel ?? null,
      timestamp: new Date()
    };
    
    const userMetrics = this.healthMetrics.get(insertMetric.userId) || [];
    userMetrics.push(metric);
    this.healthMetrics.set(insertMetric.userId, userMetrics);
    
    return metric;
  }

  // Mood entry methods
  async getMoodEntries(userId: string, days = 30): Promise<MoodEntry[]> {
    const entries = this.moodEntries.get(userId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries
      .filter(entry => (entry.timestamp?.getTime() || 0) >= cutoffDate.getTime())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async getLatestMoodEntry(userId: string): Promise<MoodEntry | undefined> {
    const entries = await this.getMoodEntries(userId, 1);
    return entries[0];
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const entry: MoodEntry = {
      ...insertEntry,
      id,
      factors: insertEntry.factors ?? null,
      timestamp: new Date()
    };
    
    const userEntries = this.moodEntries.get(insertEntry.userId) || [];
    userEntries.push(entry);
    this.moodEntries.set(insertEntry.userId, userEntries);
    
    return entry;
  }

  // Chat message methods
  async getChatMessages(userId: string, limit = 50): Promise<ChatMessage[]> {
    const messages = this.chatMessages.get(userId) || [];
    return messages
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0))
      .slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      isFromUser: insertMessage.isFromUser ?? 1,
      timestamp: new Date()
    };
    
    const userMessages = this.chatMessages.get(insertMessage.userId) || [];
    userMessages.push(message);
    this.chatMessages.set(insertMessage.userId, userMessages);
    
    return message;
  }

  // Insights methods
  async getInsights(userId: string, limit = 20): Promise<Insight[]> {
    const insights = this.insights.get(userId) || [];
    return insights
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = randomUUID();
    const insight: Insight = {
      ...insertInsight,
      id,
      data: insertInsight.data ?? null,
      isRead: insertInsight.isRead ?? 0,
      timestamp: new Date()
    };
    
    const userInsights = this.insights.get(insertInsight.userId) || [];
    userInsights.push(insight);
    this.insights.set(insertInsight.userId, userInsights);
    
    return insight;
  }

  async markInsightAsRead(insightId: string): Promise<void> {
    for (const [userId, insights] of Array.from(this.insights.entries())) {
      const insight = insights.find((i: Insight) => i.id === insightId);
      if (insight) {
        insight.isRead = 1;
        break;
      }
    }
  }
}

export const storage = new MemStorage();
