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

  // Determine current active workflow step based on real user state
  const hasSkillsData = skills && skills.length > 0;
  const hasTakenQuiz = (studentProfile?.level > 1) || (skills.some(s => s.mastery > 0 && s.mastery !== 42));
  const hasReviewedGraph = localStorage.getItem('mentorpath_graph_visited') === 'true';

  let currentStepIndex = 3; // Default to Adaptive Quiz step for standard demo flow
  if (!careerGoal) {
    currentStepIndex = 1;
  } else if (!hasTakenQuiz) {
    currentStepIndex = 3; // Adaptive Quiz
  } else if (!hasReviewedGraph) {
    currentStepIndex = 4; // Skill Graph
  } else {
    currentStepIndex = 5; // Learning Twin / Smart Revision
  }

  const steps = [
    {
      number: 1,
      title: "Set Technical Goal & Background Context",
      actionLabel: "Edit Setup",
      targetView: "onboarding",
      why: "Tailors AI explanation depth, analogy metaphors (e.g. cooking, sports), and session timing directly to your background.",
      unlocks: "Personalized 5-8 topic learning roadmap.",
      resultPayoff: `Target Role: ${careerGoal || 'AI Engineer'} • Level: ${studentProfile.skillLevel || 'Beginner'} • Metaphor: ${studentProfile.domain || 'Cooking'}`,
      isCompleted: true
    },
    {
      number: 2,
      title: "AI Personalized Roadmap Generation",
      actionLabel: "View Path Roadmap",
      targetView: "path",
      why: "Deconstructs target role requirements into structured, bite-sized daily objectives instead of overwhelming course lists.",
      unlocks: "Interactive adaptive learning modules & diagnostic quizzes.",
      resultPayoff: "Roadmap Active: 5 core topics, estimated 85 minutes total learning path.",
      isCompleted: true
    },
    {
      number: 3,
      title: "Adaptive Quiz & Misconception Calibration",
      actionLabel: "Start Adaptive Quiz",
      targetView: "adaptive-quiz",
      why: "Measures real-time baseline mastery, cognitive speed, and detects exact underlying mental model errors beyond simple right/wrong.",
      unlocks: "Populated 2D Skill Graph Matrix & Cognitive Learning Twin profile.",
      resultPayoff: hasTakenQuiz ? "Initial assessment completed. 1 bottleneck identified in Probability." : null,
      isCompleted: hasTakenQuiz
    },
    {
      number: 4,
      title: "Interactive Skill Graph & Bottleneck Diagnostics",
      actionLabel: "Inspect Skill Graph",
      targetView: "skill-graph",
      why: "Visualizes how foundational prerequisite nodes (e.g. Probability 42%) bottleneck progression in target AI roles.",
      unlocks: "Targeted micro-revisions & memory retention decay prediction.",
      resultPayoff: hasReviewedGraph ? "Skill Graph calibrated: Probability identified as core bottleneck." : null,
      isCompleted: hasReviewedGraph
    },
    {
      number: 5,
      title: "Cognitive Learning Twin & Memory Retention Modeling",
      actionLabel: "Explore Learning Twin",
      targetView: "learning-twin",
      why: "Simulates how fast you learn, predicts memory decay before forgetting occurs, and queues proactive smart revisions.",
      unlocks: "Industry benchmark evaluation against target job profiles.",
      resultPayoff: null,
      isCompleted: false
    },
    {
      number: 6,
      title: "Job Readiness Benchmark & Certified Resume Synthesis",
      actionLabel: "Generate AI Resume",
      targetView: "career",
      why: "Translates verified skill mastery into an ATS-optimized CV and official Certificate of Mastery.",
      unlocks: "Printable Master Certificate & ATS Resume Export.",
      resultPayoff: null,
      isCompleted: false
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const activeStep = steps.find(s => s.number === currentStepIndex) || steps[2];

  const weakSkills = skills.filter(s => s.retention < 60 || s.mastery < 65);
  const topRecommendation = weakSkills.find(s => s.id === 'probability') || weakSkills[0] || skills[0] || { name: 'Probability', mastery: 42 };
  const whyExplanation = explainRecommendation(topRecommendation.name, topRecommendation.mastery, careerGoal);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
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

      {/* 2. GUIDED WORKFLOW STEPPER SEQUENCE (NOT A RANDOM GRID) */}
      <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
        
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-neutral-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-warning-700" />
              <span>Your Guided Setup & Learning Pathway</span>
            </h2>
            <p className="text-xs text-neutral-600 font-sans mt-0.5">
              Complete each step sequentially to calibrate your Learning Twin and reach job readiness.
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
            const isLocked = !isCompleted && !isActive;

            // Collapsed view for finished steps unless expanded
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
                      <p className="text-[11px] text-neutral-600 mt-0.5">{step.resultPayoff}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(step.targetView)}
                    className="text-neutral-700 hover:text-neutral-900 font-semibold text-xs border border-neutral-300 bg-neutral-100 px-3 py-1 rounded cursor-pointer"
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
                    : 'bg-neutral-50/60 border-neutral-200 opacity-60'
                }`}
              >
                {/* STEP HEADER & BADGE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${
                      isActive 
                        ? 'bg-warning-600 text-neutral-50' 
                        : isCompleted 
                        ? 'bg-success-600 text-neutral-50' 
                        : 'bg-neutral-300 text-neutral-700'
                    }`}>
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                        Step {step.number} of 6
                      </span>
                      <h3 className="font-bold text-neutral-900 text-base font-sans">{step.title}</h3>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                    isActive 
                      ? 'bg-warning-600 text-neutral-50 animate-pulse' 
                      : isCompleted 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isActive ? '● CURRENT ACTION REQUIRED' : isCompleted ? '✓ Completed' : '🔒 Locked Step'}
                  </span>
                </div>

                {/* STEP RATIONALE & WHAT / WHY / UNLOCKS EXPLANATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans pt-1">
                  <div className="bg-neutral-100 p-3.5 rounded-lg border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-bold text-warning-700 uppercase tracking-wider block flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-warning-600" />
                      <span>WHY THIS STEP MATTERS:</span>
                    </span>
                    <p className="text-neutral-700 leading-relaxed font-medium">
                      {step.why}
                    </p>
                  </div>

                  <div className="bg-neutral-100 p-3.5 rounded-lg border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-bold text-success-700 uppercase tracking-wider block flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-success-600" />
                      <span>WHAT THIS UNLOCKS:</span>
                    </span>
                    <p className="text-neutral-700 leading-relaxed font-medium">
                      {step.unlocks}
                    </p>
                  </div>
                </div>

                {/* RESULT PAYOFF (IF COMPLETED) */}
                {isCompleted && step.resultPayoff && (
                  <div className="bg-success-50 border border-success-200 p-3 rounded-lg text-xs font-semibold text-success-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Result Produced: {step.resultPayoff}</span>
                  </div>
                )}

                {/* ACTION CTA BUTTON */}
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
                      className="flex items-center space-x-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
                    >
                      <span>Review Step</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center space-x-1.5 bg-neutral-200 text-neutral-400 font-medium py-2 px-4 rounded text-xs cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked — Finish Step {step.number - 1} First</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. AI RECOMMENDATION CENTER */}
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

      {/* 4. DASHBOARD CORE METRICS & FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. LEARNING TWIN PREVIEW */}
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

        {/* 2. FORGETTING PREDICTION & REVISION QUEUE */}
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

        {/* 3. CAREER SKILL GAP ANALYSIS */}
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
