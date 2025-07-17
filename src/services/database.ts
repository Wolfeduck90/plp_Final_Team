import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

export class DatabaseService {
  // User management
  async createUser(userData: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, updates: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Marketplace listings
  async createListing(listingData: Tables['marketplace_listings']['Insert']) {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert(listingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getListings(filters?: {
    commodity?: string;
    location?: string;
    type?: 'offer' | 'request';
    status?: 'open' | 'matched' | 'closed';
  }) {
    let query = supabase
      .from('marketplace_listings')
      .select(`
        *,
        users:farmer_id (
          name,
          location,
          ratings,
          badges
        )
      `);

    if (filters?.commodity) {
      query = query.ilike('commodity', `%${filters.commodity}%`);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Mentorship connections
  async createMentorshipRequest(connectionData: Tables['mentorship_connections']['Insert']) {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .insert(connectionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getMentorshipConnections(userId: string) {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .select(`
        *,
        mentor:mentor_id (
          name,
          location,
          experience_years,
          ratings,
          badges
        ),
        mentee:mentee_id (
          name,
          location,
          experience_years
        )
      `)
      .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`);
    
    if (error) throw error;
    return data;
  }

  async updateMentorshipStatus(
    connectionId: string, 
    status: 'pending' | 'accepted' | 'declined' | 'completed'
  ) {
    const { data, error } = await supabase
      .from('mentorship_connections')
      .update({ status })
      .eq('connection_id', connectionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Messages
  async sendMessage(messageData: Tables['messages']['Insert']) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getMessages(userId: string, otherUserId?: string) {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (name, profile_photo),
        receiver:receiver_id (name, profile_photo)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (otherUserId) {
      query = query.or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async markMessageAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_status: true })
      .eq('message_id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Notifications
  async createNotification(notificationData: Tables['notifications']['Insert']) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('notification_id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Forum posts
  async createForumPost(postData: Tables['forum_posts']['Insert']) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getForumPosts(category?: string) {
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        author:author_id (
          name,
          profile_photo,
          badges
        )
      `)
      .eq('moderation_status', 'approved');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Quality assessments
  async createQualityAssessment(assessmentData: Tables['crop_quality_assessments']['Insert']) {
    const { data, error } = await supabase
      .from('crop_quality_assessments')
      .insert(assessmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getQualityAssessments(farmerId: string) {
    const { data, error } = await supabase
      .from('crop_quality_assessments')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Market insights
  async getMarketInsights(region?: string) {
    let query = supabase
      .from('market_insights')
      .select('*');

    if (region) {
      query = query.eq('region', region);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createMarketInsight(insightData: Tables['market_insights']['Insert']) {
    const { data, error } = await supabase
      .from('market_insights')
      .insert(insightData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics
  async getAnalytics(metricName?: string) {
    let query = supabase
      .from('platform_analytics')
      .select('*');

    if (metricName) {
      query = query.eq('metric_name', metricName);
    }

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createAnalyticsEntry(analyticsData: Tables['platform_analytics']['Insert']) {
    const { data, error } = await supabase
      .from('platform_analytics')
      .insert(analyticsData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  subscribeToMessages(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  subscribeToMarketplaceListings(callback: (payload: any) => void) {
    return supabase
      .channel('marketplace')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_listings',
        },
        callback
      )
      .subscribe();
  }
}

export const databaseService = new DatabaseService();