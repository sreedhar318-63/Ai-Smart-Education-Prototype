import React, { useState } from 'react';
import { 
  Sparkles, Brain, Flame, Target, Zap, ArrowRight, ShieldAlert, CheckCircle2, 
  RotateCcw, Award, Compass, Play, BarChart3, HelpCircle, GitBranch, Layers, User, Clock, Info, X, Lock, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { explainRecommendation } from '../services/aiEngine';

export default function StudentDashboard({
  studentProfile,
  skills = [],
  careerGoal,
  onNavigate,
  onStartDemoMode,
  onStartQuiz
}) {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [isCompletedStepsExpanded, setIsCompletedStepsExpanded] = useState(false);

  // Determine current active workflow step based on real persisted user state
  const hasTakenQuiz = (studentProfile?.level > 1) || (skills.some(s => s.mastery > 0 && s.mastery !== 42));
  const hasReviewedGraph = localStorage.getItem('mentorpath_graph_visited') === 'true';
  const hasExploredTwin = localStorage.getItem('mentorpath_twin_visited') === 'true';
  const hasGeneratedResume = localStorage.getItem('mentorpath_resume_visited') === 'true';

  let currentStepIndex = 3;
  if (!careerGoal) {
    currentStepIndex = 1;
  } else if (!hasTakenQuiz) {
    currentStepIndex = 3;
  } else if (!hasReviewedGraph) {
    currentStepIndex = 4;
  } else if (!hasExploredTwin) {
    currentStepIndex = 5;
  } else {
    currentStepIndex = 6;
  }

  // 6 Graph Nodes with Branching Logic
  const graphNodes = [
    {
      id: "node-1",
      number: 1,
      name: "Setup Plan",
      targetView: "onboarding",
      subtitle: "Tailors AI context & analogy engine",
      isCompleted: true,
      isActive: currentStepIndex === 1,
      isLocked: false,
      branch: "root"
    },
    {
      id: "node-2",
      number: 2,
      name: "AI Roadmap Path",
      targetView: "path",
      subtitle: "Deconstructs goal into daily topics",
      isCompleted: true,
      isActive: currentStepIndex === 2,
      isLocked: false,
      branch: "root"
    },
    {
      id: "node-3",
      number: 3,
      name: "Adaptive Quiz",
      targetView: "adaptive-quiz",
      subtitle: "Calibrates speed & detects misconceptions",
      isCompleted: hasTakenQuiz,
      isActive: currentStepIndex === 3,
      isLocked: false,
      branch: "junction"
    },
    {
      id: "node-4",
      number: 4,
      name: "Skill Graph Matrix",
      targetView: "skill-graph",
      subtitle: "Identifies prerequisite bottlenecks",
      isCompleted: hasReviewedGraph,
      isActive: currentStepIndex === 4,
      isLocked: !hasTakenQuiz,
      branch: "branch-a"
    },
    {
      id: "node-5",
      number: 5,
      name: "Cognitive Learning Twin",
      targetView: "learning-twin",
      subtitle: "Models memory decay & smart revision",
      isCompleted: hasExploredTwin,
      isActive: currentStepIndex === 5,
      isLocked: !hasTakenQuiz,
      branch: "branch-b"
    },
    {
      id: "node-6",
      number: 6,
      name: "Job Readiness & CV",
      targetView: "career",
      subtitle: "Synthesizes ATS Resume & Certificate",
      isCompleted: hasGeneratedResume,
      isActive: currentStepIndex === 6,
      isLocked: !hasExploredTwin && !hasReviewedGraph,
      branch: "convergence"
    }
  ];

  // SINGLE SOURCE OF TRUTH FOR ALL 6 STEPS & PREREQUISITE WIRING
  const steps = [
    {
      number: 1,
      title: "Set Technical Goal & Background Context",
      actionLabel: "Edit Setup",
      targetView: "onboarding",
      why: "Tailors AI explanation depth, analogy metaphors (e.g. cooking, sports), and session timing directly to your background.",
      unlocks: "Personalized 5-8 topic learning roadmap.",
      resultPayoff: `Target Role: ${careerGoal || 'AI Engineer'} • Level: ${studentProfile.skillLevel || 'Beginner'} • Metaphor: ${studentProfile.domain || 'Cooking'}`,
      isCompleted: true,
      prerequisiteStepNumber: null,
      prerequisiteName: null,
      isUnlocked: true
    },
    {
      number: 2,
      title: "AI Personalized Roadmap Generation",
      actionLabel: "View Path Roadmap",
      targetView: "path",
      why: "Deconstructs target role requirements into structured, bite-sized daily objectives instead of overwhelming course lists.",
      unlocks: "Interactive adaptive learning modules & diagnostic quizzes.",
      resultPayoff: "Roadmap Active: 5 core topics, estimated 85 minutes total learning path.",
      isCompleted: true,
      prerequisiteStepNumber: 1,
      prerequisiteName: "Setup Plan",
      isUnlocked: true
    },
    {
      number: 3,
      title: "Adaptive Quiz & Misconception Calibration",
      actionLabel: "Start Adaptive Quiz",
      targetView: "adaptive-quiz",
      why: "Measures real-time baseline mastery, cognitive speed, and detects exact underlying mental model errors beyond simple right/wrong.",
      unlocks: "Populated 2D Skill Graph Matrix & Cognitive Learning Twin profile.",
      resultPayoff: hasTakenQuiz ? "Initial assessment completed. 1 bottleneck identified in Probability." : null,
      isCompleted: hasTakenQuiz,
      prerequisiteStepNumber: 2,
      prerequisiteName: "AI Roadmap Path",
      isUnlocked: true
    },
    {
      number: 4,
      title: "Interactive Skill Graph & Bottleneck Diagnostics",
      actionLabel: "Inspect Skill Graph",
      targetView: "skill-graph",
      why: "Visualizes how foundational prerequisite nodes (e.g. Probability 42%) bottleneck progression in target AI roles.",
      unlocks: "Targeted micro-revisions & memory retention decay prediction.",
      resultPayoff: hasReviewedGraph ? "Skill Graph calibrated: Probability identified as core bottleneck." : null,
      isCompleted: hasReviewedGraph,
      prerequisiteStepNumber: 3,
      prerequisiteName: "Adaptive Quiz",
      isUnlocked: hasTakenQuiz
    },
    {
      number: 5,
      title: "Cognitive Learning Twin & Memory Retention Modeling",
      actionLabel: "Explore Learning Twin",
      targetView: "learning-twin",
      why: "Simulates how fast you learn, predicts memory decay before forgetting occurs, and queues proactive smart revisions.",
      unlocks: "Industry benchmark evaluation against target job profiles.",
      resultPayoff: hasExploredTwin ? "Cognitive twin model calibrated & retention risks mapped." : null,
      isCompleted: hasExploredTwin,
      prerequisiteStepNumber: 4,
      prerequisiteName: "Skill Graph Matrix",
      isUnlocked: hasTakenQuiz || hasReviewedGraph
    },
    {
      number: 6,
      title: "Job Readiness Benchmark & Certified Resume Synthesis",
      actionLabel: "Generate AI Resume",
      targetView: "career",
      why: "Translates verified skill mastery into an ATS-optimized CV and official Certificate of Mastery.",
      unlocks: "Printable Master Certificate & ATS Resume Export.",
      resultPayoff: hasGeneratedResume ? "Certified resume generated & job readiness benchmarked at 68%." : null,
      isCompleted: hasGeneratedResume,
      prerequisiteStepNumber: 5,
      prerequisiteName: "Cognitive Learning Twin",
      isUnlocked: hasExploredTwin || hasReviewedGraph
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const weakSkills = skills.filter(s => s.retention < 60 || s.mastery < 65);
  const topRecommendation = weakSkills.find(s => s.id === 'probability') || weakSkills[0] || skills[0] || { name: 'Probability', mastery: 42 };
  const whyExplanation = explainRecommendation(topRecommendation.name, topRecommendation.mastery, careerGoal);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* 0. HOME DASHBOARD GREETING & PHONE-FIRST QUICK ACTIONS */}
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-50 p-5 md:p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Learning Companion Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-50">
              Good morning, {studentProfile?.name || 'Sreedhar'}! 👋
            </h1>
            <p className="text-xs text-neutral-300 mt-1">
              You're <strong className="text-amber-400">72% through</strong> your Python fundamentals path. You have a <strong className="text-amber-400">{studentProfile?.streak || 5}-day streak</strong>!
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 self-start sm:self-auto text-xs">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-neutral-400 text-[10px] block">Streak</span>
              <span className="font-bold text-neutral-100">{studentProfile?.streak || 5} Days Active</span>
            </div>
          </div>
        </div>

        {/* PHONE-FIRST QUICK ACTION BAR */}
        <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigate('ai-tutor')}
            className="flex items-center space-x-2.5 bg-neutral-950 hover:bg-neutral-800 p-3 rounded-xl border border-neutral-800 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              🎤
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-neutral-100 block group-hover:text-amber-300">Ask AI Voice</span>
              <span className="text-[10px] text-neutral-400 block">Tap to speak</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai-tutor')}
            className="flex items-center space-x-2.5 bg-neutral-950 hover:bg-neutral-800 p-3 rounded-xl border border-neutral-800 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              📷
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-neutral-100 block group-hover:text-amber-300">Scan Question</span>
              <span className="text-[10px] text-neutral-400 block">Learn camera</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="flex items-center space-x-2.5 bg-neutral-950 hover:bg-neutral-800 p-3 rounded-xl border border-neutral-800 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              📝
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-neutral-100 block group-hover:text-amber-300">Practice Quiz</span>
              <span className="text-[10px] text-neutral-400 block">Adaptive Engine</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('learning')}
            className="flex items-center space-x-2.5 bg-neutral-950 hover:bg-neutral-800 p-3 rounded-xl border border-neutral-800 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              📚
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-neutral-100 block group-hover:text-amber-300">Continue</span>
              <span className="text-[10px] text-neutral-400 block">Python functions</span>
            </div>
          </button>
        </div>
      </div>

      {/* 1. PERSISTENT WORKFLOW PROGRESS BAR */}
      <div className="bg-neutral-900 text-neutral-50 rounded-lg p-6 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-warning-300 font-semibold mb-1">
              <Compass className="w-4 h-4 text-warning-400" />
              <span>MentorPath Guided Learning Sequence</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-neutral-50">
              Workflow Progress: <span className="text-warning-400">Step {currentStepIndex} of 6</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-mono-code font-bold text-neutral-300 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
              {progressPercent}% Complete
            </span>
            <button
              onClick={onStartDemoMode}
              className="bg-warning-500 hover:bg-warning-600 text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-neutral-950" />
              <span>Interactive AI Demo</span>
            </button>
          </div>
        </div>

        {/* PROGRESS STEP BAR */}
        <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden border border-neutral-700">
          <div 
            className="bg-warning-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 2. VISUAL 2D NODE FLOWCHART GRAPH (BRANCHING ARCHITECTURE) */}
      <div className="bg-neutral-900 text-neutral-50 rounded-lg p-6 md:p-8 border border-neutral-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-warning-400 font-semibold mb-1">
              <GitBranch className="w-4 h-4" />
              <span>Interactive Workflow Topology Graph</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-neutral-50">
              Personalized Learning Journey Map
            </h2>
            <p className="text-xs text-neutral-300 font-sans mt-0.5">
              Visualizes node dependencies, branching calibration junctions, and unlock sequences.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-sans">
            <span className="flex items-center space-x-1.5 text-success-400">
              <span className="w-2.5 h-2.5 rounded-full bg-success-500"></span>
              <span>Completed</span>
            </span>
            <span className="flex items-center space-x-1.5 text-warning-400">
              <span className="w-2.5 h-2.5 rounded-full bg-warning-500 animate-pulse"></span>
              <span>Active Action</span>
            </span>
            <span className="flex items-center space-x-1.5 text-neutral-500">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
              <span>Locked</span>
            </span>
          </div>
        </div>

        {/* DESKTOP 2D BRANCHING SVG GRAPH */}
        <div className="hidden lg:block relative py-6 px-2">
          {/* CONNECTOR SVG PATH OVERLAY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ minHeight: '320px' }}>
            <defs>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5C9A6C" />
              </marker>
              <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#E5A93C" />
              </marker>
              <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B463C" />
              </marker>
            </defs>

            {/* Line 1 -> 2 */}
            <line x1="16%" y1="50%" x2="30%" y2="50%" stroke="#5C9A6C" strokeWidth="2.5" markerEnd="url(#arrow-green)" />

            {/* Line 2 -> 3 */}
            <line x1="33%" y1="50%" x2="47%" y2="50%" stroke="#5C9A6C" strokeWidth="2.5" markerEnd="url(#arrow-green)" />

            {/* Line 3 -> 4 (Branch A Top) */}
            <path d="M 52% 40% C 56% 20%, 60% 20%, 64% 20%" fill="none" stroke={hasTakenQuiz ? "#E5A93C" : "#4B463C"} strokeWidth="2" strokeDasharray={hasTakenQuiz ? "none" : "4 4"} markerEnd={hasTakenQuiz ? "url(#arrow-amber)" : "url(#arrow-gray)"} />

            {/* Line 3 -> 5 (Branch B Bottom) */}
            <path d="M 52% 60% C 56% 80%, 60% 80%, 64% 80%" fill="none" stroke={hasTakenQuiz ? "#E5A93C" : "#4B463C"} strokeWidth="2" strokeDasharray={hasTakenQuiz ? "none" : "4 4"} markerEnd={hasTakenQuiz ? "url(#arrow-amber)" : "url(#arrow-gray)"} />

            {/* Line 4 -> 6 (Convergence Top) */}
            <path d="M 78% 20% C 82% 20%, 84% 40%, 87% 45%" fill="none" stroke={hasExploredTwin || hasReviewedGraph ? "#E5A93C" : "#4B463C"} strokeWidth="2" strokeDasharray={hasExploredTwin || hasReviewedGraph ? "none" : "4 4"} markerEnd={hasExploredTwin || hasReviewedGraph ? "url(#arrow-amber)" : "url(#arrow-gray)"} />

            {/* Line 5 -> 6 (Convergence Bottom) */}
            <path d="M 78% 80% C 82% 80%, 84% 60%, 87% 55%" fill="none" stroke={hasExploredTwin ? "#E5A93C" : "#4B463C"} strokeWidth="2" strokeDasharray={hasExploredTwin ? "none" : "4 4"} markerEnd={hasExploredTwin ? "url(#arrow-amber)" : "url(#arrow-gray)"} />
          </svg>

          {/* 2D GRAPH NODE CONTAINER */}
          <div className="relative z-10 grid grid-cols-5 gap-4 items-center min-h-[300px]">
            
            {/* NODE 1: SETUP */}
            <button
              onClick={() => onNavigate('onboarding')}
              className="bg-neutral-950 border border-success-500/60 hover:border-success-400 p-4 rounded-lg text-left transition-all cursor-pointer space-y-2 group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="w-6 h-6 rounded-full bg-success-600 text-neutral-50 font-bold flex items-center justify-center text-xs">✓</span>
                <span className="text-[10px] uppercase font-bold text-success-400">Node 1</span>
              </div>
              <p className="font-bold text-neutral-50 text-sm font-sans group-hover:text-success-300">Setup Plan</p>
              <p className="text-[11px] text-neutral-300 leading-snug">Tailors AI context & analogy engine</p>
            </button>

            {/* NODE 2: PATH */}
            <button
              onClick={() => onNavigate('path')}
              className="bg-neutral-950 border border-success-500/60 hover:border-success-400 p-4 rounded-lg text-left transition-all cursor-pointer space-y-2 group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="w-6 h-6 rounded-full bg-success-600 text-neutral-50 font-bold flex items-center justify-center text-xs">✓</span>
                <span className="text-[10px] uppercase font-bold text-success-400">Node 2</span>
              </div>
              <p className="font-bold text-neutral-50 text-sm font-sans group-hover:text-success-300">AI Roadmap Path</p>
              <p className="text-[11px] text-neutral-300 leading-snug">Deconstructs goal into daily topics</p>
            </button>

            {/* NODE 3: ADAPTIVE QUIZ (JUNCTION) */}
            <button
              onClick={() => onNavigate('adaptive-quiz')}
              className={`p-4 rounded-lg text-left transition-all cursor-pointer space-y-2 group shadow-xl relative ${
                currentStepIndex === 3
                  ? 'bg-warning-500/20 border-warning-500 ring-2 ring-warning-500/40 scale-105'
                  : hasTakenQuiz
                  ? 'bg-neutral-950 border-success-500/60'
                  : 'bg-neutral-950 border-warning-500/50'
              }`}
            >
              {currentStepIndex === 3 && (
                <span className="absolute -top-2.5 left-3 bg-warning-500 text-neutral-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase font-sans tracking-wide shadow-md">
                  YOU ARE HERE
                </span>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                  hasTakenQuiz ? 'bg-success-600 text-neutral-50' : 'bg-warning-500 text-neutral-950'
                }`}>
                  {hasTakenQuiz ? '✓' : '3'}
                </span>
                <span className="text-[10px] uppercase font-bold text-warning-400">Junction Node</span>
              </div>
              <p className="font-bold text-neutral-50 text-sm font-sans group-hover:text-warning-300">Adaptive Quiz</p>
              <p className="text-[11px] text-neutral-300 leading-snug">Calibrates speed & mental models</p>
            </button>

            {/* PARALLEL BRANCHES (NODE 4 & NODE 5) */}
            <div className="space-y-4 flex flex-col justify-between h-full">
              {/* NODE 4: SKILL GRAPH */}
              <button
                onClick={() => onNavigate('skill-graph')}
                className={`p-3.5 rounded-lg text-left transition-all cursor-pointer space-y-1.5 group shadow-lg ${
                  currentStepIndex === 4
                    ? 'bg-warning-500/20 border-warning-500 ring-2 ring-warning-500/40'
                    : hasReviewedGraph
                    ? 'bg-neutral-950 border-success-500/60'
                    : 'bg-neutral-950 border-neutral-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                    hasReviewedGraph ? 'bg-success-600 text-neutral-50' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {hasReviewedGraph ? '✓' : '4'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-accent-400">Branch A</span>
                </div>
                <p className="font-bold text-neutral-50 text-xs font-sans">Skill Graph Matrix</p>
                <p className="text-[10px] text-neutral-300">Prerequisite bottleneck nodes</p>
              </button>

              {/* NODE 5: LEARNING TWIN */}
              <button
                onClick={() => onNavigate('learning-twin')}
                className={`p-3.5 rounded-lg text-left transition-all cursor-pointer space-y-1.5 group shadow-lg ${
                  currentStepIndex === 5
                    ? 'bg-warning-500/20 border-warning-500 ring-2 ring-warning-500/40'
                    : hasExploredTwin
                    ? 'bg-neutral-950 border-success-500/60'
                    : 'bg-neutral-950 border-neutral-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                    hasExploredTwin ? 'bg-success-600 text-neutral-50' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {hasExploredTwin ? '✓' : '5'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-accent-400">Branch B</span>
                </div>
                <p className="font-bold text-neutral-50 text-xs font-sans">Learning Twin</p>
                <p className="text-[10px] text-neutral-300">Memory retention prediction</p>
              </button>
            </div>

            {/* NODE 6: JOB READINESS */}
            <button
              onClick={() => onNavigate('career')}
              className={`p-4 rounded-lg text-left transition-all cursor-pointer space-y-2 group shadow-lg ${
                currentStepIndex === 6
                  ? 'bg-warning-500/20 border-warning-500 ring-2 ring-warning-500/40'
                  : hasGeneratedResume
                  ? 'bg-neutral-950 border-success-500/60'
                  : 'bg-neutral-950 border-neutral-800 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                  hasGeneratedResume ? 'bg-success-600 text-neutral-50' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {hasGeneratedResume ? '✓' : '6'}
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Convergence</span>
              </div>
              <p className="font-bold text-neutral-50 text-sm font-sans group-hover:text-warning-300">Job Readiness & CV</p>
              <p className="text-[11px] text-neutral-300 leading-snug">ATS Resume & Master Credential</p>
            </button>

          </div>
        </div>

        {/* MOBILE VERTICAL FLOWCHART GRAPH */}
        <div className="lg:hidden space-y-3 relative">
          {graphNodes.map((node, index) => (
            <div key={node.id} className="relative flex items-center space-x-3">
              {index < graphNodes.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-neutral-800 -z-0"></div>
              )}

              <button
                onClick={() => onNavigate(node.targetView)}
                className={`w-full p-4 rounded-lg border text-left transition-all cursor-pointer z-10 flex items-center justify-between ${
                  node.isActive
                    ? 'bg-warning-500/20 border-warning-500 ring-2 ring-warning-500/30'
                    : node.isCompleted
                    ? 'bg-neutral-950 border-success-500/60'
                    : 'bg-neutral-950 border-neutral-800 opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                    node.isCompleted ? 'bg-success-600 text-neutral-50' : node.isActive ? 'bg-warning-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {node.isCompleted ? '✓' : node.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-neutral-50 text-sm">{node.name}</h3>
                    <p className="text-xs text-neutral-300">{node.subtitle}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* 3. STEPPER LIST EXPLANATIONS */}
      <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
        
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-neutral-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-warning-700" />
              <span>Step-by-Step Action Guidelines</span>
            </h2>
            <p className="text-xs text-neutral-600 font-sans mt-0.5">
              Review detailed rationale and outcome payoffs for each workflow node.
            </p>
          </div>

          {completedCount > 0 && (
            <button
              onClick={() => setIsCompletedStepsExpanded(prev => !prev)}
              className="text-xs text-neutral-700 hover:text-neutral-900 font-semibold flex items-center space-x-1 cursor-pointer bg-neutral-200/70 px-3 py-1.5 rounded-lg border border-neutral-300"
            >
              <span>{isCompletedStepsExpanded ? 'Collapse Finished Steps' : `View ${completedCount} Finished Steps`}</span>
              {isCompletedStepsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* WORKFLOW STEPPERS */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = step.number === currentStepIndex;
            const isCompleted = step.isCompleted;
            const isUnlocked = step.isUnlocked;

            if (isCompleted && !isCompletedStepsExpanded && !isActive) {
              return (
                <div 
                  key={step.number}
                  className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg flex items-center justify-between text-xs transition-all hover:bg-neutral-100"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-success-600 text-neutral-50 font-bold text-xs flex items-center justify-center">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-neutral-900">Step {step.number}: {step.title}</span>
                      <p className="text-[11px] text-neutral-700 mt-0.5">{step.resultPayoff}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(step.targetView)}
                    className="text-neutral-800 hover:text-neutral-950 font-semibold text-xs border border-neutral-300 bg-neutral-100 px-3 py-1 rounded cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              );
            }

            return (
              <div
                key={step.number}
                className={`p-6 rounded-lg border transition-all space-y-4 ${
                  isActive
                    ? 'bg-warning-500/10 border-warning-500 ring-2 ring-warning-500/30 text-neutral-900 shadow-md'
                    : isCompleted
                    ? 'bg-neutral-50 border-neutral-200'
                    : isUnlocked
                    ? 'bg-neutral-50 border-neutral-300'
                    : 'bg-neutral-100/70 border-neutral-300 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${
                      isActive 
                        ? 'bg-warning-600 text-neutral-50' 
                        : isCompleted 
                        ? 'bg-success-600 text-neutral-50' 
                        : isUnlocked
                        ? 'bg-neutral-800 text-neutral-50'
                        : 'bg-neutral-300 text-neutral-800'
                    }`}>
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 block">
                        Step {step.number} of 6
                      </span>
                      <h3 className="font-bold text-neutral-900 text-base font-sans">{step.title}</h3>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                    isActive 
                      ? 'bg-warning-600 text-neutral-50 animate-pulse' 
                      : isCompleted 
                      ? 'bg-success-100 text-success-900 border border-success-300' 
                      : isUnlocked
                      ? 'bg-neutral-200 text-neutral-900 border border-neutral-400'
                      : 'bg-neutral-200 text-neutral-800 border border-neutral-300'
                  }`}>
                    {isActive ? '● CURRENT ACTION REQUIRED' : isCompleted ? '✓ Completed' : isUnlocked ? '⚡ Available' : '🔒 Locked Step'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans pt-1">
                  <div className="bg-neutral-100 p-3.5 rounded-lg border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-bold text-warning-800 uppercase tracking-wider block flex items-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5 text-warning-700 shrink-0" />
                      <span>WHY THIS STEP MATTERS:</span>
                    </span>
                    <p className="text-neutral-800 leading-relaxed font-medium">
                      {step.why}
                    </p>
                  </div>

                  <div className="bg-neutral-100 p-3.5 rounded-lg border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-bold text-success-800 uppercase tracking-wider block flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-success-700 shrink-0" />
                      <span>WHAT THIS UNLOCKS:</span>
                    </span>
                    <p className="text-neutral-800 leading-relaxed font-medium">
                      {step.unlocks}
                    </p>
                  </div>
                </div>

                {isCompleted && step.resultPayoff && (
                  <div className="bg-success-50 border border-success-200 p-3 rounded-lg text-xs font-semibold text-success-950 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success-700 shrink-0" />
                    <span>Result Produced: {step.resultPayoff}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {isActive ? (
                    <button
                      onClick={() => onNavigate(step.targetView)}
                      className="flex items-center space-x-2 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3.5 px-6 rounded-lg text-xs transition-all cursor-pointer shadow-md"
                    >
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => onNavigate(step.targetView)}
                      className="flex items-center space-x-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer border border-neutral-300"
                    >
                      <span>Review Step</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onNavigate(step.targetView)}
                      className="flex items-center space-x-1.5 bg-warning-600 hover:bg-warning-700 text-neutral-50 font-bold py-2.5 px-5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center space-x-1.5 bg-neutral-200 text-neutral-700 font-semibold py-2.5 px-4 rounded-lg text-xs border border-neutral-300 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Locked — Complete Step {step.prerequisiteStepNumber} ({step.prerequisiteName}) First</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 4. AI RECOMMENDATION CENTER */}
      <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-warning-900">
            <Zap className="w-5 h-5 text-warning-700 fill-warning-500" />
            <h2 className="font-editorial text-2xl font-bold">
              AI REAL-TIME RECOMMENDATION
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-warning-100 text-warning-900 font-bold border border-warning-300">
            COGNITIVE DECISION ENGINE
          </span>
        </div>

        <div className="bg-warning-50/80 border border-warning-200/90 p-5 md:p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wide text-warning-900">
              <span className="w-2 h-2 rounded-full bg-warning-600 animate-pulse"></span>
              <span>AI Recommendation: {topRecommendation.name} Foundations</span>
            </div>
            <h3 className="font-sans font-bold text-xl text-neutral-900">
              {topRecommendation.name} & Bayes Theorem Calibration
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              <strong>Rationale:</strong> Your current <strong>{topRecommendation.mastery}% mastery</strong> is bottlenecking your <strong>{careerGoal}</strong> readiness.
            </p>
            <div className="flex items-center space-x-4 text-xs font-medium text-neutral-600 pt-1">
              <span>⏱ Est time: <strong>18 minutes</strong></span>
              <span>🎯 Expected outcome: <strong>Improve {topRecommendation.name} {topRecommendation.mastery}% ➔ {topRecommendation.mastery + 15}%</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setShowWhyModal(true)}
              className="flex items-center justify-center space-x-1.5 bg-warning-200/80 hover:bg-warning-300 text-accent-950 font-bold py-3 px-4 rounded-lg text-xs transition-all border border-warning-300 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-accent-800" />
              <span>Why did AI recommend this?</span>
            </button>

            <button
              onClick={() => onNavigate('adaptive-quiz')}
              className="flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3.5 px-6 rounded-lg text-xs transition-all cursor-pointer"
            >
              <span>Start Adaptive Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* WHY DID AI RECOMMEND THIS? POPUP MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-100 rounded-lg max-w-lg w-full p-6 md:p-8 space-y-6 border border-neutral-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center space-x-2 text-warning-900">
                <Info className="w-5 h-5 text-warning-700" />
                <h3 className="font-editorial text-xl font-bold">WHY THIS RECOMMENDATION?</h3>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-warning-50 p-4 rounded-lg border border-warning-200 text-accent-950 leading-relaxed font-sans">
                {whyExplanation.rationale}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] block">Learning Twin Evidence:</span>
                <ul className="space-y-1.5">
                  {whyExplanation.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-center space-x-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-neutral-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-warning-700 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 5. DASHBOARD CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEARNING TWIN PREVIEW */}
        <div 
          onClick={() => onNavigate('learning-twin')}
          className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover:border-warning-500 transition-all cursor-pointer space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-accent-800">
              <Brain className="w-5 h-5 text-warning-700" />
              <h3 className="font-editorial text-xl font-bold text-neutral-900 group-hover:text-accent-800">
                AI Learning Twin
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 border border-neutral-300">
              Live Profile
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-600">Overall Mastery:</span>
              <strong className="text-neutral-900 font-sans text-sm">{studentProfile.mastery}%</strong>
            </div>

            <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-600">Learning Speed:</span>
              <strong className="text-success-700 font-semibold">{studentProfile.learningSpeed}</strong>
            </div>

            <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-600">Retention Risk:</span>
              <strong className="text-error-700 font-semibold">{studentProfile.retention}% (Probability at risk)</strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-accent-800 font-bold group-hover:underline">
            <span>View Full Learning Twin</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* SMART REVISION PREVIEW */}
        <div 
          onClick={() => onNavigate('smart-revision')}
          className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover:border-error-500 transition-all cursor-pointer space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-error-800">
              <ShieldAlert className="w-5 h-5 text-error-600" />
              <h3 className="font-editorial text-xl font-bold text-neutral-900 group-hover:text-error-800">
                Smart Revision
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-error-100 text-error-800 border border-error-200">
              AI Risk Predictor
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            AI-estimated retention risk predicts <strong>Probability & Bayes Rule</strong> needs revision.
          </p>

          <div className="space-y-2">
            <div className="bg-error-50/70 border border-error-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <p className="font-bold text-error-950">Probability & Bayes</p>
                <p className="text-[10px] text-error-700">HIGH PRIORITY • 5 min</p>
              </div>
              <span className="text-[10px] bg-error-200 text-error-900 px-2 py-0.5 rounded font-bold">38% Retention</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-error-700 font-bold group-hover:underline">
            <span>Launch Smart Revision Engine</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* CAREER SKILL GAP PREVIEW */}
        <div 
          onClick={() => onNavigate('career')}
          className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover:border-warning-500 transition-all cursor-pointer space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-accent-800">
              <Target className="w-5 h-5 text-accent-600" />
              <h3 className="font-editorial text-xl font-bold text-neutral-900 group-hover:text-accent-800">
                Career Skill Gap
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-800 border border-accent-200">
              Goal: {careerGoal}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Overall AI Career Readiness:</span>
              <span className="text-accent-700 text-sm">68%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden border border-neutral-300">
              <div className="bg-accent-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">High Priority Gaps:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-neutral-50 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-medium">1. Generative AI</span>
              <span className="bg-neutral-50 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-medium">2. Deep Learning</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-accent-700 font-bold group-hover:underline">
            <span>Open Career Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

    </div>
  );
}
