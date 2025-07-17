import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { apiService, MarketInsightsResult } from '../services/api';
import { useApi } from '../hooks/useApi';

export const MarketInsights: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeframe, setTimeframe] = useState('12months');
  
  const { data: marketInsights, loading: insightsLoading, error: insightsError } = useApi(
    () => apiService.getMarketInsights(selectedRegion === 'all' ? undefined : selectedRegion),
    [selectedRegion]
  );

  // Fallback data for demo
  const fallbackMarketData = [
    {
      crop: 'Spinach',
      status: 'oversupplied',
      region: 'Gauteng',
      priceChange: -15,
      volume: 2400,
      trend: 'down',
      recommendation: 'Consider switching to ginger or reducing planting area',
    },
    {
      crop: 'Ginger',
      status: 'high-demand',
      region: 'Limpopo',
      priceChange: 28,
      volume: 680,
      trend: 'up',
      recommendation: 'Excellent opportunity for new plantings',
    },
    {
      crop: 'Turmeric',
      status: 'growing-demand',
      region: 'KwaZulu-Natal',
      priceChange: 12,
      volume: 1200,
      trend: 'up',
      recommendation: 'Good medium-term opportunity',
    },
    {
      crop: 'Lettuce',
      status: 'stable',
      region: 'Western Cape',
      priceChange: 3,
      volume: 1800,
      trend: 'stable',
      recommendation: 'Maintain current production levels',
    },
    {
      crop: 'Tomatoes',
      status: 'oversupplied',
      region: 'Gauteng',
      priceChange: -8,
      volume: 3200,
      trend: 'down',
      recommendation: 'Consider crop rotation or value-added processing',
    },
  ];

  const fallbackCropAlternatives = [
    {
      from: 'Spinach',
      to: 'Ginger',
      reason: 'Higher demand and better prices',
      difficulty: 'Medium',
      timeToHarvest: '8-10 months',
    },
    {
      from: 'Tomatoes',
      to: 'Turmeric',
      reason: 'Growing market and less competition',
      difficulty: 'Easy',
      timeToHarvest: '10-12 months',
    },
    {
      from: 'Lettuce',
      to: 'Herbs (Basil, Parsley)',
      reason: 'Higher value per kg',
      difficulty: 'Easy',
      timeToHarvest: '6-8 weeks',
    },
  ];

  const marketData = marketInsights?.market_data || fallbackMarketData;
  const cropAlternatives = marketInsights?.crop_alternatives || fallbackCropAlternatives;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'oversupplied':
        return 'bg-red-100 text-red-800';
      case 'high-demand':
        return 'bg-green-100 text-green-800';
      case 'growing-demand':
        return 'bg-blue-100 text-blue-800';
      case 'stable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Insights & Saturation Analysis</h2>
        
        {insightsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error loading market insights: {insightsError}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            <option value="gauteng">Gauteng</option>
            <option value="limpopo">Limpopo</option>
            <option value="kwazulu-natal">KwaZulu-Natal</option>
            <option value="western-cape">Western Cape</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>

        {insightsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading market insights...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Status by Crop</h3>
            <div className="space-y-4">
              {marketData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-800">{item.crop}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(item.trend)}
                      <span className={`text-sm font-medium ${item.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.priceChange >= 0 ? '+' : ''}{item.priceChange}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.region}</span>
                    </div>
                    <span>Volume: {item.volume} tons</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Alternatives</h3>
            <div className="space-y-4">
              {cropAlternatives.map((alt, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-blue-800">
                      {alt.from} → {alt.to}
                    </p>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">{alt.reason}</p>
                  <div className="space-y-1 text-xs text-blue-600">
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className="font-medium">{alt.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to harvest:</span>
                      <span className="font-medium">{alt.time_to_harvest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Oversupplied Markets</h4>
            </div>
            <p className="text-sm text-red-700">Spinach and tomatoes showing oversupply in Gauteng region</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">High Demand</h4>
            </div>
            <p className="text-sm text-green-700">Ginger showing exceptional demand growth in Limpopo</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Seasonal Opportunity</h4>
            </div>
            <p className="text-sm text-blue-700">Herb production showing consistent growth across regions</p>
          </div>
        </div>
      </div>
    </div>
  );
};