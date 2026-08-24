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
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Interactive 2D Knowledge Graph
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight">
            AI Skill Graph Matrix
          </h1>
          <p className="text-xs text-stone-300 font-sans">
            Visualize prerequisite node dependencies. Identify how weak foundational nodes bottleneck advanced target readiness.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Strong (&gt;75%)</span></span>
          <span className="flex items-center space-x-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Moderate (60-74%)</span></span>
          <span className="flex items-center space-x-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Bottleneck (&lt;60%)</span></span>
        </div>
      </div>

      {/* GRAPH CANVAS & NODE INSPECTOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH CANVAS */}
        <div className="lg:col-span-2 bg-stone-950 rounded-3xl p-6 border border-stone-800 shadow-xl relative min-h-[420px] flex flex-col items-center justify-center overflow-hidden">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

          {/* TREE STRUCTURE */}
          <div className="z-10 w-full space-y-8 text-center font-sans">
            
            {/* LEVEL 1: ROOT GOAL */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'ai_engineering'))}
                className={`px-6 py-3 rounded-2xl border transition-all cursor-pointer font-bold text-sm flex items-center space-x-2 ${
                  selectedNode.id === 'ai_engineering' 
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg scale-105' 
                    : 'bg-stone-900 text-white border-amber-500/50 hover:bg-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>AI ENGINEERING (68%)</span>
              </button>
            </div>

            {/* CONNECTING LINE */}
            <div className="w-0.5 h-6 bg-stone-700 mx-auto"></div>

            {/* LEVEL 2: CORE BRANCHES */}
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { id: 'python', name: 'Python', mastery: 82, color: 'text-emerald-400 border-emerald-600 bg-emerald-950/60' },
                { id: 'statistics', name: 'Statistics', mastery: 61, color: 'text-amber-400 border-amber-600 bg-amber-950/60' },
                { id: 'ml', name: 'ML', mastery: 64, color: 'text-amber-400 border-amber-600 bg-amber-950/60' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedNode(nodes.find(n => n.id === item.id))}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs font-bold ${item.color} ${
                    selectedNode.id === item.id ? 'ring-2 ring-amber-400 scale-105 shadow-md' : 'hover:opacity-90'
                  }`}
                >
                  <span className="block">{item.name}</span>
                  <span className="text-sm font-extrabold">{item.mastery}%</span>
                </button>
              ))}
            </div>

            {/* CONNECTING LINE FROM STATISTICS */}
            <div className="w-0.5 h-6 bg-stone-700 mx-auto"></div>

            {/* LEVEL 3: SUB-NODES */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'probability'))}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs font-bold bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse ${
                  selectedNode.id === 'probability' ? 'ring-2 ring-rose-400 scale-105 shadow-xl' : 'hover:opacity-90'
                }`}
              >
                <span className="block">Probability</span>
                <span className="text-sm font-extrabold text-white">42% (Bottleneck)</span>
              </button>

              <button
                onClick={() => setSelectedNode(nodes.find(n => n.id === 'distributions'))}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs font-bold bg-amber-950/60 border-amber-600 text-amber-300 ${
                  selectedNode.id === 'distributions' ? 'ring-2 ring-amber-400 scale-105 shadow-md' : 'hover:opacity-90'
                }`}
              >
                <span className="block">Distributions</span>
                <span className="text-sm font-extrabold text-white">68%</span>
              </button>
            </div>

          </div>

        </div>

        {/* NODE DETAILS INSPECTOR PANEL */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Selected Skill Node
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                selectedNode.mastery < 60 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedNode.mastery}% Mastery
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900">{selectedNode.name}</h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">{selectedNode.role || 'Competency Node'}</p>
            </div>

            {/* WHY THIS MATTERS CALLOUT */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                <Info className="w-4 h-4 text-amber-700" />
                <span>WHY THIS MATTERS</span>
              </div>
              <p className="text-stone-800 leading-relaxed font-medium">
                "{selectedNode.whyMatters}"
              </p>
            </div>

            {/* RECOMMENDED NEXT STEP */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Recommended Next Step:</span>
              <p className="font-bold text-stone-900 text-sm">{selectedNode.nextStep}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('adaptive-quiz')}
            className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
          >
            <span>Start Practice on {selectedNode.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
