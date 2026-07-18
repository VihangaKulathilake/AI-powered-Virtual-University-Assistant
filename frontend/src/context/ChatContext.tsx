import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { type ChatSession, type Message, type UploadedDocument } from '../types';

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Message[];
  loading: boolean;
  typing: boolean;
  documents: UploadedDocument[];
  setActiveSessionId: (id: string | null) => void;
  createNewSession: (title?: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deleteSession: (id: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  // Initialize with some starter data if needed (just client-side stubs)
  useEffect(() => {
    const defaultSessionId = 'session-1';
    setSessions([
      {
        id: defaultSessionId,
        title: 'Introduction to Calculus I',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messagesCount: 2,
      },
      {
        id: 'session-2',
        title: 'Database Normalization Help',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        messagesCount: 4,
      }
    ]);
    setActiveSessionId(defaultSessionId);

    setMessages([
      {
        id: 'msg-1',
        sender: 'assistant',
        content: 'Hello! I am your AI University Assistant. How can I help you with your coursework today?',
        timestamp: new Date(Date.now() - 10000).toISOString(),
      }
    ]);

    setDocuments([
      {
        id: 'doc-1',
        name: 'Calculus_Syllabus.pdf',
        size: 245000,
        type: 'application/pdf',
        status: 'completed',
        uploadedAt: new Date().toISOString(),
      }
    ]);
  }, []);

  const createNewSession = async (title = 'New Conversation') => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messagesCount: 0,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: `Started a new chat: "${title}". Ask me any questions about it!`,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeSessionId) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    // Simulate bot response after a brief delay
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: `I received your query about "${content}". This is a starter response because the AI pipeline is not yet linked. Ready to connect backend model.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTyping(false);
    }, 1500);
  };

  const uploadFile = async (file: File) => {
    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Simulate upload progress and success
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 20;
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id
            ? { ...doc, progress: progressVal, status: progressVal >= 100 ? 'completed' : 'uploading' }
            : doc
        )
      );
      if (progressVal >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setMessages([]);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
