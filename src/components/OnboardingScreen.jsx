import React, { useState } from 'react';
import { User, Briefcase, Sparkles, Clock, Target, ChefHat, Dumbbell, Gamepad2, Music, Flame, ArrowRight, FileText } from 'lucide-react';

const SUGGESTED_DOMAINS = [
  { label: 'Cooking & Culinary', val: 'cooking', icon: '🍳' },
  { label: 'Cricket & Sports', val: 'cricket', icon: '🏏' },
  { label: 'Gaming & RPGs', val: 'gaming', icon: '🎮' },
  { label: 'Music & Instruments', val: 'music', icon: '🎵' },
  { label: 'Gardening & Botany', val: 'gardening', icon: '🌿' },
  { label: 'Chess & Strategy', val: 'chess', icon: '♟️' },
];

const SUGGESTED_GOALS = [
  "Master AI Engineering & LLM Applications",
  "Learn React & Modern Fullstack Web Architecture",
  "Become Job-Ready in Data Science & Machine Learning",
  "Master System Design & Microservice Architectures",
  "Learn MLOps, Cloud Infrastructure & Model Deployment",
  "Become a Cybersecurity & Network Security Specialist"
];

export default function OnboardingScreen({ onSubmitOnboarding, isLoading }) {
  const [role, setRole] = useState('Student'); // Student or Working Professional
  const [goal, setGoal] = useState('Learn React & modern frontend architecture');
  const [skillLevel, setSkillLevel] = useState('Beginner'); // Beginner / Some experience / Intermediate
  const [timeMinutes, setTimeMinutes] = useState(25);
  const [timeCustomText, setTimeCustomText] = useState('25 minutes');
  const [domain, setDomain] = useState('cooking');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    onSubmitOnboarding({
      role,
      goal: goal.trim(),
      skillLevel,
      timeAvailable: `${timeMinutes} minutes`,
      timeMinutes,
      domain: domain.trim() || 'cooking',
      jobDescription: role === 'Working Professional' ? jobDescription.trim() : ''
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Header section */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 text-xs font-medium border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Tailored AI Mentor Setup</span>
        </div>
        <h2 className="font-editorial text-4xl md:text-5xl font-semibold text-stone-900 tracking-tight leading-tight">
          What would you like to master today?
        </h2>
        <p className="text-stone-600 text-base max-w-xl mx-auto font-sans leading-relaxed">
          MentorPath adapts its explanation depth, real-world analogies, and session timing directly to your personal background.
        </p>
      </div>

      {/* Main Card Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-xl shadow-stone-200/40 space-y-8">
        
        {/* 1. Role Selection */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500">
            1. Current Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('Student')}
              className={`flex items-center justify-center space-x-3 p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                role === 'Student'
                  ? 'bg-amber-500/10 border-amber-600 text-amber-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/70'
              }`}
            >
              <User className="w-5 h-5 text-amber-700" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('Working Professional')}
              className={`flex items-center justify-center space-x-3 p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                role === 'Working Professional'
                  ? 'bg-amber-500/10 border-amber-600 text-amber-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/70'
              }`}
            >
              <Briefcase className="w-5 h-5 text-amber-700" />
              <span>Working Professional</span>
            </button>
          </div>
        </div>

        {/* 2. Goal Input */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500">
            2. Primary Learning Goal
          </label>
          <div className="relative">
            <Target className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            <input
              type="text"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. learn React, become job-ready in data analysis"
              className="w-full bg-stone-50/80 border border-stone-300 rounded-2xl pl-12 pr-4 py-3 text-stone-900 text-sm font-medium focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
            />
          </div>
          {/* Quick goal suggestions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTED_GOALS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoal(s)}
                className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-900 transition-colors border border-stone-200/60 cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Skill Level & Time Available Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Skill Level */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500">
              3. Current Skill Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Some experience', 'Intermediate'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSkillLevel(lvl)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    skillLevel === lvl
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Time Available */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500">
                4. Time Available Today
              </label>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {timeMinutes} mins
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-medium">
                <span>10m Quick</span>
                <span>25m Standard</span>
                <span>45m Deep</span>
                <span>60m Marathon</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Analogy Engine Domain / Hobby */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500">
            5. Domain or Hobby You Know Well <span className="normal-case text-amber-800 font-normal">(Used for Analogy Engine)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUGGESTED_DOMAINS.map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setDomain(item.val)}
                className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  domain.toLowerCase() === item.val
                    ? 'bg-amber-500/15 border-amber-600 text-amber-950 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="pt-1">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Or enter custom hobby (e.g. photography, baking, soccer)..."
              className="w-full bg-stone-50/80 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-800 focus:outline-hidden focus:border-amber-600 focus:bg-white"
            />
          </div>
        </div>

        {/* 6. Optional Job Description for Working Professionals */}
        {role === 'Working Professional' && (
          <div className="space-y-3 pt-2 border-t border-stone-200/70 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">
                6. Target Job Description or Role Title <span className="normal-case text-stone-400 font-normal">(Optional)</span>
              </label>
            </div>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job requirements or title (e.g. Senior Frontend Engineer - requires React, Next.js, Redux, Performance Optimization, Unit Testing)..."
              className="w-full bg-stone-50/80 border border-stone-300 rounded-2xl p-3.5 text-xs text-stone-800 focus:outline-hidden focus:border-amber-600 focus:bg-white leading-relaxed"
            />
            <p className="text-[11px] text-stone-500 italic">
              When provided, MentorPath generates an instant **Skill Gap Map** highlighting matched vs. missing skills for your target role.
            </p>
          </div>
        )}

        {/* Submit CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-stone-900 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Generating Personalized Roadmap via AI...</span>
              </span>
            ) : (
              <>
                <span>Generate My Personalized Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
