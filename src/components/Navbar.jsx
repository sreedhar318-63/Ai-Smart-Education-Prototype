import React from 'react';
import { 
  BookOpen, Terminal, RotateCcw, User, Flame, ArrowLeft, FileText, Award, 
  MessageSquare, Play, Sparkles, Brain, Zap, GitBranch, Target, Compass
} from 'lucide-react';

export const PERSONAS = [
  {
    id: 'Patient Teacher',
    name: 'Patient Teacher',
    icon: '💚',
    tagline: 'Warm, encouraging, step-by-step guidance',
    systemPrompt: 'You are a warm, highly encouraging, patient teacher. Explain concepts step-by-step using gentle language and clear supportive guidance.'
  },
  {
    id: 'Strict Senior Engineer',
    name: 'Strict Senior Engineer',
    icon: '⚡',
    tagline: 'Direct, code-focused, concise, high standards',
    systemPrompt: 'You are a strict, direct Senior Principal Engineer. Cut the fluff. Focus on production edge cases, memory efficiency, code precision, and engineering rigor.'
  },
  {
    id: 'Socratic Questioner',
    name: 'Socratic Questioner',
    icon: '🔍',
    tagline: 'Asks guiding questions, sparks critical thinking',
    systemPrompt: 'You are a Socratic mentor. Challenge the learner by incorporating thoughtful guiding questions, encouraging them to deduce core principles themselves.'
  }
];

export default function Navbar({
  currentStep,
  persona,
  onPersonaChange,
  onOpenDebugger,
  onOpenResumeBuilder,
  onOpenCertificate,
  onToggleChatbot,
  onResetSession,
  onGoBack,
  activeView,
  onNavigate,
  onStartDemoMode,
  hasOnboarded,
  studentProfile
}) {
  const showGoBack = (currentStep > 1 || activeView !== 'dashboard');

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Top Row: Brand & Persona & Back */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          
          <div className="flex items-center space-x-2.5">
            {showGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-stone-700" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs group-hover:bg-amber-600 transition-colors">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <h1 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 leading-none">
                Mentor<span className="italic text-amber-700">Path</span>
              </h1>
            </button>
          </div>

          {/* Persona Selector */}
          <div className="flex items-center space-x-1 bg-white border border-stone-300 px-2.5 py-1 rounded-xl text-xs shadow-xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 mr-1 hidden sm:inline">Persona:</span>
            <select
              value={persona}
              onChange={(e) => onPersonaChange(e.target.value)}
              className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer text-xs"
            >
              {PERSONAS.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Center: Main App Navigation Tabs */}
        {hasOnboarded && (
          <nav className="flex flex-wrap items-center justify-center gap-1 bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80 text-xs font-semibold">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'dashboard' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('learning-twin')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'learning-twin' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Learning Twin
            </button>

            <button
              onClick={() => onNavigate('adaptive-quiz')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'adaptive-quiz' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Adaptive Quiz
            </button>

            <button
              onClick={() => onNavigate('skill-graph')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'skill-graph' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Skill Graph
            </button>

            <button
              onClick={() => onNavigate('smart-revision')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'smart-revision' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Smart Revision
            </button>

            <button
              onClick={() => onNavigate('career')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'career' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Career & Roadmap
            </button>
          </nav>
        )}

        {/* Right Corner Actions: Demo Mode, Certificate, Inspector, User Avatar */}
        <div className="flex items-center space-x-2">
          
          {/* JUDGE DEMO MODE BUTTON */}
          <button
            onClick={onStartDemoMode}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-all shadow-xs cursor-pointer"
            title="Start Interactive AI Demo"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>AI Demo</span>
          </button>

          {/* Ask Doubts Chatbot */}
          <button
            onClick={onToggleChatbot}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Ask AI Mentor a Doubt"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xl:inline">Doubts</span>
          </button>

          {/* Mastery Certificate */}
          {hasOnboarded && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Official Mastery Certificate"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden xl:inline">Certificate</span>
            </button>
          )}

          {/* Prompt Inspector */}
          <button
            onClick={onOpenDebugger}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Inspect Prompt Inspector Payloads"
          >
            <Terminal className="w-4 h-4 text-stone-700" />
          </button>

          {/* Learner Profile Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            className={`relative p-0.5 rounded-full transition-all cursor-pointer ${
              activeView === 'profile' ? 'ring-2 ring-amber-600 ring-offset-2 bg-amber-600' : 'hover:ring-2 hover:ring-amber-500/50'
            }`}
            title="Open Profile & Heatmap Analytics"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-xs">
              <User className="w-4 h-4" />
            </div>
            
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[9px] px-1 py-0.2 rounded-full flex items-center">
              <Flame className="w-2.5 h-2.5 fill-stone-950 text-stone-950" />
              <span>{studentProfile?.streak || 5}</span>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}
