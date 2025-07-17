import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          name: string;
          email: string;
          role: 'farmer' | 'buyer' | 'admin';
          sub_role: 'mentor' | 'mentee' | 'neither';
          location: string | null;
          experience_years: number;
          certification: any;
          profile_photo: string | null;
          bio: string | null;
          badges: number;
          ratings: any;
          two_factor_enabled: boolean;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          name: string;
          email: string;
          role?: 'farmer' | 'buyer' | 'admin';
          sub_role?: 'mentor' | 'mentee' | 'neither';
          location?: string | null;
          experience_years?: number;
          certification?: any;
          profile_photo?: string | null;
          bio?: string | null;
          badges?: number;
          ratings?: any;
          two_factor_enabled?: boolean;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          email?: string;
          role?: 'farmer' | 'buyer' | 'admin';
          sub_role?: 'mentor' | 'mentee' | 'neither';
          location?: string | null;
          experience_years?: number;
          certification?: any;
          profile_photo?: string | null;
          bio?: string | null;
          badges?: number;
          ratings?: any;
          two_factor_enabled?: boolean;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      marketplace_listings: {
        Row: {
          listing_id: string;
          farmer_id: string;
          commodity: string;
          quantity: number;
          certification_required: string | null;
          type: 'offer' | 'request';
          location: string;
          quality_grade: string | null;
          price_per_unit: number | null;
          expected_delivery: string | null;
          status: 'open' | 'matched' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          listing_id?: string;
          farmer_id: string;
          commodity: string;
          quantity: number;
          certification_required?: string | null;
          type?: 'offer' | 'request';
          location: string;
          quality_grade?: string | null;
          price_per_unit?: number | null;
          expected_delivery?: string | null;
          status?: 'open' | 'matched' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          listing_id?: string;
          farmer_id?: string;
          commodity?: string;
          quantity?: number;
          certification_required?: string | null;
          type?: 'offer' | 'request';
          location?: string;
          quality_grade?: string | null;
          price_per_unit?: number | null;
          expected_delivery?: string | null;
          status?: 'open' | 'matched' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
      mentorship_connections: {
        Row: {
          connection_id: string;
          mentor_id: string;
          mentee_id: string;
          status: 'pending' | 'accepted' | 'declined' | 'completed';
          reviews: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          connection_id?: string;
          mentor_id: string;
          mentee_id: string;
          status?: 'pending' | 'accepted' | 'declined' | 'completed';
          reviews?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          connection_id?: string;
          mentor_id?: string;
          mentee_id?: string;
          status?: 'pending' | 'accepted' | 'declined' | 'completed';
          reviews?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          message_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          type: 'buyer_farmer' | 'mentorship' | 'general';
          read_status: boolean;
          created_at: string;
        };
        Insert: {
          message_id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          type?: 'buyer_farmer' | 'mentorship' | 'general';
          read_status?: boolean;
          created_at?: string;
        };
        Update: {
          message_id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          type?: 'buyer_farmer' | 'mentorship' | 'general';
          read_status?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          notification_id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read_status: boolean;
          priority: 'low' | 'medium' | 'high';
          metadata: any;
          created_at: string;
        };
        Insert: {
          notification_id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read_status?: boolean;
          priority?: 'low' | 'medium' | 'high';
          metadata?: any;
          created_at?: string;
        };
        Update: {
          notification_id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read_status?: boolean;
          priority?: 'low' | 'medium' | 'high';
          metadata?: any;
          created_at?: string;
        };
      };
      forum_posts: {
        Row: {
          post_id: string;
          author_id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          upvotes: number;
          downvotes: number;
          moderation_score: number;
          moderation_status: 'pending' | 'approved' | 'hidden' | 'flagged' | 'promoted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          post_id?: string;
          author_id: string;
          title: string;
          content: string;
          category?: string;
          tags?: string[];
          upvotes?: number;
          downvotes?: number;
          moderation_score?: number;
          moderation_status?: 'pending' | 'approved' | 'hidden' | 'flagged' | 'promoted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          post_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          upvotes?: number;
          downvotes?: number;
          moderation_score?: number;
          moderation_status?: 'pending' | 'approved' | 'hidden' | 'flagged' | 'promoted';
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_quality_assessments: {
        Row: {
          assessment_id: string;
          farmer_id: string;
          crop_type: string;
          image_url: string;
          quality_grade: string;
          confidence_score: number;
          visual_indicators: any;
          recommendations: string[];
          market_value: string | null;
          shelf_life: string | null;
          created_at: string;
        };
        Insert: {
          assessment_id?: string;
          farmer_id: string;
          crop_type: string;
          image_url: string;
          quality_grade: string;
          confidence_score: number;
          visual_indicators?: any;
          recommendations?: string[];
          market_value?: string | null;
          shelf_life?: string | null;
          created_at?: string;
        };
        Update: {
          assessment_id?: string;
          farmer_id?: string;
          crop_type?: string;
          image_url?: string;
          quality_grade?: string;
          confidence_score?: number;
          visual_indicators?: any;
          recommendations?: string[];
          market_value?: string | null;
          shelf_life?: string | null;
          created_at?: string;
        };
      };
      market_insights: {
        Row: {
          insight_id: string;
          region: string;
          crop: string;
          status: 'oversupplied' | 'high_demand' | 'stable' | 'growing_demand';
          price_change: number;
          volume: number;
          trend: 'up' | 'down' | 'stable';
          recommendation: string | null;
          created_at: string;
        };
        Insert: {
          insight_id?: string;
          region: string;
          crop: string;
          status: 'oversupplied' | 'high_demand' | 'stable' | 'growing_demand';
          price_change?: number;
          volume?: number;
          trend?: 'up' | 'down' | 'stable';
          recommendation?: string | null;
          created_at?: string;
        };
        Update: {
          insight_id?: string;
          region?: string;
          crop?: string;
          status?: 'oversupplied' | 'high_demand' | 'stable' | 'growing_demand';
          price_change?: number;
          volume?: number;
          trend?: 'up' | 'down' | 'stable';
          recommendation?: string | null;
          created_at?: string;
        };
      };
      platform_analytics: {
        Row: {
          analytics_id: string;
          metric_name: string;
          metric_value: any;
          date: string;
          created_at: string;
        };
        Insert: {
          analytics_id?: string;
          metric_name: string;
          metric_value: any;
          date?: string;
          created_at?: string;
        };
        Update: {
          analytics_id?: string;
          metric_name?: string;
          metric_value?: any;
          date?: string;
          created_at?: string;
        };
      };
    };
  };
}