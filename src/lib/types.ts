export interface User {
  id: string; // Google user ID
  email: string;
  name?: string;
  subscription_tier: 'free' | 'paid';
  stripe_customer_id?: string;
}

export interface Message {
  id: string;
  user_id: string;
  recipient_email: string;
  message_content: string;
  deadman_duration: number; // in days
  status: 'active' | 'paused' | 'sent';
  last_activity: Date
  created_at: Date;
}

export interface MessageFormData {
  recipient_email: string;
  message_content: string;
  deadman_duration: number;
}