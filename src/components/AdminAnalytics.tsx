import React, { useState } from 'react';
import { Users, Activity, MessageSquare, TrendingUp, Eye, Flag, Award, ShoppingCart } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    { title: 'Total Users', value: '3,247', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Sessions', value: '892', change: '+8%', icon: Activity, color: 'text-green-600' },
    { title: 'Forum Posts', value: '1,834', change: '+23%', icon: MessageSquare, color: 'text-purple-600' },
    { title: 'Successful Matches', value: '456', change: '+18%', icon: ShoppingCart, color: 'text-orange-600' },
  ];

  const usersByRole = [
    { role: 'Farmers', count: 1847, percentage: 56.9 },
    { role: 'Buyers', count: 823, percentage: 25.3 },
    { role: 'Mentors', count: 389, percentage: 12.0 },
    { role: 'Mentees', count: 188, percentage: 5.8 },
  ];

  const topFeatures = [
    { feature: 'Marketplace', usage: 2456, sessions: 1234 },
    { feature: 'Forum', usage: 1834, sessions: 892 },
    { feature: 'Mentorship', usage: 1246, sessions: 567 },
    { feature: 'Chatbot', usage: 1089, sessions: 445 },
    { feature: 'Quality Check', usage: 678, sessions: 234 },
  ];

  const topMentors = [
    { name: 'Sarah Khumalo', rating: 4.9, mentees: 23, topics: 'Organic farming' },
    { name: 'John Mokoena', rating: 4.8, mentees: 18, topics: 'Hydroponics' },
    { name: 'Maria van der Merwe', rating: 4.7, mentees: 15, topics: 'Herb cultivation' },
  ];

  const topCrops = [
    { crop: 'Tomatoes', trades: 234, volume: '12,500 kg' },
    { crop: 'Lettuce', trades: 189, volume: '8,900 kg' },
    { crop: 'Spinach', trades: 156, volume: '7,800 kg' },
    { crop: 'Peppers', trades: 123, volume: '5,600 kg' },
  ];

  const moderationStats = [
    { type: 'Posts Reviewed', count: 1234, auto: 945, manual: 289 },
    { type: 'Flagged Content', count: 67, resolved: 58, pending: 9 },
    { type: 'User Reports', count: 23, resolved: 20, pending: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Analytics Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
            <div className="space-y-3">
              {usersByRole.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{user.role}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{user.count}</span>
                    <span className="text-xs text-gray-500">({user.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Usage</h3>
            <div className="space-y-3">
              {topFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{feature.feature}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">{feature.sessions} sessions</span>
                    <span className="text-sm text-gray-600">{feature.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Mentors</h3>
            <div className="space-y-4">
              {topMentors.map((mentor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{mentor.name}</p>
                    <p className="text-sm text-gray-600">{mentor.topics}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{mentor.mentees} mentees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Traded Crops</h3>
            <div className="space-y-4">
              {topCrops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{crop.crop}</p>
                    <p className="text-sm text-gray-600">{crop.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{crop.trades} trades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Moderation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moderationStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">{stat.type}</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.count}</p>
                <div className="flex items-center justify-between text-sm">
                  {stat.auto !== undefined && (
                    <span className="text-green-600">Auto: {stat.auto}</span>
                  )}
                  {stat.manual !== undefined && (
                    <span className="text-blue-600">Manual: {stat.manual}</span>
                  )}
                  {stat.resolved !== undefined && (
                    <span className="text-green-600">Resolved: {stat.resolved}</span>
                  )}
                  {stat.pending !== undefined && (
                    <span className="text-yellow-600">Pending: {stat.pending}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};