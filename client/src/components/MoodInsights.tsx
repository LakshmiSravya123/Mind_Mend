import { TrendingUp, Moon, AlertTriangle, Lightbulb, Brain } from "lucide-react";
import { useInsights, useGenerateInsights, useMoodCorrelations } from "@/hooks/useHealthData";
import { Button } from "@/components/ui/button";

const INSIGHT_COLORS = {
  pattern: {
    bg: 'mood-gradient-happy',
    border: 'border-mood-happy border-opacity-20',
    text: 'text-mood-happy',
    icon: TrendingUp
  },
  correlation: {
    bg: 'mood-gradient-calm',
    border: 'border-mood-calm border-opacity-20', 
    text: 'text-mood-calm',
    icon: Moon
  },
  alert: {
    bg: 'mood-gradient-stressed',
    border: 'border-mood-stressed border-opacity-20',
    text: 'text-mood-stressed',
    icon: AlertTriangle
  },
  recommendation: {
    bg: 'mood-gradient-neutral',
    border: 'border-mood-neutral border-opacity-20',
    text: 'text-mood-neutral',
    icon: Lightbulb
  }
};

interface InsightCardProps {
  type: string;
  title: string;
  description: string;
  data?: any;
  testId: string;
}

function InsightCard({ type, title, description, data, testId }: InsightCardProps) {
  const config = INSIGHT_COLORS[type as keyof typeof INSIGHT_COLORS] || INSIGHT_COLORS.recommendation;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} bg-opacity-10 rounded-xl p-4 border ${config.border}`} data-testid={testId}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`font-semibold ${config.text}`}>{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
      </div>
      {data && (
        <div className="flex items-center space-x-2" data-testid={`${testId}-tags`}>
          {Object.entries(data).map(([key, value], index) => (
            <span 
              key={index}
              className={`px-2 py-1 bg-white bg-opacity-50 ${config.text} text-xs rounded-full font-medium`}
              data-testid={`tag-${key}`}
            >
              {`${key}: ${value}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MoodInsights() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: correlations, isLoading: correlationsLoading } = useMoodCorrelations();
  const generateInsights = useGenerateInsights();

  const handleGenerateInsights = () => {
    generateInsights.mutate();
  };

  const isLoading = insightsLoading || correlationsLoading;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" data-testid="card-mood-insights">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h2>
          <p className="text-sm text-gray-500">Personalized suggestions based on your data</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleGenerateInsights}
            disabled={generateInsights.isPending}
            size="sm"
            variant="outline"
            data-testid="button-generate-insights"
          >
            <Brain className="w-4 h-4 mr-2" />
            {generateInsights.isPending ? 'Generating...' : 'Generate New'}
          </Button>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-mood-calm rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Generated AI Insights */}
          {insights && insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="grid-ai-insights">
              {insights.slice(0, 4).map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  data={insight.data ? JSON.parse(insight.data) : null}
                  testId={`insight-${index}`}
                />
              ))}
            </div>
          )}

          {/* Correlation Insights */}
          {correlations && correlations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" data-testid="grid-correlations">
              {correlations
                .filter(corr => Math.abs(corr.correlation) > 0.2)
                .slice(0, 2)
                .map((correlation, index) => (
                  <InsightCard
                    key={index}
                    type="correlation"
                    title={`${correlation.factor} Impact`}
                    description={correlation.description}
                    data={{
                      strength: correlation.significance,
                      correlation: `${(correlation.correlation * 100).toFixed(0)}%`
                    }}
                    testId={`correlation-${index}`}
                  />
                ))}
            </div>
          )}

          {/* Default insights when no data is available */}
          {(!insights || insights.length === 0) && (!correlations || correlations.length === 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="grid-default-insights">
              <InsightCard
                type="pattern"
                title="Positive Pattern Detected"
                description="Your mood improves significantly after morning workouts"
                data={{ "mood boost": "+23%", "streak": "7 days" }}
                testId="default-pattern"
              />
              
              <InsightCard
                type="correlation"
                title="Sleep Quality Impact"
                description="Better sleep correlates with improved emotional stability"
                data={{ "correlation": "85%", "optimal": "7-8h" }}
                testId="default-sleep"
              />
              
              <InsightCard
                type="alert"
                title="Stress Alert"
                description="Evening heart rate variability shows increased stress patterns"
                data={{ "trend": "2 day", "action": "needed" }}
                testId="default-stress"
              />
              
              <InsightCard
                type="recommendation"
                title="Personalized Tip"
                description="Try a 10-minute meditation session around 3 PM based on your stress patterns"
                data={{ "suggested": "AI", "try": "now" }}
                testId="default-recommendation"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
