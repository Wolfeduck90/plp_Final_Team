import React, { useState } from 'react';
import { Search, MapPin, Award, Truck, Star } from 'lucide-react';
import { apiService, MatchmakingRequest, MatchmakingResult } from '../services/api';
import { useAsyncAction } from '../hooks/useApi';

export const MatchmakingEngine: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    commodity: '',
    quantity: '',
    frequency: '',
    certification: '',
    location: '',
  });

  const [matches, setMatches] = useState<MatchmakingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { execute: runMatchmaking, loading: matchmakingLoading, error: matchmakingError } = useAsyncAction<MatchmakingResult[], MatchmakingRequest>();

  const handleSearch = async () => {
    if (!searchParams.commodity || !searchParams.quantity || !searchParams.location) {
      alert('Please fill in commodity, quantity, and location fields');
      return;
    }

    setIsSearching(true);
    
    const request: MatchmakingRequest = {
      buyer_location: searchParams.location,
      commodity: searchParams.commodity,
      quantity: parseInt(searchParams.quantity),
      frequency: searchParams.frequency,
      certification: searchParams.certification,
    };

    try {
      const result = await runMatchmaking(apiService.runMatchmaking, request);
      if (result) {
        setMatches(result);
      }
    } catch (error) {
      console.error('Matchmaking failed:', error);
      // Fallback to mock data for demo
      const mockMatches: MatchmakingResult[] = [
        {
          farmer_id: 'F0291',
          match_score: 92.5,
          estimated_delivery_days: 2,
          meets_certification: true,
          quality_grade: 'Grade A',
          farmer_name: 'Green Valley Farm',
          location: 'Gauteng',
          distance: '15 km',
          capacity: '500 kg/week',
          price: 'R45/kg',
          rating: 4.8,
          compatibility: 95,
        },
        {
          farmer_id: 'F0292',
          match_score: 88.0,
          estimated_delivery_days: 3,
          meets_certification: true,
          quality_grade: 'Grade A',
          farmer_name: 'Sunrise Agriculture',
          location: 'Johannesburg',
          distance: '28 km',
          capacity: '800 kg/week',
          price: 'R42/kg',
          rating: 4.6,
          compatibility: 88,
        },
      ];
      setMatches(mockMatches);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Matchmaking Engine</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Commodity (e.g., Tomatoes)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchParams.commodity}
            onChange={(e) => setSearchParams({ ...searchParams, commodity: e.target.value })}
          />
          <input
            type="text"
            placeholder="Quantity (e.g., 500kg)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchParams.quantity}
            onChange={(e) => setSearchParams({ ...searchParams, quantity: e.target.value })}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchParams.frequency}
            onChange={(e) => setSearchParams({ ...searchParams, frequency: e.target.value })}
          >
            <option value="">Select Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchParams.certification}
            onChange={(e) => setSearchParams({ ...searchParams, certification: e.target.value })}
          >
            <option value="">Certification</option>
            <option value="organic">Organic</option>
            <option value="conventional">Conventional</option>
            <option value="fair-trade">Fair Trade</option>
          </select>
          <input
            type="text"
            placeholder="Location (e.g., Gauteng)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchParams.location}
            onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || matchmakingLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{isSearching || matchmakingLoading ? 'Searching...' : 'Find Matches'}</span>
          </button>
        </div>
        
        {matchmakingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {matchmakingError}</p>
          </div>
        )}
      </div>

      {matches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Found {matches.length} matches (ranked by compatibility)
          </h3>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.farmer_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{match.farmer_name}</h4>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{match.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{match.location} ({match.distance})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span>{match.meets_certification ? 'Certified' : 'Not Certified'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span>{match.estimated_delivery_days} days</span>
                      </div>
                      <div>
                        <span className="font-medium">Quality: {match.quality_grade}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Capacity: {match.capacity}</span>
                        <span className="text-lg font-bold text-green-600">{match.price}</span>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(match.match_score)}% match
                    </div>
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