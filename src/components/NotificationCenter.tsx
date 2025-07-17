import React, { useState } from 'react';
import { Bell, Settings, Mail, MessageSquare, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match',
      title: 'New Buyer Match',
      message: 'A buyer is looking for 500kg of tomatoes in your area',
      timestamp: '2 minutes ago',
      read: false,
      icon: ShoppingCart,
      priority: 'high',
    },
    {
      id: 2,
      type: 'mentor',
      title: 'Mentorship Request',
      message: 'John M. has requested you as a mentor for organic farming',
      timestamp: '1 hour ago',
      read: false,
      icon: Users,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'market',
      title: 'Market Alert',
      message: 'Ginger prices have increased by 15% in Limpopo',
      timestamp: '3 hours ago',
      read: true,
      icon: AlertTriangle,
      priority: 'medium',
    },
    {
      id: 4,
      type: 'forum',
      title: 'Forum Reply',
      message: 'Sarah replied to your post about pest control',
      timestamp: '1 day ago',
      read: true,
      icon: MessageSquare,
      priority: 'low',
    },
  ]);

  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    frequency: 'immediate',
    categories: {
      matches: true,
      mentorship: true,
      market: true,
      forum: false,
    },
  });

  const [activeTab, setActiveTab] = useState('notifications');

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'match': return 'text-green-600';
      case 'mentor': return 'text-blue-600';
      case 'market': return 'text-yellow-600';
      case 'forum': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Notification Center</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {unreadCount} unread
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Settings
          </button>
        </div>

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-4 rounded-lg cursor-pointer transition-all ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-300' 
                        : getPriorityColor(notification.priority)
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(notification.type)}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) => setPreferences(prev => ({ ...prev, push: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Bell className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Push notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={(e) => setPreferences(prev => ({ ...prev, sms: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">SMS notifications</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequency</h3>
              <select
                value={preferences.frequency}
                onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly digest</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Buyer-Farmer matches</span>
                  <input
                    type="checkbox"
                    checked={preferences.categories.matches}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      categories: { ...prev.categories, matches: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Mentorship opportunities</span>
                  <input
                    type="checkbox"
                    checked={preferences.categories.mentorship}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      categories: { ...prev.categories, mentorship: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Market alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.categories.market}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      categories: { ...prev.categories, market: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Forum activity</span>
                  <input
                    type="checkbox"
                    checked={preferences.categories.forum}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      categories: { ...prev.categories, forum: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};