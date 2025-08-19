import { HealthMetric, MoodEntry } from "@shared/schema";
import { analyzeMoodFromHealthData, generateInsights } from "./openai";

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

export class MoodAnalyzer {
  
  async analyzeMoodFromMetrics(healthMetric: HealthMetric): Promise<{
    mood: string;
    score: number;
    confidence: number;
    factors: string[];
  }> {
    if (!healthMetric.heartRate || !healthMetric.sleepHours || !healthMetric.steps || !healthMetric.stressLevel) {
      throw new Error("Incomplete health metrics for mood analysis");
    }

    const result = await analyzeMoodFromHealthData(
      healthMetric.heartRate,
      healthMetric.sleepHours,
      healthMetric.steps,
      healthMetric.stressLevel
    );

    return {
      mood: result.mood,
      score: result.score,
      confidence: result.confidence,
      factors: result.factors
    };
  }

  analyzeMoodPatterns(moodEntries: MoodEntry[]): MoodPattern[] {
    if (moodEntries.length === 0) return [];

    const patterns: MoodPattern[] = [];
    
    // Weekly pattern
    const weeklyData = this.groupByWeek(moodEntries);
    weeklyData.forEach((entries, week) => {
      const avgScore = entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
      const moodCounts = this.countMoods(entries);
      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

      patterns.push({
        period: `Week ${week}`,
        averageMood: avgScore,
        dominantMood,
        trend: this.calculateTrend(entries),
        confidence: this.calculateConfidence(entries)
      });
    });

    return patterns;
  }

  analyzeHealthMoodCorrelations(
    healthMetrics: HealthMetric[], 
    moodEntries: MoodEntry[]
  ): MoodCorrelation[] {
    const correlations: MoodCorrelation[] = [];

    if (healthMetrics.length < 5 || moodEntries.length < 5) {
      return correlations; // Need minimum data for correlation analysis
    }

    // Align health metrics with mood entries by timestamp
    const alignedData = this.alignDataByTimestamp(healthMetrics, moodEntries);

    if (alignedData.length < 3) return correlations;

    // Calculate correlations for each health metric
    const heartRateCorr = this.calculateCorrelation(
      alignedData.map(d => d.healthMetric.heartRate || 0),
      alignedData.map(d => d.moodEntry.score)
    );

    const sleepCorr = this.calculateCorrelation(
      alignedData.map(d => d.healthMetric.sleepHours || 0),
      alignedData.map(d => d.moodEntry.score)
    );

    const stepsCorr = this.calculateCorrelation(
      alignedData.map(d => d.healthMetric.steps || 0),
      alignedData.map(d => d.moodEntry.score)
    );

    const stressCorr = this.calculateCorrelation(
      alignedData.map(d => d.healthMetric.stressLevel || 0),
      alignedData.map(d => d.moodEntry.score)
    );

    correlations.push(
      {
        factor: 'Heart Rate',
        correlation: heartRateCorr,
        significance: this.getSignificanceLevel(Math.abs(heartRateCorr)),
        description: this.describeCorrelation('heart rate', heartRateCorr)
      },
      {
        factor: 'Sleep Quality',
        correlation: sleepCorr,
        significance: this.getSignificanceLevel(Math.abs(sleepCorr)),
        description: this.describeCorrelation('sleep duration', sleepCorr)
      },
      {
        factor: 'Physical Activity',
        correlation: stepsCorr,
        significance: this.getSignificanceLevel(Math.abs(stepsCorr)),
        description: this.describeCorrelation('daily steps', stepsCorr)
      },
      {
        factor: 'Stress Level',
        correlation: stressCorr,
        significance: this.getSignificanceLevel(Math.abs(stressCorr)),
        description: this.describeCorrelation('stress level', stressCorr)
      }
    );

    return correlations.filter(c => Math.abs(c.correlation) > 0.1); // Filter weak correlations
  }

  async generateAIInsights(
    healthMetrics: HealthMetric[],
    moodEntries: MoodEntry[]
  ) {
    return await generateInsights(healthMetrics, moodEntries);
  }

  private groupByWeek(entries: MoodEntry[]): Map<string, MoodEntry[]> {
    const weeks = new Map<string, MoodEntry[]>();
    
    entries.forEach(entry => {
      if (!entry.timestamp) return;
      const weekKey = this.getWeekKey(entry.timestamp);
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey)!.push(entry);
    });

    return weeks;
  }

  private countMoods(entries: MoodEntry[]): Record<string, number> {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  }

  private calculateTrend(entries: MoodEntry[]): 'improving' | 'declining' | 'stable' {
    if (entries.length < 2) return 'stable';
    
    const sorted = entries.sort((a, b) => 
      (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
    );
    
    const first = sorted.slice(0, Math.ceil(sorted.length / 2));
    const last = sorted.slice(Math.floor(sorted.length / 2));
    
    const firstAvg = first.reduce((sum, e) => sum + e.score, 0) / first.length;
    const lastAvg = last.reduce((sum, e) => sum + e.score, 0) / last.length;
    
    const difference = lastAvg - firstAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateConfidence(entries: MoodEntry[]): number {
    const avgConfidence = entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length;
    const dataPointsBonus = Math.min(entries.length / 10, 0.2); // Bonus for more data points
    return Math.min(avgConfidence + dataPointsBonus, 1.0);
  }

  private alignDataByTimestamp(
    healthMetrics: HealthMetric[], 
    moodEntries: MoodEntry[]
  ): Array<{healthMetric: HealthMetric, moodEntry: MoodEntry}> {
    const aligned: Array<{healthMetric: HealthMetric, moodEntry: MoodEntry}> = [];
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    healthMetrics.forEach(metric => {
      if (!metric.timestamp) return;
      
      const closestMood = moodEntries
        .filter(mood => mood.timestamp && 
          Math.abs(mood.timestamp.getTime() - metric.timestamp!.getTime()) <= oneDay)
        .sort((a, b) => 
          Math.abs(a.timestamp!.getTime() - metric.timestamp!.getTime()) - 
          Math.abs(b.timestamp!.getTime() - metric.timestamp!.getTime())
        )[0];

      if (closestMood) {
        aligned.push({ healthMetric: metric, moodEntry: closestMood });
      }
    });

    return aligned;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumXX = x.reduce((total, xi) => total + xi * xi, 0);
    const sumYY = y.reduce((total, yi) => total + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private getSignificanceLevel(correlation: number): string {
    if (correlation >= 0.7) return 'Strong';
    if (correlation >= 0.4) return 'Moderate';
    if (correlation >= 0.2) return 'Weak';
    return 'Very Weak';
  }

  private describeCorrelation(factor: string, correlation: number): string {
    const strength = Math.abs(correlation);
    const direction = correlation > 0 ? 'positively' : 'negatively';
    
    if (strength >= 0.7) {
      return `${factor} is strongly ${direction} correlated with your mood`;
    } else if (strength >= 0.4) {
      return `${factor} shows a moderate ${direction} relationship with your mood`;
    } else if (strength >= 0.2) {
      return `${factor} has a weak ${direction} impact on your mood`;
    } else {
      return `${factor} shows little correlation with your mood`;
    }
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const weekNumber = this.getWeekNumber(date);
    return `${year}-W${weekNumber}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}

export const moodAnalyzer = new MoodAnalyzer();
