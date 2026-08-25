import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OnboardingScreen from './components/OnboardingScreen';
import StudentDashboard from './components/StudentDashboard';
import LearningTwinView from './components/LearningTwinView';
import AdaptiveQuizView from './components/AdaptiveQuizView';
import SkillGraphView from './components/SkillGraphView';
import SmartRevisionView from './components/SmartRevisionView';
import CareerGapView from './components/CareerGapView';
import PathScreen from './components/PathScreen';
import LearningScreen from './components/LearningScreen';
import RecapScreen from './components/RecapScreen';
import LearnerProfileScreen from './components/LearnerProfileScreen';
import PromptDebuggerModal from './components/PromptDebuggerModal';
import ResumeBuilderModal from './components/ResumeBuilderModal';
import CertificateModal from './components/CertificateModal';
import ChatbotWidget from './components/ChatbotWidget';
import DemoModeModal, { DEMO_STEPS } from './components/DemoModeModal';
import BottomNav from './components/BottomNav';
import AITutorView from './components/AITutorView';
import LearnCatalogView from './components/LearnCatalogView';
import PracticeView from './components/PracticeView';
import ProgressView from './components/ProgressView';

import { generatePersonalizedContent } from './services/aiService';
import { 
 loadSavedState, 
 saveStateToLocal, 
 INITIAL_STUDENT_PROFILE, 
 INITIAL_SKILLS 
} from './services/aiEngine';
import { generate90DayHeatmapData, updateTodayHeatmap } from './utils/mockHeatmap';

export default function App() {
 // Saved state from LocalStorage or Defaults
 const [savedData] = useState(() => loadSavedState());

 const [studentProfile, setStudentProfile] = useState(savedData.student);
 const [skills, setSkills] = useState(savedData.skills);
 const [careerGoal, setCareerGoal] = useState(savedData.career);

  // Active view switcher initialized refresh-safely from URL hash & localStorage
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'onboarding') return hash;
    const savedOnboarded = localStorage.getItem('mentorpath_onboarded') === 'true';
    if (savedOnboarded) return hash || 'dashboard';
    return 'onboarding';
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const savedOnboarded = localStorage.getItem('mentorpath_onboarded') === 'true';
    if ((hash && hash !== 'onboarding') || savedOnboarded) return 2;
    return 1;
  });

 // Judge Demo Mode State
 const [isDemoModeOpen, setIsDemoModeOpen] = useState(false);
 const [currentDemoStep, setCurrentDemoStep] = useState(1);

 // Mentor Persona persistent state
 const [persona, setPersona] = useState('Patient Teacher');

 // Modals state
 const [isDebuggerOpen, setIsDebuggerOpen] = useState(false);
 const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
 const [isCertificateOpen, setIsCertificateOpen] = useState(false);
 const [isChatbotOpen, setIsChatbotOpen] = useState(false);

 // Onboarding Form state
 const [onboardingData, setOnboardingData] = useState({
 role: 'Student',
 goal: 'Master AI Engineering & Machine Learning',
 skillLevel: 'Intermediate',
 timeAvailable: '25 minutes',
 timeMinutes: 25,
 domain: 'cooking',
 jobDescription: ''
 });

 // Master AI-generated path state
 const [pathData, setPathData] = useState({ topics: [], skillGapMap: null });
 const [isGeneratingPath, setIsGeneratingPath] = useState(false);

 // Multi-day Roadmap Progress State
 const [currentDay, setCurrentDay] = useState(1);
 const [completedTopicIds, setCompletedTopicIds] = useState([]);
 const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
 const [topicConfidenceMap, setTopicConfidenceMap] = useState({});
 const [activeSessionTopicIds, setActiveSessionTopicIds] = useState([]);

 // 90-Day Activity Heatmap Data
 const [heatmapData, setHeatmapData] = useState(() => generate90DayHeatmapData());

 // In-Memory Adaptive Learner Model
 const [learnerModel, setLearnerModel] = useState({
 completedTopicsCount: 0,
 totalMinutesSpent: 12,
 currentStreak: studentProfile.streak || 5,
 longestStreak: 12,
 topicRatings: [],
 preferredLevel: 'ELI10',
 preferredStyle: studentProfile.preferredStyle || 'Visual + Examples',
 weakTopics: ['Probability & Bayes', 'Neural Networks'],
 avgCycles: 0.8
 });

 // Synchronize navigation step with browser history hash & localStorage
 const navigateToView = (newView) => {
    if (newView === 'onboarding') {
      setCurrentStep(1);
      setActiveView('onboarding');
      window.location.hash = '#onboarding';
      localStorage.setItem('mentorpath_active_view', 'onboarding');
    } else {
      setCurrentStep(2);
      setActiveView(newView);
      window.location.hash = `#${newView}`;
      localStorage.setItem('mentorpath_active_view', newView);
      localStorage.setItem('mentorpath_onboarded', 'true');

      // Track step completion visit flags
      if (newView === 'skill-graph') {
        localStorage.setItem('mentorpath_graph_visited', 'true');
      } else if (newView === 'learning-twin') {
        localStorage.setItem('mentorpath_twin_visited', 'true');
      } else if (newView === 'career') {
        localStorage.setItem('mentorpath_resume_visited', 'true');
      }
    }
 };

 // Synchronize browser history and hash navigation
 useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '');
      const hasOnboarded = localStorage.getItem('mentorpath_onboarded') === 'true';
      if (h === 'onboarding') {
        setCurrentStep(1);
        setActiveView('onboarding');
      } else if (h) {
        setCurrentStep(2);
        setActiveView(h);
      } else if (hasOnboarded) {
        setCurrentStep(2);
        setActiveView('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
 }, []);

 const handleGoBack = () => {
 if (activeView !== 'dashboard' && activeView !== 'onboarding') {
 navigateToView('dashboard');
 } else if (activeView === 'dashboard') {
 setCurrentStep(1);
 setActiveView('onboarding');
 } else {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }
 };

 // Reset entire state and return to Onboarding Landing Page
 const handleResetSession = () => {
 setStudentProfile(INITIAL_STUDENT_PROFILE);
 setSkills(INITIAL_SKILLS);
 setCareerGoal('AI Engineer');
 setCurrentStep(1);
 navigateToView('onboarding');
 setCurrentDay(1);
 setCompletedTopicIds([]);
 setCurrentTopicIndex(0);
 setActiveSessionTopicIds([]);
 setTopicConfidenceMap({});
 setPathData({ topics: [], skillGapMap: null });
 };

 // Update Student Profile State helper
 const handleUpdateStudentProfile = (partialUpdates) => {
 setStudentProfile(prev => {
 const updated = { ...prev, ...partialUpdates };
 return updated;
 });
 };

 // Judge Demo Launcher
 const handleStartDemoMode = () => {
 setIsDemoModeOpen(true);
 setCurrentDemoStep(1);
 navigateToView('dashboard');
 };

 const handleResetDemo = () => {
 setStudentProfile(INITIAL_STUDENT_PROFILE);
 setSkills(INITIAL_SKILLS);
 setCareerGoal('AI Engineer');
 setCurrentDemoStep(1);
 navigateToView('dashboard');
 };

 // Onboarding Submission
 const handleOnboardingSubmit = async (formData) => {
 setOnboardingData(formData);
 setIsGeneratingPath(true);
 setCurrentDay(1);
 setCompletedTopicIds([]);
 setActiveSessionTopicIds([]);
 setTopicConfidenceMap({});

 try {
 const userPrompt = `Generate a structured learning path for a ${formData.role} whose goal is "${formData.goal}". Skill level: ${formData.skillLevel}.`;
 const res = await generatePersonalizedContent({
 type: 'path_generation',
 systemPrompt: 'You are an expert AI Learning Architect. Create a 5-8 topic learning roadmap.',
 userPrompt,
 learnerModel,
 context: { goal: formData.goal, role: formData.role, domain: formData.domain }
 });

 if (typeof res === 'object' && res.topics) {
 setPathData(res);
 } else {
 setPathData({
 topics: [
 { id: 't1', title: 'Python & Data Structures', description: 'Core syntax, list comprehensions, and data pipelines.', estMinutes: 12, category: 'Core' },
 { id: 't2', title: 'Statistics & Probability Foundations', description: 'Descriptive stats, mean, variance, distributions, and Bayes Theorem.', estMinutes: 15, category: 'Math' },
 { id: 't3', title: 'Supervised Learning & Regression', description: 'Building baseline ML predictive models.', estMinutes: 18, category: 'Machine Learning' },
 { id: 't4', title: 'Neural Networks & Activation Mechanics', description: 'Perceptrons, backpropagation, and loss optimization.', estMinutes: 15, category: 'Deep Learning' },
 { id: 't5', title: 'Generative AI & LLM Systems', description: 'Transformers, prompt engineering, and RAG architectures.', estMinutes: 20, category: 'Advanced AI' }
 ],
 skillGapMap: null
 });
 }

 setCurrentStep(2);
 navigateToView('dashboard');
 } catch (err) {
 console.error('Failed to generate path:', err);
 } finally {
 setIsGeneratingPath(false);
 }
 };

 return (
 <div className="min-h-screen bg-[#FCFBF9] text-[#161512] flex flex-col font-sans">
 
 {/* Persistent Navbar */}
 <Navbar
 currentStep={currentStep}
 persona={persona}
 onPersonaChange={setPersona}
 onOpenDebugger={() => setIsDebuggerOpen(true)}
 onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
 onOpenCertificate={() => setIsCertificateOpen(true)}
 onToggleChatbot={() => setIsChatbotOpen(prev => !prev)}
 onResetSession={handleResetSession}
 onGoBack={handleGoBack}
 activeView={activeView}
 onNavigate={navigateToView}
 onStartDemoMode={handleStartDemoMode}
 hasOnboarded={currentStep > 1}
 studentProfile={studentProfile}
 />

 {/* Main App Content View Switcher */}
 <main className="flex-1 pb-16">
 {currentStep === 1 ? (
 <OnboardingScreen
 onSubmitOnboarding={handleOnboardingSubmit}
 isLoading={isGeneratingPath}
 />
 ) : (
 <>
 {activeView === 'dashboard' && (
 <StudentDashboard
 studentProfile={studentProfile}
 skills={skills}
 careerGoal={careerGoal}
 onNavigate={navigateToView}
 onStartDemoMode={handleStartDemoMode}
 />
 )}

 {activeView === 'learning-twin' && (
 <LearningTwinView
 studentProfile={studentProfile}
 skills={skills}
 onGoBack={handleGoBack}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'adaptive-quiz' && (
 <AdaptiveQuizView
 studentProfile={studentProfile}
 skills={skills}
 onUpdateProfile={handleUpdateStudentProfile}
 onGoBack={handleGoBack}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'skill-graph' && (
 <SkillGraphView
 skills={skills}
 onGoBack={handleGoBack}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'smart-revision' && (
 <SmartRevisionView
 skills={skills}
 studentProfile={studentProfile}
 onUpdateProfile={handleUpdateStudentProfile}
 onGoBack={handleGoBack}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'career' && (
 <CareerGapView
 studentProfile={studentProfile}
 skills={skills}
 careerGoal={careerGoal}
 onSelectCareer={setCareerGoal}
 onGoBack={handleGoBack}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'roadmap' && (
 <PathScreen
 onboardingData={onboardingData}
 pathData={pathData.topics.length > 0 ? pathData : {
 topics: [
 { id: 't1', title: 'Python & Data Structures', description: 'Core syntax, list comprehensions, and data pipelines.', estMinutes: 12, category: 'Core' },
 { id: 't2', title: 'Statistics & Probability Foundations', description: 'Descriptive stats, mean, variance, distributions, and Bayes Theorem.', estMinutes: 15, category: 'Math' },
 { id: 't3', title: 'Supervised Learning & Regression', description: 'Building baseline ML predictive models.', estMinutes: 18, category: 'Machine Learning' },
 { id: 't4', title: 'Neural Networks & Activation Mechanics', description: 'Perceptrons, backpropagation, and loss optimization.', estMinutes: 15, category: 'Deep Learning' },
 { id: 't5', title: 'Generative AI & LLM Systems', description: 'Transformers, prompt engineering, and RAG architectures.', estMinutes: 20, category: 'Advanced AI' }
 ]
 }}
 currentDay={currentDay}
 completedTopicIds={completedTopicIds}
 todayTopics={pathData.topics.slice(0, 3)}
 todayTotalMinutes={45}
 confidenceMap={topicConfidenceMap}
 onStartSession={() => navigateToView('learning')}
 onRegeneratePath={() => handleOnboardingSubmit(onboardingData)}
 onGoBack={handleGoBack}
 onOpenCertificate={() => setIsCertificateOpen(true)}
 isLoading={isGeneratingPath}
 />
 )}

 {activeView === 'learning' && (
 <LearningScreen
 currentTopic={pathData.topics[currentTopicIndex] || { id: 't1', title: 'Python & Data Structures', description: 'Core syntax, list comprehensions, and data pipelines.', estMinutes: 12 }}
 topicIndex={currentTopicIndex}
 totalTodayTopics={pathData.topics.length || 5}
 currentDay={currentDay}
 onboardingData={onboardingData}
 persona={persona}
 learnerModel={learnerModel}
 onSaveTopicConfidence={(id, data) => setCompletedTopicIds(prev => [...prev, id])}
 onFinishSession={() => navigateToView('recap')}
 onGoBack={handleGoBack}
 />
 )}

 {activeView === 'recap' && (
 <RecapScreen
 onboardingData={onboardingData}
 todayTopics={pathData.topics}
 allTopics={pathData.topics}
 completedTopicIds={completedTopicIds}
 currentDay={currentDay}
 confidenceMap={topicConfidenceMap}
 onContinueToNextDay={() => { setCurrentDay(p => p + 1); navigateToView('roadmap'); }}
 onRestartSession={handleResetSession}
 onGoBack={handleGoBack}
 onOpenCertificate={() => setIsCertificateOpen(true)}
 />
 )}

 {activeView === 'ai-tutor' && (
 <AITutorView
 studentProfile={studentProfile}
 persona={persona}
 onboardingData={onboardingData}
 learnerModel={learnerModel}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'learn-catalog' && (
 <LearnCatalogView
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'practice' && (
 <PracticeView
 studentProfile={studentProfile}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'progress' && (
 <ProgressView
 studentProfile={studentProfile}
 skills={skills}
 onNavigate={navigateToView}
 />
 )}

 {activeView === 'profile' && (
 <LearnerProfileScreen
 onboardingData={onboardingData}
 learnerModel={learnerModel}
 heatmapData={heatmapData}
 onReturnToLearning={() => navigateToView('dashboard')}
 onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
 onOpenCertificate={() => setIsCertificateOpen(true)}
 />
 )}
 </>
 )}
 </main>

 {/* Persistent Phone-First Bottom Navigation Bar */}
 {currentStep > 1 && (
 <BottomNav activeView={activeView} onNavigate={navigateToView} />
 )}

 {/* Footer */}
 <footer className="border-t border-neutral-200 py-6 px-4 text-center text-xs text-neutral-500 font-sans">
 <p className="font-editorial text-sm font-semibold text-neutral-800">
 MentorPath — AI-Powered Personalized Adaptive Learning System
 </p>
 <p className="mt-1">
 Interactive AI Learning Prototype • Local State & Simulation Engine • Zero External Backend Dependencies
 </p>
 </footer>

 {/* Prompt Inspector Drawer */}
 <PromptDebuggerModal
 isOpen={isDebuggerOpen}
 onClose={() => setIsDebuggerOpen(false)}
 />

 {/* AI Resume Builder Modal */}
 <ResumeBuilderModal
 isOpen={isResumeBuilderOpen}
 onClose={() => setIsResumeBuilderOpen(false)}
 onboardingData={onboardingData}
 pathData={pathData}
 completedTopicIds={completedTopicIds}
 />

 {/* Mastery Certificate Modal */}
 <CertificateModal
 isOpen={isCertificateOpen}
 onClose={() => setIsCertificateOpen(false)}
 onboardingData={onboardingData}
 pathData={pathData}
 completedTopicIds={completedTopicIds}
 />

 {/* Ask Doubts Chatbot Widget */}
 <ChatbotWidget
 persona={persona}
 onboardingData={onboardingData}
 currentTopic={pathData.topics[currentTopicIndex]}
 learnerModel={learnerModel}
 isOpen={isChatbotOpen}
 onToggle={() => setIsChatbotOpen(prev => !prev)}
 />

 {/* Judge Demo Mode Modal */}
 <DemoModeModal
 isOpen={isDemoModeOpen}
 onClose={() => setIsDemoModeOpen(false)}
 currentDemoStep={currentDemoStep}
 onSetDemoStep={setCurrentDemoStep}
 onNavigate={navigateToView}
 onResetDemo={handleResetDemo}
 />

 </div>
 );
}
