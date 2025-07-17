import React from 'react';
import { Users, TrendingUp, MessageSquare, Award, AlertTriangle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Active Farmers', value: '2,847', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Successful Matches', value: '1,234', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Market Alerts', value: '47', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Mentorship Pairs', value: '389', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const recentActivity = [
    { type: 'match', message: 'New buyer-farmer match for tomatoes in Gauteng', time: '2 minutes ago' },
    { type: 'mentor', message: 'Mentor Sarah K. paired with new farmer John M.', time: '15 minutes ago' },
    { type: 'quality', message: 'Grade A quality assessment completed for spinach batch', time: '1 hour ago' },
    { type: 'alert', message: 'Market alert: High demand for ginger in Limpopo', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Ginger</p>
                <p className="text-sm text-green-600">High demand in Limpopo</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Spinach</p>
                <p className="text-sm text-red-600">Oversupplied in Gauteng</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Turmeric</p>
                <p className="text-sm text-blue-600">Growing demand</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};