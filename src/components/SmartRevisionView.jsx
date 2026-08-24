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
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-white rounded-3xl p-6 md:p-8 border border-rose-900 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onGoBack} 
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>AI Memory Decay Engine</span>
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight">
            Today's Smart Micro-Revision
          </h1>
          <p className="text-xs text-rose-200 font-sans">
            AI-estimated retention risk predicts forgetting curves and queues targeted 3-5 minute micro-refreshers.
          </p>
        </div>

        <div className="bg-rose-900/60 border border-rose-800 p-4 rounded-2xl shrink-0 text-right space-y-1">
          <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block">Completed Revisions:</span>
          <span className="text-xl font-bold text-white font-mono">{completedItems.length} / {revisionQueue.length}</span>
        </div>
      </div>

      {/* AI ESTIMATED RETENTION RISK CALLOUT */}
      <div className="bg-amber-50 rounded-3xl p-5 border border-amber-300 shadow-md flex items-center justify-between text-xs font-sans">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-stone-800">
            <strong>AI-estimated retention risk:</strong> Your Probability concept may benefit from revision soon.
          </p>
        </div>
        <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2.5 py-1 rounded-full border border-amber-300 shrink-0">
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
              className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer space-y-1 ${
                isActive 
                  ? 'bg-stone-900 text-white border-amber-500 shadow-lg scale-102' 
                  : isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className={isActive ? 'text-amber-400' : 'text-stone-400'}>{item.priority}</span>
                <span>⏱ {item.estMinutes} min</span>
              </div>
              <p className="text-sm font-bold truncate">{item.title}</p>
              {isDone && <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
            </button>
          );
        })}
      </div>

      {/* ACTIVE REVISION CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        
        {/* MICRO EXPLANATION & EXAMPLE */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-rose-900">
            <Zap className="w-5 h-5 text-rose-600 fill-rose-500" />
            <h2 className="font-editorial text-2xl font-bold">{currentItem.title} Micro-Refresher</h2>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed space-y-2">
            <p><strong>Micro Explanation:</strong> {currentItem.microExplanation}</p>
            <p className="text-amber-900 font-semibold"><strong>Example:</strong> {currentItem.example}</p>
          </div>
        </div>

        {/* QUICK QUESTION */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm font-sans">{currentItem.question}</h3>

          <div className="space-y-2.5">
            {currentItem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentItem.correctIndex;

              let styleClass = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100/80";

              if (isSubmitted) {
                if (isCorrectOption) {
                  styleClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold";
                } else if (isSelected && !isCorrectOption) {
                  styleClass = "bg-rose-50 border-rose-500 text-rose-950 font-bold";
                } else {
                  styleClass = "bg-stone-50/50 border-stone-200 text-stone-400 opacity-60";
                }
              } else if (isSelected) {
                styleClass = "bg-amber-500/15 border-amber-600 text-amber-950 font-bold";
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${styleClass}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
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
              className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              Verify Revision Answer
            </button>
          ) : (
            <div className="flex justify-between w-full">
              <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Retention refreshed! +15% Memory Stability</span>
              </span>

              {activeIndex < revisionQueue.length - 1 && (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 bg-stone-900 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs cursor-pointer"
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
