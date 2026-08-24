import React, { useState } from 'react';
import { 
 X, Award, ShieldCheck, Printer, Copy, Check, Sparkles, 
 CheckCircle2, Share2, Compass, Bookmark
} from 'lucide-react';

export default function CertificateModal({
 isOpen,
 onClose,
 onboardingData,
 pathData,
 completedTopicIds = []
}) {
 const [candidateName, setCandidateName] = useState('Alex Vance');
 const [copied, setCopied] = useState(false);

 const topics = pathData?.topics || [];
 const completedTopics = topics.filter(t => completedTopicIds.includes(t.id));
 const certId = `MP-CERT-2026-${(topics.length * 137 + 89412).toString()}`;
 const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

 if (!isOpen) return null;

 // Print Certificate (Uses @media print rules)
 const handlePrint = () => {
 window.print();
 };

 // Copy Verification Credentials
 const handleCopyCredentials = () => {
 const text = `🏆 MentorPath Certificate of Completion
Recipient: ${candidateName}
Goal Mastered: ${onboardingData.goal}
Verification ID: ${certId}
Topics Completed: ${completedTopics.length}/${topics.length}
Issued Date: ${issueDate}
Issued By: MentorPath AI Personalized Learning Engine`;

 navigator.clipboard.writeText(text);
 setCopied(true);
 setTimeout(() => setCopied(false), 3000);
 };

 return (
 <div className="fixed inset-0 z-50 bg-neutral-900/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
 
 <div className="bg-neutral-100 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
 
 {/* MODAL HEADER CONTROLS */}
 <div className="px-6 py-4 bg-neutral-900 text-neutral-100 flex items-center justify-between shrink-0 border-b border-neutral-800">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-lg bg-warning-500/20 text-accent-400 flex items-center justify-center border border-warning-500/40">
 <Award className="w-6 h-6 text-accent-400" />
 </div>
 <div>
 <h3 className="font-editorial text-xl font-bold tracking-tight text-neutral-50 flex items-center space-x-2">
 <span>Verified Mastery Certificate</span>
 <span className="text-[10px] bg-success-500 text-neutral-950 font-bold px-2 py-0.5 rounded-md font-sans">
 100% Completed
 </span>
 </h3>
 <p className="text-xs text-neutral-400">
 Official credential verifying completion of all roadmap learning modules.
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

 {/* TOOLBAR */}
 <div className="px-6 py-3 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
 <div className="flex items-center space-x-2">
 <span className="font-bold text-neutral-700">Recipient Name:</span>
 <input
 type="text"
 value={candidateName}
 onChange={(e) => setCandidateName(e.target.value)}
 className="bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1 font-semibold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-warning-500"
 placeholder="Enter candidate name"
 />
 </div>

 <div className="flex items-center space-x-2">
 <button
 onClick={handleCopyCredentials}
 className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold cursor-pointer"
 >
 {copied ? <Check className="w-3.5 h-3.5 text-success-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-600" />}
 <span>{copied ? 'Copied Verification!' : 'Copy Verification text'}</span>
 </button>

 <button
 onClick={handlePrint}
 className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-warning-700 hover:bg-accent-800 text-neutral-50 font-semibold cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Print / Save PDF</span>
 </button>
 </div>
 </div>

 {/* CERTIFICATE DISPLAY SHEET (PRINTABLE) */}
 <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-200/70 flex justify-center">
 
 <div className="w-full max-w-3xl from-[#FCFBF9] via-white rounded-lg p-8 md:p-12 border-8 border-warning-600/30 relative space-y-8 text-neutral-900 font-sans print:shadow-none print:border-8 print:m-0 print:w-full print:max-w-none">
 
 {/* Gold Corner Accents */}
 <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-warning-600"></div>
 <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-warning-600"></div>
 <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-warning-600"></div>
 <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-warning-600"></div>

 {/* Certificate Header Banner */}
 <div className="text-center space-y-2 border-b border-warning-200/80 pb-6">
 <div className="inline-flex items-center space-x-2 text-accent-800 uppercase text-xs font-bold tracking-widest bg-warning-100/80 px-4 py-1 rounded-full border border-warning-300">
 <Sparkles className="w-4 h-4 text-warning-700" />
 <span>MentorPath Official Credential</span>
 </div>
 <h2 className="font-editorial text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 pt-2">
 Certificate of Mastery
 </h2>
 <p className="text-xs text-neutral-500 font-sans tracking-wider uppercase">
 AI-Powered Personalized Learning & Technical Competency
 </p>
 </div>

 {/* Recipient Details */}
 <div className="text-center space-y-3 py-2">
 <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
 This is to certify that
 </p>
 <h3 className="font-editorial text-3xl md:text-4xl font-bold text-warning-900 tracking-tight underline underline-offset-8 decoration-amber-400">
 {candidateName}
 </h3>
 <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed pt-1">
 has successfully completed all adaptive learning modules, interactive active recall flashcards, and concept evaluations to achieve 100% mastery in:
 </p>
 <div className="font-editorial text-2xl font-bold text-neutral-900 bg-warning-50/80 border border-warning-200 p-4 rounded-lg max-w-xl mx-auto ">
 {onboardingData.goal}
 </div>
 </div>

 {/* Verified Competencies Grid */}
 <div className="space-y-3">
 <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
 Verified Mastered Topics ({completedTopics.length} Modules)
 </h4>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
 {topics.map((t, idx) => (
 <div 
 key={t.id}
 className="flex items-center space-x-2 bg-neutral-100/90 p-2.5 rounded-lg border border-neutral-200 shadow-2xs"
 >
 <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
 <span className="font-semibold text-neutral-800 truncate">{t.title}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Certificate Footer Seal & Signatures */}
 <div className="pt-6 border-t border-warning-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-sans">
 
 {/* Verification Metadata */}
 <div className="space-y-1 text-neutral-500 text-center sm:text-left font-mono-code text-[11px]">
 <p>Credential ID: <strong className="text-neutral-800">{certId}</strong></p>
 <p>Date Issued: <strong className="text-neutral-800">{issueDate}</strong></p>
 <p>Analogy Domain: <strong className="text-accent-800 uppercase">{onboardingData.domain}</strong></p>
 </div>

 {/* Gold Verification Seal */}
 <div className="flex flex-col items-center justify-center space-y-1">
 <div className="w-16 h-16 rounded-full text-neutral-950 flex items-center justify-center border-2 border-warning-300 ring-4 ring-warning-100">
 <ShieldCheck className="w-8 h-8 text-neutral-950" />
 </div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-warning-900">
 Verified Seal
 </span>
 </div>

 {/* Official Signature */}
 <div className="text-center sm:text-right space-y-1">
 <div className="font-editorial text-lg italic text-neutral-900 font-bold">
 MentorPath AI Architect
 </div>
 <div className="h-0.5 bg-neutral-300 w-32 ml-auto"></div>
 <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
 Personalized Learning System
 </p>
 </div>

 </div>

 </div>

 </div>

 </div>

 </div>
 );
}
