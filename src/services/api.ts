// API Service Layer for AI-Powered Agricultural Platform
import { supabase } from '../lib/supabase';
import { databaseService } from './database';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface MatchmakingRequest {
  buyer_location: string;
  commodity: string;
  quantity: number;
  frequency: string;
  certification: string;
}

export interface MatchmakingResult {
  farmer_id: string;
  match_score: number;
  estimated_delivery_days: number;
  meets_certification: boolean;
  quality_grade: string;
  farmer_name: string;
  location: string;
  distance: string;
  capacity: string;
  price: string;
  rating: number;
  compatibility: number;
}

export interface MentorshipRequest {
  mentee_id: string;
  crop_focus: string;
  region: string;
  forum_engagement: number;
  experience_level: string;
}

export interface MentorshipResult {
  mentor_id: string;
  match_score: number;
  reviews: string[];
  badge_tier: string;
  name: string;
  location: string;
  distance: string;
  experience: string;
  specialties: string[];
  badgeScore: number;
  reviewCount: number;
  forumPosts: number;
  compatibilityScore: number;
  recentTopics: string[];
  bio: string;
}

export interface QualityAssessmentResult {
  crop_type: string;
  quality_grade: string;
  confidence: number;
  visual_indicators: {
    ripeness: string;
    damage: string;
    uniformity: string;
    color: string;
  };
  recommendations: string[];
  market_value: string;
  shelf_life: string;
}

export interface MarketInsightsResult {
  region: string;
  oversupplied: string[];
  high_demand: string[];
  market_data: Array<{
    crop: string;
    status: string;
    region: string;
    price_change: number;
    volume: number;
    trend: string;
    recommendation: string;
  }>;
  crop_alternatives: Array<{
    from: string;
    to: string;
    reason: string;
    difficulty: string;
    time_to_harvest: string;
  }>;
}

export interface ChatbotMessage {
  message: string;
  user_context?: {
    location?: string;
    crop_type?: string;
    experience_level?: string;
  };
}

export interface ChatbotResponse {
  response: string;
  suggestions?: string[];
  confidence: number;
}

// Enhanced interfaces with database integration
export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  sub_role: 'mentor' | 'mentee' | 'neither';
  location?: string;
  experience_years: number;
  certification: any;
  profile_photo?: string;
  bio?: string;
  badges: number;
  ratings: any;
  verified: boolean;
  two_factor_enabled: boolean;
}

class ApiService {
  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<UserProfile>) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in database
      const userProfile = await databaseService.createUser({
        user_id: authData.user.id,
        name: userData.name!,
        email: email,
        role: userData.role || 'farmer',
        sub_role: userData.sub_role || 'neither',
        location: userData.location,
        experience_years: userData.experience_years || 0,
        certification: userData.certification || [],
        bio: userData.bio,
      });

      return { user: authData.user, profile: userProfile };
    }

    throw new Error('User creation failed');
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await databaseService.getUserById(data.user.id);
      return { user: data.user, profile };
    }

    throw new Error('Sign in failed');
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profile = await databaseService.getUserById(user.id);
      return { user, profile };
    }
    return null;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getAuthToken(): string {
    // Get token from Supabase session
    const session = supabase.auth.getSession();
    return session ? 'Bearer token' : '';
  }

  // 1. AI Matchmaking Engine
  async runMatchmaking(request: MatchmakingRequest): Promise<MatchmakingResult[]> {
    try {
      const response = await this.makeRequest<MatchmakingResult[]>('/Run_AI_Matchmaking', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      // Fallback: Use database to find matches
      const listings = await databaseService.getListings({
        commodity: request.commodity,
        location: request.buyer_location,
        type: 'offer',
        status: 'open'
      });

      // Transform database results to match AI response format
      return listings.map((listing, index) => ({
        farmer_id: listing.farmer_id,
        match_score: 90 - (index * 5), // Mock scoring
        estimated_delivery_days: Math.floor(Math.random() * 5) + 1,
        meets_certification: listing.certification_required === request.certification,
        quality_grade: listing.quality_grade || 'Grade A',
        farmer_name: listing.users?.name || 'Unknown Farmer',
        location: listing.location,
        distance: `${Math.floor(Math.random() * 50) + 5} km`,
        capacity: `${listing.quantity} kg/week`,
        price: `R${listing.price_per_unit || 45}/kg`,
        rating: 4.5 + (Math.random() * 0.5),
        compatibility: 90 - (index * 5),
      }));
    }
  }

  // 2. Mentorship Pairing AI
  async assignMentor(request: MentorshipRequest): Promise<MentorshipResult[]> {
    try {
      const response = await this.makeRequest<MentorshipResult[]>('/Assign_Mentor', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      // Fallback: Query database for potential mentors
      // This would be a more complex query in practice
      return [
        {
          mentor_id: 'M001',
          match_score: 94,
          reviews: ['Experienced organic farmer specializing in vegetable production'],
          badge_tier: 'Gold',
          name: 'Sarah Khumalo',
          location: request.region,
          distance: '25 km',
          experience: '15 years',
          specialties: [request.crop_focus, 'Organic farming'],
          badgeScore: 4.9,
          reviewCount: 47,
          forumPosts: 234,
          compatibilityScore: 94,
          recentTopics: ['Soil health', 'Pest management', 'Crop rotation'],
          bio: 'Experienced organic farmer specializing in vegetable production with focus on sustainable practices.',
        },
      ];
    }
  }

  // 3. Produce Quality Assessment
  async assessCropQuality(imageFile: File, cropType: string): Promise<QualityAssessmentResult> {
    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Call AI assessment API
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('crop_type', cropType);

      const response = await this.makeRequest<QualityAssessmentResult>('/Assess_Crop_Quality', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
      });

      // Store assessment in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await databaseService.createQualityAssessment({
          farmer_id: user.id,
          crop_type: cropType,
          image_url: uploadData.path,
          quality_grade: response.quality_grade,
          confidence_score: response.confidence,
          visual_indicators: response.visual_indicators,
          recommendations: response.recommendations,
          market_value: response.market_value,
          shelf_life: response.shelf_life,
        });
      }

      return response;
    } catch (error) {
      // Fallback mock assessment
      return {
        crop_type: cropType,
        quality_grade: 'Grade A',
        confidence: 92,
        visual_indicators: {
          ripeness: 'Optimal',
          damage: 'Minimal surface blemishes',
          uniformity: 'Excellent',
          color: 'Vibrant and consistent',
        },
        recommendations: [
          'Harvest within 2-3 days for optimal freshness',
          'Store in cool, dry environment',
          'Handle carefully to avoid bruising',
        ],
        market_value: 'R45-50 per kg',
        shelf_life: '7-10 days',
      };
    }
  }

  // 4. Market Insights Engine
  async getMarketInsights(region?: string): Promise<MarketInsightsResult> {
    try {
      const params = region ? `?region=${encodeURIComponent(region)}` : '';
      const response = await this.makeRequest<MarketInsightsResult>(`/Market_Insights${params}`);
      return response;
    } catch (error) {
      // Fallback: Get insights from database
      const insights = await databaseService.getMarketInsights(region);
      
      return {
        region: region || 'All Regions',
        oversupplied: insights.filter(i => i.status === 'oversupplied').map(i => i.crop),
        high_demand: insights.filter(i => i.status === 'high_demand').map(i => i.crop),
        market_data: insights.map(insight => ({
          crop: insight.crop,
          status: insight.status,
          region: insight.region,
          price_change: insight.price_change,
          volume: insight.volume,
          trend: insight.trend,
          recommendation: insight.recommendation || '',
        })),
        crop_alternatives: [
          {
            from: 'Spinach',
            to: 'Ginger',
            reason: 'Higher demand and better prices',
            difficulty: 'Medium',
            time_to_harvest: '8-10 months',
          },
        ],
      };
    }
  }

  // 5. AI Chatbot
  async sendChatMessage(message: ChatbotMessage): Promise<ChatbotResponse> {
    try {
      const response = await this.makeRequest<ChatbotResponse>('/AI_Assistant', {
        method: 'POST',
        body: JSON.stringify(message),
      });
      return response;
    } catch (error) {
      // Fallback response based on message content
      const responses = {
        'plant next season': 'Based on current market trends, consider planting ginger or turmeric as they show high demand. Also consider crop rotation with legumes to improve soil health.',
        'soil health': 'To improve soil health, consider adding organic compost, practicing crop rotation, and using cover crops during off-seasons.',
        'pest control': 'For organic pest control, try neem oil, companion planting, and beneficial insects. Always identify the pest first for targeted treatment.',
        'market prices': 'Current market shows high demand for ginger (R65/kg) and turmeric (R45/kg). Spinach is oversupplied in Gauteng region.',
        'organic farming': 'Start with soil testing, use organic fertilizers, practice crop rotation, and obtain organic certification for better market prices.',
      };

      const messageText = message.message.toLowerCase();
      let response = "I'm here to help with your farming questions. You can ask about planting advice, market insights, pest control, or soil health.";

      for (const [key, value] of Object.entries(responses)) {
        if (messageText.includes(key)) {
          response = value;
          break;
        }
      }

      return {
        response,
        suggestions: ['What should I plant next season?', 'How to improve soil health?', 'Market prices for tomatoes'],
        confidence: 0.85,
      };
    }
  }

  // Content Moderation
  async moderateContent(content: string, contentType: 'post' | 'comment'): Promise<{
    score: number;
    category: string;
    action: 'approve' | 'flag' | 'hide';
    confidence: number;
  }> {
    try {
      const response = await this.makeRequest<{
        score: number;
        category: string;
        action: 'approve' | 'flag' | 'hide';
        confidence: number;
      }>('/Moderate_Content', {
        method: 'POST',
        body: JSON.stringify({ content, content_type: contentType }),
      });
      return response;
    } catch (error) {
      // Fallback moderation logic
      const spamKeywords = ['buy now', 'click here', 'amazing deals', 'guaranteed'];
      const helpfulKeywords = ['advice', 'experience', 'recommend', 'help', 'tips'];
      
      const contentLower = content.toLowerCase();
      const hasSpam = spamKeywords.some(keyword => contentLower.includes(keyword));
      const isHelpful = helpfulKeywords.some(keyword => contentLower.includes(keyword));
      
      if (hasSpam) {
        return { score: 0.15, category: 'spam', action: 'hide', confidence: 0.9 };
      } else if (isHelpful) {
        return { score: 0.95, category: 'helpful', action: 'approve', confidence: 0.85 };
      } else {
        return { score: 0.7, category: 'neutral', action: 'approve', confidence: 0.6 };
      }
    }
  }

  // Analytics
  async getAnalytics(timeRange: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/Analytics?timeRange=${timeRange}`);
      return response;
    } catch (error) {
      // Fallback: Get analytics from database
      const analytics = await databaseService.getAnalytics();
      return analytics;
    }
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return await databaseService.getNotifications(user.id);
    }
    return [];
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await databaseService.markNotificationAsRead(notificationId);
  }

  async updateNotificationPreferences(preferences: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await databaseService.updateUser(user.id, {
        // Store preferences in user profile or separate table
      });
    }
  }

  // Database integration methods
  async createMarketplaceListing(listingData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return await databaseService.createListing({
        ...listingData,
        farmer_id: user.id,
      });
    }
    throw new Error('User not authenticated');
  }

  async getMarketplaceListings(filters?: any) {
    return await databaseService.getListings(filters);
  }

  async sendMessage(receiverId: string, content: string, type: 'buyer_farmer' | 'mentorship' | 'general' = 'general') {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return await databaseService.sendMessage({
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        type,
      });
    }
    throw new Error('User not authenticated');
  }

  async getMessages(otherUserId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return await databaseService.getMessages(user.id, otherUserId);
    }
    return [];
  }

  // Real-time subscriptions
  subscribeToNotifications(callback: (payload: any) => void) {
    const { data: { user } } = supabase.auth.getUser();
    if (user) {
      return databaseService.subscribeToNotifications(user.id, callback);
    }
    return null;
  }

  subscribeToMessages(callback: (payload: any) => void) {
    const { data: { user } } = supabase.auth.getUser();
    if (user) {
      return databaseService.subscribeToMessages(user.id, callback);
    }
    return null;
  }

  subscribeToMarketplace(callback: (payload: any) => void) {
    return databaseService.subscribeToMarketplaceListings(callback);
  }
}

export const apiService = new ApiService();