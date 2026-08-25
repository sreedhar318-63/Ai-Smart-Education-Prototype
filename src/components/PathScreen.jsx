import React, { useState } from 'react';
import { 
  Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ShieldCheck, 
  Check, Lock, Calendar, Layers, GitBranch, Info, ExternalLink, Play, 
  ChevronRight, Bookmark, Compass, Award, X, CornerDownRight
} from 'lucide-react';

export default function PathScreen({
  onboardingData,
  pathData,
  currentDay,
  completedTopicIds = [],
  todayTopics = [],
  todayTotalMinutes = 0,
  confidenceMap = {},
  onStartSession,
  onRegeneratePath,
  onGoBack,
  onOpenCertificate,
  isLoading
}) {
  const { topics = [], skillGapMap = null } = pathData || {};
  const totalTopicsCount = topics.length;
  const completedCount = completedTopicIds.length;
  const isMasteryAchieved = completedCount >= totalTopicsCount && totalTopicsCount > 0;

  // View Mode: 'tree' (roadmap.sh flowchart) vs 'list' (detailed timeline)
  const [viewMode, setViewMode] = useState('tree');

  // Selected topic node for detail inspector modal
  const [selectedTopicNode, setSelectedTopicNode] = useState(null);

  // Calculate total roadmap minutes
  const totalRoadmapMinutes = topics.reduce((acc, t) => acc + (t.estMinutes || 15), 0);

  // Group topics into 3 logical phases (roadmap.sh style pillars)
  const phase1 = topics.slice(0, Math.ceil(topics.length / 3));
  const phase2 = topics.slice(Math.ceil(topics.length / 3), Math.ceil((topics.length * 2) / 3));
  const phase3 = topics.slice(Math.ceil((topics.length * 2) / 3));

  const phases = [
    { title: 'Phase 1: Foundations & Core Concepts', topics: phase1 },
    { title: 'Phase 2: Intermediate Patterns & State', topics: phase2 },
    { title: 'Phase 3: Ecosystem, Architecture & Production', topics: phase3 }
  ].filter(p => p.topics.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-duration-300 font-sans">
      
      {/* TOP BANNER: GOAL SUMMARY & ROADMAP HEADER (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] text-[#1A0F05] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#C59B67] shadow-md">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#8A2BE2] text-white text-xs font-bold shadow-2xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Learning Roadmap</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FFE4C4] text-[#1A0F05] text-xs font-bold border border-[#C59B67]">
              <span>Day {currentDay} Session</span>
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A0F05] leading-tight">
            {onboardingData?.goal || 'AI Engineering'}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#3D2714] font-medium pt-1">
            <span className="bg-[#FFE4C4] px-3 py-1 rounded-full border border-[#C59B67]">
              Role: <strong className="text-[#8A2BE2] font-bold">{onboardingData?.role || 'Learner'}</strong>
            </span>
            <span className="bg-[#FFE4C4] px-3 py-1 rounded-full border border-[#C59B67]">
              Progress: <strong className="text-[#8A2BE2] font-bold">{completedCount} / {totalTopicsCount} Nodes Completed</strong>
            </span>
            <span className="bg-[#FFE4C4] px-3 py-1 rounded-full border border-[#C59B67]">
              Est. Total: <strong className="text-[#8A2BE2] font-bold">~{totalRoadmapMinutes} mins</strong>
            </span>
          </div>
        </div>

        {/* ACTION BUDGET BOX (BISQUE CONTAINER) */}
        <div className="z-10 bg-[#FFE4C4] border border-[#C59B67] p-5 rounded-xl md:text-right min-w-[220px] space-y-2 shadow-2xs">
          <div className="flex items-center md:justify-end space-x-1.5 text-xs text-[#8A2BE2] font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Session Target</span>
          </div>
          <div className="text-3xl font-bold text-[#1A0F05]">
            ~{todayTotalMinutes} mins
          </div>
          <p className="text-[11px] text-[#5C4228] font-semibold">
            {isMasteryAchieved ? 'All roadmap topics completed!' : `${todayTopics.length} topic(s) ready to learn.`}
          </p>

          {!isMasteryAchieved && (
            <button
              onClick={onStartSession}
              disabled={todayTopics.length === 0}
              className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Day {currentDay}</span>
            </button>
          )}
        </div>
      </div>

      {/* SKILL GAP ANALYSIS BOX */}
      {skillGapMap && (
        <div className="bg-[#ADD8E6] border border-[#91c4d5] rounded-2xl p-6 md:p-8 space-y-4 text-[#161512] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#161512]">
              <ShieldCheck className="w-5 h-5 text-[#8A2BE2]" />
              <h3 className="text-xl font-bold">
                Target Role Skill Gap Analysis: {skillGapMap.targetRole}
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-[#8A2BE2] text-white font-bold">
              AI Job Posting Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="bg-[#FFE4C4] border border-[#C59B67] rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-[#8A2BE2] uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8A2BE2]" />
                <span>Prerequisite Skills Verified</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#1A0F05]">
                {skillGapMap.matchedSkills.map((sk, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-[#C59B67] font-semibold">
                    <span>{sk.name}</span>
                    <span className="text-[10px] bg-[#8A2BE2] text-white px-2 py-0.5 rounded font-bold">{sk.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Gaps */}
            <div className="bg-[#DEB887] border border-[#C59B67] rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-[#1A0F05] uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-[#8A2BE2]" />
                <span>Skill Gaps Addressed in Roadmap</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#1A0F05]">
                {skillGapMap.missingSkills.map((sk, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-[#FFE4C4] px-3 py-1.5 rounded-lg border border-[#C59B67]">
                    <div className="truncate mr-2">
                      <p className="font-bold text-[#1A0F05]">{sk.name}</p>
                      <p className="text-[10px] text-[#5C4228] truncate">{sk.reason}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold shrink-0 uppercase bg-[#8A2BE2] text-white">
                      {sk.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE FLOWCHART CONTAINER (BISQUE BACKGROUND) */}
      <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-10 border border-[#E3C6A2] space-y-8 shadow-lg">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3C6A2]">
          <div>
            <div className="flex items-center space-x-2 text-[#1A0F05]">
              <GitBranch className="w-5 h-5 text-[#8A2BE2]" />
              <h3 className="text-2xl font-bold">
                Interactive Learning Roadmap
              </h3>
            </div>
            <p className="text-xs text-[#5C4228] font-semibold mt-0.5">
              Click any node card to inspect sub-topics, prerequisites, and detailed concepts.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 bg-[#DEB887] p-1 rounded-xl border border-[#C59B67] text-xs">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'tree' ? 'bg-[#8A2BE2] text-white shadow-2xs' : 'text-[#1A0F05] hover:text-[#8A2BE2]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Flowchart Tree</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#8A2BE2] text-white shadow-2xs' : 'text-[#1A0F05] hover:text-[#8A2BE2]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ADD8E6] p-3.5 rounded-xl border border-[#91c4d5] text-xs text-[#161512]">
          <span className="font-bold uppercase tracking-wider text-[11px]">Node Legend:</span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <span className="flex items-center space-x-1.5 text-[#8A2BE2]">
              <span className="w-3 h-3 rounded-md bg-[#8A2BE2] text-white flex items-center justify-center text-[9px] font-bold">✓</span>
              <span>Completed</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#1A0F05]">
              <span className="w-3 h-3 rounded-md bg-[#DEB887] border border-[#C59B67] animate-pulse"></span>
              <span>Day {currentDay} Active Focus</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#334155]">
              <span className="w-3 h-3 rounded-md bg-[#FFE4C4] border border-[#C59B67]"></span>
              <span>Upcoming Module</span>
            </span>
          </div>
        </div>

        {/* FLOWCHART TREE */}
        {viewMode === 'tree' ? (
          <div className="space-y-12 py-2">
            {phases.map((phase, pIdx) => (
              <div key={pIdx} className="space-y-6">
                
                {/* Phase Header */}
                <div className="flex items-center space-x-3">
                  <div className="px-3.5 py-1 rounded-full bg-[#8A2BE2] text-white font-bold text-xs shadow-2xs">
                    {phase.title}
                  </div>
                  <div className="flex-1 h-0.5 bg-[#E3C6A2]"></div>
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {phase.topics.map((topic) => {
                    const globalIdx = topics.findIndex(t => t.id === topic.id);
                    const isCompleted = completedTopicIds.includes(topic.id);
                    const isTodayActive = todayTopics.some(t => t.id === topic.id);

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopicNode(topic)}
                        className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                          isCompleted
                            ? 'bg-[#8A2BE2] text-white border-[#6b1cb9]'
                            : isTodayActive 
                            ? 'bg-[#DEB887] text-[#1A0F05] border-[#8A2BE2] ring-2 ring-[#8A2BE2]' 
                            : 'bg-[#ADD8E6] text-[#161512] border-[#91c4d5] hover:border-[#8A2BE2]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isCompleted ? 'bg-white/20 text-white' : 'bg-[#FFE4C4] text-[#1A0F05]'
                          }`}>
                            Node #{globalIdx + 1}
                          </span>

                          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                            isCompleted ? 'bg-white/20 text-white border-white/30' : 'bg-[#FFE4C4] text-[#1A0F05] border-[#C59B67]'
                          }`}>
                            ⏱ {topic.estMinutes}m
                          </span>
                        </div>

                        <h4 className="font-bold text-base flex items-center justify-between">
                          <span>{topic.title}</span>
                          <Info className="w-4 h-4 shrink-0 ml-2" />
                        </h4>

                        <p className={`text-xs leading-relaxed line-clamp-2 mt-1 ${isCompleted ? 'text-white/90' : 'text-[#3D2714]'}`}>
                          {topic.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between text-xs font-bold">
                          {isCompleted ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] bg-white text-[#8A2BE2] px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#8A2BE2]" />
                              <span>Completed</span>
                            </span>
                          ) : isTodayActive ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] bg-[#8A2BE2] text-white px-2.5 py-0.5 rounded-full animate-pulse">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Day {currentDay} Active Focus</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[11px] bg-[#FFE4C4] text-[#1A0F05] px-2.5 py-0.5 rounded-full">
                              <Lock className="w-3 h-3 text-[#5C4228]" />
                              <span>Queued</span>
                            </span>
                          )}

                          <span className="text-[11px] font-bold group-hover:underline flex items-center">
                            Inspect Concept <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#C59B67]">
            {topics.map((topic, index) => {
              const isCompleted = completedTopicIds.includes(topic.id);
              const isTodayActive = todayTopics.some(t => t.id === topic.id);

              return (
                <div key={topic.id} className="relative flex items-start space-x-4 group">
                  <div className={`absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#8A2BE2] text-white border-[#6b1cb9]'
                      : isTodayActive 
                      ? 'bg-[#DEB887] text-[#1A0F05] border-[#8A2BE2] ring-4 ring-[#FFE4C4]' 
                      : 'bg-[#ADD8E6] text-[#161512] border-[#91c4d5]'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                  </div>

                  <div 
                    onClick={() => setSelectedTopicNode(topic)}
                    className={`flex-1 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                      isCompleted
                        ? 'bg-[#8A2BE2] text-white border-[#6b1cb9]'
                        : isTodayActive 
                        ? 'bg-[#DEB887] text-[#1A0F05] border-[#C59B67]' 
                        : 'bg-[#ADD8E6] text-[#161512] border-[#91c4d5]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="font-bold text-base">
                        {topic.title}
                      </h4>
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border shrink-0 ${
                        isCompleted ? 'bg-white/20 text-white border-white/30' : 'bg-[#FFE4C4] text-[#1A0F05] border-[#C59B67]'
                      }`}>
                        ⏱ {topic.estMinutes} mins
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${isCompleted ? 'text-white/90' : 'text-[#3D2714]'}`}>
                      {topic.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="pt-6 border-t border-[#E3C6A2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onRegeneratePath}
            disabled={isLoading}
            className="text-xs text-[#5C4228] hover:text-[#1A0F05] font-bold underline underline-offset-4 cursor-pointer"
          >
            Re-generate Master Path via AI
          </button>

          {!isMasteryAchieved ? (
            <button
              onClick={onStartSession}
              disabled={todayTopics.length === 0}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Start Day {currentDay} Session (~{todayTotalMinutes} mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenCertificate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>🎓 View & Download Official Certificate</span>
            </button>
          )}
        </div>

      </div>

      {/* INTERACTIVE CONCEPT EXPLORER MODAL */}
      {selectedTopicNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFE4C4] rounded-2xl p-6 md:p-8 max-w-xl w-full border border-[#C59B67] space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedTopicNode(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#5C4228] hover:text-[#1A0F05] hover:bg-[#DEB887] transition-colors cursor-pointer font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#8A2BE2] text-white">
                  Concept Node Inspector
                </span>
                <span className="text-xs font-mono text-[#5C4228] font-bold">
                  ⏱ {selectedTopicNode.estMinutes} Mins Estimated
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A0F05]">
                {selectedTopicNode.title}
              </h3>
            </div>

            {/* Overview Description */}
            <div className="bg-[#DEB887] p-4 rounded-xl border border-[#C59B67] text-xs text-[#1A0F05] leading-relaxed space-y-2">
              <h4 className="font-bold text-[#8A2BE2] uppercase text-[10px] tracking-wider">
                Core Conceptual Breakdown
              </h4>
              <p className="font-semibold">{selectedTopicNode.description}</p>
            </div>

            {/* Sub-Topics Checklist */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#1A0F05] flex items-center space-x-1.5">
                <CornerDownRight className="w-4 h-4 text-[#8A2BE2]" />
                <span>Sub-topics & Key Pillars Covered:</span>
              </h4>
              
              <ul className="space-y-2 text-xs font-sans">
                <li className="flex items-start space-x-2 bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">
                  <CheckCircle2 className="w-4 h-4 text-[#8A2BE2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">1. Intuitive Metaphor & Analogy:</span>
                    <p className="text-[#334155] text-[11px] font-medium">Tied directly to your domain metaphor ({onboardingData?.domain || 'cooking'}).</p>
                  </div>
                </li>

                <li className="flex items-start space-x-2 bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">
                  <CheckCircle2 className="w-4 h-4 text-[#8A2BE2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">2. Explain-o-Meter Adaptability:</span>
                    <p className="text-[#334155] text-[11px] font-medium">From ELI5 zero-jargon up to Expert Senior Engineer mechanics.</p>
                  </div>
                </li>

                <li className="flex items-start space-x-2 bg-[#ADD8E6] p-3 rounded-xl border border-[#91c4d5] text-[#161512]">
                  <CheckCircle2 className="w-4 h-4 text-[#8A2BE2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">3. Active Recall Retention:</span>
                    <p className="text-[#334155] text-[11px] font-medium">3D flippable flashcard practice during your session recap.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E3C6A2] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedTopicNode(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#C59B67] bg-[#DEB887] text-[#1A0F05] font-bold text-xs hover:bg-[#cda06d] cursor-pointer"
              >
                Close Inspector
              </button>

              {!completedTopicIds.includes(selectedTopicNode.id) && (
                <button
                  onClick={() => {
                    setSelectedTopicNode(null);
                    onStartSession();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Start Lesson Node</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
