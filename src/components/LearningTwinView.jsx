import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Sparkles, Flame, Clock, Target, CheckCircle2, AlertCircle, XCircle, 
  HelpCircle, ArrowLeft, RefreshCcw, Sliders, ChevronRight, Zap
} from 'lucide-react';

export default function LearningTwinView({
  studentProfile,
  skills,
  onGoBack,
  onNavigate
}) {
  const canvasRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState(studentProfile.preferredStyle || "Visual + Examples");

  const strongSkills = skills.filter(s => s.mastery >= 75);
  const weakSkills = skills.filter(s => s.mastery < 70 || s.retention < 60);

  // PROCEDURAL CANVAS BRAIN VISUALIZATION
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth || 500);
    const height = (canvas.height = canvas.offsetHeight || 300);

    // Nodes mapped around a central Brain Core
    const nodes = skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 90 + (index % 2) * 20;
      return {
        id: skill.id,
        name: skill.name,
        mastery: skill.mastery,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        angle
      };
    });

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulse += 0.03;

      // Draw central Brain Core
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 28 + Math.sin(pulse) * 3, 0, Math.PI * 2);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f59e0b';

      // Central brain label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TWIN CORE', width / 2, height / 2 + 4);
      ctx.shadowBlur = 0;

      // Draw connections & nodes
      nodes.forEach((node, i) => {
        // Floating motion
        node.x += Math.cos(pulse + i) * 0.3;
        node.y += Math.sin(pulse + i) * 0.3;

        // Line to core
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.mastery >= 75 ? 'rgba(16, 185, 129, 0.4)' : node.mastery >= 50 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node circle
        const nodeRadius = 14 + (node.mastery / 100) * 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        
        if (node.mastery >= 75) {
          ctx.fillStyle = '#10b981';
        } else if (node.mastery >= 50) {
          ctx.fillStyle = '#f59e0b';
        } else {
          ctx.fillStyle = '#f43f5e';
        }
        ctx.fill();

        // Node label
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${node.name.split(' ')[0]} (${node.mastery}%)`, node.x, node.y + nodeRadius + 12);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [skills]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-stone-100 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button 
              onClick={onGoBack} 
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Continuously Updated Learning Profile
            </span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold tracking-tight text-white">
            AI Learning Twin Dashboard
          </h1>
          <p className="text-xs text-stone-300 font-sans max-w-xl">
            Your Learning Twin models your cognitive state in real time: tracking mastery speed, retention decay risk, error patterns, and optimal explanation preferences.
          </p>
        </div>

        <button
          onClick={() => onNavigate('adaptive-quiz')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0 flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Update Twin via Quiz</span>
        </button>
      </div>

      {/* TOP STATS DASHBOARD GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* OVERALL MASTERY */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Overall Mastery</span>
          <div className="text-3xl font-bold text-stone-900 font-sans">{studentProfile.mastery}%</div>
          <span className="text-[11px] text-emerald-700 font-medium">↑ Dynamic calculation</span>
        </div>

        {/* LEARNING SPEED */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Learning Speed</span>
          <div className="text-3xl font-bold text-amber-700 font-sans">{studentProfile.learningSpeed}</div>
          <span className="text-[11px] text-stone-500">Pace index</span>
        </div>

        {/* RETENTION % */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Retention Score</span>
          <div className="text-3xl font-bold text-emerald-700 font-sans">{studentProfile.retention}%</div>
          <span className="text-[11px] text-stone-500">Memory retention</span>
        </div>

        {/* CONFIDENCE % */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Confidence</span>
          <div className="text-3xl font-bold text-indigo-700 font-sans">{studentProfile.confidence}%</div>
          <span className="text-[11px] text-stone-500">Self-assessment</span>
        </div>

      </div>

      {/* PROCEDURAL LEARNING BRAIN & COGNITIVE PROFILE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BRAIN CANVAS CARD (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-amber-700" />
              <h2 className="font-editorial text-xl font-bold text-stone-900">
                Cognitive State Matrix ("Learning Brain")
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono-code">
              Procedural Node Visualizer
            </span>
          </div>

          <p className="text-xs text-stone-600 font-sans">
            Visual map of skill node mastery. Nodes shift color (Emerald = Mastered, Amber = Moderate, Rose = Vulnerable) and pulse based on real-time activity.
          </p>

          <div className="w-full h-64 bg-stone-50 rounded-2xl border border-stone-200 relative overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>

        {/* PREFERRED EXPLANATION STYLE & TOLERANCE */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="font-editorial text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              <span>Preferred Explanation Style</span>
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              Tailors AI responses across lessons and doubt resolutions.
            </p>
          </div>

          <div className="space-y-2">
            {[
              "Visual + Examples",
              "Simple Analogy Mode",
              "Technical / Engineering",
              "Socratic Questioning"
            ].map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedStyle === style
                    ? 'bg-amber-500/15 border-amber-600 text-amber-950 font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{style}</span>
                {selectedStyle === style && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-700 font-medium">
              <span>Difficulty Tolerance:</span>
              <strong className="text-stone-900">{studentProfile.difficultyTolerance}</strong>
            </div>
            <div className="flex justify-between text-stone-700 font-medium">
              <span>Avg Response Time:</span>
              <strong className="text-stone-900">{studentProfile.avgResponseTime} seconds</strong>
            </div>
          </div>
        </div>

      </div>

      {/* STRONG VS WEAK CONCEPTS & RECENT MISTAKES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STRONG CONCEPTS */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-editorial text-lg font-bold">Strong Concepts</h3>
          </div>
          <ul className="space-y-2 text-xs font-sans">
            {strongSkills.map(sk => (
              <li key={sk.id} className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <span className="font-bold text-stone-800">{sk.name}</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold text-[11px]">{sk.mastery}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* NEEDS ATTENTION */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-rose-950">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h3 className="font-editorial text-lg font-bold">Needs Attention</h3>
          </div>
          <ul className="space-y-2 text-xs font-sans">
            {weakSkills.map(sk => (
              <li key={sk.id} className="bg-white p-3 rounded-xl border border-rose-200 flex justify-between items-center">
                <span className="font-bold text-stone-800">{sk.name}</span>
                <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold text-[11px]">{sk.mastery}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RECENT MISTAKES LOG */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-amber-950">
            <XCircle className="w-5 h-5 text-amber-700" />
            <h3 className="font-editorial text-lg font-bold">Recent Mistakes Log</h3>
          </div>
          <div className="space-y-2 text-xs font-sans">
            {studentProfile.recentMistakes.map((m, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>{m.topic}</span>
                  <span className="text-[10px] text-stone-400 font-normal">{m.timestamp}</span>
                </div>
                <p className="text-[11px] text-stone-600 italic">"{m.mistake}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
