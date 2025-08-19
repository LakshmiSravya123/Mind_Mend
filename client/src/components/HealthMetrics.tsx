import { Heart, Moon, Zap, Thermometer, TrendingUp } from "lucide-react";
import { useLatestHealthMetric, useSimulateHealthData } from "@/hooks/useHealthData";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface MetricCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  unit: string;
  trend?: string;
  trendColor?: string;
  color: string;
  bgColor: string;
  progress?: number;
  testId: string;
}

function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  trend, 
  trendColor = "text-green-600", 
  color, 
  bgColor, 
  progress = 0,
  testId 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" data-testid={testId}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {trend && (
          <span className={`text-xs ${trendColor} font-medium`} data-testid={`${testId}-trend`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900" data-testid={`${testId}-value`}>{value}</h3>
      <p className="text-xs text-gray-500" data-testid={`${testId}-unit`}>{unit}</p>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${progress}%` }}
          data-testid={`${testId}-progress`}
        ></div>
      </div>
    </div>
  );
}

export default function HealthMetrics() {
  const { data: healthData, isLoading, refetch } = useLatestHealthMetric();
  const simulateData = useSimulateHealthData();

  // Auto-generate new data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      simulateData.mutate();
    }, 30000);

    return () => clearInterval(interval);
  }, [simulateData]);

  const handleGenerateData = () => {
    simulateData.mutate();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-full bg-gray-200 rounded-full h-1"></div>
          </div>
        ))}
      </div>
    );
  }

  const heartRateProgress = healthData?.heartRate ? Math.min((healthData.heartRate / 120) * 100, 100) : 0;
  const sleepProgress = healthData?.sleepHours ? Math.min((healthData.sleepHours / 9) * 100, 100) : 0;
  const stepsProgress = healthData?.steps ? Math.min((healthData.steps / 10000) * 100, 100) : 0;
  const stressProgress = healthData?.stressLevel ? (healthData.stressLevel / 100) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
        <Button
          onClick={handleGenerateData}
          disabled={simulateData.isPending}
          size="sm"
          variant="outline"
          data-testid="button-generate-data"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {simulateData.isPending ? 'Updating...' : 'Update Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="grid-health-metrics">
        <MetricCard
          icon={Heart}
          title="Heart Rate"
          value={healthData?.heartRate || 0}
          unit="Heart Rate (bpm)"
          trend="+2 bpm"
          color="text-red-600"
          bgColor="bg-red-100"
          progress={heartRateProgress}
          testId="card-heart-rate"
        />

        <MetricCard
          icon={Moon}
          title="Sleep Duration"
          value={healthData?.sleepHours ? `${healthData.sleepHours}h` : '0h'}
          unit="Sleep Duration"
          trend="Good"
          color="text-blue-600"
          bgColor="bg-blue-100"
          progress={sleepProgress}
          testId="card-sleep"
        />

        <MetricCard
          icon={Zap}
          title="Steps"
          value={healthData?.steps?.toLocaleString() || '0'}
          unit="Steps Today"
          trend="+15%"
          color="text-green-600"
          bgColor="bg-green-100"
          progress={stepsProgress}
          testId="card-steps"
        />

        <MetricCard
          icon={Thermometer}
          title="Stress Level"
          value={healthData?.stressLevel || 0}
          unit="Stress Level"
          trend="Low"
          trendColor="text-yellow-600"
          color="text-orange-600"
          bgColor="bg-orange-100"
          progress={stressProgress}
          testId="card-stress"
        />
      </div>
    </div>
  );
}
