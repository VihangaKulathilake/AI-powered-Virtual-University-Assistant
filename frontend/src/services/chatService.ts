import api from './api';
import { type ChatSession, type Message, type UploadedDocument, type DashboardStats } from '../types';

export const chatService = {
  /**
   * Fetch all active chat sessions
   */
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get<ChatSession[]>('/chats/sessions');
    return response.data;
  },

  /**
   * Create a new chat session
   */
  async createSession(title: string): Promise<ChatSession> {
    const response = await api.post<ChatSession>('/chats/sessions', { title });
    return response.data;
  },

  /**
   * Fetch messages for a specific session
   */
  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/chats/sessions/${sessionId}/messages`);
    return response.data;
  },

  /**
   * Send a new message to the bot
   */
  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const response = await api.post<Message>(`/chats/sessions/${sessionId}/messages`, { content });
    return response.data;
  },

  /**
   * Upload a document to the server for RAG processing
   */
  async uploadDocument(formData: FormData): Promise<UploadedDocument> {
    const response = await api.post<UploadedDocument>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }
};
