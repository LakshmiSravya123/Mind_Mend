import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertHealthMetricSchema, 
  insertMoodEntrySchema, 
  insertChatMessageSchema, 
  insertInsightSchema 
} from "@shared/schema";
import { healthSimulator, deviceManager } from "./services/healthData";
import { moodAnalyzer } from "./services/moodAnalysis";
import { generateChatResponse } from "./services/openai";

const DEMO_USER_ID = 'demo-user-1';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health metrics endpoints
  app.get("/api/health/metrics", async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const metrics = await storage.getHealthMetrics(DEMO_USER_ID, Number(limit));
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health metrics" });
    }
  });

  app.get("/api/health/metrics/latest", async (req, res) => {
    try {
      let latestMetric = await storage.getLatestHealthMetric(DEMO_USER_ID);
      
      // If no recent metric exists, generate one
      if (!latestMetric) {
        const reading = healthSimulator.generateReading();
        latestMetric = await storage.createHealthMetric({
          userId: DEMO_USER_ID,
          heartRate: reading.heartRate,
          sleepHours: reading.sleepHours,
          steps: reading.steps,
          stressLevel: reading.stressLevel
        });
      }
      
      res.json(latestMetric);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest health metric" });
    }
  });

  app.post("/api/health/metrics", async (req, res) => {
    try {
      const validatedData = insertHealthMetricSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const metric = await storage.createHealthMetric(validatedData);
      res.json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid health metric data" });
    }
  });

  // Generate and store new simulated health data
  app.post("/api/health/simulate", async (req, res) => {
    try {
      const reading = healthSimulator.generateReading();
      const metric = await storage.createHealthMetric({
        userId: DEMO_USER_ID,
        heartRate: reading.heartRate,
        sleepHours: reading.sleepHours,
        steps: reading.steps,
        stressLevel: reading.stressLevel
      });
      res.json(metric);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate health data" });
    }
  });

  // Mood entries endpoints
  app.get("/api/mood/entries", async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const entries = await storage.getMoodEntries(DEMO_USER_ID, Number(days));
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.get("/api/mood/current", async (req, res) => {
    try {
      let currentMood = await storage.getLatestMoodEntry(DEMO_USER_ID);
      
      // If no recent mood entry, analyze from latest health data
      if (!currentMood) {
        const latestHealth = await storage.getLatestHealthMetric(DEMO_USER_ID);
        if (latestHealth && latestHealth.heartRate && latestHealth.sleepHours && 
            latestHealth.steps && latestHealth.stressLevel) {
          const analysis = await moodAnalyzer.analyzeMoodFromMetrics(latestHealth);
          currentMood = await storage.createMoodEntry({
            userId: DEMO_USER_ID,
            mood: analysis.mood,
            score: analysis.score,
            confidence: analysis.confidence,
            factors: JSON.stringify(analysis.factors)
          });
        }
      }
      
      res.json(currentMood);
    } catch (error) {
      res.status(500).json({ error: "Failed to get current mood" });
    }
  });

  app.post("/api/mood/entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const entry = await storage.createMoodEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood entry data" });
    }
  });

  app.post("/api/mood/analyze", async (req, res) => {
    try {
      const latestHealth = await storage.getLatestHealthMetric(DEMO_USER_ID);
      if (!latestHealth || !latestHealth.heartRate || !latestHealth.sleepHours || 
          !latestHealth.steps || !latestHealth.stressLevel) {
        return res.status(400).json({ error: "Insufficient health data for mood analysis" });
      }

      const analysis = await moodAnalyzer.analyzeMoodFromMetrics(latestHealth);
      
      // Store the analyzed mood
      const moodEntry = await storage.createMoodEntry({
        userId: DEMO_USER_ID,
        mood: analysis.mood,
        score: analysis.score,
        confidence: analysis.confidence,
        factors: JSON.stringify(analysis.factors)
      });

      res.json(moodEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze mood" });
    }
  });

  // Mood patterns and correlations
  app.get("/api/mood/patterns", async (req, res) => {
    try {
      const entries = await storage.getMoodEntries(DEMO_USER_ID, 30);
      const patterns = moodAnalyzer.analyzeMoodPatterns(entries);
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze mood patterns" });
    }
  });

  app.get("/api/mood/correlations", async (req, res) => {
    try {
      const healthMetrics = await storage.getHealthMetrics(DEMO_USER_ID, 30);
      const moodEntries = await storage.getMoodEntries(DEMO_USER_ID, 30);
      const correlations = moodAnalyzer.analyzeHealthMoodCorrelations(healthMetrics, moodEntries);
      res.json(correlations);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze mood correlations" });
    }
  });

  // AI Chat endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const messages = await storage.getChatMessages(DEMO_USER_ID, Number(limit));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Store user message
      const userMessage = await storage.createChatMessage({
        userId: DEMO_USER_ID,
        message,
        isFromUser: 1
      });

      // Get conversation history
      const history = await storage.getChatMessages(DEMO_USER_ID, 10);
      const conversationHistory = history.map(msg => ({
        role: msg.isFromUser ? "user" : "assistant",
        content: msg.message
      }));

      // Get user context
      const latestHealth = await storage.getLatestHealthMetric(DEMO_USER_ID);
      const latestMood = await storage.getLatestMoodEntry(DEMO_USER_ID);

      // Generate AI response
      const aiResponse = await generateChatResponse(
        message, 
        conversationHistory,
        latestHealth,
        latestMood
      );

      // Store AI response
      const aiMessage = await storage.createChatMessage({
        userId: DEMO_USER_ID,
        message: aiResponse,
        isFromUser: 0
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Insights endpoints
  app.get("/api/insights", async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const insights = await storage.getInsights(DEMO_USER_ID, Number(limit));
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights/generate", async (req, res) => {
    try {
      const healthMetrics = await storage.getHealthMetrics(DEMO_USER_ID, 30);
      const moodEntries = await storage.getMoodEntries(DEMO_USER_ID, 30);
      
      const aiInsights = await moodAnalyzer.generateAIInsights(healthMetrics, moodEntries);
      
      // Store each insight
      const storedInsights = [];
      for (const insight of aiInsights) {
        const stored = await storage.createInsight({
          userId: DEMO_USER_ID,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          data: JSON.stringify(insight.data),
          isRead: 0
        });
        storedInsights.push(stored);
      }
      
      res.json(storedInsights);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.patch("/api/insights/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markInsightAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark insight as read" });
    }
  });

  // Device management endpoints
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await deviceManager.getConnectedDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connected devices" });
    }
  });

  app.post("/api/devices/connect", async (req, res) => {
    try {
      const { deviceType, deviceId } = req.body;
      const device = await deviceManager.connectDevice(deviceType, deviceId);
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect device" });
    }
  });

  app.post("/api/devices/:id/sync", async (req, res) => {
    try {
      const { id } = req.params;
      const readings = await deviceManager.syncDeviceData(id);
      
      // Store synced health data
      for (const reading of readings) {
        await storage.createHealthMetric({
          userId: DEMO_USER_ID,
          heartRate: reading.heartRate,
          sleepHours: reading.sleepData?.duration,
          steps: reading.steps,
          stressLevel: reading.stressLevel
        });
      }
      
      res.json({ synced: readings.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync device data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
