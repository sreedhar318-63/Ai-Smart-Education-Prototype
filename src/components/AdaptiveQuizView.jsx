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
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>Real-Time AI Adaptation Engine</span>
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight">
            Adaptive Learning Assessment
          </h1>
          <p className="text-xs text-stone-300 font-sans">
            AI evaluates response accuracy, speed, and mental models to adjust difficulty in real-time.
          </p>
        </div>

        <div className="bg-stone-800/90 border border-stone-700 p-4 rounded-2xl shrink-0 text-right space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Current Target Topic:</span>
          <span className="text-sm font-bold text-amber-400 block">{question.topic}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
            Initial Difficulty: Medium
          </span>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Question {currentQuestionIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs font-medium text-stone-500">
            Topic: <strong>{question.topic}</strong>
          </span>
        </div>

        <h2 className="font-sans text-xl font-bold text-stone-900 leading-snug">
          {question.question}
        </h2>

        {/* OPTIONS GRID */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let styleClass = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100/80";

            if (isSubmitted) {
              if (isCorrectOption) {
                styleClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
              } else if (isSelected && !isCorrectOption) {
                styleClass = "bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs";
              } else {
                styleClass = "bg-stone-50/50 border-stone-200 text-stone-400 opacity-60";
              }
            } else if (isSelected) {
              styleClass = "bg-amber-500/15 border-amber-600 text-amber-950 font-bold shadow-xs";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${styleClass}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center border ${
                    isSelected ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-stone-300 text-stone-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isSubmitted && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {/* SUBMIT BUTTON */}
        {!isSubmitted && (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl text-xs transition-all shadow-lg cursor-pointer disabled:opacity-40"
          >
            Submit Answer for AI Misconception Analysis
          </button>
        )}
      </div>

      {/* STEP 2: AI MISCONCEPTION DETECTED & STEP 3: LEARNING TWIN UPDATE */}
      {isSubmitted && misconception && (
        <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          
          {/* MISCONCEPTION DETECTION CARD */}
          <div className="bg-rose-950 text-rose-100 rounded-3xl p-6 md:p-8 border border-rose-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-rose-900 pb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                <h3 className="font-editorial text-2xl font-bold text-white">
                  AI MISCONCEPTION DETECTED
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-rose-900/80 text-rose-200 font-mono border border-rose-700">
                Confidence: {misconception.confidence}%
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-rose-900/40 p-4 rounded-2xl border border-rose-800 space-y-1">
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] block">Identified Mental Model Error:</span>
                <p className="text-sm font-bold text-white leading-relaxed">{misconception.misconception}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-900/30 p-3.5 rounded-xl border border-rose-800/80 space-y-1">
                  <span className="text-rose-300 font-bold text-[11px] block">AI Evidence:</span>
                  <ul className="space-y-1 text-rose-200">
                    {misconception.evidence?.map((ev, idx) => (
                      <li key={idx}>• {ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-900/30 p-3.5 rounded-xl border border-rose-800/80 space-y-1">
                  <span className="text-rose-300 font-bold text-[11px] block">Recommended Intervention:</span>
                  <p className="font-bold text-amber-300">"Review Probability Foundations."</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: LEARNING TWIN UPDATE CALLOUT */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-stone-900">
                <Brain className="w-5 h-5 text-amber-700" />
                <h3 className="font-editorial text-xl font-bold">Learning Twin State Update</h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                Real-Time Adaptation Complete
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block font-bold uppercase">Probability Mastery</span>
                <span className="text-stone-900 font-bold text-base">42% ➔ 45%</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block font-bold uppercase">Conceptual Confidence</span>
                <span className="text-rose-600 font-bold text-base">↓ Decreased</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block font-bold uppercase">Retention Risk</span>
                <span className="text-rose-600 font-bold text-base">↑ Increased</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 text-[10px] block font-bold uppercase">Difficulty Strategy</span>
                <span className="text-amber-800 font-bold text-xs">Easy + Visual</span>
              </div>
            </div>
          </div>

          {/* STEP 4: ADAPTIVE DIFFICULTY STRATEGY */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-xl font-bold text-amber-950 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-700" />
                <span>AI DECISION: "Conceptual gap detected."</span>
              </h3>
              <button
                onClick={() => setShowWhyModal(true)}
                className="flex items-center space-x-1 text-xs font-bold text-amber-900 underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why did AI recommend this?</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-amber-950 text-center">
              <div className="bg-amber-200/80 p-3 rounded-xl border border-amber-300">1. VISUAL EXPLANATION</div>
              <div className="bg-amber-200/80 p-3 rounded-xl border border-amber-300">2. EASY QUESTION</div>
              <div className="bg-amber-200/80 p-3 rounded-xl border border-amber-300">3. MEDIUM QUESTION</div>
              <div className="bg-amber-200/80 p-3 rounded-xl border border-amber-300">4. MASTERY CHECK</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Try Question Again
              </button>

              <button
                onClick={() => onNavigate('smart-revision')}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer flex items-center space-x-1.5"
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
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-2 text-amber-900">
                <Info className="w-5 h-5 text-amber-700" />
                <h3 className="font-editorial text-xl font-bold">WHY THIS RECOMMENDATION?</h3>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950 leading-relaxed font-sans">
                {whyExplanation.rationale}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">Learning Twin Evidence:</span>
                <ul className="space-y-1.5">
                  {whyExplanation.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-center space-x-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
