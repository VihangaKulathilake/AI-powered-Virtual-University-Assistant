import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Cpu, 
  Zap, 
  Search, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';

export const Home: React.FC = () => {
  const features = [
    {
      title: 'Context-Aware RAG Assistant',
      description: 'Upload course slides, syllabus PDFs, or text notes. The assistant parses and indexes content to answer queries with precise local references.',
      icon: Search,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Mathematics & Code Helper',
      description: 'Struggle with coding assignments or calculus? Enjoy structured markdown support with copying buttons, formatted code blocks, and lists.',
      icon: Cpu,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Academic Analytics Dashboard',
      description: 'Monitor your vector space capacity, total saved chat sessions, generated responses count, and resource allocations in real-time.',
      icon: BrainCircuit,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Secure & Customizable Context',
      description: 'Tune temperature, chunk sizes, and providers in the settings. Your academic materials remain indexed securely inside local mock vector stores.',
      icon: ShieldCheck,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
  ];

  return (
    <div className="space-y-16 py-6 overflow-hidden">
      
      {/* 1. SaaS Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto py-10 px-4 space-y-6">
        {/* Glow elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 uppercase tracking-widest select-none glow-glow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent University Companion</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight tracking-tight m-0 select-none font-outfit">
          Your AI-Powered <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">Academic Assistant</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Upload lecture files, syllabus details, or notes to construct a personalized knowledge base. Ask questions, analyze complex concepts, and generate studies stubs instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 select-none">
          <Link to="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-indigo-650 hover:bg-indigo-550 shadow-md">
              <span>Start Chatting</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/upload" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-slate-800 text-slate-300 hover:bg-slate-900">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Explore Knowledge Base</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Project Introduction */}
      <section className="p-8 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-4 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-100 m-0 select-none">Modern Academic Assistance</h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
            Built using modern full-stack technologies, the **AI University Assistant** bridges the gap between massive course resources and quick academic feedback. Retrieve specific slides, solve math formulas, write code snippets, and review analytics in one central app workspace.
          </p>
          <div className="pt-2 select-none">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-800 text-slate-400 hover:bg-slate-850">
                <span>View Live Dashboard Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Badge Icon */}
        <div className="flex-shrink-0 w-36 h-36 bg-slate-950 border border-slate-850 rounded-full flex items-center justify-center text-indigo-400 shadow-inner select-none">
          <GraduationCap className="w-16 h-16 text-indigo-500 glow-glow" />
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="space-y-6 max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-100 m-0 select-none font-outfit">Built for High Performance</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">Everything you need to accelerate your learning in a single SaaS application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="bg-slate-900/50 border-slate-850 hover:border-slate-800 transition-all duration-300">
                <CardBody className="flex gap-4 p-6">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-200">{feat.title}</h3>
                    <p className="text-xs text-slate-450 leading-relaxed">{feat.description}</p>
                  </div>
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
