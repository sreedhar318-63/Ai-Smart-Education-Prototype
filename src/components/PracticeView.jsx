import React, { useState } from 'react';
import { 
  PenTool, CheckCircle2, XCircle, HelpCircle, ArrowRight, Zap, RefreshCw, Award, Code
} from 'lucide-react';
import { MOCK_QUIZ_QUESTIONS, selectNextDifficulty } from '../services/aiEngine';

export default function PracticeView({ studentProfile, onNavigate }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [startTime] = useState(Date.now());

  const currentQ = MOCK_QUIZ_QUESTIONS[questionIndex % MOCK_QUIZ_QUESTIONS.length];

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    const responseTime = (Date.now() - startTime) / 1000;
    const diffNext = selectNextDifficulty(difficulty, isCorrect, responseTime);
    setDifficulty(diffNext.nextDifficulty);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setQuestionIndex(prev => prev + 1);
  };

  const isCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* HEADER BAR (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] border border-[#C59B67] text-[#1A0F05] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-[#8A2BE2] text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4" />
            <span>Adaptive Quiz Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A0F05]">Interactive Practice & Assessment</h1>
          <p className="text-xs text-[#3D2714] mt-1 font-medium">
            Adapts difficulty in real-time based on accuracy & cognitive response speed.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-[#FFE4C4] px-4 py-2.5 rounded-xl border border-[#C59B67] self-start md:self-auto text-xs shadow-2xs">
          <div>
            <span className="text-[#5C4228] block text-[10px] font-bold uppercase">Difficulty</span>
            <span className="font-bold text-[#8A2BE2]">{difficulty}</span>
          </div>
          <div className="h-6 w-px bg-[#C59B67]"></div>
          <div>
            <span className="text-[#5C4228] block text-[10px] font-bold uppercase">Session Score</span>
            <span className="font-bold text-[#1A0F05]">{score.correct} / {score.total}</span>
          </div>
        </div>
      </div>

      {/* QUESTION CARD (BISQUE BACKGROUND) */}
      <div className="bg-[#FFE4C4] border border-[#E3C6A2] rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
        
        <div className="flex items-center justify-between border-b border-[#E3C6A2] pb-4">
          <span className="bg-[#8A2BE2] text-white text-xs font-bold px-3 py-1 rounded-lg border border-[#6b1cb9] shadow-2xs">
            {currentQ.topic}
          </span>
          <span className="text-xs text-[#3D2714] font-bold font-mono">Question {questionIndex + 1}</span>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-[#1A0F05] leading-snug">
          {currentQ.question}
        </h2>

        {/* OPTIONS */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, idx) => {
            let optionStyle = "bg-[#ADD8E6] border-[#91c4d5] text-[#161512] hover:border-[#8A2BE2]";
            
            if (selectedOption === idx) {
              optionStyle = "bg-[#DEB887] border-[#8A2BE2] text-[#1A0F05] ring-2 ring-[#8A2BE2] font-bold";
            }

            if (isSubmitted) {
              if (idx === currentQ.correctIndex) {
                optionStyle = "bg-[#8A2BE2] border-[#6b1cb9] text-white font-bold shadow-md";
              } else if (selectedOption === idx && idx !== currentQ.correctIndex) {
                optionStyle = "bg-[#DEB887] border-[#C59B67] text-[#1A0F05] font-bold shadow-sm";
              } else {
                optionStyle = "bg-[#ADD8E6]/60 border-[#91c4d5] text-[#334155] opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
              >
                <span>{optionText}</span>

                {isSubmitted && idx === currentQ.correctIndex && (
                  <div className="flex items-center space-x-1 text-white font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>✓ CORRECT</span>
                  </div>
                )}

                {isSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <div className="flex items-center space-x-1 text-[#5A2A00] font-bold text-xs">
                    <XCircle className="w-5 h-5 text-[#5A2A00]" />
                    <span>✗ INCORRECT</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT / NEXT BUTTON */}
        {!isSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="w-full bg-[#8A2BE2] hover:bg-[#7823c6] disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            Submit Answer for Evaluation
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>

    </div>
  );
}
