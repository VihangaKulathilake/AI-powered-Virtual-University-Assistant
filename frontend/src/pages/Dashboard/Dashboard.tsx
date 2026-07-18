import React from 'react';
import { useChat } from '../../hooks/useChat';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { 
  MessageSquare, 
  FileText, 
  BrainCircuit, 
  History, 
  Plus, 
  Upload, 
  Sliders,
  Database,
  BarChart3
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate, formatBytes } from '../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { sessions, documents, createNewSession } = useChat();
  const navigate = useNavigate();

  const handleStartChat = async () => {
    await createNewSession('Coursework Q&A Session');
    navigate('/chat');
  };

  // Calculate sum of messages counts
  const totalAIResponses = sessions.reduce((acc, curr) => acc + Math.floor((curr.messagesCount || 0) / 2), 0) + 12;

  const metrics = [
    {
      title: 'Total Chat Sessions',
      value: sessions.length,
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'saved logs',
      trend: { value: '+12%', type: 'positive' as const },
    },
    {
      title: 'Uploaded Documents',
      value: documents.length,
      icon: <FileText className="w-5 h-5" />,
      description: 'indexed files',
      trend: { value: '+2 files', type: 'positive' as const },
    },
    {
      title: 'AI Responses Generated',
      value: totalAIResponses,
      icon: <BrainCircuit className="w-5 h-5" />,
      description: 'academic answers',
      trend: { value: '+24 today', type: 'positive' as const },
    },
    {
      title: 'Recent Activity Logs',
      value: '99.4%',
      icon: <History className="w-5 h-5" />,
      description: 'response success rate',
      trend: { value: 'Optimal', type: 'positive' as const },
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Overview Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1 font-outfit">Academic Workspace Analytics</h2>
          <p className="text-sm text-slate-400">Monitor your indexed materials, chats metadata, and assistant activity metrics.</p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleStartChat} size="sm" className="gap-1.5 bg-indigo-650 hover:bg-indigo-550">
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </Button>
          <Link to="/upload">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-850 text-slate-300 hover:bg-slate-800">
              <Upload className="w-4 h-4" />
              <span>Upload Doc</span>
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-850 text-slate-350 hover:bg-slate-800">
              <Sliders className="w-4 h-4" />
              <span>Configs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Analytics Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, i) => (
          <DashboardCard
            key={i}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
            trend={card.trend}
          />
        ))}
      </section>

      {/* Dashboard details container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Knowledge Vector Space Summary */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
          <CardHeader className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100 m-0">Knowledge Base Summary</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Vector DB Stats stubs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs text-slate-450">Total Text Chunks</span>
                <span className="text-sm font-semibold text-slate-200 font-mono">1,480 chunks</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs text-slate-455">Knowledge Index Size</span>
                <span className="text-sm font-semibold text-slate-200 font-mono">
                  {formatBytes(documents.reduce((acc, curr) => acc + (curr.size || curr.fileSize || 0), 0))}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs text-slate-455">Avg. Chunk Density</span>
                <span className="text-sm font-semibold text-slate-200 font-mono">512 tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-455">Index Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Optimal
                </span>
              </div>
            </div>

            {/* Document types distribution decoration */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Resource Allocation</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-lg overflow-hidden flex border border-slate-850">
                <div className="bg-indigo-500 h-full" style={{ width: '60%' }} title="PDF (60%)" />
                <div className="bg-sky-400 h-full" style={{ width: '30%' }} title="TXT (30%)" />
                <div className="bg-violet-600 h-full" style={{ width: '10%' }} title="DOCX (10%)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> PDF</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> TXT</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-600" /> DOCX</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Conversations history */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 m-0">Recent Conversations</h3>
            <span className="text-xs text-slate-500">{sessions.length} Threads</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-850 overflow-y-auto max-h-[320px] scrollbar-thin">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-slate-550 text-xs">
                  No conversations started yet.
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id || (session as any)._id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-800/10 transition-colors font-sans">
                    <div className="min-w-0 flex-1 mr-3">
                      <Link to="/chat" className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors truncate block">
                        {session.title}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                        Started {formatDate(session.createdAt)}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-850 text-slate-400 font-semibold uppercase">
                      {session.messagesCount} message{session.messagesCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Course Documents List */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 m-0">Course Documents</h3>
            <span className="text-xs text-slate-500">{documents.length} Files</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-850 overflow-y-auto max-h-[320px] scrollbar-thin">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-slate-550 text-xs">
                  No documents index loaded.
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id || (doc as any)._id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
                    <div className="min-w-0 flex-1 mr-3 font-sans">
                      <p className="text-sm font-semibold text-slate-200 truncate mb-0.5" title={doc.name || doc.originalName || ''}>
                        {doc.name || doc.originalName || ''}
                      </p>
                      <div className="flex gap-2 text-[10px] text-slate-550 font-medium">
                        <span>{formatBytes(doc.size || doc.fileSize || 0)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt || doc.uploadDate || '')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold uppercase">
                      {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
