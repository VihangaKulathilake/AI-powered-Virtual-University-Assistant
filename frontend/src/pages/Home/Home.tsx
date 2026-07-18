import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, FileText, ArrowRight, BrainCircuit, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';

export const Home: React.FC = () => {
  const quickActions = [
    {
      title: 'Consult AI Assistant',
      description: 'Ask any questions about lecture notes, code stubs, assignment requirements or study schedules.',
      icon: MessageSquare,
      to: '/chat',
      color: 'text-violet-400 bg-violet-650/10 border-violet-500/20',
      actionText: 'Start Chatting',
    },
    {
      title: 'Upload Course Documents',
      description: 'Drag in PDFs, slides, or syllabus docs to feed your personal assistant with specific knowledge.',
      icon: FileText,
      to: '/chat',
      color: 'text-sky-400 bg-sky-650/10 border-sky-500/20',
      actionText: 'Index Files',
    },
    {
      title: 'Academic Analytics',
      description: 'Review your total study sessions, loaded knowledge metrics, and assistant metrics overview.',
      icon: LayoutDashboard,
      to: '/dashboard',
      color: 'text-emerald-400 bg-emerald-650/10 border-emerald-500/20',
      actionText: 'Open Dashboard',
    },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-xs text-violet-300 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            University Assistant Active
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight m-0 select-none font-outfit">
            Welcome back, <span className="text-violet-400">John Doe</span>!
          </h1>
          
          <p className="text-base text-slate-400 leading-relaxed max-w-xl">
            Get instant academic insights, search course materials, summarize files, and generate practice questions directly with your AI assistant.
          </p>

          <div className="pt-2">
            <Link to="/chat">
              <Button className="h-10 px-5 text-sm gap-2">
                <BrainCircuit className="w-4 h-4" />
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Decoration */}
        <div className="flex-shrink-0 w-40 h-40 hidden md:flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-violet-400 shadow-xl">
          <GraduationCap className="w-20 h-20 text-violet-500" />
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 select-none">Quick Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} hoverable className="border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <CardBody className="flex flex-col h-full justify-between gap-6 p-6">
                  <div className="space-y-3.5">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{action.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{action.description}</p>
                  </div>
                  
                  <Link to={action.to} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between group">
                      <span>{action.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
