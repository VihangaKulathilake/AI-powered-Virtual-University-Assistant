export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'assistant';
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  _id?: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  _id?: string;
  sender?: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  createdAt?: string;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  _id?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messagesCount?: number;
}

export interface UploadedDocument {
  id: string;
  _id?: string;
  name?: string;
  originalName?: string;
  size?: number;
  fileSize?: number;
  type?: string;
  fileType?: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  uploadedAt?: string;
  uploadDate?: string;
  progress?: number;
}

export interface DashboardStats {
  totalChats: number;
  totalDocuments: number;
  conversationsToday: number;
  documentsProcessed: number;
}
