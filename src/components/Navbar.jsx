import React, { useState, useRef, useEffect } from 'react';
import { 
  Route, Menu, X, ChevronDown, Play, MessageSquare, User,
  Target, GitBranch, RotateCcw, Award, FileText, Terminal
} from 'lucide-react';

export const PERSONAS = [
  { id: 'Patient Teacher', name: 'Patient Teacher', icon: '👨‍🏫' },
  { id: 'Strict Senior Engineer', name: 'Strict Senior', icon: '⚡' },
  { id: 'Socratic Questioner', name: 'Socratic Guide', icon: '🔍' }
];

export default function Navbar({
  currentStep,
  persona,
  onPersonaChange,
  onOpenDebugger,
  onOpenResumeBuilder,
  onOpenCertificate,
  onToggleChatbot,
  onGoBack,
  activeView,
  onNavigate,
  onStartDemoMode,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showGoBack = (currentStep > 1 || activeView !== 'dashboard');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'learning-twin', label: 'Learning Twin' },
    { id: 'adaptive-quiz', label: 'Adaptive Quiz' },
    { id: 'career', label: 'Career Path' },
  ];

  const secondaryNav = [
    { id: 'onboarding', label: 'Setup Plan', icon: Target },
    { id: 'skill-graph', label: 'Skill Graph', icon: GitBranch },
    { id: 'smart-revision', label: 'Smart Revision', icon: RotateCcw },
  ];

  const toolsNav = [
    { id: 'cert', label: 'Mastery Certificate', icon: Award, action: onOpenCertificate },
    { id: 'resume', label: 'Resume Builder', icon: FileText, action: onOpenResumeBuilder },
    { id: 'debug', label: 'Prompt Inspector', icon: Terminal, action: onOpenDebugger },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto h-16 px-4 lg:px-8 flex items-center justify-between">
        
        {/* LEFT GROUP: Logo + Optional Breadcrumb */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Home"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-50 flex items-center justify-center transition-colors group-hover:bg-neutral-800">
              <Route className="w-4 h-4" />
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-neutral-900">
              MentorPath
            </span>
          </button>

          {showGoBack && (
            <div className="hidden sm:flex items-center gap-2 text-neutral-400">
              <span className="text-sm">/</span>
              <button 
                onClick={onGoBack} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Back
              </button>
            </div>
          )}
        </div>

        {/* CENTER GROUP: Main Nav + More Dropdown */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {mainNav.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-neutral-200/50 text-neutral-900' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          {/* MORE DROPDOWN */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isMoreMenuOpen || secondaryNav.some(n => n.id === activeView)
                  ? 'bg-neutral-200/50 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              More <ChevronDown className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm py-2 z-50">
                
                {/* Persona Selector */}
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">AI Persona</p>
                  <select
                    value={persona}
                    onChange={(e) => onPersonaChange(e.target.value)}
                    className="w-full bg-white border border-neutral-200 text-xs font-medium text-neutral-800 rounded p-1.5 focus:outline-none cursor-pointer hover:border-neutral-300"
                  >
                    {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>

                <div className="my-1 border-t border-neutral-100"></div>

                {/* Secondary Views */}
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Views</div>
                {secondaryNav.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => handleNav(item.id)} 
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors text-left"
                  >
                    <item.icon className="w-4 h-4 text-neutral-400" /> {item.label}
                  </button>
                ))}

                <div className="my-1 border-t border-neutral-100"></div>

                {/* Tools */}
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tools</div>
                {toolsNav.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { item.action(); setIsMoreMenuOpen(false); }} 
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors text-left"
                  >
                    <item.icon className="w-4 h-4 text-neutral-400" /> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT GROUP: CTAs & Avatar (Max 3 items) */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Secondary CTA: Doubts (Ghost Outline) */}
          <button
            onClick={onToggleChatbot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-400 rounded-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI</span>
          </button>

          {/* Primary CTA: AI Demo (Accent Color) */}
          <button
            onClick={onStartDemoMode}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white bg-accent-600 hover:bg-accent-700 rounded-md transition-colors shadow-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>AI Demo</span>
          </button>

          {/* Avatar */}
          <button
            onClick={() => handleNav('profile')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
              activeView === 'profile' 
                ? 'bg-neutral-900 text-white border-neutral-900' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-300'
            }`}
            title="Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-neutral-50 border-b border-neutral-200 px-4 py-4 shadow-sm z-50 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            
            {/* Persona */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">AI Persona</p>
              <select
                value={persona}
                onChange={(e) => onPersonaChange(e.target.value)}
                className="w-full bg-white border border-neutral-200 text-sm font-medium text-neutral-800 rounded-md p-2 focus:outline-none"
              >
                {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
              </select>
            </div>
            
            {/* Navigation */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Navigation</p>
              <div className="space-y-1">
                {[...mainNav, ...secondaryNav].map(item => {
                  const isActive = activeView === item.id;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => handleNav(item.id)} 
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? 'bg-neutral-200/50 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tools & CTAs */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Tools & Actions</p>
              <div className="space-y-1">
                {toolsNav.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { item.action(); setIsMobileMenuOpen(false); }} 
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-neutral-400" /> {item.label}
                  </button>
                ))}
                
                {/* Profile */}
                <button 
                  onClick={() => handleNav('profile')} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  <User className="w-4 h-4 text-neutral-400" /> Learner Profile
                </button>

                {/* Ask AI */}
                <button 
                  onClick={() => { onToggleChatbot(); setIsMobileMenuOpen(false); }} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-900 bg-neutral-200/50 hover:bg-neutral-200 rounded-md transition-colors mt-2"
                >
                  <MessageSquare className="w-4 h-4" /> Ask AI Mentor
                </button>
              </div>
            </div>
            
            {/* Primary Mobile CTA */}
            <div className="pt-2">
              <button 
                onClick={() => { onStartDemoMode(); setIsMobileMenuOpen(false); }} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-accent-600 hover:bg-accent-700 rounded-md shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-current" /> AI Demo
              </button>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
}
