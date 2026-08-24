import React, { useState } from 'react';
import { 
 Target, Award, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
 Lock, Sparkles, Compass, ShieldAlert, Zap, Layers, Briefcase, Search, Plus
} from 'lucide-react';
import { 
 CAREER_PROFILES, 
 calculateCareerReadiness, 
 generatePersonalizedRoadmap 
} from '../services/aiEngine';

export default function CareerGapView({
 studentProfile,
 skills,
 careerGoal,
 onSelectCareer,
 onGoBack,
 onNavigate
}) {
 const [activeTarget, setActiveTarget] = useState(careerGoal || "AI Engineer");
 const [searchQuery, setSearchQuery] = useState("");
 const [customGoalInput, setCustomGoalInput] = useState("");

 const readinessData = calculateCareerReadiness(activeTarget, skills);
 const roadmapPhases = generatePersonalizedRoadmap(activeTarget, skills);

 const handleGoalChange = (goalTitle) => {
 if (!goalTitle.trim()) return;
 setActiveTarget(goalTitle.trim());
 if (onSelectCareer) onSelectCareer(goalTitle.trim());
 };

 const handleCustomGoalSubmit = (e) => {
 e.preventDefault();
 if (customGoalInput.trim()) {
 handleGoalChange(customGoalInput.trim());
 setCustomGoalInput("");
 }
 };

 // Filter preset profiles by search query
 const filteredProfiles = CAREER_PROFILES.filter(p => 
 p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 p.description.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
 <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
 
 {/* HEADER */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 text-neutral-100 p-6 md:p-8 rounded-lg ">
 <div className="space-y-2">
 <div className="flex items-center space-x-2">
 <button 
 onClick={onGoBack} 
 className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer mr-1"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>
 <span className="text-xs px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 font-semibold border border-warning-500/30">
 Technical Goal Benchmark Engine
 </span>
 </div>
 <h1 className="font-editorial text-3xl md:text-4xl font-bold tracking-tight text-neutral-50">
 Technical Goal & Career Readiness
 </h1>
 <p className="text-xs text-neutral-300 font-sans max-w-xl">
 Search, customize, or type any technical goal to analyze skill gaps and generate a 6-phase personalized roadmap.
 </p>
 </div>

 <div className="bg-neutral-800/90 border border-warning-500/40 p-4 rounded-lg shrink-0 space-y-1">
 <span className="text-[10px] uppercase font-bold text-accent-400 block tracking-wider">Active Technical Goal:</span>
 <div className="text-lg font-bold text-neutral-50 font-sans flex items-center space-x-2">
 <Target className="w-4 h-4 text-accent-400" />
 <span>{activeTarget}</span>
 </div>
 </div>
 </div>

 {/* SEARCH AND SET CUSTOM TECHNICAL GOALS SECTION */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 <div className="space-y-2">
 <h2 className="font-editorial text-2xl font-bold text-neutral-900 flex items-center space-x-2">
 <Search className="w-5 h-5 text-warning-700" />
 <span>Search & Fix Your Technical Goal</span>
 </h2>
 <p className="text-xs text-neutral-500 font-sans">
 Don't see your target role? Type any custom goal (e.g. <em>Fullstack Next.js Developer</em>, <em>Robotics AI Architect</em>) to fix your goal state.
 </p>
 </div>

 {/* SEARCH AND CUSTOM INPUT ROW */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
 {/* SEARCH PRESET GOALS */}
 <div className="relative">
 <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search popular technical goals..."
 className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-10 pr-4 py-3 text-xs font-medium text-neutral-800 focus:outline-none focus:border-warning-600 focus:bg-neutral-100"
 />
 </div>

 {/* CUSTOM GOAL INPUT FORM */}
 <form onSubmit={handleCustomGoalSubmit} className="flex gap-2">
 <input
 type="text"
 value={customGoalInput}
 onChange={(e) => setCustomGoalInput(e.target.value)}
 placeholder="Or enter custom technical goal..."
 className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-3 text-xs font-medium text-neutral-800 focus:outline-none focus:border-warning-600 focus:bg-neutral-100"
 />
 <button
 type="submit"
 disabled={!customGoalInput.trim()}
 className="bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold px-4 py-3 rounded-lg text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center space-x-1"
 >
 <Plus className="w-4 h-4" />
 <span>Fix Goal</span>
 </button>
 </form>

 </div>

 {/* POPULAR GOAL PILLS / SEARCH RESULTS */}
 <div className="space-y-2 pt-2">
 <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Available & Popular Goals:</span>
 <div className="flex flex-wrap gap-2">
 {filteredProfiles.map((p) => {
 const isSelected = activeTarget.toLowerCase() === p.title.toLowerCase();

 return (
 <button
 key={p.title}
 onClick={() => handleGoalChange(p.title)}
 className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
 isSelected
 ? 'bg-warning-500/15 border-warning-600 text-accent-950 font-bold '
 : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
 }`}
 >
 <Target className="w-3.5 h-3.5 text-warning-700" />
 <span>{p.title}</span>
 {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent-800 ml-1" />}
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* CAREER READINESS SCORE BANNER */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-neutral-100 pb-6">
 <div className="space-y-1 text-center md:text-left">
 <span className="text-xs font-bold text-accent-800 uppercase tracking-wider">Benchmark Evaluation</span>
 <h2 className="font-editorial text-2xl font-bold text-neutral-900">
 Your AI Readiness Score for <span className="text-warning-700 italic">{readinessData.careerTitle}</span>
 </h2>
 <p className="text-xs text-neutral-500 font-sans">
 Weighted calculation across critical vs optional skills for <strong>{readinessData.careerTitle}</strong>.
 </p>
 </div>

 <div className="flex items-center space-x-4 bg-warning-50 px-6 py-4 rounded-lg border border-warning-200">
 <div className="text-4xl font-bold text-warning-900 font-sans">
 {readinessData.readinessScore}%
 </div>
 <div className="text-xs font-medium text-accent-950">
 <span className="block font-bold text-sm">Readiness Score</span>
 <span className="text-[11px] text-accent-800">Target: 85%+ Job-Ready</span>
 </div>
 </div>
 </div>

 {/* HIGH PRIORITY GAPS */}
 <div className="space-y-3">
 <h3 className="font-bold text-neutral-900 text-sm font-sans flex items-center space-x-2">
 <ShieldAlert className="w-4 h-4 text-error-600" />
 <span>High Priority Skill Gaps Detected:</span>
 </h3>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {readinessData.highPriorityGaps.slice(0, 3).map((gap, idx) => (
 <div key={idx} className="bg-error-50/70 border border-error-200 p-4 rounded-lg space-y-1 text-xs">
 <div className="flex justify-between font-bold text-error-950">
 <span>{gap.skillName}</span>
 <span className="text-[10px] bg-error-200 text-error-900 px-2 py-0.5 rounded font-bold uppercase">{gap.importance}</span>
 </div>
 <p className="text-neutral-600">Current: {gap.currentLevel}% • Required: {gap.requiredLevel}%</p>
 <div className="w-full bg-error-200 rounded-full h-1.5 overflow-hidden mt-1">
 <div className="bg-error-600 h-1.5 rounded-full" style={{ width: `${gap.currentLevel}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* FULL SKILLS COMPARISON BREAKDOWN */}
 <div className="space-y-3 pt-4 border-t border-neutral-100">
 <h3 className="font-bold text-neutral-900 text-sm font-sans">Required Skills Breakdown for {readinessData.careerTitle}:</h3>

 <div className="space-y-2">
 {readinessData.gaps.map((g, idx) => (
 <div key={idx} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
 <div className="w-1/3 font-bold text-neutral-800">{g.skillName}</div>
 <div className="w-1/2 space-y-1">
 <div className="flex justify-between text-[10px] text-neutral-500">
 <span>Level: {g.currentLevel}%</span>
 <span>Target: {g.requiredLevel}%</span>
 </div>
 <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
 <div className="bg-warning-600 h-2 rounded-full" style={{ width: `${Math.min(100, (g.currentLevel / g.requiredLevel) * 100)}%` }}></div>
 </div>
 </div>
 <div className="w-1/6 text-right font-bold text-neutral-700">
 {g.gap > 0 ? `-${g.gap}% Gap` : `✓ Match`}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* PERSONALIZED 6-PHASE LEARNING ROADMAP */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
 <div className="flex items-center space-x-2">
 <Compass className="w-5 h-5 text-warning-700" />
 <h2 className="font-editorial text-2xl font-bold text-neutral-900">
 Personalized Learning Roadmap for {readinessData.careerTitle}
 </h2>
 </div>
 <span className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-bold border border-neutral-200">
 6 Phases
 </span>
 </div>

 <div className="space-y-4">
 {roadmapPhases.map((phase) => {
 const isCompleted = phase.status === 'Completed';
 const isInProgress = phase.status === 'In Progress';

 return (
 <div
 key={phase.phase}
 className={`p-5 rounded-lg border transition-all space-y-3 ${
 isCompleted 
 ? 'bg-success-50/50 border-success-300' 
 : isInProgress 
 ? 'bg-warning-50/60 border-accent-400 ring-2 ring-warning-200' 
 : 'bg-neutral-50 border-neutral-200 opacity-70'
 }`}
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="flex items-center space-x-3">
 <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${
 isCompleted ? 'bg-success-600 text-neutral-50' : isInProgress ? 'bg-warning-600 text-neutral-50' : 'bg-neutral-300 text-neutral-700'
 }`}>
 {phase.phase}
 </span>
 <h3 className="font-bold text-neutral-900 text-base font-sans">{phase.title}</h3>
 </div>

 <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
 isCompleted ? 'bg-success-200 text-success-900' : isInProgress ? 'bg-warning-200 text-accent-950 animate-pulse' : 'bg-neutral-200 text-neutral-600'
 }`}>
 {phase.status}
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
 <div className="bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
 <span className="text-[10px] text-neutral-400 font-bold uppercase block">Est Time & Target</span>
 <span className="font-semibold text-neutral-800">{phase.estTime} • {phase.masteryTarget}</span>
 </div>

 <div className="bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
 <span className="text-[10px] text-neutral-400 font-bold uppercase block">Practical Project</span>
 <span className="font-semibold text-warning-900">{phase.project}</span>
 </div>

 <div className="bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
 <span className="text-[10px] text-neutral-400 font-bold uppercase block">Assessment</span>
 <span className="font-semibold text-neutral-800">{phase.assessment}</span>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 <div className="pt-4 border-t border-neutral-200 flex justify-end">
 <button
 onClick={() => onNavigate('adaptive-quiz')}
 className="flex items-center space-x-2 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3.5 px-6 rounded-lg text-xs transition-all cursor-pointer"
 >
 <span>Start Active Phase Quiz</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>

 </div>

 </div>
 );
}
