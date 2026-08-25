import React from 'react';
import { 
  BarChart3, Flame, Target, AlertTriangle, ArrowRight, Award, 
  CheckCircle, Sparkles, TrendingUp, BookOpen
} from 'lucide-react';

export default function ProgressView({ studentProfile, skills, onNavigate }) {
  const overallMastery = studentProfile?.mastery || 72;
  const streakDays = studentProfile?.streak || 7;

  const subjectPerformance = [
    { subject: 'Python Foundations', score: 82 },
    { subject: 'Mathematics & Probability', score: 64 },
    { subject: 'AI & Machine Learning', score: 71 },
    { subject: 'Generative AI & LLMs', score: 40 }
  ];

  const topicMasteryList = [
    { topic: 'Lists & Data Structures', mastery: 91, status: 'Mastered', badgeBg: '#8A2BE2', badgeText: '#FFFFFF' },
    { topic: 'Control Flow & Loops', mastery: 76, status: 'Proficient', badgeBg: '#DEB887', badgeText: '#1A0F05' },
    { topic: 'Functions & Recursion', mastery: 48, status: 'Needs Practice', isWeak: true, badgeBg: '#ADD8E6', badgeText: '#161512' },
    { topic: 'Probability & Bayes Rule', mastery: 42, status: 'Weak', isWeak: true, badgeBg: '#ADD8E6', badgeText: '#161512' }
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
      
      {/* HEADER BAR (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] border border-[#C59B67] text-[#1A0F05] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-[#5A2A00] text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#5A2A00]" />
            <span>Learner Analytics & Insights</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A0F05]">Mastery & Progress Dashboard</h1>
          <p className="text-xs text-[#3D2714] mt-1 font-medium">
            Real-time mastery tracking, retention modeling, and AI weakness diagnostics.
          </p>
        </div>

        {/* STREAK BADGE (BISQUE INNER PANEL) */}
        <div className="flex items-center space-x-3 bg-[#FFE4C4] px-4 py-3 rounded-xl border border-[#C59B67] self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#8A2BE2] text-white flex items-center justify-center border border-[#6b1cb9]">
            <Flame className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#1A0F05] block">{streakDays} Day Streak!</span>
            <span className="text-[10px] text-[#5C4228] font-semibold">Consistent daily study</span>
          </div>
        </div>
      </div>

      {/* MASTERY METRIC CARDS (BISQUE & LIGHTBLUE PANELS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFE4C4] border border-[#E3C6A2] p-5 rounded-2xl space-y-2 shadow-sm">
          <span className="text-xs font-bold text-[#5C4228] uppercase tracking-wider">Overall Mastery</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#8A2BE2]">{overallMastery}%</span>
            <span className="text-xs text-[#4c1d95] font-bold">+5% this week</span>
          </div>
          <div className="w-full bg-[#ADD8E6] rounded-full h-2.5 overflow-hidden border border-[#91c4d5]">
            <div className="bg-[#8A2BE2] h-full rounded-full" style={{ width: `${overallMastery}%` }}></div>
          </div>
        </div>

        <div className="bg-[#FFE4C4] border border-[#E3C6A2] p-5 rounded-2xl space-y-2 shadow-sm">
          <span className="text-xs font-bold text-[#5C4228] uppercase tracking-wider">Retention Health</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#8A2BE2]">68%</span>
            <span className="text-xs text-[#4A3B32] font-semibold">Optimal zone</span>
          </div>
          <div className="w-full bg-[#ADD8E6] rounded-full h-2.5 overflow-hidden border border-[#91c4d5]">
            <div className="bg-[#8A2BE2] h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-[#FFE4C4] border border-[#E3C6A2] p-5 rounded-2xl space-y-2 shadow-sm">
          <span className="text-xs font-bold text-[#5C4228] uppercase tracking-wider">AI Skill Level</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-[#1A0F05]">Level 4 Apprentice</span>
          </div>
          <p className="text-[11px] text-[#5C4228] font-medium">Next rank: AI Engineer (Level 5)</p>
        </div>
      </div>

      {/* AI WEAKNESS DETECTION SECTION ("AI INSIGHTS") */}
      <div className="bg-[#FFE4C4] border border-[#E3C6A2] rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center space-x-2 text-[#8A2BE2]">
          <Sparkles className="w-5 h-5 text-[#8A2BE2]" />
          <h2 className="text-base font-bold text-[#1A0F05]">AI Insights & Weakness Detection</h2>
        </div>

        <div className="space-y-3">
          {aiInsights.map((ins) => (
            <div key={ins.id} className="bg-[#ADD8E6] border border-[#96cbe0] p-4 rounded-xl space-y-2 text-xs text-[#161512]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#4c1d95] flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#8A2BE2]" />
                  <span>{ins.title}</span>
                </span>
                <span className="bg-[#DEB887] text-[#1A0F05] text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#C59B67]">
                  Weakness Flag
                </span>
              </div>

              <p className="text-[#0f172a]"><strong className="text-[#1A0F05]">WHAT:</strong> {ins.what}</p>
              <p className="text-[#334155]"><strong className="text-[#1A0F05]">WHY:</strong> {ins.why}</p>
              
              <div className="pt-2 flex items-center justify-between border-t border-[#91c4d5]">
                <p className="text-[#4c1d95] font-bold"><strong>WHAT NEXT:</strong> {ins.whatNext}</p>
                <button
                  onClick={() => onNavigate(ins.actionView)}
                  className="bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center space-x-1 shrink-0 shadow-2xs"
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
        <div className="bg-[#FFE4C4] border border-[#E3C6A2] p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1A0F05] flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#8A2BE2]" />
            <span>Subject Performance</span>
          </h3>
          <div className="space-y-3 text-xs">
            {subjectPerformance.map((subj, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[#3D2714] font-semibold">
                  <span>{subj.subject}</span>
                  <span className="font-bold text-[#1A0F05]">{subj.score}%</span>
                </div>
                <div className="w-full bg-[#ADD8E6] rounded-full h-2.5 overflow-hidden border border-[#91c4d5]">
                  <div className="bg-[#8A2BE2] h-full rounded-full" style={{ width: `${subj.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOPIC MASTERY BREAKDOWN */}
        <div className="bg-[#FFE4C4] border border-[#E3C6A2] p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1A0F05] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#8A2BE2]" />
            <span>Topic Mastery Breakdown</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            {topicMasteryList.map((t, i) => (
              <div key={i} className="p-3 bg-[#ADD8E6] rounded-xl border border-[#96cbe0] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#161512]">{t.topic}</p>
                  <span className="text-[10px] text-[#334155] font-semibold">{t.status}</span>
                </div>
                <span 
                  className="font-bold text-xs px-2.5 py-1 rounded-lg border shadow-2xs"
                  style={{ backgroundColor: t.badgeBg, color: t.badgeText, borderColor: t.badgeBg }}
                >
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
