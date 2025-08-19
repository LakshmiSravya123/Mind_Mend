import Header from "@/components/Header";
import CurrentMoodCard from "@/components/CurrentMoodCard";
import HealthMetrics from "@/components/HealthMetrics";
import MoodTimeline from "@/components/MoodTimeline";
import MoodInsights from "@/components/MoodInsights";
import AICompanion from "@/components/AICompanion";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-dashboard">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Current Mood and Quick Actions */}
          <CurrentMoodCard />
          
          {/* Main Dashboard Content */}
          <div className="lg:col-span-3">
            {/* Health Metrics Row */}
            <HealthMetrics />
            
            {/* Mood Timeline */}
            <div className="mt-6">
              <MoodTimeline />
            </div>
            
            {/* AI Insights */}
            <MoodInsights />
          </div>
        </div>
      </div>

      {/* AI Companion Chat */}
      <AICompanion />
    </div>
  );
}
