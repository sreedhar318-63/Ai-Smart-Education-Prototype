import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, XCircle, Sliders, ChefHat, ArrowRight, RefreshCcw, BookOpen, Quote, ShieldAlert, Cpu, ArrowLeft, Lightbulb, Zap } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';
import { PERSONAS } from './Navbar';

const EXPLAIN_LEVELS = [
 { id: 'ELI5', label: 'ELI5 (5 Year Old)', desc: 'Zero jargon, pure simple metaphors' },
 { id: 'ELI10', label: 'ELI10 (School)', desc: 'Plain language, practical intuition' },
 { id: 'ELI20', label: 'ELI20 (Peer)', desc: 'Professional engineer-to-peer discussion' },
 { id: 'Expert', label: 'Expert', desc: 'Internal mechanics & memory trade-offs' }
];

const CONFUSION_STYLES = [
 { id: 'Analogy', label: '1. Domain Analogy', icon: '🍳' },
 { id: 'Story', label: '2. Scenario Story', icon: '📖' },
 { id: 'Visual', label: '3. Visual / Diagram', icon: '📐' },
 { id: 'Worked Example', label: '4. Worked Step Example', icon: '🛠' },
 { id: 'Expert', label: '5. Expert Mode', icon: '🔬' }
];

export default function LearningScreen({
 currentTopic,
 topicIndex,
 totalTodayTopics,
 currentDay = 1,
 onboardingData,
 persona,
 learnerModel,
 onSaveTopicConfidence,
 onFinishSession,
 onGoBack
}) {
 const [explainLevelIndex, setExplainLevelIndex] = useState(1); // Default ELI10
 const [styleIndex, setStyleIndex] = useState(0); // Default Analogy
 const [explanationData, setExplanationData] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [confusedCycleCount, setConfusedCycleCount] = useState(0);

 // Active Toast/Notice Banner state when switching styles or clicking ratings
 const [activeToast, setActiveToast] = useState(null);

 // Remediation Modal State when user clicks "Still lost"
 const [showRemediationModal, setShowRemediationModal] = useState(false);

 const currentLevel = EXPLAIN_LEVELS[explainLevelIndex];
 const currentStyle = CONFUSION_STYLES[styleIndex];

 // Active persona object
 const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

 // Fetch or re-generate explanation whenever topic, level, style, or persona changes
 useEffect(() => {
 let isSubscribed = true;

 async function loadExplanation() {
 setIsLoading(true);
 try {
 const systemPrompt = activePersonaObj.systemPrompt;
 const userPrompt = `Explain the concept "${currentTopic.title}" for a learner whose overall goal is "${onboardingData.goal}".
Required Complexity Level: ${currentLevel.id} (${currentLevel.desc}).
Required Style Approach: ${currentStyle.id}.
Analogy Domain to integrate: "${onboardingData.domain}".
Topic Description: ${currentTopic.description}.`;

 const res = await generatePersonalizedContent({
 type: 'topic_explanation',
 systemPrompt,
 userPrompt,
 learnerModel,
 context: {
 topicName: currentTopic.title,
 goal: onboardingData.goal,
 domain: onboardingData.domain,
 persona: persona,
 level: currentLevel.id,
 style: currentStyle.id,
 learnerModel
 }
 });

 if (isSubscribed) {
 if (typeof res === 'object') {
 setExplanationData(res);
 } else {
 setExplanationData({
 headline: `Explanation of ${currentTopic.title}`,
 body: res,
 keyTakeaway: `Key Takeaway: Master ${currentTopic.title} to progress in ${onboardingData.goal}.`
 });
 }
 }
 } catch (err) {
 console.error('Failed to load explanation:', err);
 } finally {
 if (isSubscribed) setIsLoading(false);
 }
 }

 loadExplanation();

 return () => {
 isSubscribed = false;
 };
 }, [currentTopic.id, explainLevelIndex, styleIndex, persona, onboardingData.domain]);

 // Handle "I'm still confused" button click
 const handleStillConfused = () => {
 const nextStyleIndex = (styleIndex + 1) % CONFUSION_STYLES.length;
 const nextStyleObj = CONFUSION_STYLES[nextStyleIndex];
 setStyleIndex(nextStyleIndex);
 setConfusedCycleCount(prev => prev + 1);

 setActiveToast({
 message: `Switched explanation style to ${nextStyleObj.icon} ${nextStyleObj.label}`,
 type: 'info'
 });

 setTimeout(() => setActiveToast(null), 4000);
 };

 // Handle self-rating click
 const handleRatingSelect = (rating) => {
 if (rating === 'Still lost') {
 // Open remediation modal instead of abruptly skipping!
 setShowRemediationModal(true);
 } else {
 onSaveTopicConfidence(currentTopic.id, {
 rating, // 'Got it' | 'Shaky'
 levelUsed: currentLevel.id,
 finalStyleStopped: currentStyle.id,
 confusedCycles: confusedCycleCount
 });
 }
 };

 // Confirm proceeding with 'Still lost' rating after viewing remediation modal
 const handleConfirmStillLostProceed = () => {
 setShowRemediationModal(false);
 onSaveTopicConfidence(currentTopic.id, {
 rating: 'Still lost',
 levelUsed: currentLevel.id,
 finalStyleStopped: currentStyle.id,
 confusedCycles: confusedCycleCount
 });
 };

 // Apply instant ELI5 simplification retry inside remediation modal
 const handleApplyELI5Remediation = () => {
 setShowRemediationModal(false);
 setExplainLevelIndex(0); // Switch to ELI5
 setStyleIndex(0); // Switch to Analogy Engine
 setActiveToast({
 message: `💡 Switched to ELI5 Simple Metaphor Mode for ${currentTopic.title}`,
 type: 'remediation'
 });
 setTimeout(() => setActiveToast(null), 5000);
 };

 return (
 <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-duration-300">
 
 {/* Toast Notification Banner */}
 {activeToast && (
 <div className={`p-4 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all animate-in fade-in slide-in-${
 activeToast.type === 'remediation' 
 ? 'bg-warning-100 border-warning-300 text-accent-950' 
 : 'bg-neutral-900 border-neutral-800 text-warning-300'
 }`}>
 <div className="flex items-center space-x-2">
 <Sparkles className="w-4 h-4 text-accent-400 shrink-0" />
 <span>{activeToast.message}</span>
 </div>
 <button 
 onClick={() => setActiveToast(null)}
 className="text-neutral-400 hover:text-neutral-50 font-bold ml-4"
 >
 ✕
 </button>
 </div>
 )}

 {/* Session Progress Header Bar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-100 px-6 py-4 rounded-lg border border-neutral-200 ">
 <div className="flex items-center space-x-3">
 <button
 onClick={onGoBack}
 className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
 title="Back to Roadmap"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>

 <div>
 <span className="text-xs font-bold text-accent-800 uppercase tracking-wider">
 Day {currentDay} Session • Topic {topicIndex + 1} of {totalTodayTopics}
 </span>
 <h2 className="font-editorial text-2xl font-bold text-neutral-900 leading-tight">
 {currentTopic.title}
 </h2>
 </div>
 </div>

 {/* Persona Active Indicator */}
 <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 shrink-0 text-xs">
 <span>{activePersonaObj.icon}</span>
 <div>
 <span className="font-semibold text-neutral-900">{activePersonaObj.name}</span>
 <span className="text-[10px] text-neutral-500 block">System Prompt Tone Active</span>
 </div>
 </div>
 </div>

 {/* Main Study Card */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-10 border border-neutral-200 space-y-8">
 
 {/* EXPLAIN-O-METER SLIDER */}
 <div className="bg-neutral-50 border border-neutral-200/90 rounded-lg p-5 space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="flex items-center space-x-2">
 <Sliders className="w-4 h-4 text-warning-700" />
 <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
 Explain-o-Meter (Complexity Slider)
 </label>
 </div>
 <span className="text-xs font-bold text-warning-900 bg-warning-200/70 px-3 py-1 rounded-full">
 {currentLevel.label}
 </span>
 </div>

 <input
 type="range"
 min="0"
 max="3"
 step="1"
 value={explainLevelIndex}
 onChange={(e) => setExplainLevelIndex(Number(e.target.value))}
 className="w-full accent-warning-700 cursor-pointer"
 />

 <div className="grid grid-cols-4 text-center text-[11px] font-medium text-neutral-500 gap-1">
 <span className={explainLevelIndex === 0 ? 'text-warning-900 font-bold' : ''}>ELI5</span>
 <span className={explainLevelIndex === 1 ? 'text-warning-900 font-bold' : ''}>ELI10</span>
 <span className={explainLevelIndex === 2 ? 'text-warning-900 font-bold' : ''}>ELI20 (Peer)</span>
 <span className={explainLevelIndex === 3 ? 'text-warning-900 font-bold' : ''}>Expert</span>
 </div>

 <p className="text-xs text-neutral-500 italic text-center pt-1">
 {currentLevel.desc}
 </p>
 </div>

 {/* ANALOGY ENGINE & CONFUSION STYLES HEADER */}
 <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-100">
 <div className="flex items-center space-x-2 text-warning-900 bg-warning-100/60 px-3 py-1 rounded-full text-xs font-semibold">
 <ChefHat className="w-4 h-4 text-warning-700" />
 <span>Analogy Engine Domain: <strong className="uppercase">{onboardingData.domain}</strong></span>
 </div>

 {/* I'm Still Confused Button */}
 <button
 onClick={handleStillConfused}
 className="flex items-center space-x-2 bg-neutral-900 hover:bg-warning-700 text-neutral-100 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
 title="Cycles through Analogy -> Story -> Visual -> Worked Example -> Expert"
 >
 <HelpCircle className="w-4 h-4 text-warning-300" />
 <span>I'm still confused ({currentStyle.label})</span>
 </button>
 </div>

 {/* EXPLANATION CONTENT AREA */}
 {isLoading ? (
 <div className="py-16 text-center space-y-4">
 <div className="w-10 h-10 border-4 border-warning-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
 <p className="text-sm text-neutral-600 font-editorial font-medium">
 Generating {currentLevel.id} explanation ({currentStyle.label}) tailored to {onboardingData.domain}...
 </p>
 </div>
 ) : (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Persona Callout Quote */}
 <div className="bg-warning-50/50 border-l-4 border-warning-600 p-4 rounded-r-2xl space-y-1">
 <div className="flex items-center space-x-2 text-xs font-bold text-warning-900 uppercase">
 <Quote className="w-3.5 h-3.5" />
 <span>{persona} Tone Perspective</span>
 </div>
 <p className="text-xs text-neutral-700 italic font-editorial">
 "{explanationData?.headline || currentTopic.title}"
 </p>
 </div>

 {/* Explanation Body */}
 <div className="prose prose-stone max-w-none text-neutral-800 leading-relaxed font-sans text-sm space-y-4 whitespace-pre-line">
 {explanationData?.body}
 </div>

 {/* Key Takeaway Box */}
 {explanationData?.keyTakeaway && (
 <div className="bg-neutral-900 text-neutral-200 p-4 rounded-lg text-xs font-mono-code leading-relaxed border border-neutral-800">
 {explanationData.keyTakeaway}
 </div>
 )}

 </div>
 )}

 {/* SELF-RATING CONFIDENCE SECTION */}
 <div className="pt-6 border-t border-neutral-200 space-y-4">
 <div className="text-center space-y-1">
 <h3 className="font-editorial text-xl font-bold text-neutral-900">
 How well did you understand this concept?
 </h3>
 <p className="text-xs text-neutral-500 font-sans">
 Your self-rating updates your in-memory confidence map for this session.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 
 {/* Got It */}
 <button
 onClick={() => handleRatingSelect('Got it')}
 className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-success-50 hover:bg-success-100 text-success-900 border border-success-300 font-semibold text-sm transition-all cursor-pointer group"
 >
 <CheckCircle className="w-5 h-5 text-success-600 group-hover:scale-110 transition-transform" />
 <span>Got it!</span>
 </button>

 {/* Shaky */}
 <button
 onClick={() => handleRatingSelect('Shaky')}
 className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-warning-50 hover:bg-warning-100 text-warning-900 border border-warning-300 font-semibold text-sm transition-all cursor-pointer group"
 >
 <AlertTriangle className="w-5 h-5 text-warning-600 group-hover:scale-110 transition-transform" />
 <span>Shaky</span>
 </button>

 {/* Still Lost */}
 <button
 onClick={() => handleRatingSelect('Still lost')}
 className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-error-50 hover:bg-error-100 text-error-900 border border-error-300 font-semibold text-sm transition-all cursor-pointer group"
 >
 <XCircle className="w-5 h-5 text-error-600 group-hover:scale-110 transition-transform" />
 <span>Still lost</span>
 </button>

 </div>
 </div>

 </div>

 {/* REMEDIATION MODAL WHEN "STILL LOST" IS CLICKED */}
 {showRemediationModal && (
 <div className="fixed inset-0 z-50 bg-neutral-900/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 max-w-lg w-full border border-neutral-200 space-y-6 animate-in zoom-in-95 duration-200">
 
 <div className="flex items-center space-x-3 text-error-600 border-b border-neutral-100 pb-4">
 <div className="w-10 h-10 rounded-lg bg-error-100 border border-error-200 flex items-center justify-center shrink-0">
 <XCircle className="w-6 h-6 text-error-600" />
 </div>
 <div>
 <h3 className="font-editorial text-xl font-bold text-neutral-900">
 Concept Remediation Needed
 </h3>
 <p className="text-xs text-neutral-500">
 Topic: <strong className="text-neutral-800">{currentTopic.title}</strong>
 </p>
 </div>
 </div>

 <div className="space-y-3 text-xs text-neutral-700 leading-relaxed font-sans">
 <p className="bg-error-50 border border-error-200 p-3.5 rounded-lg text-error-950 font-medium">
 We've flagged <strong>"{currentTopic.title}"</strong> as <strong>"Still lost"</strong> in your in-memory Learner Model. Don't worry—learning complex concepts takes iteration!
 </p>
 <p>
 What would you like to do before moving forward?
 </p>
 </div>

 <div className="space-y-2.5 pt-2">
 
 {/* Option 1: Simplify to ELI5 & Retry */}
 <button
 onClick={handleApplyELI5Remediation}
 className="w-full flex items-center justify-between p-4 rounded-lg bg-warning-50 hover:bg-warning-100 border border-warning-300 text-accent-950 font-semibold text-xs transition-all cursor-pointer"
 >
 <div className="flex items-center space-x-3">
 <Lightbulb className="w-5 h-5 text-warning-600 shrink-0" />
 <div className="text-left">
 <p className="font-bold text-sm">Simplify to ELI5 Mode & Retry</p>
 <p className="text-[11px] text-accent-800 font-normal">Re-explains using zero-jargon everyday metaphors right now</p>
 </div>
 </div>
 <Zap className="w-4 h-4 text-warning-600 shrink-0" />
 </button>

 {/* Option 2: Save for Recap & Proceed */}
 <button
 onClick={handleConfirmStillLostProceed}
 className="w-full flex items-center justify-between p-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-semibold text-xs transition-all cursor-pointer"
 >
 <div className="flex items-center space-x-3">
 <HelpCircle className="w-5 h-5 text-neutral-500 shrink-0" />
 <div className="text-left">
 <p className="font-bold text-sm">Save Rating & Proceed</p>
 <p className="text-[11px] text-neutral-500 font-normal">Saves rating for active recall flashcards & recap review</p>
 </div>
 </div>
 <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0" />
 </button>

 </div>

 </div>
 </div>
 )}

 </div>
 );
}
