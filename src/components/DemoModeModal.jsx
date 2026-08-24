import React, { useState } from 'react';
import { 
 Play, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, X, Brain, 
 ShieldAlert, Target, GitBranch, Zap, RotateCcw, Compass, HelpCircle 
} from 'lucide-react';

export const DEMO_STEPS = [
 {
 step: 1,
 title: "Step 1: MentorPath Product Positioning",
 targetView: "dashboard",
 subtitle: "An AI that learns how YOU learn.",
 description: "MentorPath doesn't just answer questions. It continuously builds a cognitive Learning Twin to detect misconceptions, adapt difficulty, and predict retention.",
 actionLabel: "View Dashboard Overview",
 highlight: "Notice the Visual Loop: Student ➔ Learning Twin ➔ AI Analysis ➔ Adaptive Learning ➔ Career Growth"
 },
 {
 step: 2,
 title: "Step 2: AI Recommendation Center",
 targetView: "dashboard",
 subtitle: "WHAT SHOULD YOU LEARN NEXT?",
 description: "The AI Decision Center identifies Probability & Bayes Rule as the primary bottleneck restricting AI Engineer career readiness.",
 actionLabel: "Inspect Recommendation Rationale",
 highlight: "Click 'Why did AI recommend this?' to see full cognitive rationale."
 },
 {
 step: 3,
 title: "Step 3: Learning Twin Cognitive Matrix",
 targetView: "learning-twin",
 subtitle: "Live Cognitive Model Inspection",
 description: "Inspect the student's current baseline: Python 82%, Statistics 61%, ML 64%, Probability 42% (High Risk), DL 31%, GenAI 24%.",
 actionLabel: "Inspect Learning Twin",
 highlight: "Overall Mastery: 72% • Learning Speed: Fast • Retention: 68%"
 },
 {
 step: 4,
 title: "Step 4: Adaptive Quiz Engine",
 targetView: "adaptive-quiz",
 subtitle: "Start Assessment on Probability",
 description: "The student begins a Probability check: 'If event A (30%) and B (50%) occur independently, what is P(A and B)?'",
 actionLabel: "Go to Adaptive Quiz",
 highlight: "Topic: Probability & Bayes Rule • Initial Difficulty: Medium"
 },
 {
 step: 5,
 title: "Step 5: Intentionally Answer Incorrectly",
 targetView: "adaptive-quiz",
 subtitle: "Select Option A (80%) to trigger misconception analysis",
 description: "Selecting 80% simulates a common student error: adding probabilities (0.30 + 0.50) instead of multiplying independent events (0.30 * 0.50).",
 actionLabel: "Simulate Wrong Answer",
 highlight: "Triggers AI Misconception Detection Engine"
 },
 {
 step: 6,
 title: "Step 6: AI Misconception Detected",
 targetView: "adaptive-quiz",
 subtitle: "Mental Model Diagnosis",
 description: "AI identifies: 'Additive Fallacy in Independent Events' (87% confidence). Evidence: 3 recent incorrect answers, +27% response time.",
 actionLabel: "View Misconception Card",
 highlight: "Intervention: 'Review Probability Foundations.'"
 },
 {
 step: 7,
 title: "Step 7: Learning Twin Real-Time Update",
 targetView: "adaptive-quiz",
 subtitle: "Animated State Shift",
 description: "Learning Twin immediately updates: Probability Mastery shifts 42% ➔ 45%, Conceptual Confidence decreases (↓), Retention Risk increases (↑).",
 actionLabel: "Inspect State Shift",
 highlight: "Real-time feedback loop visible to the judge."
 },
 {
 step: 8,
 title: "Step 8: Adaptive Difficulty Escalation",
 targetView: "adaptive-quiz",
 subtitle: "AI DECISION: Conceptual Gap Detected",
 description: "System changes strategy to: 1. Visual Explanation ➔ 2. Easy Question ➔ 3. Medium Question ➔ 4. Mastery Check.",
 actionLabel: "View Strategy Escalation",
 highlight: "Demonstrates real-time pedagogical adaptation."
 },
 {
 step: 9,
 title: "Step 9: AI Explains Why",
 targetView: "adaptive-quiz",
 subtitle: "Transparent AI Reasoning",
 description: "Clicking 'Why did AI recommend this?' displays exact evidence: '3 of 5 questions incorrect, +27% response time, prerequisite for ML'.",
 actionLabel: "View AI Explanation",
 highlight: "Eliminates black-box perception."
 },
 {
 step: 10,
 title: "Step 10: Retention Prediction & Risk Engine",
 targetView: "smart-revision",
 subtitle: "AI-Estimated Retention Risk",
 description: "Memory decay model calculates Probability retention at 38% (HIGH RISK) and queues micro-revisions before forgetting occurs.",
 actionLabel: "View Retention Risk",
 highlight: "'Your Probability concept may benefit from revision soon.'"
 },
 {
 step: 11,
 title: "Step 11: Today's Smart Micro-Revision",
 targetView: "smart-revision",
 subtitle: "5-Minute Refresher Queue",
 description: "Provides micro-explanation, real-world example, and quick verification question to refresh memory stability.",
 actionLabel: "Launch Micro-Revision",
 highlight: "Completing revision updates frontend retention state."
 },
 {
 step: 12,
 title: "Step 12: Interactive AI Skill Graph",
 targetView: "skill-graph",
 subtitle: "Dependency & Bottleneck Matrix",
 description: "Inspect the tree matrix. Clicking Probability displays 'WHY THIS MATTERS: Probability is currently one of the biggest constraints on ML readiness.'",
 actionLabel: "Inspect Skill Graph Matrix",
 highlight: "Interactive node graph with mastery-based color coding."
 },
 {
 step: 13,
 title: "Step 13: Career Skill Gap & Roadmap",
 targetView: "career",
 subtitle: "AI Engineer Readiness (68%)",
 description: "Identifies top gaps (Generative AI, Deep Learning, SQL) and renders a personalized 7-phase learning roadmap for the student.",
 actionLabel: "View Career Roadmap",
 highlight: "Complete end-to-end 2-minute demo finished!"
 }
];

export default function DemoModeModal({ isOpen, onClose, onNavigateStep }) {
 const [stepIndex, setStepIndex] = useState(0);

 if (!isOpen) return null;

 const currentStep = DEMO_STEPS[stepIndex];

 const handleNext = () => {
 if (stepIndex < DEMO_STEPS.length - 1) {
 const nextIdx = stepIndex + 1;
 setStepIndex(nextIdx);
 onNavigateStep(DEMO_STEPS[nextIdx].targetView);
 }
 };

 const handlePrev = () => {
 if (stepIndex > 0) {
 const prevIdx = stepIndex - 1;
 setStepIndex(prevIdx);
 onNavigateStep(DEMO_STEPS[prevIdx].targetView);
 }
 };

 return (
 <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md w-auto sm:w-full animate-in slide-in-duration-300">
 <div className="bg-neutral-900 text-neutral-50 rounded-lg p-4 sm:p-5 border border-warning-500/50 space-y-4 relative overflow-hidden ">
 
 {/* Glowing top line */}
 <div className="absolute top-0 left-0 right-0 h-1 "></div>

 {/* HEADER BAR */}
 <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
 <div className="flex items-center space-x-2">
 <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse"></span>
 <span className="text-xs font-bold uppercase tracking-wider text-warning-300 font-mono">
 INTERACTIVE AI DEMO ({currentStep.step} / {DEMO_STEPS.length})
 </span>
 </div>
 <button 
 onClick={onClose}
 className="p-1 rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* STEP CONTENT */}
 <div className="space-y-2 font-sans text-xs">
 <h3 className="font-bold text-sm text-neutral-50 font-editorial">{currentStep.title}</h3>
 <p className="text-warning-300 font-semibold text-[11px]">{currentStep.subtitle}</p>
 <p className="text-neutral-300 leading-relaxed text-[11px]">{currentStep.description}</p>
 
 <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 text-[10px] text-warning-200 font-mono">
 💡 {currentStep.highlight}
 </div>
 </div>

 {/* NAVIGATION CONTROLS */}
 <div className="flex items-center justify-between pt-1">
 <button
 onClick={handlePrev}
 disabled={stepIndex === 0}
 className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold disabled:opacity-30 cursor-pointer"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Prev Step</span>
 </button>

 <span className="text-[10px] text-neutral-500 font-mono font-bold">
 Step {stepIndex + 1} of {DEMO_STEPS.length}
 </span>

 <button
 onClick={handleNext}
 disabled={stepIndex === DEMO_STEPS.length - 1}
 className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-warning-500 hover:bg-warning-600 text-neutral-950 text-xs font-bold cursor-pointer disabled:opacity-40"
 >
 <span>Next Step</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>

 </div>
 </div>
 );
}
