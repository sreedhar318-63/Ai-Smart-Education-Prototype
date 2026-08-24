import React, { useState } from 'react';
import { 
 ShieldAlert, Clock, CheckCircle2, ArrowLeft, ArrowRight, Zap, 
 RotateCcw, Sparkles, AlertCircle, HelpCircle, Layers 
} from 'lucide-react';
import { generateSmartRevisionQueue, predictRetentionRisk } from '../services/aiEngine';

export default function SmartRevisionView({ skills, studentProfile, onGoBack, onNavigate }) {
 const revisionQueue = generateSmartRevisionQueue(skills);
 const [activeIndex, setActiveIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState(null);
 const [isSubmitted, setIsSubmitted] = useState(false);
 const [completedItems, setCompletedItems] = useState([]);

 const currentItem = revisionQueue[activeIndex] || revisionQueue[0];

 const handleOptionSelect = (idx) => {
 if (isSubmitted) return;
 setSelectedOption(idx);
 };

 const handleSubmit = () => {
 if (selectedOption === null || isSubmitted) return;
 setIsSubmitted(true);
 if (!completedItems.includes(currentItem.id)) {
 setCompletedItems([...completedItems, currentItem.id]);
 }
 };

 const handleNext = () => {
 if (activeIndex < revisionQueue.length - 1) {
 setActiveIndex(activeIndex + 1);
 setSelectedOption(null);
 setIsSubmitted(false);
 }
 };

 return (
 <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
 
 {/* HEADER */}
 <div className="text-neutral-50 rounded-lg p-6 md:p-8 border border-error-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-2">
 <div className="flex items-center space-x-2">
 <button 
 onClick={onGoBack} 
 className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer mr-1"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>
 <span className="text-xs px-3 py-1 rounded-full bg-error-500/20 text-error-300 font-semibold border border-error-500/30 flex items-center space-x-1">
 <ShieldAlert className="w-3.5 h-3.5 text-error-400" />
 <span>AI Memory Decay Engine</span>
 </span>
 </div>
 <h1 className="font-editorial text-3xl font-bold tracking-tight">
 Today's Smart Micro-Revision
 </h1>
 <p className="text-xs text-error-200 font-sans">
 AI-estimated retention risk predicts forgetting curves and queues targeted 3-5 minute micro-refreshers.
 </p>
 </div>

 <div className="bg-error-900/60 border border-error-800 p-4 rounded-lg shrink-0 text-right space-y-1">
 <span className="text-[10px] text-error-300 font-bold uppercase tracking-wider block">Completed Revisions:</span>
 <span className="text-xl font-bold text-neutral-50 font-mono">{completedItems.length} / {revisionQueue.length}</span>
 </div>
 </div>

 {/* AI ESTIMATED RETENTION RISK CALLOUT */}
 <div className="bg-warning-50 rounded-lg p-5 border border-warning-300 flex items-center justify-between text-xs font-sans">
 <div className="flex items-center space-x-3">
 <AlertCircle className="w-5 h-5 text-warning-700 shrink-0" />
 <p className="text-neutral-800">
 <strong>AI-estimated retention risk:</strong> Your Probability concept may benefit from revision soon.
 </p>
 </div>
 <span className="text-[10px] bg-warning-200 text-accent-950 font-bold px-2.5 py-1 rounded-full border border-warning-300 shrink-0">
 Retention Decay Model
 </span>
 </div>

 {/* REVISION QUEUE SELECTOR TABS */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {revisionQueue.map((item, idx) => {
 const isActive = idx === activeIndex;
 const isDone = completedItems.includes(item.id);

 return (
 <button
 key={item.id}
 onClick={() => {
 setActiveIndex(idx);
 setSelectedOption(null);
 setIsSubmitted(false);
 }}
 className={`p-4 rounded-lg border text-left text-xs font-bold transition-all cursor-pointer space-y-1 ${
 isActive 
 ? 'bg-neutral-900 text-neutral-50 border-warning-500 scale-102' 
 : isDone
 ? 'bg-success-50 border-success-300 text-success-950'
 : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-50'
 }`}
 >
 <div className="flex justify-between items-center text-[10px]">
 <span className={isActive ? 'text-accent-400' : 'text-neutral-400'}>{item.priority}</span>
 <span>⏱ {item.estMinutes} min</span>
 </div>
 <p className="text-sm font-bold truncate">{item.title}</p>
 {isDone && <span className="text-[10px] text-success-700 font-bold flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
 </button>
 );
 })}
 </div>

 {/* ACTIVE REVISION CARD */}
 <div className="bg-neutral-100 rounded-lg p-6 md:p-8 border border-neutral-200 space-y-6">
 
 {/* MICRO EXPLANATION & EXAMPLE */}
 <div className="space-y-3">
 <div className="flex items-center space-x-2 text-error-900">
 <Zap className="w-5 h-5 text-error-600 fill-error-500" />
 <h2 className="font-editorial text-2xl font-bold">{currentItem.title} Micro-Refresher</h2>
 </div>

 <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs text-neutral-800 font-sans leading-relaxed space-y-2">
 <p><strong>Micro Explanation:</strong> {currentItem.microExplanation}</p>
 <p className="text-warning-900 font-semibold"><strong>Example:</strong> {currentItem.example}</p>
 </div>
 </div>

 {/* QUICK QUESTION */}
 <div className="space-y-4 pt-2 border-t border-neutral-100">
 <h3 className="font-bold text-neutral-900 text-sm font-sans">{currentItem.question}</h3>

 <div className="space-y-2.5">
 {currentItem.options.map((opt, idx) => {
 const isSelected = selectedOption === idx;
 const isCorrectOption = idx === currentItem.correctIndex;

 let styleClass = "bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100/80";

 if (isSubmitted) {
 if (isCorrectOption) {
 styleClass = "bg-success-50 border-success-500 text-success-950 font-bold";
 } else if (isSelected && !isCorrectOption) {
 styleClass = "bg-error-50 border-error-500 text-error-950 font-bold";
 } else {
 styleClass = "bg-neutral-50/50 border-neutral-200 text-neutral-400 opacity-60";
 }
 } else if (isSelected) {
 styleClass = "bg-warning-500/15 border-warning-600 text-accent-950 font-bold";
 }

 return (
 <button
 key={idx}
 disabled={isSubmitted}
 onClick={() => handleOptionSelect(idx)}
 className={`w-full text-left p-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${styleClass}`}
 >
 <span>{opt}</span>
 {isSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-success-600" />}
 </button>
 );
 })}
 </div>
 </div>

 {/* ACTIONS */}
 <div className="flex justify-between items-center pt-2">
 {!isSubmitted ? (
 <button
 disabled={selectedOption === null}
 onClick={handleSubmit}
 className="w-full bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3.5 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-40"
 >
 Verify Revision Answer
 </button>
 ) : (
 <div className="flex justify-between w-full">
 <span className="text-xs text-success-700 font-bold flex items-center space-x-1">
 <CheckCircle2 className="w-4 h-4" />
 <span>Retention refreshed! +15% Memory Stability</span>
 </span>

 {activeIndex < revisionQueue.length - 1 && (
 <button
 onClick={handleNext}
 className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer"
 >
 <span>Next Micro-Revision</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>
 )}
 </div>

 </div>

 </div>
 );
}
