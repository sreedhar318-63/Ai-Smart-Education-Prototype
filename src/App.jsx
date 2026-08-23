import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OnboardingScreen from './components/OnboardingScreen';
import PathScreen from './components/PathScreen';
import LearningScreen from './components/LearningScreen';
import RecapScreen from './components/RecapScreen';
import LearnerProfileScreen from './components/LearnerProfileScreen';
import PromptDebuggerModal from './components/PromptDebuggerModal';
import ResumeBuilderModal from './components/ResumeBuilderModal';
import CertificateModal from './components/CertificateModal';
import { generatePersonalizedContent } from './services/aiService';
import { generate90DayHeatmapData, updateTodayHeatmap } from './utils/mockHeatmap';

// Helper to calculate session topics given uncompleted topics and time budget
function calculateSessionTopics(allTopics, completedIds, timeLimitMinutes) {
  const uncompleted = allTopics.filter(t => !completedIds.includes(t.id));
  let accumulatedMinutes = 0;
  const sessionTopics = [];

  for (let t of uncompleted) {
    if (sessionTopics.length === 0 || (accumulatedMinutes + t.estMinutes <= timeLimitMinutes + 5)) {
      sessionTopics.push(t);
      accumulatedMinutes += t.estMinutes;
    } else {
      break;
    }
  }

  return sessionTopics;
}

export default function App() {
  // Navigation step state: 1: Onboarding, 2: Path Roadmap, 3: Learning Session, 4: Session Recap
  const [currentStep, setCurrentStep] = useState(1);
  
  // View mode switcher: 'main' or 'profile'
  const [activeView, setActiveView] = useState('main');

  // Mentor Persona persistent state
  const [persona, setPersona] = useState('Patient Teacher');

  // Prompt Debugger modal state
  const [isDebuggerOpen, setIsDebuggerOpen] = useState(false);

  // Resume Builder modal state
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);

  // Certificate modal state
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);



  // Onboarding Form state
  const [onboardingData, setOnboardingData] = useState({
    role: 'Student',
    goal: 'Learn React & modern frontend architecture',
    skillLevel: 'Beginner',
    timeAvailable: '25 minutes',
    timeMinutes: 25,
    domain: 'cooking',
    jobDescription: ''
  });

  // Master AI-generated path state (Persists across sessions!)
  const [pathData, setPathData] = useState({ topics: [], skillGapMap: null });
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  // Multi-day Roadmap Progress State
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTopicIds, setCompletedTopicIds] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [topicConfidenceMap, setTopicConfidenceMap] = useState({});

  // Fixed Session Topic IDs for the currently active day session
  const [activeSessionTopicIds, setActiveSessionTopicIds] = useState([]);

  // 90-Day Activity Heatmap Data
  const [heatmapData, setHeatmapData] = useState(() => generate90DayHeatmapData());

  // In-Memory Adaptive Learner Model
  const [learnerModel, setLearnerModel] = useState({
    completedTopicsCount: 0,
    totalMinutesSpent: 0,
    currentStreak: 5,
    longestStreak: 12,
    topicRatings: [],
    preferredLevel: 'ELI10',
    preferredStyle: 'Analogy',
    weakTopics: [],
    avgCycles: 0
  });

  // Synchronize app navigation state with browser history (PushState & PopState)
  const changeStep = (newStep, newView = 'main', replace = false) => {
    setCurrentStep(newStep);
    setActiveView(newView);

    const hash = newView === 'profile' ? '#profile' : (
      newStep === 1 ? '#onboarding' :
      newStep === 2 ? '#roadmap' :
      newStep === 3 ? '#learning' : '#recap'
    );

    if (replace) {
      window.history.replaceState({ step: newStep, view: newView }, '', hash);
    } else if (window.location.hash !== hash || window.history.state?.step !== newStep) {
      window.history.pushState({ step: newStep, view: newView }, '', hash);
    }
  };

  // Synchronize browser Back & Forward button clicks with App State
  useEffect(() => {
    const hash = window.location.hash;
    let initialStep = 1;
    let initialView = 'main';

    if (hash === '#profile') initialView = 'profile';
    else if (hash === '#roadmap') initialStep = 2;
    else if (hash === '#learning') initialStep = 3;
    else if (hash === '#recap') initialStep = 4;

    window.history.replaceState({ step: initialStep, view: initialView }, '', hash || '#onboarding');

    const handlePopState = (e) => {
      if (e.state) {
        setCurrentStep(e.state.step || 1);
        setActiveView(e.state.view || 'main');
      } else {
        const h = window.location.hash;
        if (h === '#profile') setActiveView('profile');
        else if (h === '#roadmap') { setCurrentStep(2); setActiveView('main'); }
        else if (h === '#learning') { setCurrentStep(3); setActiveView('main'); }
        else if (h === '#recap') { setCurrentStep(4); setActiveView('main'); }
        else { setCurrentStep(1); setActiveView('main'); }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle explicit Go Back navigation
  const handleGoBack = () => {
    if (activeView === 'profile') {
      changeStep(currentStep, 'main');
    } else if (currentStep === 4) {
      changeStep(2, 'main');
    } else if (currentStep === 3) {
      if (currentTopicIndex > 0) {
        setCurrentTopicIndex(prev => prev - 1);
      } else {
        changeStep(2, 'main');
      }
    } else if (currentStep === 2) {
      changeStep(1, 'main');
    }
  };

  // Reset entire session back to onboarding
  const handleResetSession = () => {
    changeStep(1, 'main', true);
    setCurrentDay(1);
    setCompletedTopicIds([]);
    setCurrentTopicIndex(0);
    setActiveSessionTopicIds([]);
    setTopicConfidenceMap({});
    setPathData({ topics: [], skillGapMap: null });
  };

  // STEP 1 -> STEP 2: Generate Master Learning Path via generatePersonalizedContent
  const handleOnboardingSubmit = async (formData) => {
    setOnboardingData(formData);
    setIsGeneratingPath(true);
    setCurrentDay(1);
    setCompletedTopicIds([]);
    setActiveSessionTopicIds([]);
    setTopicConfidenceMap({});

    try {
      const userPrompt = `Generate a structured learning path for a ${formData.role} whose goal is "${formData.goal}".
Skill level: ${formData.skillLevel}.
Time available today: ${formData.timeAvailable}.
Analogy domain: ${formData.domain}.
${formData.jobDescription ? `Target Job Description: ${formData.jobDescription}` : ''}`;

      const res = await generatePersonalizedContent({
        type: 'path_generation',
        systemPrompt: 'You are an expert AI Learning Architect. Create a structured 5-8 topic learning roadmap.',
        userPrompt,
        learnerModel,
        context: {
          goal: formData.goal,
          role: formData.role,
          domain: formData.domain,
          jobDescription: formData.jobDescription,
          learnerModel
        }
      });

      if (typeof res === 'object' && res.topics) {
        setPathData(res);
      } else {
        // Fallback default structure
        setPathData({
          topics: [
            { id: 't1', title: 'Component Architecture & Props Flow', description: 'Understanding reusable UI blocks and data passing.', estMinutes: 12, category: 'Core' },
            { id: 't2', title: 'State Management with useState & useReducer', description: 'Handling reactive user inputs and temporary state.', estMinutes: 15, category: 'Core' },
            { id: 't3', title: 'Effect Lifecycles & Data Fetching', description: 'Synchronizing components with external APIs.', estMinutes: 18, category: 'Advanced' },
            { id: 't4', title: 'Custom Hooks & Reusable Logic', description: 'Extracting stateful business logic out of UI components.', estMinutes: 15, category: 'Architecture' },
            { id: 't5', title: 'Performance Tuning & Memoization', description: 'Preventing unnecessary re-renders with useMemo & useCallback.', estMinutes: 20, category: 'Optimization' },
            { id: 't6', title: 'Testing & Production Deployment', description: 'Unit testing components and deployment pipelines.', estMinutes: 15, category: 'DevOps' }
          ],
          skillGapMap: formData.jobDescription ? {
            targetRole: formData.jobDescription.slice(0, 40),
            matchedSkills: [{ name: 'Core Conceptual Understanding', level: 'Strong' }],
            missingSkills: [{ name: 'Production State & Performance Tuning', priority: 'High', reason: 'Required in posting' }]
          } : null
        });
      }

      changeStep(2, 'main');
    } catch (err) {
      console.error('Failed to generate path:', err);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  const topics = pathData.topics || [];
  const timeLimit = onboardingData.timeMinutes || 25;

  // Compute preview topics for Roadmap Screen
  const previewTodayTopics = calculateSessionTopics(topics, completedTopicIds, timeLimit);
  const previewTotalMinutes = previewTodayTopics.reduce((acc, t) => acc + t.estMinutes, 0);

  // Derive stable todayTopics for active session (Step 3 & Step 4)
  const todayTopics = activeSessionTopicIds.length > 0
    ? topics.filter(t => activeSessionTopicIds.includes(t.id))
    : previewTodayTopics;

  const todayTotalMinutes = todayTopics.reduce((acc, t) => acc + t.estMinutes, 0);

  // STEP 2 -> STEP 3: Start Current Day Session (Locks in activeSessionTopicIds)
  const handleStartSession = () => {
    const sessionTopics = calculateSessionTopics(topics, completedTopicIds, timeLimit);
    setActiveSessionTopicIds(sessionTopics.map(t => t.id));
    setCurrentTopicIndex(0);
    changeStep(3, 'main');
  };

  // STEP 3: Handle Topic Self-Rating Confidence & Progress along Roadmap
  const handleSaveTopicConfidence = (topicId, confidenceData) => {
    const currentTopicObj = todayTopics[currentTopicIndex];
    const topicTitle = currentTopicObj?.title || 'Covered Concept';
    const estMinutes = currentTopicObj?.estMinutes || 15;

    // 1. Mark topic as completed
    if (!completedTopicIds.includes(topicId)) {
      setCompletedTopicIds(prev => [...prev, topicId]);
    }

    // 2. Save rating in topicConfidenceMap
    setTopicConfidenceMap((prev) => ({
      ...prev,
      [topicId]: confidenceData
    }));

    // 3. Live Update Today's Heatmap Cell
    setHeatmapData((prevDays) => updateTodayHeatmap(prevDays, 1, topicTitle));

    // 4. Accumulate in learnerModel
    setLearnerModel((prevModel) => {
      const newRatings = [...prevModel.topicRatings, { topicId, title: topicTitle, ...confidenceData }];
      const newCompletedCount = prevModel.completedTopicsCount + 1;
      const newMinutes = prevModel.totalMinutesSpent + estMinutes;

      // Extract weak topics ('Shaky' or 'Still lost')
      const weakTopics = newRatings
        .filter(r => r.rating === 'Shaky' || r.rating === 'Still lost')
        .map(r => r.title);

      // Compute mode of levelUsed & finalStyleStopped
      const levelCounts = {};
      const styleCounts = {};
      let totalCycles = 0;

      newRatings.forEach(r => {
        levelCounts[r.levelUsed] = (levelCounts[r.levelUsed] || 0) + 1;
        styleCounts[r.finalStyleStopped] = (styleCounts[r.finalStyleStopped] || 0) + 1;
        totalCycles += (r.confusedCycles || 0);
      });

      const prefLevel = Object.keys(levelCounts).sort((a, b) => levelCounts[b] - levelCounts[a])[0] || 'ELI10';
      const prefStyle = Object.keys(styleCounts).sort((a, b) => styleCounts[b] - styleCounts[a])[0] || 'Analogy';
      const avgCycles = Math.round((totalCycles / newRatings.length) * 10) / 10;

      return {
        ...prevModel,
        completedTopicsCount: newCompletedCount,
        totalMinutesSpent: newMinutes,
        topicRatings: newRatings,
        preferredLevel: prefLevel,
        preferredStyle: prefStyle,
        weakTopics,
        avgCycles
      };
    });

    // Move to next topic in current session, or proceed to Recap Screen if current session completed
    if (currentTopicIndex + 1 < todayTopics.length) {
      setCurrentTopicIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      changeStep(4, 'main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Advance to Next Day's Session on the Master Roadmap
  const handleContinueToNextDay = () => {
    setCurrentDay(prev => prev + 1);
    setCurrentTopicIndex(0);
    setActiveSessionTopicIds([]);
    changeStep(2, 'main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#242220] flex flex-col font-sans">
      
      {/* Persistent Navigation & Mentor Persona Header */}
      <Navbar
        currentStep={currentStep}
        persona={persona}
        onPersonaChange={setPersona}
        onOpenDebugger={() => setIsDebuggerOpen(true)}
        onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onResetSession={handleResetSession}
        onGoBack={handleGoBack}
        activeView={activeView}
        onToggleProfile={() => changeStep(currentStep, activeView === 'profile' ? 'main' : 'profile')}
        hasOnboarded={currentStep > 1}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {activeView === 'profile' ? (
          <LearnerProfileScreen
            onboardingData={onboardingData}
            learnerModel={learnerModel}
            heatmapData={heatmapData}
            onReturnToLearning={() => changeStep(currentStep, 'main')}
            onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <OnboardingScreen
                onSubmitOnboarding={handleOnboardingSubmit}
                isLoading={isGeneratingPath}
              />
            )}

            {currentStep === 2 && (
              <PathScreen
                onboardingData={onboardingData}
                pathData={pathData}
                currentDay={currentDay}
                completedTopicIds={completedTopicIds}
                todayTopics={previewTodayTopics}
                todayTotalMinutes={previewTotalMinutes}
                confidenceMap={topicConfidenceMap}
                onStartSession={handleStartSession}
                onRegeneratePath={() => handleOnboardingSubmit(onboardingData)}
                onGoBack={handleGoBack}
                onOpenCertificate={() => setIsCertificateOpen(true)}
                isLoading={isGeneratingPath}
              />
            )}

            {currentStep === 3 && todayTopics[currentTopicIndex] && (
              <LearningScreen
                currentTopic={todayTopics[currentTopicIndex]}
                topicIndex={currentTopicIndex}
                totalTodayTopics={todayTopics.length}
                currentDay={currentDay}
                onboardingData={onboardingData}
                persona={persona}
                learnerModel={learnerModel}
                onSaveTopicConfidence={handleSaveTopicConfidence}
                onFinishSession={() => changeStep(4, 'main')}
                onGoBack={handleGoBack}
              />
            )}

            {currentStep === 4 && (
              <RecapScreen
                onboardingData={onboardingData}
                todayTopics={todayTopics}
                allTopics={topics}
                completedTopicIds={completedTopicIds}
                currentDay={currentDay}
                confidenceMap={topicConfidenceMap}
                onContinueToNextDay={handleContinueToNextDay}
                onRestartSession={handleResetSession}
                onGoBack={handleGoBack}
                onOpenCertificate={() => setIsCertificateOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 px-4 text-center text-xs text-stone-500 font-sans">
        <p className="font-editorial text-sm font-semibold text-stone-800">
          MentorPath — AI-Powered Personalized Learning Platform
        </p>
        <p className="mt-1">
          Frontend-Only Prototype • Single session state • Powered by <code className="text-amber-800 font-mono-code text-[11px]">generatePersonalizedContent()</code>
        </p>
      </footer>

      {/* Black-Box Prompt Inspector & Credentials Drawer */}
      <PromptDebuggerModal
        isOpen={isDebuggerOpen}
        onClose={() => setIsDebuggerOpen(false)}
      />

      {/* AI Skill-Based Resume Builder Modal */}
      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
        onboardingData={onboardingData}
        pathData={pathData}
        completedTopicIds={completedTopicIds}
      />

      {/* Verified Mastery Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        onboardingData={onboardingData}
        pathData={pathData}
        completedTopicIds={completedTopicIds}
      />

    </div>
  );
}


