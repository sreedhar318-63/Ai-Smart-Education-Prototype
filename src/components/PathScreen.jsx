import React, { useState } from 'react';
import { 
 Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ShieldCheck, 
 Check, Lock, Calendar, Layers, GitBranch, Info, ExternalLink, Play, 
 ChevronRight, Bookmark, Compass, Award, X, CornerDownRight
} from 'lucide-react';

export default function PathScreen({
 onboardingData,
 pathData,
 currentDay,
 completedTopicIds = [],
 todayTopics = [],
 todayTotalMinutes = 0,
 confidenceMap = {},
 onStartSession,
 onRegeneratePath,
 onGoBack,
 onOpenCertificate,
 isLoading
}) {

 const { topics = [], skillGapMap = null } = pathData || {};
 const totalTopicsCount = topics.length;
 const completedCount = completedTopicIds.length;
 const isMasteryAchieved = completedCount >= totalTopicsCount && totalTopicsCount > 0;

 // View Mode: 'tree' (roadmap.sh flowchart) vs 'list' (detailed timeline)
 const [viewMode, setViewMode] = useState('tree');

 // Selected topic node for roadmap.sh Detail Inspector Modal
 const [selectedTopicNode, setSelectedTopicNode] = useState(null);

 // Calculate total roadmap minutes
 const totalRoadmapMinutes = topics.reduce((acc, t) => acc + (t.estMinutes || 15), 0);

 // Group topics into 3 logical phases (roadmap.sh style pillars)
 const phase1 = topics.slice(0, Math.ceil(topics.length / 3));
 const phase2 = topics.slice(Math.ceil(topics.length / 3), Math.ceil((topics.length * 2) / 3));
 const phase3 = topics.slice(Math.ceil((topics.length * 2) / 3));

 const phases = [
 { title: 'Phase 1: Foundations & Core Concepts', topics: phase1, color: 'emerald' },
 { title: 'Phase 2: Intermediate Patterns & State', topics: phase2, color: 'amber' },
 { title: 'Phase 3: Ecosystem, Architecture & Production', topics: phase3, color: 'indigo' }
 ].filter(p => p.topics.length > 0);

 return (
 <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-duration-300">
 
 {/* Top Banner: Goal Summary & roadmap.sh Header */}
 <div className="bg-neutral-900 text-neutral-100 rounded-lg p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-neutral-800">
 <div className="space-y-3 z-10 max-w-2xl">
 <div className="flex flex-wrap items-center gap-2">
 <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 text-xs font-semibold border border-warning-500/30">
 <Compass className="w-3.5 h-3.5" />
 <span>roadmap.sh Style Interactive Roadmap</span>
 </span>
 <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono-code">
 <span>Day {currentDay} Session</span>
 </span>
 </div>

 <h2 className="font-editorial text-3xl md:text-4xl font-semibold tracking-tight text-neutral-50 leading-tight">
 {onboardingData.goal}
 </h2>

 <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300 pt-1 font-sans">
 <span className="bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700">
 Role: <strong className="text-warning-300 font-semibold">{onboardingData.role}</strong>
 </span>
 <span className="bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700">
 Progress: <strong className="text-success-400 font-semibold">{completedCount} / {totalTopicsCount} Nodes Completed</strong>
 </span>
 <span className="bg-neutral-800/80 px-3 py-1 rounded-full border border-neutral-700">
 Est. Total: <strong className="text-warning-300 font-semibold">~{totalRoadmapMinutes} mins</strong>
 </span>
 </div>
 </div>

 {/* Action Budget Box */}
 <div className="z-10 bg-neutral-800/90 border border-warning-500/30 p-5 rounded-lg md:text-right min-w-[220px] space-y-2">
 <div className="flex items-center md:justify-end space-x-1.5 text-xs text-accent-400 font-medium">
 <Calendar className="w-3.5 h-3.5" />
 <span>Today's Session Target</span>
 </div>
 <div className="text-3xl font-bold text-neutral-50 font-sans">
 ~{todayTotalMinutes} mins
 </div>
 <p className="text-[11px] text-neutral-400">
 {isMasteryAchieved ? 'All roadmap topics completed!' : `${todayTopics.length} topic(s) ready to learn.`}
 </p>

 {!isMasteryAchieved && (
 <button
 onClick={onStartSession}
 disabled={todayTopics.length === 0}
 className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-warning-600 hover:bg-warning-700 text-neutral-50 font-semibold py-2.5 px-4 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-50"
 >
 <Play className="w-3.5 h-3.5 fill-current" />
 <span>Start Day {currentDay}</span>
 </button>
 )}
 </div>
 </div>

 {/* Skill Gap Analysis Box (If Job Description provided) */}
 {skillGapMap && (
 <div className="bg-warning-50/80 border border-warning-200/90 rounded-lg p-6 md:p-8 space-y-4 ">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-2 text-accent-950">
 <ShieldCheck className="w-5 h-5 text-warning-700" />
 <h3 className="font-editorial text-xl font-bold">
 Target Role Skill Gap Analysis: {skillGapMap.targetRole}
 </h3>
 </div>
 <span className="text-xs px-3 py-1 rounded-full bg-warning-200/70 text-warning-900 font-semibold border border-warning-300">
 AI Job Posting Match
 </span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 
 {/* Matched Skills */}
 <div className="bg-neutral-100/90 border border-success-200 rounded-lg p-4 space-y-2">
 <h4 className="text-xs font-bold text-success-800 uppercase tracking-wider flex items-center space-x-1.5">
 <CheckCircle2 className="w-4 h-4 text-success-600" />
 <span>Prerequisite Skills Verified</span>
 </h4>
 <ul className="space-y-1.5 text-xs text-neutral-700">
 {skillGapMap.matchedSkills.map((sk, idx) => (
 <li key={idx} className="flex items-center justify-between bg-success-50/60 px-3 py-1.5 rounded-lg border border-success-100 font-medium">
 <span>{sk.name}</span>
 <span className="text-[10px] bg-success-200 text-success-900 px-2 py-0.5 rounded-md font-bold">{sk.level}</span>
 </li>
 ))}
 </ul>
 </div>

 {/* Target Gaps */}
 <div className="bg-neutral-100/90 border border-warning-300 rounded-lg p-4 space-y-2">
 <h4 className="text-xs font-bold text-warning-900 uppercase tracking-wider flex items-center space-x-1.5">
 <AlertCircle className="w-4 h-4 text-warning-600" />
 <span>Skill Gaps Addressed in Roadmap</span>
 </h4>
 <ul className="space-y-1.5 text-xs text-neutral-700">
 {skillGapMap.missingSkills.map((sk, idx) => (
 <li key={idx} className="flex items-center justify-between bg-warning-100/60 px-3 py-1.5 rounded-lg border border-warning-200">
 <div className="truncate mr-2">
 <p className="font-bold text-neutral-900">{sk.name}</p>
 <p className="text-[10px] text-neutral-500 truncate">{sk.reason}</p>
 </div>
 <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 uppercase ${
 sk.priority === 'High' ? 'bg-error-100 text-error-800 border border-error-200' : 'bg-warning-200 text-warning-900'
 }`}>
 {sk.priority}
 </span>
 </li>
 ))}
 </ul>
 </div>

 </div>
 </div>
 )}

 {/* ROADMAP.SH INTERACTIVE FLOWCHART & NODE TREE CONTAINER */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-10 border border-neutral-200 space-y-8">
 
 {/* Controls Bar: Title, View Switcher & Legend */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
 <div>
 <div className="flex items-center space-x-2">
 <GitBranch className="w-5 h-5 text-warning-700" />
 <h3 className="font-editorial text-2xl font-bold text-neutral-900">
 Interactive Learning Roadmap
 </h3>
 </div>
 <p className="text-xs text-neutral-500 font-sans mt-0.5">
 Click any node card to inspect sub-topics, prerequisites, and detailed concepts.
 </p>
 </div>

 {/* View Mode Switcher */}
 <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
 <button
 onClick={() => setViewMode('tree')}
 className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
 viewMode === 'tree' ? 'bg-neutral-900 text-neutral-50 ' : 'text-neutral-600 hover:text-neutral-900'
 }`}
 >
 <GitBranch className="w-3.5 h-3.5" />
 <span>Flowchart Tree</span>
 </button>
 <button
 onClick={() => setViewMode('list')}
 className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
 viewMode === 'list' ? 'bg-neutral-900 text-neutral-50 ' : 'text-neutral-600 hover:text-neutral-900'
 }`}
 >
 <Layers className="w-3.5 h-3.5" />
 <span>List View</span>
 </button>
 </div>
 </div>

 {/* Legend */}
 <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-xs">
 <span className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">Node Legend:</span>
 <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
 <span className="flex items-center space-x-1.5 text-success-800">
 <span className="w-3 h-3 rounded-md bg-success-500 border border-success-600 flex items-center justify-center text-neutral-50 text-[9px]">✓</span>
 <span>Completed</span>
 </span>
 <span className="flex items-center space-x-1.5 text-warning-900">
 <span className="w-3 h-3 rounded-md bg-warning-500 border border-warning-600 animate-pulse"></span>
 <span>Day {currentDay} Active Focus</span>
 </span>
 <span className="flex items-center space-x-1.5 text-neutral-500">
 <span className="w-3 h-3 rounded-md bg-neutral-300 border border-neutral-400"></span>
 <span>Upcoming Module</span>
 </span>
 </div>
 </div>

 {/* VIEW MODE 1: ROADMAP.SH VISUAL FLOWCHART TREE */}
 {viewMode === 'tree' ? (
 <div className="space-y-12 py-2">
 {phases.map((phase, pIdx) => (
 <div key={pIdx} className="space-y-6">
 
 {/* Phase Pillar Header */}
 <div className="flex items-center space-x-3">
 <div className="px-3 py-1 rounded-full bg-neutral-900 text-warning-300 font-editorial font-bold text-xs ">
 {phase.title}
 </div>
 <div className="flex-1 h-0.5 bg-neutral-200"></div>
 </div>

 {/* Nodes Grid / Flowchart connectors */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
 {phase.topics.map((topic, tIdx) => {
 const globalIdx = topics.findIndex(t => t.id === topic.id);
 const isCompleted = completedTopicIds.includes(topic.id);
 const isTodayActive = todayTopics.some(t => t.id === topic.id);
 const conf = confidenceMap[topic.id];

 return (
 <div
 key={topic.id}
 onClick={() => setSelectedTopicNode(topic)}
 className={`group relative p-5 rounded-lg border-2 transition-all cursor-pointer hover: ${
 isCompleted
 ? 'bg-success-50/50 border-success-300 hover:border-success-500'
 : isTodayActive 
 ? 'bg-warning-50/60 border-accent-400 ring-2 ring-warning-200 hover:border-warning-600' 
 : 'bg-neutral-50/60 border-neutral-200 hover:border-neutral-400 opacity-80'
 }`}
 >
 {/* Node Top Row */}
 <div className="flex items-center justify-between gap-2 mb-2">
 <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-700">
 Node #{globalIdx + 1}
 </span>

 <span className="text-xs font-mono-code font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-md border border-neutral-200">
 ⏱ {topic.estMinutes}m
 </span>
 </div>

 {/* Node Title */}
 <h4 className="font-sans font-bold text-neutral-900 text-base group-hover:text-accent-800 transition-colors flex items-center justify-between">
 <span>{topic.title}</span>
 <Info className="w-4 h-4 text-neutral-400 group-hover:text-warning-700 shrink-0 ml-2" />
 </h4>

 {/* Node Description */}
 <p className="text-xs text-neutral-600 leading-relaxed font-sans line-clamp-2 mt-1">
 {topic.description}
 </p>

 {/* Status Badges Row */}
 <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
 {isCompleted ? (
 <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-success-800 bg-success-100 px-2.5 py-0.5 rounded-full border border-success-300">
 <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
 <span>Completed ({conf?.rating || 'Got it'})</span>
 </span>
 ) : isTodayActive ? (
 <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-warning-900 bg-warning-200 px-2.5 py-0.5 rounded-full border border-warning-300 animate-pulse">
 <Sparkles className="w-3.5 h-3.5 text-warning-700" />
 <span>Day {currentDay} Active Focus</span>
 </span>
 ) : (
 <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-neutral-500 bg-neutral-200/70 px-2.5 py-0.5 rounded-full">
 <Lock className="w-3 h-3 text-neutral-400" />
 <span>Queued</span>
 </span>
 )}

 <span className="text-[11px] font-semibold text-accent-800 group-hover:underline flex items-center">
 Inspect Concept <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 ) : (
 /* VIEW MODE 2: DETAILED TIMELINE LIST */
 <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
 {topics.map((topic, index) => {
 const isCompleted = completedTopicIds.includes(topic.id);
 const isTodayActive = todayTopics.some(t => t.id === topic.id);
 const conf = confidenceMap[topic.id];

 return (
 <div key={topic.id} className="relative flex items-start space-x-4 group">
 <div className={`absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans border-2 transition-all ${
 isCompleted
 ? 'bg-success-600 text-neutral-50 border-success-700'
 : isTodayActive 
 ? 'bg-warning-600 text-neutral-50 border-warning-700 ring-4 ring-warning-100' 
 : 'bg-neutral-100 text-neutral-400 border-neutral-300'
 }`}>
 {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
 </div>

 <div 
 onClick={() => setSelectedTopicNode(topic)}
 className={`flex-1 p-5 rounded-lg border transition-all cursor-pointer hover: ${
 isCompleted
 ? 'bg-success-50/40 border-success-200'
 : isTodayActive 
 ? 'bg-warning-50/40 border-warning-300 ' 
 : 'bg-neutral-50/60 border-neutral-200 opacity-60'
 }`}
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
 <h4 className="font-sans font-bold text-neutral-900 text-base">
 {topic.title}
 </h4>
 <span className="text-xs font-mono-code text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 shrink-0">
 ⏱ {topic.estMinutes} mins
 </span>
 </div>

 <p className="text-xs text-neutral-600 leading-relaxed font-sans">
 {topic.description}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* Footer Action Bar */}
 <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
 <button
 onClick={onRegeneratePath}
 disabled={isLoading}
 className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium underline underline-offset-4 cursor-pointer"
 >
 Re-generate Master Path via AI
 </button>

 {isMasteryAchieved ? (
 <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
 <span className="text-xs font-bold text-success-700 bg-success-100 px-3 py-1 rounded-full border border-success-300">
 🎉 Roadmap 100% Completed!
 </span>
 <button
 onClick={onOpenCertificate}
 className="inline-flex items-center space-x-2 hover:hover:text-neutral-50 font-bold py-3 px-6 rounded-lg text-xs transition-all hover: cursor-pointer"
 >
 <span>🎓 View & Download Official Certificate</span>
 </button>
 </div>
 ) : (

 <button
 onClick={onStartSession}
 disabled={todayTopics.length === 0}
 className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-warning-700 hover:bg-accent-800 text-neutral-50 font-semibold py-3.5 px-8 rounded-lg text-sm transition-all hover: cursor-pointer disabled:opacity-50"
 >
 <Play className="w-4 h-4 fill-current" />
 <span>Start Day {currentDay} Session (~{todayTotalMinutes} mins)</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>

 </div>

 {/* ROADMAP.SH INTERACTIVE CONCEPT EXPLORER MODAL */}
 {selectedTopicNode && (
 <div className="fixed inset-0 z-50 bg-neutral-900/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 max-w-xl w-full border border-neutral-200 space-y-6 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
 
 <button
 onClick={() => setSelectedTopicNode(null)}
 className="absolute top-6 right-6 p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>

 {/* Modal Header */}
 <div className="space-y-2 pr-8">
 <div className="flex items-center space-x-2">
 <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-warning-100 text-warning-900 border border-warning-300">
 Concept Node Inspector
 </span>
 <span className="text-xs font-mono-code text-neutral-500">
 ⏱ {selectedTopicNode.estMinutes} Mins Estimated
 </span>
 </div>
 <h3 className="font-editorial text-2xl font-bold text-neutral-900">
 {selectedTopicNode.title}
 </h3>
 </div>

 {/* Overview Description */}
 <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-sans space-y-2">
 <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider text-accent-800">
 Core Conceptual Breakdown
 </h4>
 <p>{selectedTopicNode.description}</p>
 </div>

 {/* Sub-Topics Checklist (roadmap.sh style breakdown) */}
 <div className="space-y-3">
 <h4 className="font-editorial font-bold text-sm text-neutral-900 flex items-center space-x-1.5">
 <CornerDownRight className="w-4 h-4 text-warning-700" />
 <span>Sub-topics & Key Pillars Covered:</span>
 </h4>
 
 <ul className="space-y-2 text-xs font-sans">
 <li className="flex items-start space-x-2 bg-neutral-100 p-3 rounded-lg border border-neutral-200">
 <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
 <div>
 <span className="font-bold text-neutral-900">1. Intuitive Metaphor & Analogy:</span>
 <p className="text-neutral-600 text-[11px]">Tied directly to your domain metaphor ({onboardingData.domain}).</p>
 </div>
 </li>

 <li className="flex items-start space-x-2 bg-neutral-100 p-3 rounded-lg border border-neutral-200">
 <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
 <div>
 <span className="font-bold text-neutral-900">2. Explain-o-Meter Adaptability:</span>
 <p className="text-neutral-600 text-[11px]">From ELI5 zero-jargon up to Expert Senior Engineer mechanics.</p>
 </div>
 </li>

 <li className="flex items-start space-x-2 bg-neutral-100 p-3 rounded-lg border border-neutral-200">
 <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
 <div>
 <span className="font-bold text-neutral-900">3. Active Recall Retention:</span>
 <p className="text-neutral-600 text-[11px]">3D flippable flashcard practice during your session recap.</p>
 </div>
 </li>
 </ul>
 </div>

 {/* Modal Actions */}
 <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
 <button
 onClick={() => setSelectedTopicNode(null)}
 className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
 >
 Close Inspector
 </button>

 {!completedTopicIds.includes(selectedTopicNode.id) && (
 <button
 onClick={() => {
 setSelectedTopicNode(null);
 onStartSession();
 }}
 className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-warning-700 hover:bg-accent-800 text-neutral-50 font-semibold py-2.5 px-6 rounded-lg text-xs transition-all cursor-pointer"
 >
 <Play className="w-3.5 h-3.5 fill-current" />
 <span>Start Lesson Node</span>
 </button>
 )}
 </div>

 </div>
 </div>
 )}

 </div>
 );
}
