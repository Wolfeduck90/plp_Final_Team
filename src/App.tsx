import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MatchmakingEngine } from './components/MatchmakingEngine';
import { MentorshipPairing } from './components/MentorshipPairing';
import { QualityAssessment } from './components/QualityAssessment';
import { MarketInsights } from './components/MarketInsights';
import { ChatbotGuidance } from './components/ChatbotGuidance';
import { ContentModeration } from './components/ContentModeration';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminAnalytics } from './components/AdminAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'matchmaking':
        return <MatchmakingEngine />;
      case 'mentorship':
        return <MentorshipPairing />;
      case 'quality':
        return <QualityAssessment />;
      case 'insights':
        return <MarketInsights />;
      case 'chatbot':
        return <ChatbotGuidance />;
      case 'moderation':
        return <ContentModeration />;
      case 'notifications':
        return <NotificationCenter />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;