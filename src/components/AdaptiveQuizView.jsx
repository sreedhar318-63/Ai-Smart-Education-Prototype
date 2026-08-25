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
  const whyExplanation = explainRecommendation(question.topic, 42, studentProfile?.targetCareer || 'AI Engineer');

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* HEADER BAR (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] border border-[#C59B67] text-[#1A0F05] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#8A2BE2] text-white font-bold flex items-center space-x-1 shadow-2xs">
              <Brain className="w-3.5 h-3.5" />
              <span>Real-Time AI Adaptation Engine</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A0F05] tracking-tight">
            Adaptive Learning Assessment
          </h1>
          <p className="text-xs text-[#3D2714] font-medium">
            AI evaluates response accuracy, speed, and mental models to adjust difficulty in real-time.
          </p>
        </div>

        {/* TARGET TOPIC BADGE (BISQUE PANEL) */}
        <div className="bg-[#FFE4C4] border border-[#C59B67] p-4 rounded-xl shrink-0 text-right space-y-1 shadow-2xs">
          <span className="text-[10px] text-[#5C4228] font-bold uppercase tracking-wider block">Current Target Topic:</span>
          <span className="text-sm font-bold text-[#8A2BE2] block">{question.topic}</span>
          <span className="text-[10px] text-[#1A0F05] bg-[#DEB887] px-2.5 py-0.5 rounded border border-[#C59B67] font-bold">
            Initial Difficulty: Medium
          </span>
        </div>
      </div>

      {/* QUESTION CARD (BISQUE BACKGROUND) */}
      <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-8 border border-[#E3C6A2] space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#E3C6A2] pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#8A2BE2] px-3.5 py-1 rounded-full shadow-2xs">
            Question {currentQuestionIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs font-bold text-[#3D2714]">
            Topic: <strong className="text-[#1A0F05]">{question.topic}</strong>
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#1A0F05] leading-snug">
          {question.question}
        </h2>

        {/* OPTIONS GRID */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            // Base unselected style: lightblue background with dark text
            let styleClass = "bg-[#ADD8E6] border-[#91c4d5] text-[#161512] hover:border-[#8A2BE2]";

            if (isSubmitted) {
              if (isCorrectOption) {
                // Correct Answer State: Blueviolet background with white text + icon
                styleClass = "bg-[#8A2BE2] border-[#6b1cb9] text-white font-bold shadow-md";
              } else if (isSelected && !isCorrectOption) {
                // Incorrect Answer State: Burlywood background with dark text + icon
                styleClass = "bg-[#DEB887] border-[#C59B67] text-[#1A0F05] font-bold shadow-sm";
              } else {
                styleClass = "bg-[#ADD8E6]/60 border-[#91c4d5] text-[#334155] opacity-60";
              }
            } else if (isSelected) {
              // Pre-submit Selected State: Burlywood background
              styleClass = "bg-[#DEB887] border-[#8A2BE2] text-[#1A0F05] font-bold ring-2 ring-[#8A2BE2]";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${styleClass}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border ${
                    isSubmitted && isCorrectOption
                      ? 'bg-white text-[#8A2BE2] border-white'
                      : isSelected
                      ? 'bg-[#8A2BE2] text-white border-[#8A2BE2]'
                      : 'bg-[#FFE4C4] border-[#C59B67] text-[#1A0F05]'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {/* ACCESSIBILITY: Explicit icon + label pair for colorblind usability */}
                {isSubmitted && isCorrectOption && (
                  <div className="flex items-center space-x-1.5 text-white font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>✓ CORRECT</span>
                  </div>
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <div className="flex items-center space-x-1.5 text-[#5A2A00] font-bold text-xs">
                    <XCircle className="w-5 h-5 text-[#5A2A00]" />
                    <span>✗ INCORRECT</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT BUTTON (BLUEVIOLET WITH WHITE TEXT) */}
        {!isSubmitted && (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="w-full bg-[#8A2BE2] hover:bg-[#7823c6] disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            Submit Answer for AI Misconception Analysis
          </button>
        )}
      </div>

      {/* STEP 2: AI MISCONCEPTION DETECTED & STEP 3: LEARNING TWIN UPDATE */}
      {isSubmitted && misconception && (
        <div className="space-y-6 animate-in slide-in-duration-300">
          
          {/* MISCONCEPTION DETECTION CARD (BURLYWOOD BACKGROUND) */}
          <div className="bg-[#DEB887] text-[#1A0F05] rounded-2xl p-6 md:p-8 border border-[#C59B67] space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#C59B67] pb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-[#8A2BE2]" />
                <h3 className="text-xl font-bold text-[#1A0F05]">
                  AI MISCONCEPTION DETECTED
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#8A2BE2] text-white font-bold">
                Confidence: {misconception.confidence}%
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-[#FFE4C4] p-4 rounded-xl border border-[#C59B67] space-y-1">
                <span className="text-[#5A2A00] font-bold uppercase tracking-wider text-[10px] block">Identified Mental Model Error:</span>
                <p className="text-sm font-bold text-[#1A0F05] leading-relaxed">{misconception.misconception}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#ADD8E6] p-3.5 rounded-xl border border-[#91c4d5] space-y-1">
                  <span className="text-[#1A0F05] font-bold text-[11px] block">AI Evidence:</span>
                  <ul className="space-y-1 text-[#0f172a] font-medium">
                    {misconception.evidence?.map((ev, idx) => (
                      <li key={idx}>• {ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#ADD8E6] p-3.5 rounded-xl border border-[#91c4d5] space-y-1">
                  <span className="text-[#1A0F05] font-bold text-[11px] block">Recommended Intervention:</span>
                  <p className="font-bold text-[#8A2BE2]">"Review Probability Foundations."</p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: LEARNING TWIN UPDATE CALLOUT (LIGHTBLUE BACKGROUND) */}
          <div className="bg-[#ADD8E6] rounded-2xl p-6 border border-[#91c4d5] space-y-4 shadow-sm text-[#161512]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-[#8A2BE2]" />
                <h3 className="text-xl font-bold">Learning Twin State Update</h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#8A2BE2] text-white font-bold">
                Real-Time Adaptation Complete
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div className="bg-[#FFE4C4] p-3 rounded-xl border border-[#C59B67]">
                <span className="text-[#5C4228] text-[10px] block font-bold uppercase">Probability Mastery</span>
                <span className="text-[#1A0F05] font-bold text-base">42% ➔ 45%</span>
              </div>

              <div className="bg-[#FFE4C4] p-3 rounded-xl border border-[#C59B67]">
                <span className="text-[#5C4228] text-[10px] block font-bold uppercase">Conceptual Confidence</span>
                <span className="text-[#8A2BE2] font-bold text-base">↓ Decreased</span>
              </div>

              <div className="bg-[#FFE4C4] p-3 rounded-xl border border-[#C59B67]">
                <span className="text-[#5C4228] text-[10px] block font-bold uppercase">Retention Risk</span>
                <span className="text-[#8A2BE2] font-bold text-base">↑ Increased</span>
              </div>

              <div className="bg-[#FFE4C4] p-3 rounded-xl border border-[#C59B67]">
                <span className="text-[#5C4228] text-[10px] block font-bold uppercase">Difficulty Strategy</span>
                <span className="text-[#8A2BE2] font-bold text-xs">Easy + Visual</span>
              </div>
            </div>
          </div>

          {/* STEP 4: ADAPTIVE DIFFICULTY STRATEGY (BISQUE CONTAINER) */}
          <div className="bg-[#FFE4C4] rounded-2xl p-6 border border-[#E3C6A2] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1A0F05] flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#8A2BE2]" />
                <span>AI DECISION: "Conceptual gap detected."</span>
              </h3>
              <button
                onClick={() => setShowWhyModal(true)}
                className="flex items-center space-x-1 text-xs font-bold text-[#8A2BE2] underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why did AI recommend this?</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
              <div className="bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">1. VISUAL EXPLANATION</div>
              <div className="bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">2. EASY QUESTION</div>
              <div className="bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">3. MEDIUM QUESTION</div>
              <div className="bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">4. MASTERY CHECK</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-[#DEB887] border border-[#C59B67] text-[#1A0F05] font-bold text-xs hover:bg-[#cda06d] cursor-pointer"
              >
                Try Question Again
              </button>

              <button
                onClick={() => onNavigate('smart-revision')}
                className="px-5 py-2.5 rounded-xl bg-[#8A2BE2] text-white font-bold text-xs hover:bg-[#7823c6] cursor-pointer flex items-center space-x-1.5 shadow-md"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFE4C4] rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 border border-[#C59B67] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E3C6A2] pb-4">
              <div className="flex items-center space-x-2 text-[#8A2BE2]">
                <Info className="w-5 h-5 text-[#8A2BE2]" />
                <h3 className="text-xl font-bold text-[#1A0F05]">WHY THIS RECOMMENDATION?</h3>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-lg text-[#5C4228] hover:text-[#1A0F05] transition-colors cursor-pointer font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#DEB887] p-4 rounded-xl border border-[#C59B67] text-[#1A0F05] leading-relaxed font-semibold">
                {whyExplanation.rationale}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#1A0F05] uppercase tracking-wider text-[10px] block">Learning Twin Evidence:</span>
                <ul className="space-y-1.5">
                  {whyExplanation.evidence.map((ev, idx) => (
                    <li key={idx} className="flex items-center space-x-2 bg-[#ADD8E6] p-2.5 rounded-xl border border-[#91c4d5] text-[#161512] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8A2BE2] shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
