import React, { useState, useEffect } from 'react';
import { User, Flame, Award, Clock, BookOpen, Sparkles, Brain, CheckCircle2, AlertTriangle, XCircle, Sliders, ChefHat, HelpCircle, Info, FileText } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';

export default function LearnerProfileScreen({
 onboardingData,
 learnerModel,
 heatmapData,
 onReturnToLearning,
 onOpenResumeBuilder,
 onOpenCertificate
}) {

 const [insightChips, setInsightChips] = useState([]);
 const [isLoadingChips, setIsLoadingChips] = useState(false);
 const [hoveredDay, setHoveredDay] = useState(null);

 // Fetch AI-generated insight chips derived from learnerModel
 useEffect(() => {
 let isSubscribed = true;

 async function loadChips() {
 setIsLoadingChips(true);
 try {
 const userPrompt = `Summarize the following learner model into 3-4 concise adaptive insight chips:
Goal: ${onboardingData.goal} (${onboardingData.skillLevel} level)
Domain: ${onboardingData.domain}
Preferred Depth: ${learnerModel.preferredLevel || 'ELI10'}
Preferred Style: ${learnerModel.preferredStyle || 'Analogy'}
Weak Topics: ${learnerModel.weakTopics?.join(', ') || 'None'}
Average Confusion Cycles per Topic: ${learnerModel.avgCycles || 0}`;

 const res = await generatePersonalizedContent({
 type: 'learner_model_summary',
 systemPrompt: 'You are an AI Learning Analytics Engine. Summarize learner cognitive state into crisp insight chips.',
 userPrompt,
 context: {
 goal: onboardingData.goal,
 domain: onboardingData.domain,
 learnerModel
 }
 });

 if (isSubscribed) {
 if (res?.chips) {
 setInsightChips(res.chips);
 } else {
 setInsightChips([
 { label: `You learn best with: ${learnerModel.preferredStyle || 'Analogies'} (${onboardingData.domain})`, category: 'style' },
 { label: `Preferred depth: ${learnerModel.preferredLevel || 'ELI10 (School)'}`, category: 'depth' },
 { label: `Pace signal: ${learnerModel.avgCycles > 1 ? 'High curiosity / Re-explores' : 'Steady progress'}`, category: 'pace' },
 { label: `Watch out for: ${learnerModel.weakTopics?.length > 0 ? learnerModel.weakTopics.slice(0, 2).join(', ') : 'State side-effects'}`, category: 'warning' }
 ]);
 }
 }
 } catch (err) {
 console.error('Failed to load insight chips:', err);
 } finally {
 if (isSubscribed) setIsLoadingChips(false);
 }
 }

 loadChips();

 return () => {
 isSubscribed = false;
 };
 }, [learnerModel, onboardingData.goal, onboardingData.domain]);

 // Color mapping for 90-day heatmap intensity cells
 const getCellBgClass = (intensity, isToday) => {
 if (isToday && intensity === 0) return 'bg-warning-100 border-2 border-warning-500 animate-pulse';
 if (isToday) return 'bg-success-500 border-2 border-accent-400 ring-2 ring-warning-200';
 switch (intensity) {
 case 1: return 'bg-success-200';
 case 2: return 'bg-success-400';
 case 3: return 'bg-success-600';
 case 4: return 'bg-success-800';
 default: return 'bg-neutral-100 border border-neutral-200/60';
 }
 };

 return (
 <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-duration-300">
 
 {/* 1. PROFILE HEADER */}
 <div className="bg-neutral-900 text-neutral-100 rounded-lg p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 
 {/* User Info */}
 <div className="flex items-start space-x-4 z-10">
 <div className="w-14 h-14 rounded-lg bg-warning-600/20 text-accent-400 border border-warning-500/30 flex items-center justify-center font-editorial text-2xl font-bold shrink-0">
 <User className="w-7 h-7 text-accent-400" />
 </div>
 <div className="space-y-1">
 <div className="flex items-center space-x-2">
 <h2 className="font-editorial text-2xl md:text-3xl font-bold text-neutral-50 tracking-tight">
 Learner Profile & Analytics
 </h2>
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-warning-500/20 text-warning-300 border border-warning-500/30 uppercase font-semibold tracking-wider font-mono-code">
 {onboardingData.role}
 </span>
 </div>
 <p className="text-sm text-neutral-300 font-sans">
 Goal: <strong className="text-warning-300">{onboardingData.goal}</strong> • Level: <span className="italic">{onboardingData.skillLevel}</span>
 </p>
 <p className="text-xs text-neutral-400 font-sans">
 Analogy Engine Domain: <strong className="text-neutral-50 uppercase">{onboardingData.domain}</strong>
 </p>
 </div>
 </div>

 {/* Stats Counter Cards */}
 <div className="grid grid-cols-3 gap-3 w-full md:w-auto z-10">
 {/* Streak Counter */}
 <div className="bg-neutral-800/90 border border-neutral-700/80 p-3.5 rounded-lg text-center space-y-0.5">
 <div className="flex items-center justify-center space-x-1 text-accent-400 text-xs font-semibold">
 <Flame className="w-4 h-4 fill-amber-400" />
 <span>Streak</span>
 </div>
 <div className="text-2xl font-bold text-neutral-50 font-sans">
 {learnerModel.currentStreak || 5}d
 </div>
 <div className="text-[10px] text-neutral-400">
 Longest: {learnerModel.longestStreak || 12}d
 </div>
 </div>

 {/* Topics Completed */}
 <div className="bg-neutral-800/90 border border-neutral-700/80 p-3.5 rounded-lg text-center space-y-0.5">
 <div className="flex items-center justify-center space-x-1 text-success-400 text-xs font-semibold">
 <BookOpen className="w-4 h-4" />
 <span>Topics</span>
 </div>
 <div className="text-2xl font-bold text-neutral-50 font-sans">
 {learnerModel.completedTopicsCount || 0}
 </div>
 <div className="text-[10px] text-neutral-400">
 Completed
 </div>
 </div>

 {/* Time Spent */}
 <div className="bg-neutral-800/90 border border-neutral-700/80 p-3.5 rounded-lg text-center space-y-0.5">
 <div className="flex items-center justify-center space-x-1 text-cyan-400 text-xs font-semibold">
 <Clock className="w-4 h-4" />
 <span>Time</span>
 </div>
 <div className="text-2xl font-bold text-neutral-50 font-sans">
 ~{learnerModel.totalMinutesSpent || 0}m
 </div>
 <div className="text-[10px] text-neutral-400">
 Total Focus
 </div>
 </div>
 </div>

 </div>

 {/* 2. ACTIVITY HEATMAP (90-DAY GITHUB CONTRIBUTION STYLE) */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-4">
 
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div>
 <div className="flex items-center space-x-2">
 <Sparkles className="w-4 h-4 text-warning-700" />
 <h3 className="font-editorial text-2xl font-bold text-neutral-900">
 90-Day Learning Activity Heatmap
 </h3>
 </div>
 <p className="text-xs text-neutral-500 font-sans">
 Visual record of study consistency. Today's cell updates live as you complete topics.
 </p>
 </div>

 {/* Legend */}
 <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 font-medium">
 <span>Less</span>
 <span className="w-3 h-3 rounded-xs bg-neutral-100 border border-neutral-200"></span>
 <span className="w-3 h-3 rounded-xs bg-success-200"></span>
 <span className="w-3 h-3 rounded-xs bg-success-400"></span>
 <span className="w-3 h-3 rounded-xs bg-success-600"></span>
 <span className="w-3 h-3 rounded-xs bg-success-800"></span>
 <span>More</span>
 </div>
 </div>

 {/* Notice Callout */}
 <div className="flex items-center space-x-2 bg-warning-50/80 border border-warning-200/80 px-3.5 py-2 rounded-lg text-xs text-warning-900">
 <Info className="w-4 h-4 text-warning-700 shrink-0" />
 <span>
 <strong>Prototype Note:</strong> Heatmap is initialized with seeded mock historical data on app load and updates live during your session. Resets on refresh (no backend/localStorage persistence).
 </span>
 </div>

 {/* Heatmap Grid */}
 <div className="relative overflow-x-auto pb-2">
 <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 p-2 bg-neutral-50/80 border border-neutral-200/80 rounded-lg">
 {heatmapData.map((day, idx) => (
 <div
 key={day.dateStr}
 onMouseEnter={() => setHoveredDay(day)}
 onMouseLeave={() => setHoveredDay(null)}
 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-all cursor-pointer hover:ring-2 hover:ring-warning-500 ${getCellBgClass(day.intensity, day.isToday)}`}
 title={`${day.formattedDate}: ${day.count} topic(s) covered`}
 />
 ))}
 </div>

 {/* Tooltip display */}
 {hoveredDay && (
 <div className="mt-2 p-3 bg-neutral-900 text-neutral-100 rounded-lg text-xs space-y-1 animate-in fade-in duration-150 inline-block font-sans">
 <div className="font-semibold text-accent-400">
 {hoveredDay.formattedDate} {hoveredDay.isToday && '(Today - Live Session Data)'}
 </div>
 <div className="text-neutral-300">
 Topics Covered ({hoveredDay.count}): {hoveredDay.topicsCovered.length > 0 ? hoveredDay.topicsCovered.join(', ') : 'Rest / Reflection day'}
 </div>
 </div>
 )}
 </div>

 </div>

 {/* 3. ADAPTIVE LEARNING TRACKER */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
 <div>
 <div className="flex items-center space-x-2">
 <Brain className="w-5 h-5 text-warning-700" />
 <h3 className="font-editorial text-2xl font-bold text-neutral-900">
 Adaptive Learning Model & Cognitive Insights
 </h3>
 </div>
 <p className="text-xs text-neutral-500 font-sans">
 This <code className="text-accent-800 font-mono-code font-bold">learnerModel</code> is injected into every black-box LLM call to tailor AI tone, analogies, and difficulty.
 </p>
 </div>
 </div>

 {/* AI-Generated Insight Chips */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans">
 AI-Synthesized Learner Insight Chips (Auto-generated via LLM)
 </h4>

 {isLoadingChips ? (
 <div className="py-4 text-xs text-neutral-400 animate-pulse">Synthesizing cognitive chips...</div>
 ) : (
 <div className="flex flex-wrap gap-2.5">
 {insightChips.map((chip, i) => (
 <div
 key={i}
 className={`px-3.5 py-2 rounded-lg border text-xs font-medium flex items-center space-x-2 ${
 chip.category === 'style' 
 ? 'bg-warning-50 border-warning-300 text-warning-900' 
 : chip.category === 'warning' 
 ? 'bg-error-50 border-error-300 text-error-900' 
 : 'bg-success-50 border-success-300 text-success-900'
 }`}
 >
 <Sparkles className="w-3.5 h-3.5 text-warning-700 shrink-0" />
 <span>{chip.label}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Model Metrics Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
 
 {/* Preferred Depth */}
 <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-1">
 <div className="flex items-center space-x-2 text-accent-800 text-xs font-bold uppercase">
 <Sliders className="w-4 h-4 text-warning-700" />
 <span>Preferred Depth</span>
 </div>
 <div className="text-lg font-bold text-neutral-900 font-sans">
 {learnerModel.preferredLevel || 'ELI10 (School)'}
 </div>
 <p className="text-[11px] text-neutral-500">
 Most frequently selected complexity level on Explain-o-Meter.
 </p>
 </div>

 {/* Preferred Style */}
 <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-1">
 <div className="flex items-center space-x-2 text-accent-800 text-xs font-bold uppercase">
 <ChefHat className="w-4 h-4 text-warning-700" />
 <span>Best-Fit Style</span>
 </div>
 <div className="text-lg font-bold text-neutral-900 font-sans">
 {learnerModel.preferredStyle || 'Analogy Engine'}
 </div>
 <p className="text-[11px] text-neutral-500">
 Style stopped on when using "I'm still confused" cycler.
 </p>
 </div>

 {/* Pace & Confusion Signal */}
 <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-1">
 <div className="flex items-center space-x-2 text-accent-800 text-xs font-bold uppercase">
 <HelpCircle className="w-4 h-4 text-warning-700" />
 <span>Pace & Confusion Signal</span>
 </div>
 <div className="text-lg font-bold text-neutral-900 font-sans">
 {learnerModel.avgCycles > 1 ? 'High Curiosity / Re-explores' : 'Steady Pace'}
 </div>
 <p className="text-[11px] text-neutral-500">
 Average {learnerModel.avgCycles || 0} style cycle(s) per topic.
 </p>
 </div>

 </div>

 {/* System Prompt Injection Inspector Codebox */}
 <div className="bg-neutral-900 text-neutral-200 rounded-lg p-5 border border-neutral-800 space-y-2 font-mono-code text-xs">
 <div className="flex items-center justify-between text-accent-400 font-semibold text-[11px] uppercase tracking-wider">
 <span>Injected LLM System Prompt Context</span>
 <span className="text-success-400">Active in generatePersonalizedContent()</span>
 </div>
 <pre className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
{`[ADAPTIVE LEARNER MODEL CONTEXT]:
- Preferred Complexity Depth: ${learnerModel.preferredLevel || 'ELI10'}
- Best-Fit Explanation Style: ${learnerModel.preferredStyle || 'Analogy'}
- Topics Learner Struggled With: ${learnerModel.weakTopics?.join(', ') || 'None'}
- Pace Signal: ${learnerModel.avgCycles || 0} cycles per topic.
INSTRUCTION: Adapt your explanation style accordingly. If this topic is conceptually related to something they struggled with, build a helpful cognitive bridge.`}
 </pre>
 </div>

 {/* AI Resume Builder CTA Banner */}
 <div className="text-neutral-100 rounded-lg p-6 border border-warning-600/40 flex flex-col sm:flex-row items-center justify-between gap-4 ">
 <div className="space-y-1">
 <div className="flex items-center space-x-2 text-accent-400 font-bold text-xs uppercase tracking-wider">
 <Sparkles className="w-4 h-4" />
 <span>Job Readiness Tool</span>
 </div>
 <h4 className="font-editorial text-xl font-bold text-neutral-50">
 Generate AI Skill-Based Resume
 </h4>
 <p className="text-xs text-neutral-300 font-sans">
 Synthesize your completed roadmap topics into an ATS-optimized CV with custom bullet points.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
 <button
 onClick={onOpenCertificate}
 className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-warning-600 hover:bg-warning-700 text-neutral-50 font-bold py-3 px-5 rounded-lg text-xs transition-all cursor-pointer"
 >
 <Award className="w-4 h-4 text-warning-200" />
 <span>Official Certificate</span>
 </button>

 <button
 onClick={onOpenResumeBuilder}
 className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-warning-500 hover:bg-warning-600 text-neutral-950 font-bold py-3 px-5 rounded-lg text-xs transition-all cursor-pointer"
 >
 <FileText className="w-4 h-4" />
 <span>AI Resume Builder</span>
 </button>
 </div>

 </div>

 </div>

 </div>
 );
}
