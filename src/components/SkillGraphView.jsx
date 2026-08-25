import React, { useState } from 'react';
import { GitBranch, Brain, Target, ArrowRight, Zap, Info, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SkillGraphView({ skills, onNavigate }) {
  const [selectedNode, setSelectedNode] = useState({
    id: "probability",
    name: "Probability",
    mastery: 42,
    role: "Bottleneck Node",
    whyMatters: "Probability is currently one of the biggest constraints on your Machine Learning readiness.",
    nextStep: "Probability Foundations"
  });

  const nodes = [
    { 
      id: "ai_engineering", 
      name: "AI Engineering", 
      mastery: 68, 
      type: "target", 
      whyMatters: "Overall Target Goal Readiness Benchmark across foundational and advanced skills.",
      nextStep: "Address Probability & Deep Learning bottlenecks." 
    },
    { 
      id: "python", 
      name: "Python", 
      mastery: 82, 
      type: "foundational", 
      whyMatters: "Strong foundational node supporting all scripting and data pipelines.",
      nextStep: "Maintain high retention via periodic checks." 
    },
    { 
      id: "statistics", 
      name: "Statistics", 
      mastery: 61, 
      type: "intermediate", 
      whyMatters: "Intermediate analytical foundation for statistical modeling and hypothesis testing.",
      nextStep: "Review distributions & variance." 
    },
    { 
      id: "ml", 
      name: "Machine Learning", 
      mastery: 64, 
      type: "core", 
      whyMatters: "Core prediction model concepts constrained by underlying probability fundamentals.",
      nextStep: "Complete Supervised Learning modules." 
    },
    { 
      id: "probability", 
      name: "Probability", 
      mastery: 42, 
      type: "bottleneck", 
      whyMatters: "Probability is currently one of the biggest constraints on your Machine Learning readiness.",
      nextStep: "Probability Foundations" 
    },
    { 
      id: "distributions", 
      name: "Distributions", 
      mastery: 68, 
      type: "intermediate", 
      whyMatters: "Normal, Gaussian, and Binomial distribution models for data analysis.",
      nextStep: "Practice distribution sampling." 
    },
    { 
      id: "deep_learning", 
      name: "Deep Learning", 
      mastery: 31, 
      type: "advanced", 
      whyMatters: "Neural networks & perceptrons requiring strong calculus and probability baselines.",
      nextStep: "PyTorch Basics & Activation Functions." 
    },
    { 
      id: "genai", 
      name: "Generative AI", 
      mastery: 24, 
      type: "advanced", 
      whyMatters: "Transformers, LLMs & RAG architecture requiring deep learning mastery.",
      nextStep: "Prompt Engineering & Vector DBs." 
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* EMPTY STATE FOR NEW USERS */}
      {(!skills || skills.length === 0) ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 md:p-16 text-center space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
            <GitBranch className="w-8 h-8 text-neutral-500" />
          </div>
          <h2 className="font-editorial text-3xl font-bold text-neutral-50">Your Skill Graph is Empty</h2>
          <p className="text-neutral-400 font-sans max-w-lg leading-relaxed text-sm">
            The AI Skill Graph visualizes your prerequisite node dependencies and tracks exactly what is bottlenecking your goals. It populates automatically as you learn.
          </p>
          <button 
            onClick={() => onNavigate('adaptive-quiz')} 
            className="bg-warning-600 hover:bg-warning-700 text-neutral-950 font-bold py-3.5 px-6 rounded-lg text-sm inline-flex items-center space-x-2 transition-colors cursor-pointer mt-4"
          >
            <Zap className="w-4 h-4"/> 
            <span>Take Initial Assessment to Populate Graph</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* HEADER */}
          <div className="text-neutral-50 rounded-lg p-6 md:p-8 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-accent-400" />
                <span className="text-xs px-3 py-1 rounded-full bg-warning-500/20 text-warning-300 font-semibold border border-warning-500/30">
                  Interactive 2D Knowledge Graph
                </span>
              </div>
              <h1 className="font-editorial text-3xl font-bold tracking-tight">
                AI Skill Graph Matrix
              </h1>
              <p className="text-xs text-neutral-300 font-sans">
                Visualize prerequisite node dependencies. Identify how weak foundational nodes bottleneck advanced target readiness.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-success-400"><span className="w-2.5 h-2.5 rounded-full bg-success-500"></span><span>Strong (&gt;75%)</span></span>
              <span className="flex items-center space-x-1 text-accent-400"><span className="w-2.5 h-2.5 rounded-full bg-warning-500"></span><span>Moderate (60-74%)</span></span>
              <span className="flex items-center space-x-1 text-error-400"><span className="w-2.5 h-2.5 rounded-full bg-error-500"></span><span>Bottleneck (&lt;60%)</span></span>
            </div>
          </div>

          {/* GRAPH CANVAS & NODE INSPECTOR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRAPH CANVAS */}
            <div className="lg:col-span-2 bg-neutral-950 rounded-lg p-6 border border-neutral-800 relative min-h-[420px] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

              {/* TREE STRUCTURE */}
              <div className="z-10 w-full space-y-8 text-center font-sans">
                
                {/* LEVEL 1: ROOT GOAL */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedNode(nodes.find(n => n.id === 'ai_engineering'))}
                    className={`px-6 py-3 rounded-lg border transition-all cursor-pointer font-bold text-sm flex items-center space-x-2 ${
                      selectedNode.id === 'ai_engineering' 
                        ? 'bg-warning-500 text-neutral-950 border-accent-400 scale-105' 
                        : 'bg-neutral-900 text-neutral-50 border-warning-500/50 hover:bg-neutral-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-accent-400 fill-amber-400" />
                    <span>AI ENGINEERING (68%)</span>
                  </button>
                </div>

                <div className="w-0.5 h-6 bg-neutral-700 mx-auto"></div>

                {/* LEVEL 2: CORE BRANCHES */}
                <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
                  {[
                    { id: 'python', name: 'Python', mastery: 82, status: 'Strong', borderColor: 'border-success-500/60', statusColor: 'text-success-400' },
                    { id: 'statistics', name: 'Statistics', mastery: 61, status: 'Moderate', borderColor: 'border-warning-500/60', statusColor: 'text-warning-400' },
                    { id: 'ml', name: 'ML', mastery: 64, status: 'Moderate', borderColor: 'border-warning-500/60', statusColor: 'text-warning-400' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNode(nodes.find(n => n.id === item.id))}
                      className={`p-3 rounded-lg border bg-neutral-900 transition-all cursor-pointer flex flex-col items-center justify-center ${item.borderColor} ${
                        selectedNode.id === item.id ? 'ring-2 ring-neutral-300 scale-105 ' : 'hover:bg-neutral-800'
                      }`}
                    >
                      <span className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${item.statusColor}`}>{item.status}</span>
                      <span className="text-xs font-medium text-neutral-300 block mb-0.5">{item.name}</span>
                      <span className="text-lg font-bold text-neutral-50">{item.mastery}%</span>
                    </button>
                  ))}
                </div>

                <div className="w-0.5 h-6 bg-neutral-700 mx-auto"></div>

                {/* LEVEL 3: SUB-NODES */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => setSelectedNode(nodes.find(n => n.id === 'probability'))}
                    className={`p-3 rounded-lg border bg-neutral-900 border-error-500/60 transition-all cursor-pointer flex flex-col items-center justify-center animate-pulse ${
                      selectedNode.id === 'probability' ? 'ring-2 ring-neutral-300 scale-105 ' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider mb-1 text-error-400">Bottleneck</span>
                    <span className="text-xs font-medium text-neutral-300 block mb-0.5">Probability</span>
                    <span className="text-lg font-bold text-neutral-50">42%</span>
                  </button>

                  <button
                    onClick={() => setSelectedNode(nodes.find(n => n.id === 'distributions'))}
                    className={`p-3 rounded-lg border bg-neutral-900 border-warning-500/60 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedNode.id === 'distributions' ? 'ring-2 ring-neutral-300 scale-105 ' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider mb-1 text-warning-400">Moderate</span>
                    <span className="text-xs font-medium text-neutral-300 block mb-0.5">Distributions</span>
                    <span className="text-lg font-bold text-neutral-50">68%</span>
                  </button>
                </div>

              </div>
            </div>

            {/* NODE DETAILS INSPECTOR PANEL */}
            <div className="bg-neutral-100 rounded-lg p-6 border border-neutral-200 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-800 bg-warning-50 px-3 py-1 rounded-full border border-warning-200">
                    Selected Skill Node
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    selectedNode.mastery < 60 ? 'bg-error-100 text-error-800' : 'bg-success-100 text-success-800'
                  }`}>
                    {selectedNode.mastery}% Mastery
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl font-bold text-neutral-900">{selectedNode.name}</h3>
                  <p className="text-xs text-neutral-600 font-sans mt-0.5">{selectedNode.role || 'Competency Node'}</p>
                </div>

                {/* WHY THIS MATTERS CALLOUT */}
                <div className="bg-warning-50/80 border border-warning-200 p-4 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-accent-950">
                    <Info className="w-4 h-4 text-warning-700" />
                    <span>WHY THIS MATTERS</span>
                  </div>
                  <p className="text-neutral-800 leading-relaxed font-medium">
                    "{selectedNode.whyMatters}"
                  </p>
                </div>

                {/* RECOMMENDED NEXT STEP */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block">Recommended Next Step:</span>
                  <p className="font-bold text-neutral-900 text-sm">{selectedNode.nextStep}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('adaptive-quiz')}
                className="w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-warning-700 text-neutral-50 font-bold py-3.5 px-6 rounded-lg text-xs transition-all cursor-pointer"
              >
                <span>Start Practice on {selectedNode.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
