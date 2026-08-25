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

  // End-of-deck & difficulty escalation state
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [flashcardLevel, setFlashcardLevel] = useState(() => {
    try {
      const saved = localStorage.getItem('mentorpath_flashcard_level');
      if (saved) return parseInt(saved, 10) || 1;
    } catch (e) {}
    return 1;
  });

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
        const userPrompt = `Generate 4 Level ${flashcardLevel} high-yield flashcards for the learner who covered the following topics today: ${coveredTopicTitles.join(', ')}.
Goal: ${onboardingData?.goal || 'AI Engineering'}.
Analogy Domain: ${onboardingData?.domain || 'cooking'}.`;

        const res = await generatePersonalizedContent({
          type: 'flashcard_generation',
          systemPrompt: `You are an expert AI learning designer specializing in Level ${flashcardLevel} active recall flashcards.`,
          userPrompt,
          context: {
            goal: onboardingData?.goal,
            domain: onboardingData?.domain,
            coveredTopics: coveredTopicTitles,
            level: flashcardLevel
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
                question: `How does the ${onboardingData?.domain || 'cooking'} metaphor help explain system behavior?`,
                answer: `Just like ingredients in ${onboardingData?.domain || 'cooking'}, data transforms sequentially through predefined steps.`
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
  }, [onboardingData?.goal, onboardingData?.domain]);

  const currentCard = flashcards[activeCardIndex] || flashcards[0];

  // Navigation Logic (Prev / Next with deck boundary handling)
  const handleNextCard = () => {
    if (activeCardIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setActiveCardIndex(prev => prev + 1);
    } else {
      // Reached card 4 of 4: Trigger completion state
      setIsDeckCompleted(true);
    }
  };

  const handlePrevCard = () => {
    if (activeCardIndex > 0) {
      setIsFlipped(false);
      setActiveCardIndex(prev => prev - 1);
    }
  };

  // Escalate difficulty to Level 2 or 3
  const handleIncreaseDifficulty = async () => {
    const nextLevel = Math.min(flashcardLevel + 1, 3);
    setFlashcardLevel(nextLevel);
    try {
      localStorage.setItem('mentorpath_flashcard_level', nextLevel.toString());
    } catch (e) {}

    setIsDeckCompleted(false);
    setActiveCardIndex(0);
    setIsFlipped(false);
    setIsLoadingFlashcards(true);

    try {
      const userPrompt = `Generate 4 Level ${nextLevel} high-yield active recall flashcards for: ${coveredTopicTitles.join(', ')}.
Goal: ${onboardingData?.goal || 'AI Engineering'}.
Domain: ${onboardingData?.domain || 'cooking'}. Level ${nextLevel} must test deeper mechanics and architectural trade-offs.`;

      const res = await generatePersonalizedContent({
        type: 'flashcard_generation',
        systemPrompt: `You are an expert AI learning designer generating Level ${nextLevel} active recall flashcards.`,
        userPrompt,
        context: { goal: onboardingData?.goal, domain: onboardingData?.domain, coveredTopics: coveredTopicTitles, level: nextLevel }
      });

      if (Array.isArray(res)) setFlashcards(res);
      else if (res?.flashcards) setFlashcards(res.flashcards);
      else {
        setFlashcards([
          { id: '1', question: `[Level ${nextLevel}] What edge case occurs in ${coveredTopicTitles[0] || 'the core concept'} under high concurrency?`, answer: `Data race conditions require locking mechanisms or pure immutable data pipelines.` },
          { id: '2', question: `[Level ${nextLevel}] How does the ${onboardingData?.domain || 'cooking'} metaphor handle error recovery?`, answer: `Just like replacing a missing ingredient mid-recipe, fallback functions return safe default states.` },
          { id: '3', question: `[Level ${nextLevel}] What is the primary memory/compute trade-off in this pipeline?`, answer: `Caching intermediate results reduces compute time at the expense of RAM usage.` },
          { id: '4', question: `[Level ${nextLevel}] How do you verify zero regression in deep system architectures?`, answer: `By enforcing automated end-to-end integration tests and contract validation schemas.` }
        ]);
      }
    } catch (err) {
      console.error('Failed to escalate flashcards:', err);
    } finally {
      setIsLoadingFlashcards(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-duration-300 font-sans">
      
      {/* SESSION RECAP HEADER BAR (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] border border-[#C59B67] p-6 rounded-2xl text-center space-y-3 shadow-md text-[#1A0F05]">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FFE4C4] text-[#1A0F05] text-xs font-bold border border-[#C59B67]">
          <BookmarkCheck className="w-4 h-4 text-[#8A2BE2]" />
          <span>Day {currentDay} Session Accomplished</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A0F05] tracking-tight">
          Session Recap & Retention Flashcards
        </h2>
        <p className="text-xs md:text-sm text-[#3D2714] font-medium max-w-xl mx-auto leading-relaxed">
          {completedTopicIds.length} of {allTopics.length} roadmap topics completed. Test your active recall below and proceed to your next day's task!
        </p>
      </div>

      {/* SECTION 1: FLIPPABLE FLASHCARDS (BISQUE CONTAINER) */}
      <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-10 border border-[#E3C6A2] space-y-6 shadow-lg">
        
        {/* FLASHCARD HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3C6A2] pb-4">
          <div className="flex items-center space-x-2 text-[#1A0F05] text-xl font-bold">
            <Brain className="w-5 h-5 text-[#8A2BE2]" />
            <h3>Interactive Active Recall Flashcards</h3>
          </div>
          {flashcards.length > 0 && !isDeckCompleted && (
            <div className="flex items-center space-x-2">
              <span className="bg-[#8A2BE2] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                Level {flashcardLevel}
              </span>
              <span className="text-xs font-bold text-[#1A0F05] bg-[#DEB887] px-3 py-1 rounded-full border border-[#C59B67]">
                Card {activeCardIndex + 1} of {flashcards.length}
              </span>
            </div>
          )}
        </div>

        {isLoadingFlashcards ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-[#5C4228] font-bold">Generating Level {flashcardLevel} flashcards via AI...</p>
          </div>
        ) : isDeckCompleted ? (
          /* DECK COMPLETE SUMMARY OVERLAY */
          <div className="bg-[#DEB887] border border-[#C59B67] rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#8A2BE2] text-white flex items-center justify-center mx-auto border border-[#6b1cb9] shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-[#1A0F05]">
                🎉 Active Recall Deck Completed!
              </h4>
              <p className="text-xs text-[#3D2714] font-semibold">
                You successfully reviewed {flashcards.length}/{flashcards.length} cards at Level {flashcardLevel} difficulty.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              {/* Option 1: Increase Difficulty & Continue */}
              <button
                onClick={handleIncreaseDifficulty}
                className="bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Increase Difficulty & Continue (Level {Math.min(flashcardLevel + 1, 3)})</span>
              </button>

              {/* Option 2: Done — Review Summary */}
              <button
                onClick={() => setIsDeckCompleted(false)}
                className="bg-[#FFE4C4] hover:bg-[#fbd3a2] text-[#1A0F05] border border-[#C59B67] font-bold p-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#8A2BE2]" />
                <span>Done — Review Summary</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE FLASHCARD VIEW */
          <div className="space-y-6">
            
            {/* 3D Flip Card Container */}
            <div className="perspective-1000 w-full max-w-xl mx-auto h-64 sm:h-72">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer rounded-2xl transition-transform shadow-md ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE (Question - Blueviolet Background) */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-[#8A2BE2] text-white rounded-2xl p-8 flex flex-col justify-between border border-[#6b1cb9]">
                  <div className="flex items-center justify-between text-xs text-amber-300 uppercase tracking-wider font-bold">
                    <span>Question • Tap to reveal answer</span>
                    <RotateCw className="w-4 h-4" />
                  </div>
                  <p className="text-lg sm:text-xl font-bold leading-snug text-center px-2">
                    "{currentCard?.question}"
                  </p>
                  <div className="text-center text-[11px] text-white/80 font-semibold">
                    💡 Concept focus: {coveredTopicTitles[activeCardIndex % coveredTopicTitles.length] || onboardingData?.goal}
                  </div>
                </div>

                {/* BACK FACE (Answer - Lightblue Background) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#ADD8E6] text-[#161512] rounded-2xl p-8 flex flex-col justify-between border border-[#91c4d5]">
                  <div className="flex items-center justify-between text-xs text-[#8A2BE2] uppercase tracking-wider font-bold">
                    <span>Answer & Core Concept</span>
                    <RotateCw className="w-4 h-4 text-[#8A2BE2]" />
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-[#0f172a] px-2 font-semibold">
                    {currentCard?.answer}
                  </p>
                  <div className="text-center text-[11px] text-[#4c1d95] font-bold">
                    🍳 Tied to {onboardingData?.domain || 'cooking'} domain metaphor
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between max-w-xl mx-auto pt-2">
              <button
                onClick={handlePrevCard}
                disabled={activeCardIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-[#DEB887] hover:bg-[#cda06d] disabled:opacity-40 disabled:cursor-not-allowed text-[#1A0F05] text-xs font-bold transition-colors cursor-pointer border border-[#C59B67]"
              >
                ← Previous Card
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-xs text-[#8A2BE2] hover:text-[#7823c6] font-bold underline underline-offset-4 cursor-pointer"
              >
                {isFlipped ? 'Show Question' : 'Flip to Answer'}
              </button>

              <button
                onClick={handleNextCard}
                className="px-4 py-2.5 rounded-xl bg-[#8A2BE2] hover:bg-[#7823c6] text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                {activeCardIndex === flashcards.length - 1 ? 'Finish Deck →' : 'Next Card →'}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: IN-MEMORY CONFIDENCE MAP */}
      <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-10 border border-[#E3C6A2] space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3C6A2] pb-4">
          <div>
            <h3 className="text-2xl font-bold text-[#1A0F05]">
              Session Topic Confidence Map
            </h3>
            <p className="text-xs text-[#5C4228] font-semibold">
              Color-coded status from your self-ratings today.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-bold">
            <span className="flex items-center text-[#8A2BE2]"><span className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2] mr-1"></span> Got it</span>
            <span className="flex items-center text-[#5A2A00]"><span className="w-2.5 h-2.5 rounded-full bg-[#DEB887] mr-1"></span> Shaky</span>
            <span className="flex items-center text-[#161512]"><span className="w-2.5 h-2.5 rounded-full bg-[#ADD8E6] mr-1"></span> Still lost</span>
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
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  rating === 'Got it' 
                    ? 'bg-[#8A2BE2] text-white border-[#6b1cb9]' 
                    : rating === 'Shaky' 
                    ? 'bg-[#DEB887] text-[#1A0F05] border-[#C59B67]' 
                    : 'bg-[#ADD8E6] text-[#161512] border-[#91c4d5]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm">
                      {topic.title}
                    </h4>
                    {rating !== 'Got it' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A0F05] text-white">
                        Targeted AI Resurfacing Next Session
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${rating === 'Got it' ? 'text-white/90' : 'text-[#3D2714]'}`}>
                    {topic.description}
                  </p>
                  <div className={`text-[11px] font-mono font-semibold pt-0.5 ${rating === 'Got it' ? 'text-amber-200' : 'text-[#5C4228]'}`}>
                    Level: {conf.levelUsed} • Style Stopped: {conf.finalStyleStopped}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    rating === 'Got it' 
                      ? 'bg-white text-[#8A2BE2] border-white' 
                      : rating === 'Shaky' 
                      ? 'bg-[#1A0F05] text-[#DEB887] border-[#1A0F05]' 
                      : 'bg-[#8A2BE2] text-white border-[#8A2BE2]'
                  }`}>
                    {rating === 'Got it' && <CheckCircle2 className="w-4 h-4" />}
                    {rating === 'Shaky' && <AlertTriangle className="w-4 h-4" />}
                    {rating === 'Still lost' && <XCircle className="w-4 h-4" />}
                    <span>{rating}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 3: ROADMAP PROGRESSION ACTION BUTTONS */}
        <div className="pt-6 border-t border-[#E3C6A2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onRestartSession}
            className="text-xs text-[#5C4228] hover:text-[#1A0F05] font-bold underline underline-offset-4 cursor-pointer"
          >
            Start Fresh / Change Onboarding Goal
          </button>

          {!isMasteryAchieved ? (
            <button
              onClick={onContinueToNextDay}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Proceed to Day {currentDay + 1} Session ({remainingCount} topics left)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenCertificate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>🎓 Claim Official Mastery Certificate</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
