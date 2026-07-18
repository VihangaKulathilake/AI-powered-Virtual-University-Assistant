import api from './api';
import { type ChatSession, type Message, type UploadedDocument, type DashboardStats } from '../types';

/**
 * Unified response payload format returned by Express rest endpoints
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const chatService = {
  /**
   * Fetch all active chat sessions from MongoDB
   */
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get<ApiResponse<ChatSession[]>>('/chats');
    return response.data.data;
  },

  /**
   * Initialize a new chat session in database
   */
  async createSession(title: string): Promise<ChatSession> {
    const response = await api.post<ApiResponse<ChatSession>>('/chats', { title });
    return response.data.data;
  },

  /**
   * Fetch message history logs inside a specific session
   */
  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get<ApiResponse<Message[]>>(`/chats/${sessionId}/messages`);
    return response.data.data;
  },

  /**
   * Send a query: save user message, trigger auto assistant response stubs
   */
  async sendMessage(sessionId: string, content: string, image?: { data: string; mimeType: string }): Promise<Message> {
    const response = await api.post<ApiResponse<Message>>(`/chats/${sessionId}/messages`, { content, image });
    return response.data.data;
  },

  /**
   * Delete a chat session and cascade messages
   */
  async deleteSession(sessionId: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/chats/${sessionId}`);
  },

  /**
   * Fetch list of all uploaded resources in vector catalog
   */
  async getDocuments(): Promise<UploadedDocument[]> {
    const response = await api.get<ApiResponse<UploadedDocument[]>>('/knowledge');
    return response.data.data;
  },

  /**
   * Upload coursework file to disk storage and save metadata
   */
  async uploadDocument(formData: FormData): Promise<UploadedDocument> {
    const response = await api.post<ApiResponse<UploadedDocument>>('/knowledge/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Delete file metadata from MongoDB and delete local physical file from disk
   */
  async deleteDocument(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/knowledge/${id}`);
  },

  /**
   * Fetch dashboard metrics overview
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Generate dashboard statistics dynamically from loaded items
    const sessions = await this.getSessions();
    const documents = await this.getDocuments();

    // Map stats stubs matching dashboard card schemas
    return {
      totalChats: sessions.length,
      totalDocuments: documents.length,
      conversationsToday: sessions.length > 0 ? 1 : 0,
      documentsProcessed: documents.filter(d => d.status === 'completed').length
    };
  }
};
