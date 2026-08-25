import React, { useState } from 'react';
import { 
  PenTool, CheckCircle, XCircle, HelpCircle, ArrowRight, Zap, RefreshCw, Award, Code
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
      
      {/* HEADER BAR */}
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4" />
            <span>Adaptive Quiz Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-50">Interactive Practice & Assessment</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Adapts difficulty in real-time based on accuracy & cognitive response speed.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 self-start md:self-auto text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px]">Difficulty</span>
            <span className="font-bold text-amber-400">{difficulty}</span>
          </div>
          <div className="h-6 w-px bg-neutral-800"></div>
          <div>
            <span className="text-neutral-400 block text-[10px]">Session Score</span>
            <span className="font-bold text-neutral-100">{score.correct} / {score.total}</span>
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <span className="bg-neutral-800 text-amber-300 text-xs font-bold px-3 py-1 rounded-lg border border-neutral-700">
            {currentQ.topic}
          </span>
          <span className="text-xs text-neutral-400 font-mono">Question {questionIndex + 1}</span>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-neutral-100 leading-snug">
          {currentQ.question}
        </h2>

        {/* OPTIONS */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, idx) => {
            let optionStyle = "bg-neutral-950 border-neutral-800 text-neutral-200 hover:border-amber-500/50";
            
            if (selectedOption === idx) {
              optionStyle = "bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/40";
            }

            if (isSubmitted) {
              if (idx === currentQ.correctIndex) {
                optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 font-bold";
              } else if (selectedOption === idx && idx !== currentQ.correctIndex) {
                optionStyle = "bg-red-500/20 border-red-500 text-red-200 ring-2 ring-red-500/40";
              } else {
                optionStyle = "bg-neutral-950/40 border-neutral-800 text-neutral-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
              >
                <span>{optionText}</span>
                {isSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* SUBMIT / NEXT ACTION */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
          >
            Submit Answer & Inspect Explanation
          </button>
        ) : (
          <div className="space-y-4 pt-4 border-t border-neutral-800 animate-in fade-in duration-200">
            
            {/* RICH PEDAGOGICAL EXPLANATION */}
            <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100' : 'bg-red-500/10 border-red-500/30 text-red-100'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                <span>{isCorrect ? '✓ Correct Answer!' : 'Incorrect — Concept Bridge Below'}</span>
              </div>

              <p><strong>WHY:</strong> {currentQ.explanation}</p>
              <p><strong>CONCEPT BRIDGE:</strong> Independent probabilities multiply; additive fallacies confuse independent events with disjoint sets.</p>
              <p><strong>NEXT STEP:</strong> {isCorrect ? 'Escalating to Hard difficulty question.' : 'Queued 3-minute concept refresher.'}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-neutral-100 hover:bg-white text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Next Practice Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
