import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { type ChatSession, type Message, type UploadedDocument } from '../types';
import { chatService } from '../services/chatService';

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Message[];
  loading: boolean;
  typing: boolean;
  documents: UploadedDocument[];
  setActiveSessionId: (id: string | null) => void;
  createNewSession: (title?: string) => Promise<void>;
  sendMessage: (content: string, image?: { data: string; mimeType: string }) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deleteSession: (id: string) => void;
  deleteDocument: (id: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  // Fetch all chat sessions and document catalogs from database on boot
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const loadedSessions = await chatService.getSessions();
        const loadedDocs = await chatService.getDocuments();
        
        setSessions(loadedSessions);
        setDocuments(loadedDocs);

        if (loadedSessions.length > 0) {
          setActiveSessionId(loadedSessions[0].id || loadedSessions[0]._id || null); // Fallback standard mongo id keys
        }
      } catch (err) {
        console.error('Failed to retrieve initial MERN workspace logs:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Retrieve message history whenever the active chat session changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeSessionId) {
        setMessages([]);
        return;
      }
      
      setLoading(true);
      try {
        const threadMessages = await chatService.getMessages(activeSessionId);
        setMessages(threadMessages);
      } catch (err) {
        console.error(`Failed to retrieve messages for session ${activeSessionId}:`, err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [activeSessionId]);

  const createNewSession = async (title = 'New Conversation') => {
    try {
      setLoading(true);
      const newSession = await chatService.createSession(title);
      
      // Update session histories
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id || (newSession as any)._id);
    } catch (err) {
      console.error('Failed to create new session in MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, image?: { data: string; mimeType: string }) => {
    if (!content.trim() && !image) return;

    let sessionId = activeSessionId;
    setTyping(true);

    try {
      // If no active session exists (database empty), initialize one first
      if (!sessionId) {
        const title = content.length > 30 ? `${content.substring(0, 30)}...` : content || 'Visual Query';
        const newSession = await chatService.createSession(title);
        sessionId = newSession.id || (newSession as any)._id || null;
        
        if (!sessionId) {
          throw new Error('Failed to create a valid chat session ID');
        }

        // Update sessions lists and set active ID
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(sessionId);
      }

      // 1. Post user message to REST API (including visual image if present)
      const userMsg = await chatService.sendMessage(sessionId, content, image);
      
      // 2. Append user message locally for instant UI updates
      setMessages((prev) => [...prev, userMsg]);

      // 3. Force message reload from database to retrieve the auto-generated assistant response
      // Brief delay to allow database processing
      setTimeout(async () => {
        try {
          const updatedMessages = await chatService.getMessages(sessionId!);
          setMessages(updatedMessages);
        } catch (err) {
          console.error('Failed to refresh messages after user post:', err);
        } finally {
          setTyping(false);
        }
      }, 1200);
      
    } catch (err) {
      console.error('Failed to send query to REST backend:', err);
      setTyping(false);
      throw err;
    }
  };

  const uploadFile = async (file: File) => {
    // Create local uploading indicator stub
    const uploadId = `upload-${Date.now()}`;
    const localUploadDoc: UploadedDocument = {
      id: uploadId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 20,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [localUploadDoc, ...prev]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Execute upload to Multer server
      const newFile = await chatService.uploadDocument(formData);

      // Replace loading stub with completed DB metadata
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === uploadId ? newFile : doc))
      );
    } catch (err) {
      console.error('Failed to upload coursework document:', err);
      // Mark loading stub as failed
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === uploadId ? { ...doc, status: 'failed', progress: undefined } : doc
        )
      );
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await chatService.deleteSession(id);
      
      setSessions((prev) => prev.filter((s) => (s.id || (s as any)._id) !== id));
      if (activeSessionId === id) {
        const remaining = sessions.filter((s) => (s.id || (s as any)._id) !== id);
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id || (remaining[0] as any)._id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(`Failed to remove session ${id} from database:`, err);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await chatService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => (d.id || (d as any)._id) !== id));
    } catch (err) {
      console.error(`Failed to remove knowledge resource ${id}:`, err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        messages,
        loading,
        typing,
        documents,
        setActiveSessionId,
        createNewSession,
        sendMessage,
        uploadFile,
        deleteSession,
        deleteDocument,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
