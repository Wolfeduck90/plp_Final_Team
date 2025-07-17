import React, { useState } from 'react';
import { User, MapPin, Award, MessageSquare, Star } from 'lucide-react';
import { apiService, MentorshipRequest, MentorshipResult } from '../services/api';
import { useAsyncAction } from '../hooks/useApi';

export const MentorshipPairing: React.FC = () => {
  const [menteeProfile, setMenteeProfile] = useState({
    location: '',
    cropType: '',
    experienceLevel: '',
    forumActivity: '',
  });

  const [mentorMatches, setMentorMatches] = useState<MentorshipResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { execute: findMentors, loading: mentorshipLoading, error: mentorshipError } = useAsyncAction<MentorshipResult[], MentorshipRequest>();

  const handleFindMentors = async () => {
    if (!menteeProfile.location || !menteeProfile.cropType || !menteeProfile.experienceLevel) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    
    const request: MentorshipRequest = {
      mentee_id: 'current_user_id', // This would come from auth context
      crop_focus: menteeProfile.cropType,
      region: menteeProfile.location,
      forum_engagement: 75, // This would be calculated from user activity
      experience_level: menteeProfile.experienceLevel,
    };

    try {
      const result = await findMentors(apiService.assignMentor, request);
      if (result) {
        setMentorMatches(result);
      }
    } catch (error) {
      console.error('Mentor matching failed:', error);
      // Fallback to mock data for demo
      const mockMentors: MentorshipResult[] = [
        {
          mentor_id: 'M001',
          match_score: 94,
          reviews: ['Experienced organic farmer specializing in vegetable production'],
          badge_tier: 'Gold',
          name: 'Sarah Khumalo',
          location: 'Gauteng',
          distance: '25 km',
          experience: '15 years',
          specialties: ['Tomatoes', 'Peppers', 'Organic farming'],
          badgeScore: 4.9,
          reviewCount: 47,
          forumPosts: 234,
          compatibilityScore: 94,
          recentTopics: ['Soil health', 'Pest management', 'Crop rotation'],
          bio: 'Experienced organic farmer specializing in vegetable production with focus on sustainable practices.',
        },
      ];
      setMentorMatches(mockMentors);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mentorship Pairing AI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Your Location (e.g., Gauteng)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={menteeProfile.location}
            onChange={(e) => setMenteeProfile({ ...menteeProfile, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Crop Type (e.g., Tomatoes)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={menteeProfile.cropType}
            onChange={(e) => setMenteeProfile({ ...menteeProfile, cropType: e.target.value })}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={menteeProfile.experienceLevel}
            onChange={(e) => setMenteeProfile({ ...menteeProfile, experienceLevel: e.target.value })}
          >
            <option value="">Experience Level</option>
            <option value="beginner">Beginner (0-2 years)</option>
            <option value="intermediate">Intermediate (3-5 years)</option>
            <option value="advanced">Advanced (6+ years)</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={menteeProfile.forumActivity}
            onChange={(e) => setMenteeProfile({ ...menteeProfile, forumActivity: e.target.value })}
          >
            <option value="">Forum Activity</option>
            <option value="active">Very Active</option>
            <option value="moderate">Moderate</option>
            <option value="occasional">Occasional</option>
          </select>
        </div>

        <button
          onClick={handleFindMentors}
          disabled={isSearching || mentorshipLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
        >
          <User className="h-4 w-4" />
          <span>{isSearching || mentorshipLoading ? 'Finding Mentors...' : 'Find Mentors'}</span>
        </button>
        
        {mentorshipError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {mentorshipError}</p>
          </div>
        )}
      </div>

      {mentorMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top 3 Mentor Matches (ranked by compatibility)
          </h3>
          <div className="space-y-6">
            {mentorMatches.map((mentor) => (
              <div key={mentor.mentor_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{mentor.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{mentor.location} ({mentor.distance})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>{mentor.experience} experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {Math.round(mentor.match_score)}% match
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{mentor.badgeScore}</span>
                      <span className="text-xs text-gray-500">({mentor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{mentor.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Recent Forum Topics</h5>
                    <div className="flex flex-wrap gap-2">
                      {mentor.recentTopics.map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{mentor.forumPosts} forum posts</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                      View Profile
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Request Mentorship
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};