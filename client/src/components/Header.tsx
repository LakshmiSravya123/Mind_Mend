import { Heart, Settings, Download } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3" data-testid="logo-section">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-mood-calm rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MoodSync</h1>
              <p className="text-xs text-gray-500">AI Health Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-download"
            >
              <Download className="w-6 h-6" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-settings"
            >
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white" data-testid="text-user-initials">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
