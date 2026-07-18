export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'assistant';
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  progress?: number;
}

export interface DashboardStats {
  totalChats: number;
  totalDocuments: number;
  conversationsToday: number;
  documentsProcessed: number;
}
