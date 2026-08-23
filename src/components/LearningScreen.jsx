import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, XCircle, Sliders, ChefHat, ArrowRight, RefreshCcw, BookOpen, Quote, ShieldAlert, Cpu, ArrowLeft, Lightbulb, Zap } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';
import { PERSONAS } from './Navbar';

const EXPLAIN_LEVELS = [
  { id: 'ELI5', label: 'ELI5 (5 Year Old)', desc: 'Zero jargon, pure simple metaphors' },
  { id: 'ELI10', label: 'ELI10 (School)', desc: 'Plain language, practical intuition' },
  { id: 'ELI20', label: 'ELI20 (Peer)', desc: 'Professional engineer-to-peer discussion' },
  { id: 'Expert', label: 'Expert', desc: 'Internal mechanics & memory trade-offs' }
];

const CONFUSION_STYLES = [
  { id: 'Analogy', label: '1. Domain Analogy', icon: '🍳' },
  { id: 'Story', label: '2. Scenario Story', icon: '📖' },
  { id: 'Visual', label: '3. Visual / Diagram', icon: '📐' },
  { id: 'Worked Example', label: '4. Worked Step Example', icon: '🛠' },
  { id: 'Expert', label: '5. Expert Mode', icon: '🔬' }
];

export default function LearningScreen({
  currentTopic,
  topicIndex,
  totalTodayTopics,
  currentDay = 1,
  onboardingData,
  persona,
  learnerModel,
  onSaveTopicConfidence,
  onFinishSession,
  onGoBack
}) {
  const [explainLevelIndex, setExplainLevelIndex] = useState(1); // Default ELI10
  const [styleIndex, setStyleIndex] = useState(0); // Default Analogy
  const [explanationData, setExplanationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confusedCycleCount, setConfusedCycleCount] = useState(0);

  // Active Toast/Notice Banner state when switching styles or clicking ratings
  const [activeToast, setActiveToast] = useState(null);

  // Remediation Modal State when user clicks "Still lost"
  const [showRemediationModal, setShowRemediationModal] = useState(false);

  const currentLevel = EXPLAIN_LEVELS[explainLevelIndex];
  const currentStyle = CONFUSION_STYLES[styleIndex];

  // Active persona object
  const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  // Fetch or re-generate explanation whenever topic, level, style, or persona changes
  useEffect(() => {
    let isSubscribed = true;

    async function loadExplanation() {
      setIsLoading(true);
      try {
        const systemPrompt = activePersonaObj.systemPrompt;
        const userPrompt = `Explain the concept "${currentTopic.title}" for a learner whose overall goal is "${onboardingData.goal}".
Required Complexity Level: ${currentLevel.id} (${currentLevel.desc}).
Required Style Approach: ${currentStyle.id}.
Analogy Domain to integrate: "${onboardingData.domain}".
Topic Description: ${currentTopic.description}.`;

        const res = await generatePersonalizedContent({
          type: 'topic_explanation',
          systemPrompt,
          userPrompt,
          learnerModel,
          context: {
            topicName: currentTopic.title,
            goal: onboardingData.goal,
            domain: onboardingData.domain,
            persona: persona,
            level: currentLevel.id,
            style: currentStyle.id,
            learnerModel
          }
        });

        if (isSubscribed) {
          if (typeof res === 'object') {
            setExplanationData(res);
          } else {
            setExplanationData({
              headline: `Explanation of ${currentTopic.title}`,
              body: res,
              keyTakeaway: `Key Takeaway: Master ${currentTopic.title} to progress in ${onboardingData.goal}.`
            });
          }
        }
      } catch (err) {
        console.error('Failed to load explanation:', err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    }

    loadExplanation();

    return () => {
      isSubscribed = false;
    };
  }, [currentTopic.id, explainLevelIndex, styleIndex, persona, onboardingData.domain]);

  // Handle "I'm still confused" button click
  const handleStillConfused = () => {
    const nextStyleIndex = (styleIndex + 1) % CONFUSION_STYLES.length;
    const nextStyleObj = CONFUSION_STYLES[nextStyleIndex];
    setStyleIndex(nextStyleIndex);
    setConfusedCycleCount(prev => prev + 1);

    setActiveToast({
      message: `Switched explanation style to ${nextStyleObj.icon} ${nextStyleObj.label}`,
      type: 'info'
    });

    setTimeout(() => setActiveToast(null), 4000);
  };

  // Handle self-rating click
  const handleRatingSelect = (rating) => {
    if (rating === 'Still lost') {
      // Open remediation modal instead of abruptly skipping!
      setShowRemediationModal(true);
    } else {
      onSaveTopicConfidence(currentTopic.id, {
        rating, // 'Got it' | 'Shaky'
        levelUsed: currentLevel.id,
        finalStyleStopped: currentStyle.id,
        confusedCycles: confusedCycleCount
      });
    }
  };

  // Confirm proceeding with 'Still lost' rating after viewing remediation modal
  const handleConfirmStillLostProceed = () => {
    setShowRemediationModal(false);
    onSaveTopicConfidence(currentTopic.id, {
      rating: 'Still lost',
      levelUsed: currentLevel.id,
      finalStyleStopped: currentStyle.id,
      confusedCycles: confusedCycleCount
    });
  };

  // Apply instant ELI5 simplification retry inside remediation modal
  const handleApplyELI5Remediation = () => {
    setShowRemediationModal(false);
    setExplainLevelIndex(0); // Switch to ELI5
    setStyleIndex(0); // Switch to Analogy Engine
    setActiveToast({
      message: `💡 Switched to ELI5 Simple Metaphor Mode for ${currentTopic.title}`,
      type: 'remediation'
    });
    setTimeout(() => setActiveToast(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-2 ${
          activeToast.type === 'remediation' 
            ? 'bg-amber-100 border-amber-300 text-amber-950' 
            : 'bg-stone-900 border-stone-800 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{activeToast.message}</span>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-stone-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Session Progress Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoBack}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Back to Roadmap"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Day {currentDay} Session • Topic {topicIndex + 1} of {totalTodayTopics}
            </span>
            <h2 className="font-editorial text-2xl font-bold text-stone-900 leading-tight">
              {currentTopic.title}
            </h2>
          </div>
        </div>

        {/* Persona Active Indicator */}
        <div className="flex items-center space-x-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0 text-xs">
          <span>{activePersonaObj.icon}</span>
          <div>
            <span className="font-semibold text-stone-900">{activePersonaObj.name}</span>
            <span className="text-[10px] text-stone-500 block">System Prompt Tone Active</span>
          </div>
        </div>
      </div>

      {/* Main Study Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-xl space-y-8">
        
        {/* EXPLAIN-O-METER SLIDER */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Explain-o-Meter (Complexity Slider)
              </label>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-3 py-1 rounded-full">
              {currentLevel.label}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={explainLevelIndex}
            onChange={(e) => setExplainLevelIndex(Number(e.target.value))}
            className="w-full accent-amber-700 cursor-pointer"
          />

          <div className="grid grid-cols-4 text-center text-[11px] font-medium text-stone-500 gap-1">
            <span className={explainLevelIndex === 0 ? 'text-amber-900 font-bold' : ''}>ELI5</span>
            <span className={explainLevelIndex === 1 ? 'text-amber-900 font-bold' : ''}>ELI10</span>
            <span className={explainLevelIndex === 2 ? 'text-amber-900 font-bold' : ''}>ELI20 (Peer)</span>
            <span className={explainLevelIndex === 3 ? 'text-amber-900 font-bold' : ''}>Expert</span>
          </div>

          <p className="text-xs text-stone-500 italic text-center pt-1">
            {currentLevel.desc}
          </p>
        </div>

        {/* ANALOGY ENGINE & CONFUSION STYLES HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-100">
          <div className="flex items-center space-x-2 text-amber-900 bg-amber-100/60 px-3 py-1 rounded-full text-xs font-semibold">
            <ChefHat className="w-4 h-4 text-amber-700" />
            <span>Analogy Engine Domain: <strong className="uppercase">{onboardingData.domain}</strong></span>
          </div>

          {/* I'm Still Confused Button */}
          <button
            onClick={handleStillConfused}
            className="flex items-center space-x-2 bg-stone-900 hover:bg-amber-700 text-stone-100 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Cycles through Analogy -> Story -> Visual -> Worked Example -> Expert"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>I'm still confused ({currentStyle.label})</span>
          </button>
        </div>

        {/* EXPLANATION CONTENT AREA */}
        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-stone-600 font-editorial font-medium">
              Generating {currentLevel.id} explanation ({currentStyle.label}) tailored to {onboardingData.domain}...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Persona Callout Quote */}
            <div className="bg-amber-50/50 border-l-4 border-amber-600 p-4 rounded-r-2xl space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase">
                <Quote className="w-3.5 h-3.5" />
                <span>{persona} Tone Perspective</span>
              </div>
              <p className="text-xs text-stone-700 italic font-editorial">
                "{explanationData?.headline || currentTopic.title}"
              </p>
            </div>

            {/* Explanation Body */}
            <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed font-sans text-sm space-y-4 whitespace-pre-line">
              {explanationData?.body}
            </div>

            {/* Key Takeaway Box */}
            {explanationData?.keyTakeaway && (
              <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl text-xs font-mono-code leading-relaxed border border-stone-800">
                {explanationData.keyTakeaway}
              </div>
            )}

          </div>
        )}

        {/* SELF-RATING CONFIDENCE SECTION */}
        <div className="pt-6 border-t border-stone-200 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-editorial text-xl font-bold text-stone-900">
              How well did you understand this concept?
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Your self-rating updates your in-memory confidence map for this session.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Got It */}
            <button
              onClick={() => handleRatingSelect('Got it')}
              className="flex items-center justify-center space-x-2 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-sm transition-all shadow-xs cursor-pointer group"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Got it!</span>
            </button>

            {/* Shaky */}
            <button
              onClick={() => handleRatingSelect('Shaky')}
              className="flex items-center justify-center space-x-2 p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-sm transition-all shadow-xs cursor-pointer group"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Shaky</span>
            </button>

            {/* Still Lost */}
            <button
              onClick={() => handleRatingSelect('Still lost')}
              className="flex items-center justify-center space-x-2 p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 font-semibold text-sm transition-all shadow-xs cursor-pointer group"
            >
              <XCircle className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>Still lost</span>
            </button>

          </div>
        </div>

      </div>

      {/* REMEDIATION MODAL WHEN "STILL LOST" IS CLICKED */}
      {showRemediationModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center space-x-3 text-rose-600 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  Concept Remediation Needed
                </h3>
                <p className="text-xs text-stone-500">
                  Topic: <strong className="text-stone-800">{currentTopic.title}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed font-sans">
              <p className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-950 font-medium">
                We've flagged <strong>"{currentTopic.title}"</strong> as <strong>"Still lost"</strong> in your in-memory Learner Model. Don't worry—learning complex concepts takes iteration!
              </p>
              <p>
                What would you like to do before moving forward?
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              
              {/* Option 1: Simplify to ELI5 & Retry */}
              <button
                onClick={handleApplyELI5Remediation}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-semibold text-xs transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-sm">Simplify to ELI5 Mode & Retry</p>
                    <p className="text-[11px] text-amber-800 font-normal">Re-explains using zero-jargon everyday metaphors right now</p>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              </button>

              {/* Option 2: Save for Recap & Proceed */}
              <button
                onClick={handleConfirmStillLostProceed}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-stone-500 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-sm">Save Rating & Proceed</p>
                    <p className="text-[11px] text-stone-500 font-normal">Saves rating for active recall flashcards & recap review</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 shrink-0" />
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
