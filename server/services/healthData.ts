import { randomUUID } from "crypto";

export interface SimulatedHealthReading {
  heartRate: number;
  sleepHours: number;
  steps: number;
  stressLevel: number;
  timestamp: Date;
}

export class HealthDataSimulator {
  private baseHeartRate = 72;
  private baseSleepHours = 7.5;
  private baseSteps = 8000;
  private baseStressLevel = 25;

  generateReading(): SimulatedHealthReading {
    const now = new Date();
    
    // Add some realistic variations
    const timeOfDay = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Heart rate variations based on time and activity
    let heartRate = this.baseHeartRate;
    if (timeOfDay >= 6 && timeOfDay <= 8) heartRate += 5; // Morning activity
    if (timeOfDay >= 17 && timeOfDay <= 19) heartRate += 8; // Evening activity
    heartRate += Math.floor(Math.random() * 10 - 5); // Random variation
    
    // Sleep hours (simulate previous night)
    let sleepHours = this.baseSleepHours;
    if (dayOfWeek === 0 || dayOfWeek === 6) sleepHours += 0.5; // Weekend
    sleepHours += (Math.random() - 0.5) * 2; // Random variation
    sleepHours = Math.max(5, Math.min(10, sleepHours));
    
    // Steps based on time of day and day of week
    let steps = this.baseSteps;
    const hoursActive = Math.max(0, timeOfDay - 6);
    steps = Math.floor((steps * hoursActive) / 16); // Distribute throughout active hours
    if (dayOfWeek === 0 || dayOfWeek === 6) steps *= 1.2; // More active on weekends
    steps += Math.floor(Math.random() * 2000 - 1000); // Random variation
    steps = Math.max(0, steps);
    
    // Stress level variations
    let stressLevel = this.baseStressLevel;
    if (timeOfDay >= 9 && timeOfDay <= 17) stressLevel += 15; // Work hours
    if (dayOfWeek >= 1 && dayOfWeek <= 5) stressLevel += 5; // Weekdays
    stressLevel += Math.floor(Math.random() * 20 - 10); // Random variation
    stressLevel = Math.max(0, Math.min(100, stressLevel));
    
    return {
      heartRate: Math.max(50, Math.min(120, Math.round(heartRate))),
      sleepHours: Math.round(sleepHours * 10) / 10,
      steps: Math.round(steps),
      stressLevel: Math.round(stressLevel),
      timestamp: now
    };
  }

  // Simulate historical data for the past N days
  generateHistoricalData(days: number): SimulatedHealthReading[] {
    const data: SimulatedHealthReading[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate multiple readings per day (e.g., every 4 hours)
      for (let hour = 8; hour <= 20; hour += 4) {
        const timestamp = new Date(date);
        timestamp.setHours(hour, 0, 0, 0);
        
        // Temporarily set the simulator's context to this time
        const originalNow = Date.now;
        Date.now = () => timestamp.getTime();
        
        const reading = this.generateReading();
        reading.timestamp = timestamp;
        data.push(reading);
        
        // Restore original Date.now
        Date.now = originalNow;
      }
    }
    
    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const healthSimulator = new HealthDataSimulator();

// Health device integration interfaces (for future real device connections)
export interface HealthDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smartphone';
  isConnected: boolean;
  lastSync: Date;
}

export interface DeviceReading {
  deviceId: string;
  heartRate?: number;
  steps?: number;
  sleepData?: {
    duration: number;
    quality: number;
    deepSleep: number;
  };
  stressLevel?: number;
  timestamp: Date;
}

// Placeholder for real device integration
export class HealthDeviceManager {
  private connectedDevices: Map<string, HealthDevice> = new Map();

  async connectDevice(deviceType: string, deviceId: string): Promise<HealthDevice> {
    const device: HealthDevice = {
      id: deviceId,
      name: `${deviceType} Device`,
      type: deviceType as any,
      isConnected: true,
      lastSync: new Date()
    };
    
    this.connectedDevices.set(deviceId, device);
    return device;
  }

  async getConnectedDevices(): Promise<HealthDevice[]> {
    return Array.from(this.connectedDevices.values());
  }

  async syncDeviceData(deviceId: string): Promise<DeviceReading[]> {
    // In a real implementation, this would connect to actual device APIs
    // For now, return simulated data
    const readings = healthSimulator.generateHistoricalData(1);
    
    return readings.map(reading => ({
      deviceId,
      heartRate: reading.heartRate,
      steps: reading.steps,
      sleepData: {
        duration: reading.sleepHours,
        quality: 0.8 + Math.random() * 0.2,
        deepSleep: reading.sleepHours * 0.25
      },
      stressLevel: reading.stressLevel,
      timestamp: reading.timestamp
    }));
  }
}

export const deviceManager = new HealthDeviceManager();
