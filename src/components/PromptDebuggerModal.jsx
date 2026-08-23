import React, { useState } from 'react';
import { Terminal, Key, Cpu, X, Check, Copy, Sparkles, RefreshCw } from 'lucide-react';
import { promptLogs } from '../services/aiService';

export default function PromptDebuggerModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(typeof window !== 'undefined' ? window.__MENTOR_PATH_API_KEY__ || '' : '');
  const [model, setModel] = useState(typeof window !== 'undefined' ? window.__MENTOR_PATH_MODEL__ || 'gpt-4o-mini' : 'gpt-4o-mini');
  const [endpoint, setEndpoint] = useState(typeof window !== 'undefined' ? window.__MENTOR_PATH_API_ENDPOINT__ || 'https://api.openai.com/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  if (!isOpen) return null;

  const handleSaveApi = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.__MENTOR_PATH_API_KEY__ = apiKey.trim();
      window.__MENTOR_PATH_MODEL__ = model.trim();
      window.__MENTOR_PATH_API_ENDPOINT__ = endpoint.trim();
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const selectedLog = promptLogs.find(l => l.id === selectedLogId) || promptLogs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e1e24] text-stone-200 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-700/60 overflow-hidden flex flex-col font-mono-code text-sm">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141418] border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 font-sans text-base">
                `generatePersonalizedContent` Prompt Inspector & API Configuration
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Inspect black-box LLM prompts, system prompts, or connect your real API Key.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: API Key Configuration */}
          <div className="md:col-span-5 border-r border-stone-800 p-5 bg-[#18181c] overflow-y-auto space-y-5 font-sans">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Key className="w-4 h-4" />
                <span>Live LLM Integration</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                By default, MentorPath uses an intelligent local mock generator. Enter your OpenAI or compatible API endpoint key below to call a real model.
              </p>
            </div>

            <form onSubmit={handleSaveApi} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Chat Completions Endpoint</label>
                <input 
                  type="text" 
                  value={endpoint} 
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://api.openai.com/v1/chat/completions"
                  className="w-full bg-[#111114] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-hidden focus:border-amber-400 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Model Name</label>
                <input 
                  type="text" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="w-full bg-[#111114] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-hidden focus:border-amber-400 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">API Key (Optional)</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-[#111114] border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-hidden focus:border-amber-400 font-mono-code"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{apiKey.trim() ? 'Save API Credentials' : 'Use Smart Mock Mode'}</span>
                </button>
                {savedSuccess && (
                  <span className="flex items-center text-xs text-emerald-400 space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>
            </form>

            <div className="pt-4 border-t border-stone-800/80">
              <div className="text-xs font-medium text-stone-400 mb-2 flex items-center justify-between">
                <span>Recent Black-Box Calls ({promptLogs.length})</span>
                <span className="text-[10px] text-stone-500">Auto-logged</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {promptLogs.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">No prompt calls recorded yet in this session.</p>
                ) : (
                  promptLogs.map((log) => (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLogId(log.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                        selectedLog?.id === log.id 
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' 
                          : 'bg-[#121215] border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="truncate font-mono-code capitalize">{log.type.replace('_', ' ')}</span>
                      <span className="text-[10px] text-stone-500 ml-2">{log.timestamp}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Prompt & System Prompt Inspector */}
          <div className="md:col-span-7 p-5 bg-[#141418] overflow-y-auto flex flex-col space-y-4">
            {selectedLog ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide font-sans font-medium">
                      {selectedLog.type}
                    </span>
                    <span className="text-xs text-stone-400">{selectedLog.timestamp}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider">
                    Status: <span className="text-emerald-400">{selectedLog.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 font-sans">
                    System Prompt Sent to LLM
                  </h4>
                  <pre className="p-3 bg-[#0d0d10] border border-stone-800 rounded-lg text-xs text-stone-300 whitespace-pre-wrap font-mono-code leading-relaxed">
                    {selectedLog.systemPrompt || 'You are an expert AI Mentor.'}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 font-sans">
                    User Prompt / Context Parameters
                  </h4>
                  <pre className="p-3 bg-[#0d0d10] border border-stone-800 rounded-lg text-xs text-stone-300 whitespace-pre-wrap font-mono-code leading-relaxed max-h-40 overflow-y-auto">
                    {selectedLog.userPrompt}
                  </pre>
                </div>

                {selectedLog.response && (
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 font-sans">
                      Black Box Output Returned
                    </h4>
                    <pre className="p-3 bg-[#0d0d10] border border-stone-800 rounded-lg text-xs text-stone-300 whitespace-pre-wrap font-mono-code leading-relaxed max-h-48 overflow-y-auto">
                      {selectedLog.response}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500 font-sans">
                <Cpu className="w-10 h-10 mb-3 text-stone-600" />
                <p className="text-sm">Interact with the app to see real-time prompt payloads captured here.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
