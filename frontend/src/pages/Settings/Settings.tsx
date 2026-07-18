import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Database, Info, Laptop } from 'lucide-react';

export const Settings: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme_preference') || 'slate');
  const [chunkSize, setChunkSize] = useState(500);
  const [temperature, setTemperature] = useState(0.3);
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [streamResponses, setStreamResponses] = useState(true);

  // Apply theme settings on load and change
  useEffect(() => {
    // Clear other theme classes
    document.body.classList.remove('theme-slate', 'theme-blue', 'theme-emerald');
    
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme_preference', theme);
  }, [theme]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings stored locally! Configuration stubs are ready for AI pipeline binding.');
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl">
      {/* Header Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1 font-outfit">System & Interface Configurations</h2>
        <p className="text-sm text-slate-400">Configure assistant behavior, aesthetic styles, knowledge base parameters, and system variables.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Model Preferences & Vector Parameters */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Model Preferences */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 m-0">AI Model Provider (Disabled)</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="provider" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Provider (Mocked)
                </label>
                <select
                  id="provider"
                  disabled
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed outline-none"
                >
                  <option value="gemini">Google Gemini 2.0 (Active default)</option>
                  <option value="openai">OpenAI GPT-4o</option>
                  <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="temperature" className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Temperature (Creativity)</span>
                  <span className="text-indigo-400 font-mono font-bold">{temperature}</span>
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-950 border border-slate-850 rounded-lg outline-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-semibold select-none leading-normal">
                  Lower values make answers focused and deterministic. Higher values encourage variety.
                </span>
              </div>
            </CardBody>
          </Card>

          {/* RAG Vector Configurations */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 m-0">RAG Chunk Configurations</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="chunk-size" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Target Chunk Size (tokens)
                  </label>
                  <input
                    id="chunk-size"
                    type="number"
                    min="100"
                    max="2000"
                    step="100"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3.5 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="overlap-size" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Chunk Overlap (tokens)
                  </label>
                  <input
                    id="overlap-size"
                    type="number"
                    disabled
                    value={50}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-500 rounded-lg px-3.5 py-2 text-xs outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-850">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="semantic" className="text-xs font-bold text-slate-350">
                      Semantic Dense Vector Search
                    </label>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Feed document embeddings context dynamically during chat query lookups.
                    </p>
                  </div>
                  <input
                    id="semantic"
                    type="checkbox"
                    checked={semanticSearch}
                    onChange={(e) => setSemanticSearch(e.target.checked)}
                    className="w-4 h-4 accent-indigo-650 cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <div className="space-y-0.5">
                    <label htmlFor="stream" className="text-xs font-bold text-slate-350">
                      Stream LLM Tokens
                    </label>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Receive responses character by character in real-time.
                    </p>
                  </div>
                  <input
                    id="stream"
                    type="checkbox"
                    checked={streamResponses}
                    onChange={(e) => setStreamResponses(e.target.checked)}
                    className="w-4 h-4 accent-indigo-650 cursor-pointer rounded"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Theme Selector & System Details */}
        <div className="space-y-6">
          {/* Theme & Appearance Selector */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 m-0">Theme & Appearance</h3>
            </CardHeader>
            <CardBody className="space-y-5">
              
              {/* Dynamic Theme Radio Options */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block select-none">
                  Aesthetic Theme Color
                </span>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'slate', name: 'Slate Dark', color: 'bg-slate-700 border-slate-600', text: 'Default' },
                    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-600 border-blue-500', text: 'Classic Blue' },
                    { id: 'emerald', name: 'Emerald Green', color: 'bg-emerald-600 border-emerald-500', text: 'Eco Slate' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                        theme === opt.id 
                          ? 'bg-indigo-600/10 border-indigo-500 text-slate-100 shadow-sm' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full border ${opt.color} flex-shrink-0`} />
                        <span className="text-xs font-bold">{opt.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{opt.text}</span>
                        <input
                          type="radio"
                          name="theme-choice"
                          value={opt.id}
                          checked={theme === opt.id}
                          onChange={() => setTheme(opt.id)}
                          className="w-3.5 h-3.5 accent-indigo-650 cursor-pointer"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* System About Details */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100 m-0">About System</h3>
            </CardHeader>
            <CardBody className="space-y-4 text-xs select-none">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500 font-medium">Software Version</span>
                <span className="text-slate-300 font-semibold font-mono">v1.0.0-Beta</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500 font-medium">Build Environment</span>
                <span className="text-slate-300 font-semibold font-mono">React-Vite v8</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500 font-medium">Target Stack</span>
                <span className="text-slate-350 font-semibold">MERN (TypeScript)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Developer Mode</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase">
                  Boilerplate Active
                </span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Form Save Button Actions */}
        <div className="md:col-span-3 flex justify-end">
          <Button type="submit" className="h-10 px-5 text-sm bg-indigo-600 hover:bg-indigo-500">
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
