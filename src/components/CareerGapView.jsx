import React, { useState } from 'react';
import { 
  Target, Award, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
  Lock, Sparkles, Compass, ShieldAlert, Zap, Layers, Briefcase, Search, Plus
} from 'lucide-react';
import { 
  CAREER_PROFILES, 
  calculateCareerReadiness, 
  generatePersonalizedRoadmap 
} from '../services/aiEngine';

export default function CareerGapView({
  studentProfile,
  skills,
  careerGoal,
  onSelectCareer,
  onGoBack,
  onNavigate
}) {
  const [activeTarget, setActiveTarget] = useState(careerGoal || "AI Engineer");
  const [searchQuery, setSearchQuery] = useState("");
  const [customGoalInput, setCustomGoalInput] = useState("");

  const readinessData = calculateCareerReadiness(activeTarget, skills);
  const roadmapPhases = generatePersonalizedRoadmap(activeTarget, skills);

  const handleGoalChange = (goalTitle) => {
    if (!goalTitle.trim()) return;
    setActiveTarget(goalTitle.trim());
    if (onSelectCareer) onSelectCareer(goalTitle.trim());
  };

  const handleCustomGoalSubmit = (e) => {
    e.preventDefault();
    if (customGoalInput.trim()) {
      handleGoalChange(customGoalInput.trim());
      setCustomGoalInput("");
    }
  };

  // Filter preset profiles by search query
  const filteredProfiles = CAREER_PROFILES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-stone-100 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onGoBack} 
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Technical Goal Benchmark Engine
            </span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold tracking-tight text-white">
            Technical Goal & Career Readiness
          </h1>
          <p className="text-xs text-stone-300 font-sans max-w-xl">
            Search, customize, or type any technical goal to analyze skill gaps and generate a 6-phase personalized roadmap.
          </p>
        </div>

        <div className="bg-stone-800/90 border border-amber-500/40 p-4 rounded-2xl shrink-0 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Active Technical Goal:</span>
          <div className="text-lg font-bold text-white font-sans flex items-center space-x-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>{activeTarget}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND SET CUSTOM TECHNICAL GOALS SECTION */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="space-y-2">
          <h2 className="font-editorial text-2xl font-bold text-stone-900 flex items-center space-x-2">
            <Search className="w-5 h-5 text-amber-700" />
            <span>Search & Fix Your Technical Goal</span>
          </h2>
          <p className="text-xs text-stone-500 font-sans">
            Don't see your target role? Type any custom goal (e.g. <em>Fullstack Next.js Developer</em>, <em>Robotics AI Architect</em>) to fix your goal state.
          </p>
        </div>

        {/* SEARCH AND CUSTOM INPUT ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* SEARCH PRESET GOALS */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search popular technical goals..."
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-stone-800 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          {/* CUSTOM GOAL INPUT FORM */}
          <form onSubmit={handleCustomGoalSubmit} className="flex gap-2">
            <input
              type="text"
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              placeholder="Or enter custom technical goal..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-xs font-medium text-stone-800 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!customGoalInput.trim()}
              className="bg-stone-900 hover:bg-amber-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Fix Goal</span>
            </button>
          </form>

        </div>

        {/* POPULAR GOAL PILLS / SEARCH RESULTS */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Available & Popular Goals:</span>
          <div className="flex flex-wrap gap-2">
            {filteredProfiles.map((p) => {
              const isSelected = activeTarget.toLowerCase() === p.title.toLowerCase();

              return (
                <button
                  key={p.title}
                  onClick={() => handleGoalChange(p.title)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-600 text-amber-950 font-bold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-amber-700" />
                  <span>{p.title}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-800 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CAREER READINESS SCORE BANNER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Benchmark Evaluation</span>
            <h2 className="font-editorial text-2xl font-bold text-stone-900">
              Your AI Readiness Score for <span className="text-amber-700 italic">{readinessData.careerTitle}</span>
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Weighted calculation across critical vs optional skills for <strong>{readinessData.careerTitle}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200">
            <div className="text-4xl font-bold text-amber-900 font-sans">
              {readinessData.readinessScore}%
            </div>
            <div className="text-xs font-medium text-amber-950">
              <span className="block font-bold text-sm">Readiness Score</span>
              <span className="text-[11px] text-amber-800">Target: 85%+ Job-Ready</span>
            </div>
          </div>
        </div>

        {/* HIGH PRIORITY GAPS */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-900 text-sm font-sans flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>High Priority Skill Gaps Detected:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {readinessData.highPriorityGaps.slice(0, 3).map((gap, idx) => (
              <div key={idx} className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between font-bold text-rose-950">
                  <span>{gap.skillName}</span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold uppercase">{gap.importance}</span>
                </div>
                <p className="text-stone-600">Current: {gap.currentLevel}% • Required: {gap.requiredLevel}%</p>
                <div className="w-full bg-rose-200 rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${gap.currentLevel}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL SKILLS COMPARISON BREAKDOWN */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm font-sans">Required Skills Breakdown for {readinessData.careerTitle}:</h3>

          <div className="space-y-2">
            {readinessData.gaps.map((g, idx) => (
              <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="w-1/3 font-bold text-stone-800">{g.skillName}</div>
                <div className="w-1/2 space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>Level: {g.currentLevel}%</span>
                    <span>Target: {g.requiredLevel}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${Math.min(100, (g.currentLevel / g.requiredLevel) * 100)}%` }}></div>
                  </div>
                </div>
                <div className="w-1/6 text-right font-bold text-stone-700">
                  {g.gap > 0 ? `-${g.gap}% Gap` : `✓ Match`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PERSONALIZED 6-PHASE LEARNING ROADMAP */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <h2 className="font-editorial text-2xl font-bold text-stone-900">
              Personalized Learning Roadmap for {readinessData.careerTitle}
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
            6 Phases
          </span>
        </div>

        <div className="space-y-4">
          {roadmapPhases.map((phase) => {
            const isCompleted = phase.status === 'Completed';
            const isInProgress = phase.status === 'In Progress';

            return (
              <div
                key={phase.phase}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-300' 
                    : isInProgress 
                      ? 'bg-amber-50/60 border-amber-400 shadow-md ring-2 ring-amber-200' 
                      : 'bg-stone-50 border-stone-200 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                      isCompleted ? 'bg-emerald-600 text-white' : isInProgress ? 'bg-amber-600 text-white' : 'bg-stone-300 text-stone-700'
                    }`}>
                      {phase.phase}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base font-sans">{phase.title}</h3>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                    isCompleted ? 'bg-emerald-200 text-emerald-900' : isInProgress ? 'bg-amber-200 text-amber-950 animate-pulse' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {phase.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Est Time & Target</span>
                    <span className="font-semibold text-stone-800">{phase.estTime} • {phase.masteryTarget}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Practical Project</span>
                    <span className="font-semibold text-amber-900">{phase.project}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Assessment</span>
                    <span className="font-semibold text-stone-800">{phase.assessment}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => onNavigate('adaptive-quiz')}
            className="flex items-center space-x-2 bg-stone-900 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
          >
            <span>Start Active Phase Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
