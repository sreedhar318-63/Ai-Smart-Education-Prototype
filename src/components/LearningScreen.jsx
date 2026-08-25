import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, XCircle, Sliders, ChefHat, ArrowRight, RefreshCcw, BookOpen, Quote, ShieldAlert, Cpu, ArrowLeft, Lightbulb, Zap, Layers } from 'lucide-react';
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

function TopicVisualDiagram({ topicTitle, domain }) {
  return (
    <div className="bg-[#ADD8E6] border border-[#91c4d5] p-5 rounded-2xl space-y-4 shadow-sm text-[#161512] animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[#8A2BE2] font-bold text-xs uppercase">
          <Zap className="w-4 h-4" />
          <span>Visual Architecture Diagram: {topicTitle}</span>
        </div>
        <span className="bg-[#8A2BE2] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
          Interactive Conceptual Graph
        </span>
      </div>

      <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[#96cbe0] flex items-center justify-center">
        <svg viewBox="0 0 600 180" className="w-full max-h-48">
          {/* Node 1: Input / Context */}
          <rect x="20" y="55" width="140" height="70" rx="12" fill="#FFE4C4" stroke="#C59B67" strokeWidth="2" />
          <text x="90" y="88" textAnchor="middle" fill="#1A0F05" fontSize="12" fontWeight="bold">Input Data / Concept</text>
          <text x="90" y="105" textAnchor="middle" fill="#5C4228" fontSize="10">({domain || 'Domain'} Metaphor)</text>

          {/* Arrow 1 */}
          <path d="M 160 90 L 220 90" stroke="#8A2BE2" strokeWidth="3" />
          <polygon points="220,90 210,84 210,96" fill="#8A2BE2" />

          {/* Node 2: Core Processing / Mechanism */}
          <rect x="225" y="45" width="160" height="90" rx="14" fill="#8A2BE2" stroke="#6b1cb9" strokeWidth="2" />
          <text x="305" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">{topicTitle.split(' ')[0] || 'Core Mechanics'}</text>
          <text x="305" y="100" textAnchor="middle" fill="#FFE4C4" fontSize="10">Logic & Execution</text>

          {/* Arrow 2 */}
          <path d="M 385 90 L 445 90" stroke="#8A2BE2" strokeWidth="3" />
          <polygon points="445,90 435,84 435,96" fill="#8A2BE2" />

          {/* Node 3: Result / Output */}
          <rect x="450" y="55" width="130" height="70" rx="12" fill="#DEB887" stroke="#C59B67" strokeWidth="2" />
          <text x="515" y="88" textAnchor="middle" fill="#1A0F05" fontSize="12" fontWeight="bold">Mastered Result</text>
          <text x="515" y="105" textAnchor="middle" fill="#5A2A00" fontSize="10">Verified Target</text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-[#334155]">
        <div className="p-2 bg-[#FFE4C4] rounded-lg border border-[#E3C6A2] text-[#1A0F05]">
          1. Concept Input
        </div>
        <div className="p-2 bg-[#8A2BE2] text-white rounded-lg">
          2. Algorithmic Transformation
        </div>
        <div className="p-2 bg-[#DEB887] text-[#1A0F05] rounded-lg">
          3. Verified Solution
        </div>
      </div>
    </div>
  );
}

export default function LearningScreen({
  currentTopic,
  topicIndex,
  totalTodayTopics,
  currentDay = 1,
  onboardingData,
  persona,
  learnerModel,
  onGotIt,
  onSaveTopicConfidence,
  onFinishSession,
  onGoBack
}) {
  const [explainLevelIndex, setExplainLevelIndex] = useState(1); // Default ELI10
  const [styleIndex, setStyleIndex] = useState(0); // Default Analogy
  const [explanationData, setExplanationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confusedCycleCount, setConfusedCycleCount] = useState(0);

  // Remediation states
  const [remediationType, setRemediationType] = useState(null); // 'shaky' | 'still_lost' | null
  const [shakyData, setShakyData] = useState(null);
  const [stillLostData, setStillLostData] = useState(null);
  const [isGeneratingRemediation, setIsGeneratingRemediation] = useState(false);

  // Active Toast/Notice Banner state
  const [activeToast, setActiveToast] = useState(null);

  const currentLevel = EXPLAIN_LEVELS[explainLevelIndex];
  const currentStyle = CONFUSION_STYLES[styleIndex];

  // Active persona object
  const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  // Fetch initial topic explanation
  useEffect(() => {
    let isSubscribed = true;

    async function loadExplanation() {
      setIsLoading(true);
      setRemediationType(null);
      setShakyData(null);
      setStillLostData(null);

      try {
        const systemPrompt = activePersonaObj.systemPrompt;
        const userPrompt = `Explain the concept "${currentTopic.title}" for a learner whose overall goal is "${onboardingData?.goal || 'AI Engineering'}".
Required Complexity Level: ${currentLevel.id} (${currentLevel.desc}).
Required Style Approach: ${currentStyle.id}.
Analogy Domain to integrate: "${onboardingData?.domain || 'cooking'}".
Topic Description: ${currentTopic.description}.`;

        const res = await generatePersonalizedContent({
          type: 'topic_explanation',
          systemPrompt,
          userPrompt,
          learnerModel,
          context: {
            topicName: currentTopic.title,
            goal: onboardingData?.goal,
            domain: onboardingData?.domain,
            persona: persona,
            level: currentLevel.id,
            style: currentStyle.id
          }
        });

        if (isSubscribed) {
          if (typeof res === 'object') {
            setExplanationData(res);
          } else {
            setExplanationData({
              headline: `Explanation of ${currentTopic.title}`,
              body: res,
              keyTakeaway: `Key Takeaway: Master ${currentTopic.title} to progress in ${onboardingData?.goal || 'AI Engineering'}.`
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
  }, [currentTopic.id, explainLevelIndex, styleIndex, persona, onboardingData?.domain]);

  // BUTTON 1 — "Got it" (Advances to next topic)
  const handleGotItClick = () => {
    onGotIt(currentTopic.id, {
      rating: 'Got it',
      levelUsed: currentLevel.id,
      finalStyleStopped: currentStyle.id,
      confusedCycles: confusedCycleCount
    });
  };

  // BUTTON 2 — "Shaky" (Re-explain with Analogy Engine + Example, stays on topic)
  const handleShakyClick = async () => {
    if (isGeneratingRemediation) return;
    setIsGeneratingRemediation(true);
    setRemediationType('shaky');

    // Save shaky status to state
    onSaveTopicConfidence(currentTopic.id, { rating: 'Shaky' });

    setActiveToast({
      message: `🔄 Generating real-world ${onboardingData?.domain || 'cooking'} analogy & concrete example...`,
      type: 'info'
    });

    try {
      const res = await generatePersonalizedContent({
        type: 'shaky_analogy_reexplanation',
        systemPrompt: `You are an expert AI Tutor. Re-explain "${currentTopic.title}" using a fresh real-world analogy from the domain "${onboardingData?.domain || 'cooking'}" AND a concrete step-by-step example.`,
        userPrompt: `Give me a clear analogy and worked example for ${currentTopic.title}.`,
        learnerModel,
        context: { topicName: currentTopic.title, domain: onboardingData?.domain || 'cooking' }
      });

      if (typeof res === 'object') {
        setShakyData(res);
      } else {
        setShakyData({
          analogy: `Think of ${currentTopic.title} like preparing a recipe in ${onboardingData?.domain || 'cooking'}: each step builds upon the previous ingredient to ensure perfect execution.`,
          example: `Concrete Example:\n1. Input: [x = 5]\n2. Transformation: Apply ${currentTopic.title} rule.\n3. Output: Result [y = 25] verified.`,
          takeaway: `Key Insight: ${currentTopic.title} breaks complex workflows into repeatable steps.`
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRemediation(false);
      setTimeout(() => setActiveToast(null), 4000);
    }
  };

  // BUTTON 3 — "Still Lost" (Multi-level explanation + Visual Diagram, stays on topic)
  const handleStillLostClick = async () => {
    if (isGeneratingRemediation) return;
    setIsGeneratingRemediation(true);
    setRemediationType('still_lost');

    // Save still lost status to state
    onSaveTopicConfidence(currentTopic.id, { rating: 'Still lost' });

    setActiveToast({
      message: `💡 Escalating to Multi-Level Explanation & Visual Concept Diagram...`,
      type: 'info'
    });

    try {
      const res = await generatePersonalizedContent({
        type: 'still_lost_multilevel',
        systemPrompt: `You are a master teacher. Provide a multi-level breakdown for "${currentTopic.title}": 1. ELI5 Simplest Metaphor, 2. Step-by-Step Logic.`,
        userPrompt: `Break down ${currentTopic.title} at multiple depth levels.`,
        learnerModel,
        context: { topicName: currentTopic.title, domain: onboardingData?.domain || 'cooking' }
      });

      if (typeof res === 'object') {
        setStillLostData(res);
      } else {
        setStillLostData({
          eli5: `Zero-Jargon Metaphor: Imagine ${currentTopic.title} is like a map guide pointing you to the exact item you need without searching every room.`,
          stepByStep: `Step-by-Step Breakdown:\n1. Start with raw input.\n2. Pass through processing boundary.\n3. Evaluate condition & emit final result.`,
          takeaway: `Core Takeaway: Master the input-output boundary to understand ${currentTopic.title}.`
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRemediation(false);
      setTimeout(() => setActiveToast(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-duration-300 font-sans">
      
      {/* TOAST NOTIFICATION BANNER */}
      {activeToast && (
        <div className="p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all bg-[#8A2BE2] border-[#6b1cb9] text-white shadow-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
            <span>{activeToast.message}</span>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-white/80 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* SESSION PROGRESS HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#DEB887] px-6 py-4 rounded-2xl border border-[#C59B67] shadow-md text-[#1A0F05]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoBack}
            className="p-2 rounded-xl bg-[#FFE4C4] hover:bg-[#8A2BE2] hover:text-white text-[#1A0F05] transition-colors cursor-pointer border border-[#C59B67]"
            title="Back to Roadmap"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="text-xs font-bold text-[#5A2A00] uppercase tracking-wider">
              Day {currentDay} Session • Topic {topicIndex + 1} of {totalTodayTopics}
            </span>
            <h2 className="text-2xl font-bold text-[#1A0F05] leading-tight">
              {currentTopic.title}
            </h2>
          </div>
        </div>

        {/* PERSONA ACTIVE INDICATOR */}
        <div className="flex items-center space-x-2 bg-[#FFE4C4] px-3.5 py-2 rounded-xl border border-[#C59B67] shrink-0 text-xs shadow-2xs">
          <span className="text-base">{activePersonaObj.icon}</span>
          <div>
            <span className="font-bold text-[#1A0F05] block">{activePersonaObj.name}</span>
            <span className="text-[10px] text-[#5C4228] font-semibold block">System Prompt Tone Active</span>
          </div>
        </div>
      </div>

      {/* MAIN STUDY CARD */}
      <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-10 border border-[#E3C6A2] space-y-8 shadow-lg">
        
        {/* EXPLAIN-O-METER SLIDER */}
        <div className="bg-[#ADD8E6] border border-[#91c4d5] rounded-xl p-5 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#8A2BE2]" />
              <label className="text-xs font-bold text-[#161512] uppercase tracking-wider">
                Explain-o-Meter (Complexity Slider)
              </label>
            </div>
            <span className="text-xs font-bold text-white bg-[#8A2BE2] px-3 py-1 rounded-full shadow-2xs">
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
            className="w-full accent-[#8A2BE2] cursor-pointer"
          />

          <div className="grid grid-cols-4 text-center text-[11px] font-bold text-[#334155] gap-1">
            <span className={explainLevelIndex === 0 ? 'text-[#8A2BE2] font-black underline' : ''}>ELI5</span>
            <span className={explainLevelIndex === 1 ? 'text-[#8A2BE2] font-black underline' : ''}>ELI10</span>
            <span className={explainLevelIndex === 2 ? 'text-[#8A2BE2] font-black underline' : ''}>ELI20 (Peer)</span>
            <span className={explainLevelIndex === 3 ? 'text-[#8A2BE2] font-black underline' : ''}>Expert</span>
          </div>

          <p className="text-xs text-[#0f172a] font-medium italic text-center pt-1">
            {currentLevel.desc}
          </p>
        </div>

        {/* ANALOGY ENGINE & CONFUSION STYLES HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E3C6A2]">
          <div className="flex items-center space-x-2 text-[#1A0F05] bg-[#DEB887] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C59B67]">
            <ChefHat className="w-4 h-4 text-[#5A2A00]" />
            <span>Analogy Engine Domain: <strong className="uppercase text-[#5A2A00]">{onboardingData?.domain || 'cooking'}</strong></span>
          </div>
        </div>

        {/* EXPLANATION CONTENT AREA */}
        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-[#5C4228] font-semibold">
              Generating {currentLevel.id} explanation tailored to {onboardingData?.domain || 'cooking'}...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Persona Callout Quote */}
            <div className="bg-[#ADD8E6] border-l-4 border-[#8A2BE2] p-4 rounded-r-2xl space-y-1 border border-[#91c4d5]">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8A2BE2] uppercase">
                <Quote className="w-3.5 h-3.5" />
                <span>{persona} Tone Perspective</span>
              </div>
              <p className="text-xs text-[#161512] font-semibold italic">
                "{explanationData?.headline || currentTopic.title}"
              </p>
            </div>

            {/* Main Explanation Body */}
            <div className="prose max-w-none text-[#161512] font-medium leading-relaxed text-sm space-y-4 whitespace-pre-line">
              {explanationData?.body}
            </div>

            {/* Key Takeaway Box */}
            {explanationData?.keyTakeaway && (
              <div className="bg-[#8A2BE2] text-white p-4.5 rounded-xl text-xs font-mono font-bold leading-relaxed border border-[#6b1cb9] shadow-md">
                {explanationData.keyTakeaway}
              </div>
            )}

            {/* DYNAMIC REMEDIATION SECTION 1 — SHAKY RE-EXPLANATION */}
            {remediationType === 'shaky' && (
              <div className="bg-[#DEB887] border border-[#C59B67] p-6 rounded-2xl space-y-4 text-[#1A0F05] animate-in fade-in slide-in-duration-300 shadow-md">
                <div className="flex items-center space-x-2 text-[#5A2A00] font-bold text-xs uppercase">
                  <ChefHat className="w-4 h-4 text-[#5A2A00]" />
                  <span>Analogy Engine Refresher ({onboardingData?.domain || 'cooking'} Domain)</span>
                </div>

                {isGeneratingRemediation ? (
                  <div className="flex items-center space-x-3 py-4 text-xs font-bold text-[#5C4228]">
                    <div className="w-5 h-5 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating custom {onboardingData?.domain || 'cooking'} analogy & worked example...</span>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[#C59B67] space-y-2">
                      <p className="font-bold text-[#8A2BE2] text-sm">🍳 Real-World Domain Analogy</p>
                      <p className="text-[#1A0F05] font-medium leading-relaxed">{shakyData?.analogy || shakyData?.body}</p>
                    </div>

                    <div className="bg-[#ADD8E6] p-4 rounded-xl border border-[#91c4d5] space-y-2">
                      <p className="font-bold text-[#161512] text-sm">🛠 Step-by-Step Worked Example</p>
                      <p className="text-[#0f172a] font-medium whitespace-pre-line leading-relaxed">{shakyData?.example || shakyData?.keyTakeaway}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DYNAMIC REMEDIATION SECTION 2 — STILL LOST MULTI-LEVEL + VISUAL DIAGRAM */}
            {remediationType === 'still_lost' && (
              <div className="space-y-6 animate-in fade-in slide-in-duration-300">
                
                {/* Multi-Level Breakdown Box */}
                <div className="bg-[#DEB887] border border-[#C59B67] p-6 rounded-2xl space-y-4 text-[#1A0F05] shadow-md">
                  <div className="flex items-center space-x-2 text-[#8A2BE2] font-bold text-xs uppercase">
                    <Layers className="w-4 h-4 text-[#8A2BE2]" />
                    <span>Multi-Level Concept Escalation & Simplification</span>
                  </div>

                  {isGeneratingRemediation ? (
                    <div className="flex items-center space-x-3 py-4 text-xs font-bold text-[#5C4228]">
                      <div className="w-5 h-5 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin"></div>
                      <span>Synthesizing multi-level explanation & visual diagram...</span>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs">
                      <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[#C59B67] space-y-1.5">
                        <span className="bg-[#8A2BE2] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Level 1 — ELI5 Simplest Metaphor</span>
                        <p className="text-[#1A0F05] font-medium leading-relaxed pt-1">{stillLostData?.eli5 || stillLostData?.body}</p>
                      </div>

                      <div className="bg-[#ADD8E6] p-4 rounded-xl border border-[#91c4d5] space-y-1.5">
                        <span className="bg-[#161512] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Level 2 — Step-by-Step Mechanism</span>
                        <p className="text-[#0f172a] font-medium whitespace-pre-line leading-relaxed pt-1">{stillLostData?.stepByStep || stillLostData?.keyTakeaway}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rendered SVG Visual Concept Diagram Component */}
                <TopicVisualDiagram topicTitle={currentTopic.title} domain={onboardingData?.domain} />

              </div>
            )}

          </div>
        )}

        {/* SELF-RATING CONFIDENCE SECTION */}
        <div className="pt-6 border-t border-[#E3C6A2] space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-[#1A0F05]">
              How well did you understand this concept?
            </h3>
            <p className="text-xs text-[#5C4228] font-semibold">
              Clicking "Got it" advances to the next topic. "Shaky" and "Still Lost" stay on this topic and trigger AI re-explanations.
            </p>
          </div>

          {/* RATING BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* BUTTON 1 — Got It */}
            <button
              onClick={handleGotItClick}
              disabled={isGeneratingRemediation}
              className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-[#8A2BE2] hover:bg-[#7823c6] text-white border border-[#6b1cb9] font-bold text-sm transition-all cursor-pointer group shadow-md disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>Got it! (Next Topic)</span>
            </button>

            {/* BUTTON 2 — Shaky */}
            <button
              onClick={handleShakyClick}
              disabled={isGeneratingRemediation}
              className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-[#DEB887] hover:bg-[#cda06d] text-[#1A0F05] border border-[#C59B67] font-bold text-sm transition-all cursor-pointer group shadow-md disabled:opacity-50"
            >
              <AlertTriangle className="w-5 h-5 text-[#5A2A00] group-hover:scale-110 transition-transform" />
              <span>Shaky (Analogy + Example)</span>
            </button>

            {/* BUTTON 3 — Still Lost (Lightblue with Blueviolet Accent Outline) */}
            <button
              onClick={handleStillLostClick}
              disabled={isGeneratingRemediation}
              className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-[#ADD8E6] hover:bg-[#96cbe0] text-[#161512] border-2 border-[#8A2BE2] font-bold text-sm transition-all cursor-pointer group shadow-md disabled:opacity-50"
            >
              <XCircle className="w-5 h-5 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
              <span>Still lost (Visual + Multi-level)</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
