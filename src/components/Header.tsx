import React from "react";
import { Compass, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

interface HeaderProps {
  score: number; // Awareness level score from 0 to 100
}

export default function Header({ score }: HeaderProps) {
  const getScoreColor = () => {
    if (score < 40) return "text-red-500 bg-red-950/40 border-red-900/50";
    if (score < 75) return "text-amber-500 bg-amber-950/40 border-amber-900/50";
    return "text-emerald-400 bg-emerald-950/40 border-emerald-900/50";
  };

  const getScoreLabel = () => {
    if (score < 40) return "غائب (في العجلة)";
    if (score < 75) return "متوسط (بداية الوعي)";
    return "ممتاز (مخطط ذكي)";
  };

  return (
    <header className="border-b border-forest-light/60 bg-forest-dark/80 backdrop-blur-md sticky top-0 z-40 px-4 py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 border-2 border-gold-dawn rotate-45 flex items-center justify-center shrink-0">
            <div className="w-5 h-5 border border-gold-dawn/70 flex items-center justify-center">
              <span className="text-[9px] -rotate-45 font-black text-gold-dawn font-mono">W</span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 -rotate-45">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tunisia-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tunisia-red"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-light tracking-wide text-white flex items-center gap-2">
              WAKE UP <span className="text-gold-dawn font-bold">TUNISIA</span>
              <span className="text-[10px] font-normal text-[#888888] bg-white/5 px-2 py-0.5 rounded-md border border-white/10 font-mono">v1.5</span>
            </h1>
            <p className="text-[10px] text-[#888888] font-medium">المنصة التفاعلية للوعي المالي وتغيير عقلية الركض اليومي</p>
          </div>
        </div>

        {/* Dynamic Poem Quote */}
        <div className="hidden lg:block text-center max-w-sm px-4 py-2 bg-forest-medium/40 border border-forest-light/30 rounded-xl">
          <p className="text-xs font-medium text-gold-light italic">
            "العَمَلُ الشَّاقُ دُونَ وَعْيٍ مَالِيٍّ، هُوَ كَمَنْ يَحْفِرُ بِئْرًا بِإِبْرَةٍ."
          </p>
        </div>

        {/* Financial Awareness Score */}
        <div className="flex items-center gap-3 bg-forest-medium/80 border border-forest-light/40 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">مؤشر وعيك المالي</div>
            <div className="text-sm font-black text-white flex items-center gap-1">
              <span>{score}%</span>
              <span className="text-[11px] text-white/60">({getScoreLabel()})</span>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-sm ${getScoreColor()}`}>
            {score < 40 ? <AlertTriangle className="w-5 h-5" /> : score < 75 ? <Compass className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </header>
  );
}
