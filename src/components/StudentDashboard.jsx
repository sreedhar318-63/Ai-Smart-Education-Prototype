import React, { useState } from 'react';
import { 
 Sparkles, Brain, Flame, Target, Zap, ArrowRight, ShieldAlert, CheckCircle2, 
 RotateCcw, Award, Compass, Play, BarChart3, HelpCircle, GitBranch, Layers, User, Clock, Info, X
} from 'lucide-react';
import { explainRecommendation } from '../services/aiEngine';

export default function StudentDashboard({
 studentProfile,
 skills,
 careerGoal,
 onNavigate,
 onStartDemoMode,
 onStartQuiz
}) {
 const [showWhyModal, setShowWhyModal] = useState(false);
 const weakSkills = skills.filter(s => s.retention < 60 || s.mastery < 65);
 const topRecommendation = weakSkills.find(s => s.id === 'probability') || weakSkills[0] || skills[2] || skills[0];
 const whyExplanation = explainRecommendation(topRecommendation.name, topRecommendation.mastery, careerGoal);

 return (
 <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
 
 {/* 1. HERO SECTION - SHORTLISTING POSITIONING */}
 <div className="text-neutral-100 rounded-lg p-6 md:p-10 border border-neutral-800 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
 
 {/* Glowing backdrop elements */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-warning-600/10 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-warning-500/10 rounded-full blur-2xl pointer-events-none"></div>

 <div className="space-y-4 z-10 max-w-2xl">
 <div className="flex flex-wrap items-center gap-2">
 <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 text-xs font-semibold border border-warning-500/30">
 <Sparkles className="w-3.5 h-3.5" />
 <span>AI Learning Intelligence Operating System</span>
 </span>
 <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-warning-900/60 text-warning-200 text-xs font-mono-code border border-warning-700/50">
 ⚡ Interactive AI Demo Ready
 </span>
 </div>

 <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight text-neutral-50 leading-tight">
 MENTORPATH — <span className="text-accent-400 italic">An AI that learns how YOU learn.</span>
 </h1>

 <p className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed">
 Detect misconceptions. Adapt difficulty. Predict retention. Build your path.
 </p>

 {/* VISUAL LOOP FLOW */}
 <div className="bg-neutral-950/80 p-3.5 rounded-lg border border-neutral-800 flex flex-wrap items-center justify-between text-[11px] font-sans text-neutral-300 gap-1">
 <span className="text-warning-300 font-bold">Student</span>
 <span className="text-neutral-600">➔</span>
 <span className="text-warning-300 font-bold">Learning Twin</span>
 <span className="text-neutral-600">➔</span>
 <span className="text-warning-300 font-bold">AI Analysis</span>
 <span className="text-neutral-600">➔</span>
 <span className="text-warning-300 font-bold">Adaptive Learning</span>
 <span className="text-neutral-600">➔</span>
 <span className="text-accent-400 font-bold">Career Growth</span>
 </div>

 {/* Quick stats pills */}
 <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
 <div className="bg-neutral-800/90 px-3.5 py-1.5 rounded-lg border border-neutral-700/80 flex items-center space-x-1.5">
 <Flame className="w-4 h-4 text-accent-400 fill-amber-400" />
 <span><strong>{studentProfile.streak} Day</strong> Streak</span>
 </div>

 <div className="bg-neutral-800/90 px-3.5 py-1.5 rounded-lg border border-neutral-700/80 flex items-center space-x-1.5">
 <Award className="w-4 h-4 text-warning-300" />
 <span>Level {studentProfile.level} • <strong>{studentProfile.levelTitle}</strong></span>
 </div>

 <div className="bg-neutral-800/90 px-3.5 py-1.5 rounded-lg border border-neutral-700/80 flex items-center space-x-1.5">
 <Target className="w-4 h-4 text-accent-400" />
 <span>Goal: <strong>{careerGoal} (68% Readiness)</strong></span>
 </div>
 </div>
 </div>

 {/* PRIMARY & SECONDARY CTA PANEL */}
 <div className="z-10 bg-warning-500/10 border border-warning-500/40 p-6 rounded-lg w-full lg:w-auto min-w-[280px] space-y-4 ">
 <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-warning-300">
 <Play className="w-4 h-4 text-accent-400 fill-amber-400" />
 <span>Interactive Demo Flow</span>
 </div>
 <p className="text-xs text-neutral-200 leading-relaxed font-sans">
 Experience the 2-minute end-to-end misconception & adaptive difficulty loop.
 </p>
 <div className="space-y-2">
 <button
 onClick={onStartDemoMode}
 className="w-full flex items-center justify-center space-x-2 bg-warning-500 hover:bg-warning-600 text-neutral-950 font-bold py-3.5 px-5 rounded-lg text-xs transition-all hover: cursor-pointer"
 >
 <span>🚀 START AI DEMO</span>
 <ArrowRight className="w-4 h-4" />
 </button>

 <button
 onClick={() => onNavigate('learning-twin')}
 className="w-full flex items-center justify-center space-x-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-50 font-bold py-3 px-5 rounded-lg text-xs border border-neutral-700 transition-all cursor-pointer"
 >
 <Brain className="w-4 h-4 text-accent-400" />
 <span>EXPLORE LEARNING TWIN</span>
 </button>
 </div>
 </div>

 </div>

 {/* 2. AI RECOMMENDATION CENTER - "WHAT SHOULD YOU LEARN NEXT?" */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-4 relative">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-2 text-warning-900">
 <Zap className="w-5 h-5 text-warning-700 fill-warning-500" />
 <h2 className="font-editorial text-2xl font-bold">
 WHAT SHOULD YOU LEARN NEXT?
 </h2>
 </div>
 <span className="text-xs px-3 py-1 rounded-full bg-warning-100 text-warning-900 font-bold border border-warning-300">
 AI DECISION CENTER
 </span>
 </div>

 <div className="bg-warning-50/80 border border-warning-200/90 p-5 md:p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div className="space-y-2 max-w-2xl">
 <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wide text-warning-900">
 <span className="w-2 h-2 rounded-full bg-warning-600 animate-pulse"></span>
 <span>AI Recommendation: Probability Foundations</span>
 </div>
 <h3 className="font-sans font-bold text-xl text-neutral-900">
 Probability & Bayes Theorem Foundations
 </h3>
 <p className="text-xs text-neutral-700 leading-relaxed">
 <strong>Rationale:</strong> You answered 3 of your last 5 Probability questions incorrectly. Your current <strong>42% mastery</strong> is bottlenecking your <strong>{careerGoal}</strong> goal.
 </p>
 <div className="flex items-center space-x-4 text-xs font-medium text-neutral-600 pt-1">
 <span>⏱ Estimated time: <strong>18 minutes</strong></span>
 <span>🎯 Expected outcome: <strong>Improve Probability 42% ➔ 55%</strong></span>
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
 <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
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

 {/* 3. PROBLEM SECTION */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 <div className="text-center max-w-2xl mx-auto space-y-2">
 <span className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 font-bold border border-neutral-200">
 THE REAL PROBLEM IN EDUCATION
 </span>
 <h2 className="font-editorial text-2xl md:text-3xl font-bold text-neutral-900">
 Students don't learn at the same speed, yet digital education provides standardized paths.
 </h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
 
 <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg space-y-2">
 <h3 className="font-bold text-neutral-900 text-sm">Traditional Learning</h3>
 <p className="text-neutral-600 leading-relaxed">
 Same content, same sequence, same difficulty for every student regardless of individual background or speed.
 </p>
 </div>

 <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg space-y-2">
 <h3 className="font-bold text-neutral-900 text-sm">Generic AI Chatbot</h3>
 <p className="text-neutral-600 leading-relaxed">
 Answers isolated questions on demand, but lacks memory of student cognitive state, error history, or retention decay.
 </p>
 </div>

 <div className="bg-warning-500/10 border border-warning-500/40 p-5 rounded-lg space-y-2">
 <h3 className="font-bold text-accent-950 text-sm flex items-center space-x-1.5">
 <Sparkles className="w-4 h-4 text-warning-700" />
 <span>MentorPath AI</span>
 </h3>
 <p className="text-neutral-800 leading-relaxed">
 Understands the learner, detects misconceptions, adapts difficulty in real-time, predicts retention decay, and maps career goals.
 </p>
 </div>

 </div>
 </div>

 {/* 4. WHY MENTORPATH? DIFFERENTIATION SECTION */}
 <div className="bg-neutral-900 text-neutral-50 rounded-lg p-6 md:p-8 border border-neutral-800 space-y-6">
 <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
 <h2 className="font-editorial text-2xl md:text-3xl font-bold text-neutral-50">
 WHY MENTORPATH?
 </h2>
 <span className="text-xs px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 font-semibold border border-warning-500/30">
 5 Core AI Innovations
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
 
 <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-lg space-y-2">
 <div className="w-8 h-8 rounded-lg bg-warning-500/20 border border-warning-500/30 flex items-center justify-center text-accent-400 font-bold">1</div>
 <h3 className="font-bold text-neutral-50 text-sm">Learning Twin</h3>
 <p className="text-neutral-400 leading-relaxed">Continuous cognitive model of mastery, confidence, and speed.</p>
 </div>

 <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-lg space-y-2">
 <div className="w-8 h-8 rounded-lg bg-warning-500/20 border border-warning-500/30 flex items-center justify-center text-accent-400 font-bold">2</div>
 <h3 className="font-bold text-neutral-50 text-sm">Misconception Detector</h3>
 <p className="text-neutral-400 leading-relaxed">Identifies exact underlying mental model errors beyond right/wrong.</p>
 </div>

 <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-lg space-y-2">
 <div className="w-8 h-8 rounded-lg bg-warning-500/20 border border-warning-500/30 flex items-center justify-center text-accent-400 font-bold">3</div>
 <h3 className="font-bold text-neutral-50 text-sm">Adaptive Difficulty</h3>
 <p className="text-neutral-400 leading-relaxed">Scales question difficulty and explanation style in real-time.</p>
 </div>

 <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-lg space-y-2">
 <div className="w-8 h-8 rounded-lg bg-warning-500/20 border border-warning-500/30 flex items-center justify-center text-accent-400 font-bold">4</div>
 <h3 className="font-bold text-neutral-50 text-sm">Retention Prediction</h3>
 <p className="text-neutral-400 leading-relaxed">Predicts memory decay and queue micro-revisions before forgetting.</p>
 </div>

 <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-lg space-y-2">
 <div className="w-8 h-8 rounded-lg bg-warning-500/20 border border-warning-500/30 flex items-center justify-center text-accent-400 font-bold">5</div>
 <h3 className="font-bold text-neutral-50 text-sm">Career Skill Gap</h3>
 <p className="text-neutral-400 leading-relaxed">Benchmarks learner against industry roles with 6-phase roadmaps.</p>
 </div>

 </div>
 </div>

 {/* 5. DASHBOARD CORE METRICS & FEATURES GRID */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 {/* 1. LEARNING TWIN PREVIEW */}
 <div 
 onClick={() => onNavigate('learning-twin')}
 className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover: transition-all cursor-pointer space-y-4 group"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-2 text-accent-800">
 <Brain className="w-5 h-5 text-warning-700" />
 <h3 className="font-editorial text-xl font-bold text-neutral-900 group-hover:text-accent-800">
 AI Learning Twin
 </h3>
 </div>
 <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
 Live Profile
 </span>
 </div>

 <div className="space-y-3 text-xs">
 <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg">
 <span className="text-neutral-600">Overall Mastery:</span>
 <strong className="text-neutral-900 font-sans text-sm">{studentProfile.mastery}%</strong>
 </div>

 <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg">
 <span className="text-neutral-600">Learning Speed:</span>
 <strong className="text-success-700 font-semibold">{studentProfile.learningSpeed}</strong>
 </div>

 <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg">
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
 className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover: transition-all cursor-pointer space-y-4 group"
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
 className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 hover: transition-all cursor-pointer space-y-4 group"
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
 <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
 <div className="bg-accent-600 h-2 rounded-full" style={{ width: '68%' }}></div>
 </div>
 </div>

 <div className="space-y-1.5 text-xs">
 <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">High Priority Gaps:</span>
 <div className="flex flex-wrap gap-1.5">
 <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-medium">1. Generative AI</span>
 <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-medium">2. Deep Learning</span>
 <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-medium">3. SQL</span>
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
