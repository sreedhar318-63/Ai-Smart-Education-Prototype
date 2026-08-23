import React from 'react';
import { BookOpen, Terminal, RotateCcw, User, Flame, ArrowLeft, FileText, Award, MessageSquare } from 'lucide-react';

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
  onToggleProfile,
  hasOnboarded
}) {
  const showGoBack = (currentStep > 1 || activeView === 'profile');

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand, Step Badge & Mentor Persona Selector */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          
          {/* Explicit Back Arrow Button */}
          {showGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
              title="Go back to previous screen"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button 
            onClick={() => onResetSession()}
            className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs group-hover:bg-amber-600 transition-colors">
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div className="hidden xs:block">
              <h1 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 leading-none">
                Mentor<span className="italic text-amber-700">Path</span>
              </h1>
            </div>
          </button>

          {/* Current Step Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-medium border border-stone-300/50">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            <span>
              {activeView === 'profile' ? 'Learner Profile & Analytics' : (
                currentStep === 1 ? 'Step 1: Onboarding' :
                currentStep === 2 ? 'Step 2: Skill Roadmap' :
                currentStep === 3 ? 'Step 3: Learning Session' : 'Step 4: Session Recap'
              )}
            </span>
          </div>

          {/* Mentor Persona Selector (Persistent on left/center) */}
          <div className="flex items-center space-x-1 bg-white border border-stone-300 px-2.5 py-1 rounded-xl text-xs shadow-xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 mr-1 hidden sm:inline">Persona:</span>
            <select
              value={persona}
              onChange={(e) => onPersonaChange(e.target.value)}
              className="bg-transparent font-bold text-stone-800 focus:outline-hidden cursor-pointer text-xs"
              title="Changes the System Prompt tone sent to AI"
            >
              {PERSONAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top-Right Corner: Certificate, Resume Builder, Unobtrusive Circular Avatar Button & Prompt Inspector */}
        <div className="flex items-center space-x-2">
          
          {/* Ask Doubts Chatbot Button */}
          <button
            onClick={onToggleChatbot}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Ask AI Mentor a Doubt"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Ask Doubts</span>
          </button>

          {/* Mastery Certificate Button */}
          {hasOnboarded && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="View & Download Official Mastery Certificate"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* AI Resume Builder Button */}
          {hasOnboarded && (
            <button
              onClick={onOpenResumeBuilder}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 hover:bg-amber-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Generate AI Skill-Based Resume from completed topics"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">AI Resume</span>
            </button>
          )}

          {/* Prompt Debugger Button */}
          <button
            onClick={onOpenDebugger}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 text-stone-200 hover:bg-stone-800 text-xs font-mono-code transition-all shadow-xs cursor-pointer"
            title="Inspect prompt payloads sent to generatePersonalizedContent()"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Inspector</span>
          </button>

          {/* Reset Session */}
          {currentStep > 1 && (
            <button
              onClick={onResetSession}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Reset current learning session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Top-Right Corner Persistent Circular Avatar Button for Learner Profile */}
          <button
            onClick={onToggleProfile}
            className={`relative p-0.5 rounded-full transition-all cursor-pointer group ${
              activeView === 'profile'
                ? 'ring-2 ring-amber-600 ring-offset-2 bg-amber-600'
                : 'hover:ring-2 hover:ring-amber-500/50 hover:ring-offset-1'
            }`}
            title="Open Learner Profile, Heatmap & Adaptive Analytics"
          >
            <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center border-2 border-amber-500/40 shadow-xs group-hover:bg-amber-800 transition-colors">
              <User className="w-4 h-4" />
            </div>
            
            {/* Small Unobtrusive Streak Flame Badge */}
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[9px] px-1 py-0.2 rounded-full border border-white flex items-center shadow-xs">
              <Flame className="w-2.5 h-2.5 fill-stone-950 text-stone-950" />
              <span>5</span>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}
