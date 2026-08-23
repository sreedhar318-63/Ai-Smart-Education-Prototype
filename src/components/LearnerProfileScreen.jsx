import React, { useState, useEffect } from 'react';
import { User, Flame, Award, Clock, BookOpen, Sparkles, Brain, CheckCircle2, AlertTriangle, XCircle, Sliders, ChefHat, HelpCircle, Info, FileText } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';

export default function LearnerProfileScreen({
  onboardingData,
  learnerModel,
  heatmapData,
  onReturnToLearning,
  onOpenResumeBuilder,
  onOpenCertificate
}) {

  const [insightChips, setInsightChips] = useState([]);
  const [isLoadingChips, setIsLoadingChips] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Fetch AI-generated insight chips derived from learnerModel
  useEffect(() => {
    let isSubscribed = true;

    async function loadChips() {
      setIsLoadingChips(true);
      try {
        const userPrompt = `Summarize the following learner model into 3-4 concise adaptive insight chips:
Goal: ${onboardingData.goal} (${onboardingData.skillLevel} level)
Domain: ${onboardingData.domain}
Preferred Depth: ${learnerModel.preferredLevel || 'ELI10'}
Preferred Style: ${learnerModel.preferredStyle || 'Analogy'}
Weak Topics: ${learnerModel.weakTopics?.join(', ') || 'None'}
Average Confusion Cycles per Topic: ${learnerModel.avgCycles || 0}`;

        const res = await generatePersonalizedContent({
          type: 'learner_model_summary',
          systemPrompt: 'You are an AI Learning Analytics Engine. Summarize learner cognitive state into crisp insight chips.',
          userPrompt,
          context: {
            goal: onboardingData.goal,
            domain: onboardingData.domain,
            learnerModel
          }
        });

        if (isSubscribed) {
          if (res?.chips) {
            setInsightChips(res.chips);
          } else {
            setInsightChips([
              { label: `You learn best with: ${learnerModel.preferredStyle || 'Analogies'} (${onboardingData.domain})`, category: 'style' },
              { label: `Preferred depth: ${learnerModel.preferredLevel || 'ELI10 (School)'}`, category: 'depth' },
              { label: `Pace signal: ${learnerModel.avgCycles > 1 ? 'High curiosity / Re-explores' : 'Steady progress'}`, category: 'pace' },
              { label: `Watch out for: ${learnerModel.weakTopics?.length > 0 ? learnerModel.weakTopics.slice(0, 2).join(', ') : 'State side-effects'}`, category: 'warning' }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load insight chips:', err);
      } finally {
        if (isSubscribed) setIsLoadingChips(false);
      }
    }

    loadChips();

    return () => {
      isSubscribed = false;
    };
  }, [learnerModel, onboardingData.goal, onboardingData.domain]);

  // Color mapping for 90-day heatmap intensity cells
  const getCellBgClass = (intensity, isToday) => {
    if (isToday && intensity === 0) return 'bg-amber-100 border-2 border-amber-500 animate-pulse';
    if (isToday) return 'bg-emerald-500 border-2 border-amber-400 ring-2 ring-amber-200';
    switch (intensity) {
      case 1: return 'bg-emerald-200';
      case 2: return 'bg-emerald-400';
      case 3: return 'bg-emerald-600';
      case 4: return 'bg-emerald-800';
      default: return 'bg-stone-100 border border-stone-200/60';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* 1. PROFILE HEADER */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* User Info */}
        <div className="flex items-start space-x-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-editorial text-2xl font-bold shrink-0">
            <User className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white tracking-tight">
                Learner Profile & Analytics
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-semibold tracking-wider font-mono-code">
                {onboardingData.role}
              </span>
            </div>
            <p className="text-sm text-stone-300 font-sans">
              Goal: <strong className="text-amber-300">{onboardingData.goal}</strong> • Level: <span className="italic">{onboardingData.skillLevel}</span>
            </p>
            <p className="text-xs text-stone-400 font-sans">
              Analogy Engine Domain: <strong className="text-white uppercase">{onboardingData.domain}</strong>
            </p>
          </div>
        </div>

        {/* Stats Counter Cards */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto z-10">
          {/* Streak Counter */}
          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Streak</span>
            </div>
            <div className="text-2xl font-bold text-white font-sans">
              {learnerModel.currentStreak || 5}d
            </div>
            <div className="text-[10px] text-stone-400">
              Longest: {learnerModel.longestStreak || 12}d
            </div>
          </div>

          {/* Topics Completed */}
          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Topics</span>
            </div>
            <div className="text-2xl font-bold text-white font-sans">
              {learnerModel.completedTopicsCount || 0}
            </div>
            <div className="text-[10px] text-stone-400">
              Completed
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="flex items-center justify-center space-x-1 text-cyan-400 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </div>
            <div className="text-2xl font-bold text-white font-sans">
              ~{learnerModel.totalMinutesSpent || 0}m
            </div>
            <div className="text-[10px] text-stone-400">
              Total Focus
            </div>
          </div>
        </div>

      </div>

      {/* 2. ACTIVITY HEATMAP (90-DAY GITHUB CONTRIBUTION STYLE) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                90-Day Learning Activity Heatmap
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-sans">
              Visual record of study consistency. Today's cell updates live as you complete topics.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 font-medium">
            <span>Less</span>
            <span className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200"></span>
            <span className="w-3 h-3 rounded-xs bg-emerald-200"></span>
            <span className="w-3 h-3 rounded-xs bg-emerald-400"></span>
            <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
            <span className="w-3 h-3 rounded-xs bg-emerald-800"></span>
            <span>More</span>
          </div>
        </div>

        {/* Notice Callout */}
        <div className="flex items-center space-x-2 bg-amber-50/80 border border-amber-200/80 px-3.5 py-2 rounded-xl text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Prototype Note:</strong> Heatmap is initialized with seeded mock historical data on app load and updates live during your session. Resets on refresh (no backend/localStorage persistence).
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="relative overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 p-2 bg-stone-50/80 border border-stone-200/80 rounded-2xl">
            {heatmapData.map((day, idx) => (
              <div
                key={day.dateStr}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-all cursor-pointer hover:ring-2 hover:ring-amber-500 ${getCellBgClass(day.intensity, day.isToday)}`}
                title={`${day.formattedDate}: ${day.count} topic(s) covered`}
              />
            ))}
          </div>

          {/* Tooltip display */}
          {hoveredDay && (
            <div className="mt-2 p-3 bg-stone-900 text-stone-100 rounded-xl text-xs space-y-1 animate-in fade-in duration-150 inline-block font-sans">
              <div className="font-semibold text-amber-400">
                {hoveredDay.formattedDate} {hoveredDay.isToday && '(Today - Live Session Data)'}
              </div>
              <div className="text-stone-300">
                Topics Covered ({hoveredDay.count}): {hoveredDay.topicsCovered.length > 0 ? hoveredDay.topicsCovered.join(', ') : 'Rest / Reflection day'}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. ADAPTIVE LEARNING TRACKER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-amber-700" />
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                Adaptive Learning Model & Cognitive Insights
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-sans">
              This <code className="text-amber-800 font-mono-code font-bold">learnerModel</code> is injected into every black-box LLM call to tailor AI tone, analogies, and difficulty.
            </p>
          </div>
        </div>

        {/* AI-Generated Insight Chips */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-sans">
            AI-Synthesized Learner Insight Chips (Auto-generated via LLM)
          </h4>

          {isLoadingChips ? (
            <div className="py-4 text-xs text-stone-400 animate-pulse">Synthesizing cognitive chips...</div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {insightChips.map((chip, i) => (
                <div
                  key={i}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center space-x-2 shadow-xs ${
                    chip.category === 'style' 
                      ? 'bg-amber-50 border-amber-300 text-amber-900' 
                      : chip.category === 'warning' 
                        ? 'bg-rose-50 border-rose-300 text-rose-900' 
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Preferred Depth */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase">
              <Sliders className="w-4 h-4 text-amber-700" />
              <span>Preferred Depth</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-sans">
              {learnerModel.preferredLevel || 'ELI10 (School)'}
            </div>
            <p className="text-[11px] text-stone-500">
              Most frequently selected complexity level on Explain-o-Meter.
            </p>
          </div>

          {/* Preferred Style */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase">
              <ChefHat className="w-4 h-4 text-amber-700" />
              <span>Best-Fit Style</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-sans">
              {learnerModel.preferredStyle || 'Analogy Engine'}
            </div>
            <p className="text-[11px] text-stone-500">
              Style stopped on when using "I'm still confused" cycler.
            </p>
          </div>

          {/* Pace & Confusion Signal */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Pace & Confusion Signal</span>
            </div>
            <div className="text-lg font-bold text-stone-900 font-sans">
              {learnerModel.avgCycles > 1 ? 'High Curiosity / Re-explores' : 'Steady Pace'}
            </div>
            <p className="text-[11px] text-stone-500">
              Average {learnerModel.avgCycles || 0} style cycle(s) per topic.
            </p>
          </div>

        </div>

        {/* System Prompt Injection Inspector Codebox */}
        <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 border border-stone-800 space-y-2 font-mono-code text-xs">
          <div className="flex items-center justify-between text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
            <span>Injected LLM System Prompt Context</span>
            <span className="text-emerald-400">Active in generatePersonalizedContent()</span>
          </div>
          <pre className="text-stone-300 whitespace-pre-wrap leading-relaxed">
{`[ADAPTIVE LEARNER MODEL CONTEXT]:
- Preferred Complexity Depth: ${learnerModel.preferredLevel || 'ELI10'}
- Best-Fit Explanation Style: ${learnerModel.preferredStyle || 'Analogy'}
- Topics Learner Struggled With: ${learnerModel.weakTopics?.join(', ') || 'None'}
- Pace Signal: ${learnerModel.avgCycles || 0} cycles per topic.
INSTRUCTION: Adapt your explanation style accordingly. If this topic is conceptually related to something they struggled with, build a helpful cognitive bridge.`}
          </pre>
        </div>

        {/* AI Resume Builder CTA Banner */}
        <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-stone-100 rounded-2xl p-6 border border-amber-600/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Job Readiness Tool</span>
            </div>
            <h4 className="font-editorial text-xl font-bold text-white">
              Generate AI Skill-Based Resume
            </h4>
            <p className="text-xs text-stone-300 font-sans">
              Synthesize your completed roadmap topics into an ATS-optimized CV with custom bullet points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenCertificate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>Official Certificate</span>
            </button>

            <button
              onClick={onOpenResumeBuilder}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>AI Resume Builder</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
