import React, { useState } from 'react';
import { 
 Brain, Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldAlert, 
 RotateCcw, HelpCircle, AlertTriangle, Layers, Info, X, Zap, Target 
} from 'lucide-react';
import { 
 MOCK_QUIZ_QUESTIONS, 
 detectMisconception, 
 selectNextDifficulty,
 explainRecommendation 
} from '../services/aiEngine';

export default function AdaptiveQuizView({ 
 skills, 
 studentProfile, 
 onUpdateLearningTwin, 
 onNavigate 
}) {
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState(null);
 const [isSubmitted, setIsSubmitted] = useState(false);
 const [misconception, setMisconception] = useState(null);
 const [difficultyDecision, setDifficultyDecision] = useState(null);
 const [showWhyModal, setShowWhyModal] = useState(false);

 const question = MOCK_QUIZ_QUESTIONS[currentQuestionIndex] || MOCK_QUIZ_QUESTIONS[0];
 const whyExplanation = explainRecommendation(question.topic, 42, studentProfile.targetCareer);

 const handleOptionSelect = (index) => {
 if (isSubmitted) return;
 setSelectedOption(index);
 };

 const handleSubmit = () => {
 if (selectedOption === null || isSubmitted) return;

 const detected = detectMisconception(question, selectedOption);
 const isCorrect = selectedOption === question.correctIndex;
 const decision = selectNextDifficulty("Medium", isCorrect, 12);

 setMisconception(detected);
 setDifficultyDecision(decision);
 setIsSubmitted(true);

 // Update state in learning twin
 if (onUpdateLearningTwin) {
 onUpdateLearningTwin({
 topic: question.topic,
 isCorrect,
 confidenceDelta: isCorrect ? +5 : -8,
 retentionRiskDelta: isCorrect ? -4 : +12
 });
 }
 };

 const handleReset = () => {
 setSelectedOption(null);
 setIsSubmitted(false);
 setMisconception(null);
 setDifficultyDecision(null);
 };

 return (
 <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
 
 {/* HEADER */}
 <div className="text-neutral-50 rounded-lg p-6 md:p-8 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-2">
 <div className="flex items-center space-x-2">
 <span className="text-xs px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 font-semibold border border-warning-500/30 flex items-center space-x-1">
 <Brain className="w-3 h-3" />
 <span>Real-Time AI Adaptation Engine</span>
 </span>
 </div>
 <h1 className="font-editorial text-3xl font-bold tracking-tight">
 Adaptive Learning Assessment
 </h1>
 <p className="text-xs text-neutral-300 font-sans">
 AI evaluates response accuracy, speed, and mental models to adjust difficulty in real-time.
 </p>
 </div>

 <div className="bg-neutral-800/90 border border-neutral-700 p-4 rounded-lg shrink-0 text-right space-y-1">
 <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Current Target Topic:</span>
 <span className="text-sm font-bold text-accent-400 block">{question.topic}</span>
 <span className="text-[10px] text-success-400 bg-success-950/80 px-2 py-0.5 rounded border border-success-800 font-mono">
 Initial Difficulty: Medium
 </span>
 </div>
 </div>

 {/* QUESTION CARD */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
 <span className="text-xs font-bold uppercase tracking-wider text-accent-800 bg-warning-50 px-3 py-1 rounded-full border border-warning-200">
 Question {currentQuestionIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
 </span>
 <span className="text-xs font-medium text-neutral-500">
 Topic: <strong>{question.topic}</strong>
 </span>
 </div>

 <h2 className="font-sans text-xl font-bold text-neutral-900 leading-snug">
 {question.question}
 </h2>

 {/* OPTIONS GRID */}
 <div className="space-y-3">
 {question.options.map((opt, idx) => {
 const isSelected = selectedOption === idx;
 const isCorrectOption = idx === question.correctIndex;

 let styleClass = "bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100/80";

 if (isSubmitted) {
 if (isCorrectOption) {
 styleClass = "bg-success-50 border-success-500 text-success-950 font-bold ";
 } else if (isSelected && !isCorrectOption) {
 styleClass = "bg-error-50 border-error-500 text-error-950 font-bold ";
 } else {
 styleClass = "bg-neutral-50/50 border-neutral-200 text-neutral-400 opacity-60";
 }
 } else if (isSelected) {
 styleClass = "bg-warning-500/15 border-warning-600 text-accent-950 font-bold ";
 }

 return (
 <button
 key={idx}
 disabled={isSubmitted}
 onClick={() => handleOptionSelect(idx)}
 className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${styleClass}`}
 >
 <div className="flex items-center space-x-3">
 <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border ${
 isSelected ? 'bg-warning-600 text-neutral-50 border-warning-600' : 'bg-neutral-100 border-neutral-300 text-neutral-600'
 }`}>
 {String.fromCharCode(65 + idx)}
 </span>
 <span>{opt}</span>
 </div>

 {isSubmitted && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-success-600" />}
 {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-error-600" />}
 </button>
 );
 })}
 </div>

 {/* SUBMIT BUTTON */}
 {!isSubmitted && (
 <button
 disabled={selectedOption === null}
 onClick={handleSubmit}
 className="w-full bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-4 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-40"
 >
 Submit Answer for AI Misconception Analysis
 </button>
 )}
 </div>

 {/* STEP 2: AI MISCONCEPTION DETECTED & STEP 3: LEARNING TWIN UPDATE */}
 {isSubmitted && misconception && (
 <div className="space-y-6 animate-in slide-in-duration-300">
 
 {/* MISCONCEPTION DETECTION CARD */}
 <div className="bg-error-950 text-error-100 rounded-lg p-6 md:p-8 border border-error-800 space-y-5">
 <div className="flex items-center justify-between border-b border-error-900 pb-4">
 <div className="flex items-center space-x-2">
 <ShieldAlert className="w-6 h-6 text-error-400 animate-pulse" />
 <h3 className="font-editorial text-2xl font-bold text-neutral-50">
 AI MISCONCEPTION DETECTED
 </h3>
 </div>
 <span className="text-xs px-3 py-1 rounded-full bg-error-900/80 text-error-200 font-mono border border-error-700">
 Confidence: {misconception.confidence}%
 </span>
 </div>

 <div className="space-y-3 font-sans text-xs">
 <div className="bg-error-900/40 p-4 rounded-lg border border-error-800 space-y-1">
 <span className="text-error-400 font-bold uppercase tracking-wider text-[10px] block">Identified Mental Model Error:</span>
 <p className="text-sm font-bold text-neutral-50 leading-relaxed">{misconception.misconception}</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="bg-error-900/30 p-3.5 rounded-lg border border-error-800/80 space-y-1">
 <span className="text-error-300 font-bold text-[11px] block">AI Evidence:</span>
 <ul className="space-y-1 text-error-200">
 {misconception.evidence?.map((ev, idx) => (
 <li key={idx}>• {ev}</li>
 ))}
 </ul>
 </div>

 <div className="bg-error-900/30 p-3.5 rounded-lg border border-error-800/80 space-y-1">
 <span className="text-error-300 font-bold text-[11px] block">Recommended Intervention:</span>
 <p className="font-bold text-warning-300">"Review Probability Foundations."</p>
 </div>
 </div>
 </div>
 </div>

 {/* STEP 3: LEARNING TWIN UPDATE CALLOUT */}
 <div className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-2 text-neutral-900">
 <Brain className="w-5 h-5 text-warning-700" />
 <h3 className="font-editorial text-xl font-bold">Learning Twin State Update</h3>
 </div>
 <span className="text-xs px-3 py-1 rounded-full bg-success-100 text-success-900 font-bold">
 Real-Time Adaptation Complete
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
 <span className="text-neutral-500 text-[10px] block font-bold uppercase">Probability Mastery</span>
 <span className="text-neutral-900 font-bold text-base">42% ➔ 45%</span>
 </div>

 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
 <span className="text-neutral-500 text-[10px] block font-bold uppercase">Conceptual Confidence</span>
 <span className="text-error-600 font-bold text-base">↓ Decreased</span>
 </div>

 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
 <span className="text-neutral-500 text-[10px] block font-bold uppercase">Retention Risk</span>
 <span className="text-error-600 font-bold text-base">↑ Increased</span>
 </div>

 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
 <span className="text-neutral-500 text-[10px] block font-bold uppercase">Difficulty Strategy</span>
 <span className="text-accent-800 font-bold text-xs">Easy + Visual</span>
 </div>
 </div>
 </div>

 {/* STEP 4: ADAPTIVE DIFFICULTY STRATEGY */}
 <div className="bg-warning-50 rounded-lg p-6 border border-warning-300 space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="font-editorial text-xl font-bold text-accent-950 flex items-center space-x-2">
 <Zap className="w-5 h-5 text-warning-700" />
 <span>AI DECISION: "Conceptual gap detected."</span>
 </h3>
 <button
 onClick={() => setShowWhyModal(true)}
 className="flex items-center space-x-1 text-xs font-bold text-warning-900 underline cursor-pointer"
 >
 <HelpCircle className="w-3.5 h-3.5" />
 <span>Why did AI recommend this?</span>
 </button>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-accent-950 text-center">
 <div className="bg-warning-200/80 p-3 rounded-lg border border-warning-300">1. VISUAL EXPLANATION</div>
 <div className="bg-warning-200/80 p-3 rounded-lg border border-warning-300">2. EASY QUESTION</div>
 <div className="bg-warning-200/80 p-3 rounded-lg border border-warning-300">3. MEDIUM QUESTION</div>
 <div className="bg-warning-200/80 p-3 rounded-lg border border-warning-300">4. MASTERY CHECK</div>
 </div>

 <div className="flex justify-end gap-3 pt-2">
 <button
 onClick={handleReset}
 className="px-4 py-2.5 rounded-lg bg-neutral-100 border border-warning-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
 >
 Try Question Again
 </button>

 <button
 onClick={() => onNavigate('smart-revision')}
 className="px-5 py-2.5 rounded-lg bg-neutral-900 text-neutral-50 font-bold text-xs hover:bg-warning-700 cursor-pointer flex items-center space-x-1.5"
 >
 <span>Launch Smart Revision</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>

 </div>
 )}

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

 </div>
 );
}
