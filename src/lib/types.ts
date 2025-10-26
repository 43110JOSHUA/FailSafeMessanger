export interface User {
  id: string; // Google user ID
  email: string;
  name?: string;
  picture?: string; // Google profile picture
  subscriptionTier: 'free' | 'paid';
  stripeCustomerId?: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  recipientEmail: string;
  messageContent: string;
  deadmanDuration: number; // in days
  status: 'active' | 'paused' | 'sent' | 'cancelled';
  lastActivity: Date;
  scheduledSendDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageFormData {
  recipientEmail: string;
  messageContent: string;
  deadmanDuration: number;
}