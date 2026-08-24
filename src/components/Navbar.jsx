import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Terminal, ArrowLeft, Award, 
  MessageSquare, Play, User, Menu, X, FileText,
  LayoutDashboard, Brain, Sparkles, GitBranch, RotateCcw, Target, ChevronDown
} from 'lucide-react';

export const PERSONAS = [
  {
    id: 'Patient Teacher',
    name: 'Patient Teacher',
    icon: '💚',
    tagline: 'Warm, encouraging, step-by-step guidance'
  },
  {
    id: 'Strict Senior Engineer',
    name: 'Strict Senior Engineer',
    icon: '⚡',
    tagline: 'Direct, code-focused, concise, high standards'
  },
  {
    id: 'Socratic Questioner',
    name: 'Socratic Questioner',
    icon: '🔍',
    tagline: 'Asks guiding questions, sparks critical thinking'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showGoBack = (currentStep > 1 || activeView !== 'dashboard');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
    setIsToolsDropdownOpen(false);
  };

  const navItems = [
    { id: 'onboarding', label: 'Setup Plan', icon: Target },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-twin', label: 'Learning Twin', icon: Brain },
    { id: 'adaptive-quiz', label: 'Adaptive Quiz', icon: Sparkles },
    { id: 'skill-graph', label: 'Skill Graph', icon: GitBranch },
    { id: 'smart-revision', label: 'Smart Revision', icon: RotateCcw },
    { id: 'career', label: 'Career & Roadmap', icon: Target },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/80 px-3 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Top Row / Brand & Mobile Menu Bar */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-2">
          
          <div className="flex items-center space-x-2">
            {showGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                title="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4 text-stone-700" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button 
              onClick={() => handleNav('dashboard')}
              className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs group-hover:bg-amber-600 transition-colors shrink-0">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <h1 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 leading-none">
                Mentor<span className="italic text-amber-700">Path</span>
              </h1>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Persona Selector */}
            <div className="flex items-center space-x-1 bg-white border border-stone-300 px-2 py-1 rounded-xl text-xs shadow-xs">
              <select
                value={persona}
                onChange={(e) => onPersonaChange(e.target.value)}
                className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer text-xs max-w-[120px] sm:max-w-none truncate"
                aria-label="Select AI Mentor Persona"
              >
                {PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-800 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Navigation Drawer"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Desktop Main Navigation Tabs */}
        <nav className="hidden lg:flex items-center overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80 text-xs font-semibold">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? item.id === 'onboarding' 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop Right Actions & Tools */}
        <div className="hidden lg:flex items-center space-x-2 shrink-0">
          
          {/* JUDGE DEMO MODE BUTTON */}
          <button
            onClick={onStartDemoMode}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-all shadow-xs cursor-pointer"
            title="Start Guided AI Demo"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>AI Demo</span>
          </button>

          {/* Ask Doubts Chatbot */}
          <button
            onClick={onToggleChatbot}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Ask AI Mentor a Doubt"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Doubts</span>
          </button>

          {/* Tools & Certs Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
              title="More Learning Tools"
            >
              <span>Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-600" />
            </button>

            {isToolsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => { onOpenCertificate(); setIsToolsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left"
                >
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mastery Certificate</span>
                </button>

                <button
                  onClick={() => { onOpenResumeBuilder(); setIsToolsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Resume Bullet Generator</span>
                </button>

                <button
                  onClick={() => { onOpenDebugger(); setIsToolsDropdownOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left"
                >
                  <Terminal className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Prompt Inspector</span>
                </button>
              </div>
            )}
          </div>

          {/* Learner Profile Avatar */}
          <button
            onClick={() => handleNav('profile')}
            className={`relative p-0.5 rounded-full transition-all cursor-pointer ${
              activeView === 'profile' ? 'ring-2 ring-amber-600 ring-offset-2 bg-amber-600' : 'hover:ring-2 hover:ring-amber-500/50'
            }`}
            title="Open Profile & Analytics"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-stone-200/80 animate-in slide-in-from-top-4 duration-200">
          
          {/* Main Navigation Options */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">Navigation Pages</p>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-amber-300 shadow-xs' 
                      : 'text-stone-700 hover:bg-stone-200/60 hover:text-stone-900'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Tools & Features */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">Tools & Features</p>
            
            <button
              onClick={() => { onStartDemoMode(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold transition-all text-left cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>Start Guided AI Demo</span>
            </button>

            <button
              onClick={() => { onToggleChatbot(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/60 text-left cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ask AI Mentor a Doubt</span>
            </button>

            <button
              onClick={() => { onOpenCertificate(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/60 text-left cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Official Mastery Certificate</span>
            </button>

            <button
              onClick={() => { onOpenResumeBuilder(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/60 text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Resume Bullet Generator</span>
            </button>

            <button
              onClick={() => { onOpenDebugger(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/60 text-left cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-stone-600 shrink-0" />
              <span>Prompt Inspector</span>
            </button>

            <button
              onClick={() => handleNav('profile')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200/60 text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Learner Profile & Heatmap</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
