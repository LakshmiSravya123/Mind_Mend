import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface MoodAnalysisResult {
  mood: string;
  score: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export async function analyzeMoodFromHealthData(
  heartRate: number,
  sleepHours: number,
  steps: number,
  stressLevel: number,
  contextualData?: any
): Promise<MoodAnalysisResult> {
  try {
    const prompt = `Analyze the following health data to determine mood and provide insights:
    
Heart Rate: ${heartRate} bpm
Sleep Duration: ${sleepHours} hours
Steps: ${steps}
Stress Level: ${stressLevel}/100
Context: ${contextualData ? JSON.stringify(contextualData) : 'None'}

Please respond with JSON in this exact format:
{
  "mood": "one of: happy, calm, neutral, stressed, sad",
  "score": "number from 0-10 representing mood positivity",
  "confidence": "number from 0-1 representing analysis confidence",
  "factors": ["array", "of", "key", "factors"],
  "recommendations": ["array", "of", "personalized", "suggestions"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in mood analysis based on health biometric data. Provide accurate, helpful insights based on physiological indicators."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      mood: result.mood || 'neutral',
      score: Math.max(0, Math.min(10, result.score || 5)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      factors: Array.isArray(result.factors) ? result.factors : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
  } catch (error) {
    console.error("Mood analysis failed:", error);
    throw new Error("Failed to analyze mood from health data");
  }
}

export async function generateChatResponse(
  userMessage: string,
  conversationHistory: Array<{role: string, content: string}>,
  userHealthData?: any,
  userMoodData?: any
): Promise<string> {
  try {
    const systemPrompt = `You are MoodSync Assistant, an AI companion focused on mental wellness and mood support. 
    
You have access to the user's health and mood data:
${userHealthData ? `Health Data: ${JSON.stringify(userHealthData)}` : ''}
${userMoodData ? `Recent Mood: ${JSON.stringify(userMoodData)}` : ''}

Provide supportive, personalized responses that:
- Are empathetic and encouraging
- Reference their health/mood patterns when relevant
- Offer practical, actionable advice
- Keep responses concise and conversational
- Focus on mental wellness and emotional support`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user" as const, content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0].message.content || "I'm here to help! Could you tell me more about how you're feeling?";
  } catch (error) {
    console.error("Chat response generation failed:", error);
    return "I'm having trouble responding right now. How can I support you with your mood and wellness today?";
  }
}

export async function generateInsights(
  healthMetrics: any[],
  moodEntries: any[]
): Promise<Array<{type: string, title: string, description: string, data: any}>> {
  try {
    const prompt = `Analyze the following health and mood data to generate personalized insights:

Health Metrics: ${JSON.stringify(healthMetrics)}
Mood Entries: ${JSON.stringify(moodEntries)}

Please identify patterns, correlations, and provide actionable insights. Respond with JSON in this format:
{
  "insights": [
    {
      "type": "one of: pattern, correlation, recommendation, alert",
      "title": "Brief insight title",
      "description": "Detailed explanation with specific data points",
      "data": "relevant supporting data object"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in health and mood pattern analysis. Identify meaningful correlations and provide actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return Array.isArray(result.insights) ? result.insights : [];
  } catch (error) {
    console.error("Insight generation failed:", error);
    return [];
  }
}
