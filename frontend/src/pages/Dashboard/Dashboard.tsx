import React from 'react';
import { useChat } from '../../hooks/useChat';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { MessageSquare, FileText, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { formatDate, formatBytes } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { sessions, documents } = useChat();

  const metrics = [
    {
      title: 'Total Active Chats',
      value: sessions.length,
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'saved sessions',
      trend: { value: '+12%', type: 'positive' as const },
    },
    {
      title: 'Indexed Documents',
      value: documents.length,
      icon: <FileText className="w-5 h-5" />,
      description: 'for AI context',
      trend: { value: '+2 files', type: 'positive' as const },
    },
    {
      title: 'Active Queries Today',
      value: 18,
      icon: <Calendar className="w-5 h-5" />,
      description: 'academic prompts',
      trend: { value: 'Stable', type: 'neutral' as const },
    },
    {
      title: 'File Success Rate',
      value: '100%',
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: 'parsed correctly',
      trend: { value: 'Perfect', type: 'positive' as const },
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">Academic Dashboard</h2>
        <p className="text-sm text-slate-400">Track and monitor your chat logs, indexed resource folders and general usages.</p>
      </div>

      {/* Grid of Metrics Cards */}
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

      {/* Details Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Base Documents Details */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 m-0">Indexed Knowledge Base</h3>
            <span className="text-xs text-slate-400">{documents.length} Files</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-800 overflow-y-auto max-h-[300px] scrollbar-thin">
              {documents.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No documents found.
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate mb-0.5">{doc.name}</p>
                      <div className="flex gap-2 text-xs text-slate-500">
                        <span>{formatBytes(doc.size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium capitalize">
                      {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Recent Conversations Details */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 m-0">Recent Conversations</h3>
            <Link to="/chat" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-0.5">
              <span>Go to Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-800 overflow-y-auto max-h-[300px] scrollbar-thin">
              {sessions.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No conversations started yet.
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate mb-0.5">{session.title}</p>
                      <span className="text-xs text-slate-500">
                        Started {formatDate(session.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {session.messagesCount} message{session.messagesCount !== 1 ? 's' : ''}
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
