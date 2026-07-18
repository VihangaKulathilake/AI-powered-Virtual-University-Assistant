import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  const [model, setModel] = useState('gemini-2-pro');
  const [chunkSize, setChunkSize] = useState(500);
  const [temperature, setTemperature] = useState(0.3);
  const [semanticSearch, setSemanticSearch] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved locally! Stubs ready for system configurations integration.');
  };

  return (
    <div className="space-y-8 py-4 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">System Settings</h2>
        <p className="text-sm text-slate-400">Configure assistant behavior, knowledge base parameters, and general settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* LLM Configurations */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-slate-100 m-0">AI Model Preferences</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="model-select" className="text-sm font-semibold text-slate-350">
                Large Language Model
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
              >
                <option value="gemini-2-flash">Gemini 2.0 Flash (Recommended)</option>
                <option value="gemini-2-pro">Gemini 2.0 Pro</option>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="temp-slider" className="text-sm font-semibold text-slate-350 flex justify-between">
                <span>Temperature (Creativity)</span>
                <span className="text-violet-400 font-mono">{temperature}</span>
              </label>
              <input
                id="temp-slider"
                type="range"
                min="0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-950 border border-slate-850 rounded-lg outline-none cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Lower temperatures produce precise responses; higher temperatures allow creative answers.
              </span>
            </div>
          </CardBody>
        </Card>

        {/* RAG Parameters */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-slate-100 m-0">RAG & Vector Parameters</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="chunk-input" className="text-sm font-semibold text-slate-350">
                Text Chunk Size (tokens)
              </label>
              <input
                id="chunk-input"
                type="number"
                min="100"
                max="2000"
                step="100"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-850">
              <div className="space-y-0.5">
                <label htmlFor="semantic-toggle" className="text-sm font-semibold text-slate-250">
                  Semantic Hybrid Search
                </label>
                <p className="text-[10px] text-slate-500">
                  Enable vectors keyword matching together with dense vector search embeddings.
                </p>
              </div>
              <input
                id="semantic-toggle"
                type="checkbox"
                checked={semanticSearch}
                onChange={(e) => setSemanticSearch(e.target.checked)}
                className="w-4 h-4 accent-violet-650 cursor-pointer"
              />
            </div>
          </CardBody>
        </Card>

        {/* Submit action */}
        <div className="flex justify-end gap-3.5">
          <Button type="submit" className="h-10 px-5 text-sm">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
