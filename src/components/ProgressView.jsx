import React from 'react';
import { 
  BarChart3, Flame, Target, AlertTriangle, ArrowRight, Award, 
  CheckCircle, Sparkles, TrendingUp, BookOpen
} from 'lucide-react';

export default function ProgressView({ studentProfile, skills, onNavigate }) {
  const overallMastery = studentProfile?.mastery || 72;
  const streakDays = studentProfile?.streak || 7;

  const subjectPerformance = [
    { subject: 'Python Foundations', score: 82, color: 'bg-emerald-500' },
    { subject: 'Mathematics & Probability', score: 64, color: 'bg-amber-500' },
    { subject: 'AI & Machine Learning', score: 71, color: 'bg-indigo-500' },
    { subject: 'Generative AI & LLMs', score: 40, color: 'bg-purple-500' }
  ];

  const topicMasteryList = [
    { topic: 'Lists & Data Structures', mastery: 91, status: 'Mastered' },
    { topic: 'Control Flow & Loops', mastery: 76, status: 'Proficient' },
    { topic: 'Functions & Recursion', mastery: 48, status: 'Needs Practice', isWeak: true },
    { topic: 'Probability & Bayes Rule', mastery: 42, status: 'Weak', isWeak: true }
  ];

  const aiInsights = [
    {
      id: 'ins-1',
      title: 'Functions & Lambda Expressions',
      what: 'You have a 48% mastery rating in Functions & Scope.',
      why: 'You answered 3 of your last 5 quiz questions incorrectly and spent +27% more time reading function definitions.',
      whatNext: 'Complete the 8-minute Nested Functions & Scope lesson.',
      actionView: 'learning'
    },
    {
      id: 'ins-2',
      title: 'Probability & Bayes Theorem',
      what: 'Retention decay risk flagged as HIGH (38% retention score).',
      why: 'No activity on Probability for 8 days. Cognitive decay predictions indicate high risk of forgetting Bayes formula.',
      whatNext: 'Review 5-minute Smart Revision queue for Probability.',
      actionView: 'smart-revision'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Learner Analytics & Insights</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-50">Mastery & Progress Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time mastery tracking, retention modeling, and AI weakness diagnostics.
          </p>
        </div>

        {/* STREAK BADGE */}
        <div className="flex items-center space-x-3 bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-800 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Flame className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-sm font-bold text-neutral-100 block">{streakDays} Day Streak!</span>
            <span className="text-[10px] text-neutral-400">Consistent daily study</span>
          </div>
        </div>
      </div>

      {/* MASTERY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Overall Mastery</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">{overallMastery}%</span>
            <span className="text-xs text-emerald-400 font-bold">+5% this week</span>
          </div>
          <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${overallMastery}%` }}></div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Retention Health</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">68%</span>
            <span className="text-xs text-neutral-400 font-medium">Optimal zone</span>
          </div>
          <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">AI Skill Level</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-neutral-100">Level 4 Apprentice</span>
          </div>
          <p className="text-[11px] text-neutral-400">Next rank: AI Engineer (Level 5)</p>
        </div>
      </div>

      {/* AI WEAKNESS DETECTION SECTION ("AI INSIGHTS") */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-base font-bold text-neutral-50">AI Insights & Weakness Detection</h2>
        </div>

        <div className="space-y-3">
          {aiInsights.map((ins) => (
            <div key={ins.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-2 text-xs text-neutral-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>{ins.title}</span>
                </span>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                  Weakness Flag
                </span>
              </div>

              <p><strong>WHAT:</strong> {ins.what}</p>
              <p className="text-neutral-400"><strong>WHY:</strong> {ins.why}</p>
              
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                <p className="text-amber-300 font-medium"><strong>WHAT NEXT:</strong> {ins.whatNext}</p>
                <button
                  onClick={() => onNavigate(ins.actionView)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center space-x-1 shrink-0"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECT & TOPIC MASTERY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SUBJECT PERFORMANCE */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-neutral-100 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Subject Performance</span>
          </h3>
          <div className="space-y-3 text-xs">
            {subjectPerformance.map((subj, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-neutral-300 font-medium">
                  <span>{subj.subject}</span>
                  <span className="font-bold text-neutral-100">{subj.score}%</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                  <div className={`${subj.color} h-full rounded-full`} style={{ width: `${subj.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOPIC MASTERY BREAKDOWN */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-neutral-100 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Topic Mastery Breakdown</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            {topicMasteryList.map((t, i) => (
              <div key={i} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-200">{t.topic}</p>
                  <span className="text-[10px] text-neutral-400">{t.status}</span>
                </div>
                <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${
                  t.mastery >= 80
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : t.mastery >= 60
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {t.mastery}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
