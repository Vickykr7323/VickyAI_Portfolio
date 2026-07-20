import React, { useState } from "react";
import { ThemeId } from "@/types";
import { BookOpen, Layers, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
}

export default function ThemeSelector({ currentTheme, onChangeTheme }: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<ThemeId | null>(null);

  const themes: { 
    id: ThemeId; 
    name: string; 
    icon: any; 
    desc: string; 
  }[] = [
    {
      id: "minimal",
      name: "Minimal Clean",
      icon: Sparkles,
      desc: "Clean off-white canvas with dark slate text and high contrast sans-serif layout.",
    },
    {
      id: "glass",
      name: "Glassmorphism",
      icon: Layers,
      desc: "Modern twilight canvas featuring semi-transparent glass panel effects and neon purple highlights.",
    },
    {
      id: "developer",
      name: "Developer Dashboard",
      icon: Terminal,
      desc: "Cyberpunk developer terminal style with monospaced font, neon cyan borders, and code widgets.",
    },
    {
      id: "academic",
      name: "Academic Portfolio",
      icon: BookOpen,
      desc: "Traditional research style with serif print headers, elegant warm beige background, and cardinal red accents.",
    },
  ];

  const renderVisualPreview = (themeId: ThemeId) => {
    switch (themeId) {
      case "minimal":
        return (
          <div className="w-24 h-14 bg-[#FCFCFC] border border-neutral-200/80 rounded-md p-1.5 flex flex-col justify-between relative overflow-hidden mb-2 shadow-inner">
            <div className="bg-white border border-neutral-100 rounded-sm p-1 shadow-xs flex flex-col gap-1 h-full justify-center">
              <div className="h-1 w-10 bg-neutral-900 rounded-full" />
              <div className="h-0.5 w-14 bg-neutral-200 rounded-full" />
              <div className="h-0.5 w-8 bg-neutral-150 rounded-full" />
            </div>
          </div>
        );
      case "glass":
        return (
          <div className="w-24 h-14 bg-[#0B0816] rounded-md p-1.5 flex flex-col justify-between relative overflow-hidden mb-2 border border-slate-800 shadow-inner">
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-violet-500/20 blur-[4px]" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-indigo-500/10 blur-[3px]" />
            <div className="bg-white/5 border border-white/10 backdrop-blur-[1px] rounded-sm p-1 flex flex-col gap-1 h-full justify-center z-10 shadow-lg">
              <div className="h-1 w-10 bg-violet-400 rounded-full shadow-[0_0_4px_#a78bfa]" />
              <div className="h-0.5 w-14 bg-violet-300/40 rounded-full" />
              <div className="h-0.5 w-8 bg-violet-300/20 rounded-full" />
            </div>
          </div>
        );
      case "developer":
        return (
          <div className="w-24 h-14 bg-[#0F141C] border border-cyan-500/30 rounded-none p-1.5 flex flex-col justify-between relative overflow-hidden mb-2 font-mono shadow-inner">
            <div className="border border-cyan-500/20 bg-black/40 p-1 flex flex-col gap-1 h-full justify-center rounded-none">
              <div className="flex items-center gap-1">
                <span className="text-[5px] text-cyan-450 font-extrabold scale-75">&gt;_</span>
                <div className="h-1 w-12 bg-cyan-400/80 rounded-none" />
              </div>
              <div className="h-0.5 w-14 bg-cyan-500/30 rounded-none" />
              <div className="h-0.5 w-8 bg-cyan-500/15 rounded-none" />
            </div>
          </div>
        );
      case "academic":
        return (
          <div className="w-24 h-14 bg-[#FAF6EE] border border-[#D4C3A3] rounded-md p-1.5 flex flex-col justify-between relative overflow-hidden mb-2 font-serif shadow-inner">
            <div className="border border-[#E2D5BE] bg-white p-1 flex flex-col gap-0.5 h-full justify-center rounded-sm">
              <div className="h-1 w-10 bg-[#5C2D11]/80 rounded-none mx-auto" />
              <div className="border-t border-[#D4C3A3] my-0.5" />
              <div className="h-0.5 w-14 bg-[#5C2D11]/45 rounded-none" />
              <div className="h-0.5 w-10 bg-[#5C2D11]/30 rounded-none" />
            </div>
          </div>
        );
    }
  };

  const getTooltipAlignment = (themeId: ThemeId) => {
    switch (themeId) {
      case "minimal":
        return {
          body: "left-1/2 -translate-x-[20%] -ml-6",
          arrow: "left-[30%]"
        };
      case "glass":
        return {
          body: "left-1/2 -translate-x-[40%] -ml-6",
          arrow: "left-[45%]"
        };
      case "developer":
        return {
          body: "left-1/2 -translate-x-[60%] -ml-6",
          arrow: "left-[60%]"
        };
      case "academic":
      default:
        return {
          body: "left-1/2 -translate-x-[80%] -ml-6",
          arrow: "left-[75%]"
        };
    }
  };

  const getContainerStyles = () => {
    switch (currentTheme) {
      case "glass":
        return "bg-slate-950/80 border-slate-800/80 shadow-2xl text-violet-400 ring-1 ring-violet-500/10";
      case "developer":
        return "bg-slate-900 border-cyan-500/50 shadow-md text-cyan-400 font-mono";
      case "academic":
        return "bg-[#FAF6EE] border-[#D4C3A3] shadow-md text-[#5C2D11] ring-1 ring-[#5C2D11]/10 font-serif";
      case "minimal":
      default:
        return "bg-white border-neutral-200 shadow-sm text-neutral-800";
    }
  };

  const getDynamicButtonStyle = (themeId: ThemeId, isActive: boolean) => {
    switch (currentTheme) {
      case "glass":
        return isActive
          ? "bg-violet-600 text-white border border-violet-400 font-bold shadow-[0_0_15px_rgba(139,92,246,0.6)]"
          : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-violet-950/20";
      case "developer":
        return isActive
          ? "bg-cyan-500 text-black border border-cyan-400 font-bold font-mono shadow-[0_0_12px_rgba(0,229,255,0.8)]"
          : "bg-slate-950 text-cyan-400/60 border border-slate-800 hover:text-cyan-400 hover:bg-cyan-950/20 font-mono";
      case "academic":
        return isActive
          ? "bg-[#7F1D1D] text-white border border-[#5A1010] font-semibold shadow-xs rounded-md"
          : "bg-[#FAF6EE] text-[#5C2D11]/70 border border-[#D4C3A3]/60 hover:text-[#7F1D1D] hover:bg-[#FAF0D9] rounded-md";
      case "minimal":
      default:
        return isActive
          ? "bg-neutral-950 text-white font-semibold shadow-xs rounded-full"
          : "bg-white text-neutral-500 border border-neutral-200 hover:text-neutral-950 hover:bg-neutral-50 rounded-full";
    }
  };

  const getTooltipStyles = () => {
    switch (currentTheme) {
      case "glass":
        return "bg-slate-950 text-white border border-violet-500/30";
      case "developer":
        return "bg-slate-900 text-cyan-400 border border-cyan-500/50 font-mono";
      case "academic":
        return "bg-[#7F1D1D] text-white border border-[#5A1010] font-serif";
      case "minimal":
      default:
        return "bg-neutral-950 text-white font-sans";
    }
  };

  const getArrowStyles = () => {
    switch (currentTheme) {
      case "glass":
        return "bg-slate-950 border-b border-r border-violet-500/30";
      case "developer":
        return "bg-slate-900 border-b border-r border-cyan-500/50";
      case "academic":
        return "bg-[#7F1D1D] border-b border-r border-[#5A1010]";
      case "minimal":
      default:
        return "bg-neutral-900";
    }
  };

  const getContainerPadding = () => {
    if (currentTheme === "developer") return "p-1 rounded-none";
    if (currentTheme === "academic") return "p-1 rounded-lg";
    return "p-1.5 rounded-full";
  };

  return (
    <div 
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[100] flex items-center border backdrop-blur-md transition-all duration-300 ${getContainerStyles()} ${getContainerPadding()}`}
      id="floating-theme-selector"
    >
      <div className="flex items-center gap-1.5">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = currentTheme === t.id;
          const btnClass = getDynamicButtonStyle(t.id, isActive);
          const alignment = getTooltipAlignment(t.id);
          return (
            <div 
              key={t.id} 
              className="relative group"
              onMouseEnter={() => setHoveredTheme(t.id)}
              onMouseLeave={() => setHoveredTheme(null)}
            >
              <button
                id={`theme-btn-${t.id}`}
                onClick={() => onChangeTheme(t.id)}
                className={`w-9 h-9 flex items-center justify-center transition-all duration-300 ${btnClass} ${isActive ? "scale-105 z-10" : "scale-90"}`}
                aria-label={`Switch to ${t.name}`}
              >
                <Icon className="w-4 h-4" />
              </button>
              
              {/* Elegant floating tooltip with layout shift preview */}
              <AnimatePresence>
                {hoveredTheme === t.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`absolute bottom-12 ${alignment.body} w-48 pointer-events-none text-[10px] font-bold p-2.5 rounded-lg shadow-xl z-[110] flex flex-col items-center text-center border ${getTooltipStyles()}`}
                    style={{ originX: 0.5, originY: 1 }}
                  >
                    {renderVisualPreview(t.id)}
                    <span className="font-extrabold">{t.name}</span>
                    <span className="text-[8.5px] opacity-80 font-normal mt-0.5 leading-tight">{t.desc}</span>
                    {/* Micro tooltip arrow */}
                    <div className={`w-1.5 h-1.5 rotate-45 absolute -bottom-0.75 ${alignment.arrow} -translate-x-1/2 ${getArrowStyles()}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
