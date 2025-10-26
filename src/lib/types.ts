export interface Message {
  id: string;
  recipientEmail: string;
  content: string;
  deadmanDuration: number;
  createdAt: Date;
}