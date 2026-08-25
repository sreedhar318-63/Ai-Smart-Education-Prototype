import React, { useState, useEffect } from 'react';
import { 
 X, FileText, Sparkles, Download, Copy, Check, Printer, 
 Briefcase, Award, Code, User, CheckCircle2, RefreshCw, Layout
} from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';

export default function ResumeBuilderModal({
 isOpen,
 onClose,
 onboardingData,
 pathData,
 completedTopicIds = []
}) {
 const [templateStyle, setTemplateStyle] = useState('modern'); // 'modern' | 'minimal' | 'executive'
 const [isLoading, setIsLoading] = useState(true);
 const [resumeData, setResumeData] = useState(null);
 const [copied, setCopied] = useState(false);

 // Editable candidate fields
 const [candidateName, setCandidateName] = useState('Alex Vance');
 const [targetTitle, setTargetTitle] = useState(onboardingData?.goal ? `${onboardingData.goal} Specialist` : 'Software Engineer');

 const topics = pathData?.topics || [];
 const completedTopics = topics.filter(t => completedTopicIds.includes(t.id));

 // Fetch AI-generated resume data on open
 useEffect(() => {
 if (!isOpen) return;

 let isSubscribed = true;

 async function loadResume() {
 setIsLoading(true);
 try {
 const userPrompt = `Generate a modern ATS-optimized resume for a candidate aiming to be a "${targetTitle}".
Completed Skills: ${completedTopics.map(t => t.title).join(', ') || onboardingData.goal}.
Role: ${onboardingData.role}.
Goal: ${onboardingData.goal}.`;

 const res = await generatePersonalizedContent({
 type: 'resume_generation',
 systemPrompt: 'You are an elite Tech Career Coach & Executive Resume Architect.',
 userPrompt,
 context: {
 goal: onboardingData.goal,
 role: onboardingData.role,
 completedTopics: completedTopics,
 skillGapMap: pathData?.skillGapMap
 }
 });

 if (isSubscribed) {
 if (typeof res === 'object') {
 setResumeData(res);
 if (res.name) setCandidateName(res.name);
 if (res.targetTitle) setTargetTitle(res.targetTitle);
 } else {
 // Default fallback structure
 setResumeData({
 name: candidateName,
 targetTitle: targetTitle,
 summary: `Results-driven ${onboardingData.role || 'Professional'} actively mastering modern ${onboardingData.goal || 'software engineering'} competencies through AI-guided adaptive learning pathways. Demonstrated expertise in architectural patterns, reactive state management, and real-world domain problem solving.`,
 skills: completedTopics.map(t => t.title),
 projects: [
 {
 title: `${onboardingData.goal} Adaptive Capstone Project`,
 period: '2026 • Live Project',
 description: `Architected and implemented a high-performance application demonstrating core competencies in ${completedTopics.slice(0, 2).map(t => t.title).join(', ') || onboardingData.goal}.`,
 highlights: [
 `Mastered key architectural patterns with verified confidence self-assessments.`,
 `Implemented state management & reactive components fitting target industry standards.`
 ]
 }
 ],
 certifications: [
 {
 title: `MentorPath Master Learning Certificate: ${onboardingData.goal}`,
 issuer: 'MentorPath AI Platform',
 date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
 }
 ]
 });
 }
 }
 } catch (err) {
 console.error('Failed to generate resume:', err);
 } finally {
 if (isSubscribed) setIsLoading(false);
 }
 }

 loadResume();

 return () => {
 isSubscribed = false;
 };
 }, [isOpen, onboardingData.goal]);

 if (!isOpen) return null;

 // Handle Print / Save PDF
 const handlePrint = () => {
 window.print();
 };

 // Handle Copy Plaintext Markdown to Clipboard
 const handleCopyText = () => {
 if (!resumeData) return;

 const markdownText = `# ${candidateName}
**${targetTitle}**

## Professional Summary
${resumeData.summary}

## Core Technical Competencies
${(resumeData.skills || []).map(s => `- ${s}`).join('\n')}

## Key Capstone Projects
${(resumeData.projects || []).map(p => `### ${p.title} (${p.period})\n${p.description}\n${(p.highlights || []).map(h => `- ${h}`).join('\n')}`).join('\n\n')}

## Certifications & Upskilling
${(resumeData.certifications || []).map(c => `- **${c.title}** (${c.issuer}, ${c.date})`).join('\n')}
`;

 navigator.clipboard.writeText(markdownText);
 setCopied(true);
 setTimeout(() => setCopied(false), 3000);
 };

 return (
 <div className="fixed inset-0 z-50 bg-neutral-900/70 flex items-center justify-center p-4 animate-in fade-in duration-200">
 
 <div className="bg-neutral-100 rounded-lg max-w-4xl w-full h-[90vh] flex flex-col border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
 
 {/* MODAL HEADER */}
 <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-neutral-100 flex items-center justify-between shrink-0">
 <div className="flex items-center space-x-3">
 <div className="w-9 h-9 rounded-lg bg-warning-600/30 text-warning-300 flex items-center justify-center border border-warning-500/40">
 <FileText className="w-5 h-5 text-accent-400" />
 </div>
 <div>
 <h3 className="font-editorial text-xl font-bold tracking-tight text-neutral-50 flex items-center space-x-2">
 <span>AI Skill-Based Resume Builder</span>
 <span className="text-[10px] bg-warning-500 text-neutral-950 font-bold px-2 py-0.5 rounded-md font-sans">
 ATS Ready
 </span>
 </h3>
 <p className="text-xs text-neutral-400">
 Automatically synthesizes your completed roadmap topics into a high-impact CV.
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* TOOLBAR CONTROLS */}
 <div className="px-6 py-3 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
 
 {/* Template Style Selector */}
 <div className="flex items-center space-x-2">
 <Layout className="w-4 h-4 text-neutral-500" />
 <span className="font-bold text-neutral-700">Template Style:</span>
 <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-300">
 <button
 onClick={() => setTemplateStyle('modern')}
 className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
 templateStyle === 'modern' ? 'bg-warning-700 text-neutral-50 ' : 'text-neutral-600 hover:text-neutral-900'
 }`}
 >
 Modern Tech
 </button>
 <button
 onClick={() => setTemplateStyle('executive')}
 className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
 templateStyle === 'executive' ? 'bg-neutral-900 text-neutral-50 ' : 'text-neutral-600 hover:text-neutral-900'
 }`}
 >
 Executive Serif
 </button>
 <button
 onClick={() => setTemplateStyle('minimal')}
 className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
 templateStyle === 'minimal' ? 'bg-neutral-800 text-neutral-50 ' : 'text-neutral-600 hover:text-neutral-900'
 }`}
 >
 Clean Minimalist
 </button>
 </div>
 </div>

 {/* Export Action Buttons */}
 <div className="flex items-center space-x-2">
 <button
 onClick={handleCopyText}
 className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold cursor-pointer"
 >
 {copied ? <Check className="w-3.5 h-3.5 text-success-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-600" />}
 <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
 </button>

 <button
 onClick={handlePrint}
 className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-warning-700 hover:bg-accent-800 text-neutral-50 font-semibold cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Print / Export PDF</span>
 </button>
 </div>

 </div>

 {/* MODAL MAIN CONTENT (LIVE PAPER PREVIEW) */}
 <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-200/60 flex justify-center">
 
 {isLoading ? (
 <div className="my-auto text-center space-y-3 py-16">
 <div className="w-10 h-10 border-4 border-warning-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
 <p className="text-sm font-semibold text-neutral-700 font-editorial">
 Synthesizing skill-backed resume bullets via AI...
 </p>
 </div>
 ) : (
 <div className={`w-full max-w-2xl bg-neutral-100 rounded-lg p-8 md:p-12 space-y-6 text-neutral-900 font-sans border border-neutral-300 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none ${
 templateStyle === 'executive' ? 'font-editorial' : templateStyle === 'minimal' ? 'font-sans text-xs' : 'font-sans'
 }`}>
 
 {/* RESUME HEADER */}
 <div className="border-b border-neutral-300 pb-4 space-y-1">
 <input
 type="text"
 value={candidateName}
 onChange={(e) => setCandidateName(e.target.value)}
 className="font-editorial text-3xl font-bold tracking-tight text-neutral-900 w-full bg-transparent focus:bg-neutral-50 focus:outline-hidden rounded px-1 -ml-1"
 />
 <input
 type="text"
 value={targetTitle}
 onChange={(e) => setTargetTitle(e.target.value)}
 className="text-sm font-bold text-accent-800 uppercase tracking-wider w-full bg-transparent focus:bg-neutral-50 focus:outline-hidden rounded px-1 -ml-1"
 />
 <p className="text-xs text-neutral-500 pt-0.5">
 Verified Candidate • MentorPath Learning Portfolio
 </p>
 </div>

 {/* EXECUTIVE SUMMARY */}
 <div className="space-y-1.5">
 <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
 Professional Executive Summary
 </h4>
 <p className="text-xs text-neutral-700 leading-relaxed">
 {resumeData?.summary}
 </p>
 </div>

 {/* CORE COMPETENCIES GRID */}
 <div className="space-y-2">
 <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
 Verified Technical Competencies & Topics Mastered
 </h4>

 <div className="flex flex-wrap gap-2 pt-1">
 {(resumeData?.skills || []).map((skill, idx) => (
 <span
 key={idx}
 className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-200"
 >
 <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
 <span>{skill}</span>
 </span>
 ))}
 </div>
 </div>

 {/* KEY CAPSTONE PROJECTS */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
 Key Projects & Practical Applications
 </h4>

 {(resumeData?.projects || []).map((proj, idx) => (
 <div key={idx} className="space-y-1.5">
 <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
 <span>{proj.title}</span>
 <span className="text-neutral-500 font-normal">{proj.period}</span>
 </div>
 <p className="text-xs text-neutral-700 leading-relaxed">
 {proj.description}
 </p>
 <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600">
 {(proj.highlights || []).map((h, hIdx) => (
 <li key={hIdx}>{h}</li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 {/* CERTIFICATIONS & UPSKILLING */}
 <div className="space-y-2">
 <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
 Certifications & Adaptive Learning Milestones
 </h4>

 {(resumeData?.certifications || []).map((cert, idx) => (
 <div key={idx} className="flex items-center justify-between text-xs">
 <div>
 <p className="font-bold text-neutral-900">{cert.title}</p>
 <p className="text-neutral-500">{cert.issuer}</p>
 </div>
 <span className="text-neutral-500 font-mono-code">{cert.date}</span>
 </div>
 ))}
 </div>

 </div>
 )}

 </div>

 </div>

 </div>
 );
}
