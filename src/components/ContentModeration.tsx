import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff, ThumbsUp, Flag } from 'lucide-react';

export const ContentModeration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingPosts = [
    {
      id: 1,
      author: 'John Farmer',
      content: 'Looking for advice on organic pest control for tomatoes. Anyone have experience with neem oil?',
      timestamp: '2 hours ago',
      score: 0.95,
      category: 'helpful',
      flags: 0,
    },
    {
      id: 2,
      author: 'Sarah Green',
      content: 'This is spam content trying to sell fake seeds. Click here for amazing deals!!!',
      timestamp: '1 hour ago',
      score: 0.15,
      category: 'spam',
      flags: 3,
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'Has anyone tried hydroponic lettuce farming? I\'m considering setting up a system.',
      timestamp: '30 minutes ago',
      score: 0.88,
      category: 'question',
      flags: 0,
    },
  ];

  const moderatedPosts = [
    {
      id: 4,
      author: 'Lisa Chen',
      content: 'Great tips on soil preparation! I\'ve increased my yield by 30% following these methods.',
      timestamp: '1 day ago',
      action: 'promoted',
      score: 0.96,
      engagement: 24,
    },
    {
      id: 5,
      author: 'Spammer123',
      content: 'Buy cheap fertilizers here! Best prices guaranteed! [REMOVED]',
      timestamp: '2 days ago',
      action: 'hidden',
      score: 0.08,
      engagement: 0,
    },
    {
      id: 6,
      author: 'Expert Farmer',
      content: 'For beginners: Start with easy crops like lettuce and radishes. Here\'s my complete guide...',
      timestamp: '3 days ago',
      action: 'promoted',
      score: 0.94,
      engagement: 45,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'helpful': return 'bg-green-100 text-green-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'promoted': return 'bg-green-100 text-green-800';
      case 'hidden': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: number) => {
    console.log('Approved post:', id);
  };

  const handleHide = (id: number) => {
    console.log('Hidden post:', id);
  };

  const handlePromote = (id: number) => {
    console.log('Promoted post:', id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Moderation</h2>
        
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveTab('moderated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'moderated'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Moderated
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Pending Review</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-800 mt-2">{pendingPosts.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Auto-Approved</h3>
                </div>
                <p className="text-2xl font-bold text-green-800 mt-2">156</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Auto-Hidden</h3>
                </div>
                <p className="text-2xl font-bold text-red-800 mt-2">23</p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-800">{post.author}</span>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(post.score)}`}>
                        Score: {(post.score * 100).toFixed(0)}%
                      </div>
                      {post.flags > 0 && (
                        <div className="flex items-center space-x-1 mt-1 text-red-600">
                          <Flag className="h-3 w-3" />
                          <span className="text-xs">{post.flags} flags</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleHide(post.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                      <EyeOff className="h-3 w-3" />
                      <span>Hide</span>
                    </button>
                    <button
                      onClick={() => handlePromote(post.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>Promote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'moderated' && (
          <div className="space-y-4">
            {moderatedPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-800">{post.author}</span>
                      <span className="text-sm text-gray-500">{post.timestamp}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(post.action)}`}>
                        {post.action}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(post.score)}`}>
                      Score: {(post.score * 100).toFixed(0)}%
                    </div>
                    {post.engagement > 0 && (
                      <div className="flex items-center space-x-1 mt-1 text-blue-600">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{post.engagement} reactions</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};