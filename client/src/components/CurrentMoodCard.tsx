import { Smile, Activity, BarChart3, Zap } from "lucide-react";
import { useCurrentMood, useAnalyzeMood } from "@/hooks/useHealthData";
import { MOOD_COLORS, MOOD_LABELS } from "@/types/health";
import { Button } from "@/components/ui/button";

const MOOD_ICONS = {
  happy: Smile,
  calm: Activity,
  neutral: BarChart3,
  stressed: Zap,
  sad: Activity
};

export default function CurrentMoodCard() {
  const { data: currentMood, isLoading } = useCurrentMood();
  const analyzeMood = useAnalyzeMood();

  const mood = currentMood?.mood as keyof typeof MOOD_COLORS || 'neutral';
  const MoodIcon = MOOD_ICONS[mood];
  const moodColor = MOOD_COLORS[mood];
  const moodLabel = MOOD_LABELS[mood];

  const factors = currentMood?.factors ? JSON.parse(currentMood.factors) : [];

  const handleAnalyzeMood = () => {
    analyzeMood.mutate();
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="card-current-mood">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Mood</h2>
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: moodColor }}
            data-testid="indicator-mood-pulse"
          ></div>
        </div>
        
        <div className="text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
            </div>
          ) : (
            <>
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${moodColor}, ${moodColor}80)` 
                }}
                data-testid="icon-current-mood"
              >
                <MoodIcon className="w-12 h-12 text-white" />
              </div>
              <h3 
                className="text-2xl font-bold mb-2" 
                style={{ color: moodColor }}
                data-testid="text-mood-label"
              >
                {moodLabel}
              </h3>
              <p className="text-sm text-gray-600 mb-4" data-testid="text-mood-confidence">
                {currentMood ? `${Math.round(currentMood.confidence * 100)}% confidence` : 'Analyzing...'}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 text-left">
                <p className="text-xs font-medium text-gray-700 mb-1">Key Indicators:</p>
                <div className="flex flex-wrap gap-1" data-testid="list-mood-factors">
                  {factors.length > 0 ? (
                    factors.map((factor: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-opacity-20"
                        style={{ 
                          backgroundColor: `${moodColor}40`, 
                          color: moodColor 
                        }}
                        data-testid={`tag-factor-${index}`}
                      >
                        {factor}
                      </span>
                    ))
                  ) : (
                    <>
                      <span 
                        className="px-2 py-1 text-xs rounded-full bg-opacity-20"
                        style={{ 
                          backgroundColor: `${moodColor}40`, 
                          color: moodColor 
                        }}
                      >
                        Heart Rate
                      </span>
                      <span 
                        className="px-2 py-1 text-xs rounded-full bg-opacity-20"
                        style={{ 
                          backgroundColor: `${moodColor}40`, 
                          color: moodColor 
                        }}
                      >
                        Sleep Quality
                      </span>
                      <span 
                        className="px-2 py-1 text-xs rounded-full bg-opacity-20"
                        style={{ 
                          backgroundColor: `${moodColor}40`, 
                          color: moodColor 
                        }}
                      >
                        Activity Level
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6" data-testid="card-quick-actions">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={handleAnalyzeMood}
            disabled={analyzeMood.isPending}
            className="w-full flex items-center justify-start space-x-3 p-3 bg-primary bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-colors text-primary hover:text-primary"
            variant="ghost"
            data-testid="button-analyze-mood"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">
              {analyzeMood.isPending ? 'Analyzing...' : 'Analyze Mood'}
            </span>
          </Button>
          
          <Button
            className="w-full flex items-center justify-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
            variant="ghost"
            data-testid="button-view-insights"
          >
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">View Insights</span>
          </Button>
          
          <Button
            className="w-full flex items-center justify-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
            variant="ghost"
            data-testid="button-sync-devices"
          >
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Sync Devices</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
