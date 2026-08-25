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
 const [skillLevel, setSkillLevel] = useState('Beginner'); // Beginner / Some experience / Intermediate
 const [timeMinutes, setTimeMinutes] = useState(25);
 const [domain, setDomain] = useState('cooking');
 const [jobDescription, setJobDescription] = useState('');

 const handleSubmit = (e) => {
 e.preventDefault();
 const derivedGoal = role === 'Working Professional' 
 ? (jobDescription.trim() || 'AI Engineering & Career Advancement') 
 : 'AI Engineering & Machine Learning';

 onSubmitOnboarding({
 role,
 goal: derivedGoal,
 skillLevel,
 timeAvailable: `${timeMinutes} minutes`,
 timeMinutes,
 domain: domain.trim() || 'cooking',
 jobDescription: role === 'Working Professional' ? jobDescription.trim() : ''
 });
 };

 return (
 <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-duration-300">
 
 {/* Header section */}
 <div className="text-center mb-8 space-y-3">
 <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-warning-500/10 text-accent-800 text-xs font-medium border border-warning-500/20">
 <Sparkles className="w-3.5 h-3.5 text-warning-600" />
 <span>Tailored AI Mentor Setup</span>
 </div>
 <h2 className="font-editorial text-4xl md:text-5xl font-semibold text-neutral-900 tracking-tight leading-tight">
 What would you like to master today?
 </h2>
 <p className="text-neutral-600 text-base max-w-xl mx-auto font-sans leading-relaxed">
 MentorPath adapts its explanation depth, real-world analogies, and session timing directly to your personal background.
 </p>
 </div>

 {/* Main Card Form */}
 <form onSubmit={handleSubmit} className="bg-neutral-100 rounded-lg p-6 md:p-10 border border-neutral-200/90 shadow-neutral-200/40 space-y-8">
 
 {/* 1. Role Selection */}
 <div className="space-y-3">
 <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500">
 1. Current Role
 </label>
 <div className="grid grid-cols-2 gap-4">
 <button
 type="button"
 onClick={() => setRole('Student')}
 className={`flex items-center justify-center space-x-3 p-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
 role === 'Student'
 ? 'bg-warning-500/10 border-warning-600 text-warning-900 '
 : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100/70'
 }`}
 >
 <User className="w-5 h-5 text-warning-700" />
 <span>Student</span>
 </button>

 <button
 type="button"
 onClick={() => setRole('Working Professional')}
 className={`flex items-center justify-center space-x-3 p-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
 role === 'Working Professional'
 ? 'bg-warning-500/10 border-warning-600 text-warning-900 '
 : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100/70'
 }`}
 >
 <Briefcase className="w-5 h-5 text-warning-700" />
 <span>Working Professional</span>
 </button>
 </div>
 </div>

 {/* 2. Skill Level & 3. Time Available Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Skill Level */}
 <div className="space-y-3">
 <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500">
 2. Current Skill Level
 </label>
 <div className="grid grid-cols-3 gap-2">
 {['Beginner', 'Some experience', 'Intermediate'].map((lvl) => (
 <button
 key={lvl}
 type="button"
 onClick={() => setSkillLevel(lvl)}
 className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
 skillLevel === lvl
 ? 'bg-warning-600 text-neutral-50 border-warning-600 '
 : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
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
 <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500">
 3. Time Available Today
 </label>
 <span className="text-xs font-bold text-warning-700 bg-warning-100 px-2.5 py-0.5 rounded-full">
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
 className="w-full accent-warning-700 cursor-pointer"
 />
 <div className="flex justify-between text-[11px] text-neutral-600 font-medium">
 <span>10m Quick</span>
 <span>25m Standard</span>
 <span>45m Deep</span>
 <span>60m Marathon</span>
 </div>
 </div>
 </div>

 </div>

 {/* 4. Analogy Engine Domain / Hobby */}
 <div className="space-y-3">
 <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500">
 4. Domain or Hobby You Know Well <span className="normal-case text-accent-800 font-normal">(Used for Analogy Engine)</span>
 </label>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
 {SUGGESTED_DOMAINS.map((item) => (
 <button
 key={item.val}
 type="button"
 onClick={() => setDomain(item.val)}
 className={`flex items-center space-x-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
 domain.toLowerCase() === item.val
 ? 'bg-warning-500/15 border-warning-600 text-accent-950 font-semibold '
 : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
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
 className="w-full bg-neutral-50/80 border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-warning-600 focus:bg-neutral-100"
 />
 </div>
 </div>

 {/* 5. Optional Job Description for Working Professionals */}
 {role === 'Working Professional' && (
 <div className="space-y-3 pt-2 border-t border-neutral-200/70 animate-in fade-in duration-200">
 <div className="flex items-center space-x-2">
 <FileText className="w-4 h-4 text-warning-700" />
 <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700">
 5. Target Job Description or Role Title <span className="normal-case text-neutral-600 font-normal">(Optional)</span>
 </label>
 </div>
 <textarea
 rows={3}
 value={jobDescription}
 onChange={(e) => setJobDescription(e.target.value)}
 placeholder="Paste target job requirements or title (e.g. Senior Frontend Engineer - requires React, Next.js, Redux, Performance Optimization, Unit Testing)..."
 className="w-full bg-neutral-50/80 border border-neutral-300 rounded-lg p-3.5 text-xs text-neutral-800 focus:outline-hidden focus:border-warning-600 focus:bg-neutral-100 leading-relaxed"
 />
 <p className="text-[11px] text-neutral-500 italic">
 When provided, MentorPath generates an instant **Skill Gap Map** highlighting matched vs. missing skills for your target role.
 </p>
 </div>
 )}

 {/* Submit CTA */}
 <div className="pt-4">
 <button
 type="submit"
 disabled={isLoading}
 className="w-full flex items-center justify-center space-x-3 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-semibold py-4 px-8 rounded-lg text-sm transition-all hover: cursor-pointer disabled:opacity-50"
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
