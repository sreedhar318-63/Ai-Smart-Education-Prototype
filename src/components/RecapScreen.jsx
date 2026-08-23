import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, RotateCw, CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw, Brain, BookmarkCheck, Calendar, Award } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';

export default function RecapScreen({
  onboardingData,
  todayTopics = [],
  allTopics = [],
  completedTopicIds = [],
  currentDay = 1,
  confidenceMap = {},
  onContinueToNextDay,
  onRestartSession,
  onOpenCertificate
}) {

  const [flashcards, setFlashcards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  // Covered topic names array
  const coveredTopicTitles = todayTopics.map(t => t.title);

  // Remaining topics on master roadmap
  const remainingCount = allTopics.length - completedTopicIds.length;
  const isMasteryAchieved = remainingCount <= 0 && allTopics.length > 0;

  useEffect(() => {
    let isSubscribed = true;

    async function loadFlashcards() {
      setIsLoadingFlashcards(true);
      try {
        const userPrompt = `Generate 4 high-yield flashcards for the learner who covered the following topics today: ${coveredTopicTitles.join(', ')}.
Goal: ${onboardingData.goal}.
Analogy Domain: ${onboardingData.domain}.`;

        const res = await generatePersonalizedContent({
          type: 'flashcard_generation',
          systemPrompt: 'You are an expert AI learning designer specializing in high-yield active recall flashcards.',
          userPrompt,
          context: {
            goal: onboardingData.goal,
            domain: onboardingData.domain,
            coveredTopics: coveredTopicTitles
          }
        });

        if (isSubscribed) {
          if (Array.isArray(res)) {
            setFlashcards(res);
          } else if (res?.flashcards) {
            setFlashcards(res.flashcards);
          } else {
            // Default generated flashcards
            setFlashcards([
              {
                id: '1',
                question: `What is the core principle behind ${coveredTopicTitles[0] || 'the first concept'}?`,
                answer: `It structures data flow so components remain modular and predictable without unintended side effects.`
              },
              {
                id: '2',
                question: `How does the ${onboardingData.domain} metaphor help explain system behavior?`,
                answer: `Just like ingredients in ${onboardingData.domain}, data transforms sequentially through predefined steps.`
              },
              {
                id: '3',
                question: `What confidence signal indicates a concept needs targeted resurfacing?`,
                answer: `Rating a topic 'Shaky' or 'Still lost' flags it for active recall practice before moving to advanced topics.`
              },
              {
                id: '4',
                question: `How do Explain-o-Meter level adjustments impact your mental model?`,
                answer: `Lower levels (ELI5) build intuitive metaphors, while higher levels (Expert) refine exact implementation specifications.`
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load flashcards:', err);
      } finally {
        if (isSubscribed) setIsLoadingFlashcards(false);
      }
    }

    loadFlashcards();

    return () => {
      isSubscribed = false;
    };
  }, [onboardingData.goal, onboardingData.domain]);

  const currentCard = flashcards[activeCardIndex] || flashcards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Session Recap Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold border border-emerald-500/20">
          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
          <span>Day {currentDay} Session Accomplished</span>
        </div>
        <h2 className="font-editorial text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
          Session Recap & Retention Flashcards
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          {completedTopicIds.length} of {allTopics.length} roadmap topics completed. Test your active recall below and proceed to your next day's task!
        </p>
      </div>

      {/* SECTION 1: FLIPPABLE FLASHCARDS (3D FLIP EFFECT) */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="flex items-center space-x-2 text-amber-900 font-editorial text-xl font-bold">
            <Brain className="w-5 h-5 text-amber-700" />
            <h3>Interactive Active Recall Flashcards</h3>
          </div>
          {flashcards.length > 0 && (
            <span className="text-xs font-bold font-mono-code text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              Card {activeCardIndex + 1} of {flashcards.length}
            </span>
          )}
        </div>

        {isLoadingFlashcards ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-stone-500">Generating flashcards via AI...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 3D Flip Card Container */}
            <div className="perspective-1000 w-full max-w-xl mx-auto h-64 sm:h-72">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer rounded-3xl transition-transform shadow-lg ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE (Question) */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-stone-900 text-stone-100 rounded-3xl p-8 flex flex-col justify-between border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-amber-400 uppercase tracking-wider font-semibold font-mono-code">
                    <span>Question • Tap to reveal answer</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                  <p className="font-editorial text-xl sm:text-2xl font-medium leading-snug text-center px-2">
                    "{currentCard?.question}"
                  </p>
                  <div className="text-center text-[11px] text-stone-400 font-sans">
                    💡 Concept focus: {coveredTopicTitles[activeCardIndex % coveredTopicTitles.length] || onboardingData.goal}
                  </div>
                </div>

                {/* BACK FACE (Answer) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-amber-50 text-stone-900 rounded-3xl p-8 flex flex-col justify-between border-2 border-amber-300">
                  <div className="flex items-center justify-between text-xs text-amber-900 uppercase tracking-wider font-bold font-mono-code">
                    <span>Answer & Core Concept</span>
                    <RotateCw className="w-4 h-4 text-amber-700" />
                  </div>
                  <p className="font-sans text-base leading-relaxed text-stone-800 px-2 font-medium">
                    {currentCard?.answer}
                  </p>
                  <div className="text-center text-[11px] text-amber-800 font-semibold font-sans">
                    🍳 Tied to {onboardingData.domain} domain metaphor
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between max-w-xl mx-auto pt-2">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Previous Card
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-xs text-amber-800 hover:text-amber-950 font-bold underline underline-offset-4 cursor-pointer"
              >
                {isFlipped ? 'Show Question' : 'Flip to Answer'}
              </button>

              <button
                onClick={handleNextCard}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Next Card →
              </button>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: IN-MEMORY CONFIDENCE MAP */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              Session Topic Confidence Map
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Color-coded status from your self-ratings today.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-semibold">
            <span className="flex items-center text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span> Got it</span>
            <span className="flex items-center text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> Shaky</span>
            <span className="flex items-center text-rose-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1"></span> Still lost</span>
          </div>
        </div>

        {/* Confidence List Grid */}
        <div className="grid grid-cols-1 gap-3">
          {todayTopics.map((topic) => {
            const conf = confidenceMap[topic.id] || { rating: 'Got it', levelUsed: 'ELI10', finalStyleStopped: 'Analogy' };
            const rating = conf.rating;

            return (
              <div
                key={topic.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  rating === 'Got it' 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : rating === 'Shaky' 
                      ? 'bg-amber-50/70 border-amber-200' 
                      : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-stone-900 text-sm font-sans">
                      {topic.title}
                    </h4>
                    {rating !== 'Got it' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                        Targeted AI Resurfacing Next Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">
                    {topic.description}
                  </p>
                  <div className="text-[11px] text-stone-500 font-mono-code pt-0.5">
                    Level: {conf.levelUsed} • Style Stopped: {conf.finalStyleStopped}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    rating === 'Got it' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : rating === 'Shaky' 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {rating === 'Got it' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {rating === 'Shaky' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {rating === 'Still lost' && <XCircle className="w-4 h-4 text-rose-600" />}
                    <span>{rating}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 3: ROADMAP PROGRESSION ACTION BUTTONS */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onRestartSession}
            className="text-xs text-stone-500 hover:text-stone-900 font-medium underline underline-offset-4 cursor-pointer"
          >
            Start Fresh / Change Onboarding Goal
          </button>

          {!isMasteryAchieved ? (
            <button
              onClick={onContinueToNextDay}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Proceed to Day {currentDay + 1} Session ({remainingCount} topics left)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenCertificate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Award className="w-5 h-5 text-amber-200" />
              <span>🎓 Claim Official Mastery Certificate</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
