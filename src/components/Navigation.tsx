import React from 'react';
import { Sprout, Users, Award, Eye, TrendingUp, MessageSquare, Shield, Bell, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'matchmaking', label: 'Matchmaking', icon: Sprout },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'quality', label: 'Quality Check', icon: Eye },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp },
    { id: 'chatbot', label: 'AI Guidance', icon: MessageSquare },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-300" />
            <h1 className="text-xl font-bold">AgriConnect AI</h1>
          </div>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};