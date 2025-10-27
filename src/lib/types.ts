export interface User {
  id: string; // Google user ID
  email: string;
  name?: string;
  subscriptionTier: 'free' | 'paid';
  stripeCustomerId?: string;
}

export interface Message {
  id: string;
  userId: string;
  recipientEmail: string;
  messageContent: string;
  deadmanDuration: number; // in days
  status: 'active' | 'paused' | 'sent';
  lastActivity: Date
  createdAt: Date;
}

export interface MessageFormData {
  recipientEmail: string;
  messageContent: string;
  deadmanDuration: number;
}