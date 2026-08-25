import React from 'react';
import { Home, BookOpen, Bot, PenTool, BarChart3, User } from 'lucide-react';

export default function BottomNav({ activeView, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'learn-catalog', label: 'Learn', icon: BookOpen },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, isHighlight: true },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800 backdrop-blur-md px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
                aria-label={item.label}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 ring-4 ring-amber-500/30'
                    : 'bg-neutral-800 text-amber-400 border border-neutral-700'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? 'text-amber-400' : 'text-neutral-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[48px] cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold bg-neutral-800/80'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
