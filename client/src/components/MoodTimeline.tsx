import { useMoodEntries } from "@/hooks/useHealthData";
import { MOOD_COLORS } from "@/types/health";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function MoodTimeline() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | '3M'>('7D');
  const { data: moodEntries, isLoading } = useMoodEntries(
    selectedPeriod === '7D' ? 7 : selectedPeriod === '30D' ? 30 : 90
  );

  const chartData = useMemo(() => {
    if (!moodEntries) return [];
    
    return moodEntries
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
      .map(entry => ({
        date: new Date(entry.timestamp || 0).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        score: entry.score,
        mood: entry.mood,
        confidence: entry.confidence
      }));
  }, [moodEntries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm capitalize" style={{ color: MOOD_COLORS[data.mood as keyof typeof MOOD_COLORS] }}>
            {data.mood}: {data.score.toFixed(1)}/10
          </p>
          <p className="text-xs text-gray-500">
            {Math.round(data.confidence * 100)}% confidence
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" data-testid="card-mood-timeline">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Mood Timeline</h2>
          <p className="text-sm text-gray-500">Emotional patterns over time</p>
        </div>
        <div className="flex items-center space-x-2">
          {(['7D', '30D', '3M'] as const).map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              className={selectedPeriod === period ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"}
              data-testid={`button-period-${period}`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-64 relative" data-testid="chart-mood-timeline">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6B7280' }}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No mood data available for the selected period</p>
          </div>
        )}
      </div>

      {/* Mood Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100" data-testid="legend-mood-colors">
        {Object.entries(MOOD_COLORS).map(([mood, color]) => (
          <div key={mood} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
              data-testid={`legend-${mood}`}
            ></div>
            <span className="text-xs text-gray-600 capitalize">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
