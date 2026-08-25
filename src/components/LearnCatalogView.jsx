import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Lock, Play, Layers, Clock, Award, 
  HelpCircle, ChevronRight, Zap, Target, Sparkles, Filter
} from 'lucide-react';

export const HIERARCHICAL_CURRICULUM = [
  {
    id: 'subj-python',
    subject: 'Python Engineering & AI Architecture',
    mastery: 72,
    totalTime: '4.5 Hours',
    modules: [
      {
        id: 'mod-1',
        name: 'Module 1: Language Fundamentals',
        status: 'Completed',
        topics: [
          { id: 't1-1', name: 'Variables & Data Types', estMin: 12, status: 'Completed', mastery: 95, difficulty: 'Easy' },
          { id: 't1-2', name: 'Control Flow & Conditionals', estMin: 15, status: 'Completed', mastery: 88, difficulty: 'Easy' },
          { id: 't1-3', name: 'Loops & Iterators', estMin: 18, status: 'Completed', mastery: 76, difficulty: 'Medium' }
        ]
      },
      {
        id: 'mod-2',
        name: 'Module 2: Advanced Data Structures & Functions',
        status: 'In Progress',
        topics: [
          { id: 't2-1', name: 'Lists, Tuples & Dictionaries', estMin: 20, status: 'Completed', mastery: 91, difficulty: 'Medium' },
          { id: 't2-2', name: 'Functions & Lambda Expressions', estMin: 25, status: 'Current', mastery: 48, difficulty: 'Medium', isWeak: true },
          { id: 't2-3', name: 'Scope & Closures', estMin: 20, status: 'Unlocked', mastery: 0, difficulty: 'Hard' }
        ]
      },
      {
        id: 'mod-3',
        name: 'Module 3: Object-Oriented Programming (OOP)',
        status: 'Locked',
        topics: [
          { id: 't3-1', name: 'Classes & Instantiation', estMin: 22, status: 'Locked', mastery: 0, difficulty: 'Medium' },
          { id: 't3-2', name: 'Inheritance & Polymorphism', estMin: 25, status: 'Locked', mastery: 0, difficulty: 'Hard' },
          { id: 't3-3', name: 'Dunder Methods & Metaprogramming', estMin: 30, status: 'Locked', mastery: 0, difficulty: 'Hard' }
        ]
      },
      {
        id: 'mod-4',
        name: 'Module 4: Machine Learning & LLM Integration',
        status: 'Locked',
        topics: [
          { id: 't4-1', name: 'NumPy & Vectorized Computations', estMin: 30, status: 'Locked', mastery: 0, difficulty: 'Medium' },
          { id: 't4-2', name: 'Neural Networks & PyTorch Basics', estMin: 45, status: 'Locked', mastery: 0, difficulty: 'Hard' },
          { id: 't4-3', name: 'Transformers & RAG Pipeline', estMin: 50, status: 'Locked', mastery: 0, difficulty: 'Advanced' }
        ]
      }
    ]
  }
];

export default function LearnCatalogView({ onNavigate }) {
  const [selectedSubject] = useState(HIERARCHICAL_CURRICULUM[0]);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [diagnosticScore, setDiagnosticScore] = useState(null);

  const runDiagnostic = () => {
    setDiagnosticOpen(true);
    setTimeout(() => {
      setDiagnosticScore({
        strong: ['Variables', 'Data Types', 'Lists'],
        needsPractice: ['Loops', 'NumPy'],
        weak: ['Functions', 'Recursion'],
        recommendation: 'Start with 15-min Functions & Lambda Expressions lesson.'
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Structured Learning System</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-50">{selectedSubject.subject}</h1>
          <p className="text-xs text-neutral-400">
            Hierarchical Course Hierarchy: Subject → Module → Topic → Lesson → Practice → Assessment.
          </p>
        </div>

        <button
          onClick={runDiagnostic}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md self-start md:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>Take Diagnostic Assessment</span>
        </button>
      </div>

      {/* DIAGNOSTIC MODAL */}
      {diagnosticOpen && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-100 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-neutral-50">Diagnostic Analysis Results</h3>
            </div>
            <button onClick={() => setDiagnosticOpen(false)} className="text-neutral-400 hover:text-neutral-100 text-xs font-bold">
              Close
            </button>
          </div>

          {!diagnosticScore ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-neutral-400">Evaluating cognitive speed & mental model accuracy...</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                  <p className="font-bold text-emerald-400">Strong Topics</p>
                  <p className="text-neutral-300 mt-1">{diagnosticScore.strong.join(', ')}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                  <p className="font-bold text-amber-400">Needs Practice</p>
                  <p className="text-neutral-300 mt-1">{diagnosticScore.needsPractice.join(', ')}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                  <p className="font-bold text-red-400">Weak Topics (!)</p>
                  <p className="text-neutral-300 mt-1">{diagnosticScore.weak.join(', ')}</p>
                </div>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-400">System Personalized Recommendation:</p>
                  <p className="text-neutral-300">{diagnosticScore.recommendation}</p>
                </div>
                <button
                  onClick={() => onNavigate('learning')}
                  className="bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 transition-colors"
                >
                  Start Lesson Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE LIST */}
      <div className="space-y-4">
        {selectedSubject.modules.map((mod, idx) => (
          <div key={mod.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
            
            {/* MODULE HEADER */}
            <div className="p-4 md:p-5 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-neutral-800 text-amber-400 font-bold text-xs flex items-center justify-center border border-neutral-700">
                  M{idx + 1}
                </span>
                <div>
                  <h2 className="text-sm font-bold text-neutral-100">{mod.name}</h2>
                  <p className="text-[10px] text-neutral-400">{mod.topics.length} Lessons • Estimated 65 mins</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                mod.status === 'Completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : mod.status === 'In Progress'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}>
                {mod.status}
              </span>
            </div>

            {/* TOPICS IN MODULE */}
            <div className="divide-y divide-neutral-800/60">
              {mod.topics.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    t.status === 'Current'
                      ? 'bg-amber-500/10 border-l-4 border-amber-500'
                      : t.status === 'Completed'
                      ? 'hover:bg-neutral-800/30'
                      : 'opacity-60 bg-neutral-950/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {t.status === 'Completed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : t.status === 'Locked' ? (
                      <Lock className="w-5 h-5 text-neutral-600 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center shrink-0 animate-pulse">
                        ●
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-neutral-100">{t.name}</p>
                        {t.isWeak && (
                          <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                            Weakness Flag
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{t.estMin} min</span>
                        </span>
                        <span>• Difficulty: {t.difficulty}</span>
                        {t.mastery > 0 && <span>• Mastery: {t.mastery}%</span>}
                      </div>
                    </div>
                  </div>

                  {t.status !== 'Locked' ? (
                    <button
                      onClick={() => onNavigate('learning')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                        t.status === 'Current'
                          ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      }`}
                    >
                      <span>{t.status === 'Completed' ? 'Review' : 'Start'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-semibold px-2 py-1 bg-neutral-950 rounded border border-neutral-800">
                      Finish Prerequisite
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
