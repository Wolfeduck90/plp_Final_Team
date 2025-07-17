// Authentication utilities and context
import { createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer' | 'mentor' | 'mentee' | 'admin';
  location?: string;
  cropTypes?: string[];
  experienceLevel?: string;
  certifications?: string[];
  verified: boolean;
  twoFactorEnabled: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code URL
  verifyTwoFactor: (code: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based access control
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;

  const permissions: Record<string, string[]> = {
    farmer: ['marketplace', 'forum', 'mentorship', 'quality_assessment', 'chatbot'],
    buyer: ['marketplace', 'messaging', 'profile'],
    mentor: ['marketplace', 'forum', 'mentorship', 'quality_assessment', 'chatbot', 'mentor_dashboard'],
    mentee: ['marketplace', 'forum', 'mentorship', 'quality_assessment', 'chatbot'],
    admin: ['*'], // All permissions
  };

  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
};

// Security utilities
export const maskLocation = (location: string): string => {
  // Mask exact location for privacy
  const parts = location.split(',');
  if (parts.length > 1) {
    return `${parts[0]}, ${parts[1].trim().split(' ')[0]}...`;
  }
  return location.split(' ')[0] + '...';
};

export const validateImageUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
};

// Encryption utilities for sensitive data
export const encryptSensitiveData = (data: string): string => {
  // In production, use proper encryption
  return btoa(data);
};

export const decryptSensitiveData = (encryptedData: string): string => {
  // In production, use proper decryption
  return atob(encryptedData);
};