import React, { useState } from "react";
import { ThemeId } from "@/types";
import { EXPERIENCES } from "../data";
import { Briefcase, GraduationCap, Award, Calendar, CheckCircle2, Clock, Map, TrendingUp } from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { playAudioCue } from "@/utils/audio";
import { calculateReadingTime } from "@/utils/readingTime";
import { AnimatePresence, motion } from "motion/react";
import CareerRoadmap from "./CareerRoadmap";

interface ExperienceProps {
  currentTheme: ThemeId;
}

export default function Experience({ currentTheme }: ExperienceProps) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "chronicle">("roadmap");

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          line: "border-cyan-500/50",
          bullet: "bg-cyan-500 text-black border-2 border-black rounded-none",
          badge: "bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-2 py-0.5 text-xs rounded-none",
          subtext: "text-neutral-400",
          itemCard: "bg-black border border-cyan-500/40 p-4 rounded-none",
          textTitle: "text-cyan-400",
          textPrimary: "text-white font-bold",
          textSecondary: "text-neutral-200",
          textMuted: "text-neutral-400",
          textHover: "group-hover:text-cyan-400",
          border: "border-cyan-500/30",
          iconColor: "text-cyan-400",
          tabsContainer: "flex items-center gap-1.5 bg-cyan-950/20 p-1 border border-cyan-500/20 rounded-none",
          tabActive: "bg-cyan-500 text-black px-3 py-1 font-bold font-mono text-xs rounded-none transition-all cursor-pointer",
          tabInactive: "text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10 px-3 py-1 font-mono text-xs rounded-none transition-all cursor-pointer"
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          line: "border-violet-900/30",
          bullet: "bg-violet-600 text-white border-2 border-violet-500 rounded-full shadow-lg shadow-violet-500/20",
          badge: "bg-violet-950/40 border border-violet-800/30 text-violet-300 px-2.5 py-0.5 text-xs rounded-full",
          subtext: "text-slate-400",
          itemCard: "bg-[#1A1333]/40 border border-white/5 hover:border-violet-500/30 transition-all p-5 rounded-xl",
          textTitle: "text-white",
          textPrimary: "text-slate-100",
          textSecondary: "text-slate-300",
          textMuted: "text-slate-400",
          textHover: "group-hover:text-violet-400",
          border: "border-white/5",
          iconColor: "text-violet-500",
          tabsContainer: "flex items-center gap-1.5 bg-slate-950/50 border border-white/10 p-1 rounded-full",
          tabActive: "bg-violet-600 text-white px-4 py-1.5 font-semibold text-xs rounded-full shadow-md shadow-violet-500/20 transition-all cursor-pointer",
          tabInactive: "text-slate-400 hover:text-white px-4 py-1.5 text-xs rounded-full transition-all cursor-pointer"
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-200 text-neutral-850 rounded-3xl p-6 shadow-xs font-sans",
          line: "border-neutral-200",
          bullet: "bg-neutral-950 text-white border-2 border-white rounded-full shadow-xs",
          badge: "bg-neutral-50 border border-neutral-250 text-neutral-900 px-3 py-1 text-xs rounded-full font-bold",
          subtext: "text-neutral-500",
          itemCard: "bg-white border border-neutral-150 hover:border-neutral-950 transition-all p-5 rounded-2xl shadow-3xs",
          textTitle: "text-black font-extrabold",
          textPrimary: "text-black font-bold",
          textSecondary: "text-neutral-700 font-medium",
          textMuted: "text-neutral-500",
          textHover: "group-hover:text-black",
          border: "border-neutral-200/50",
          iconColor: "text-neutral-900",
          tabsContainer: "flex items-center gap-1 bg-neutral-100 p-1 rounded-full border border-neutral-200/60",
          tabActive: "bg-neutral-950 text-white px-4 py-1.5 font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer",
          tabInactive: "text-neutral-600 hover:text-neutral-950 px-4 py-1.5 text-xs rounded-full transition-all cursor-pointer"
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          line: "border-[#D4C3A3]/50",
          bullet: "bg-[#7F1D1D] text-white border-2 border-[#FAF6EE] rounded-md shadow-sm",
          badge: "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] px-2.5 py-0.5 text-xs rounded-md font-bold",
          subtext: "text-[#5C4533]",
          itemCard: "bg-[#FAF6EE] border border-[#D4C3A3]/60 hover:border-[#7F1D1D] hover:shadow-xs transition-all p-5 rounded-md",
          textTitle: "text-[#5A1010] font-bold font-serif",
          textPrimary: "text-[#5A1010] font-bold font-serif",
          textSecondary: "text-[#4A3B32] font-serif",
          textMuted: "text-[#5C4533] font-serif",
          textHover: "group-hover:text-[#7F1D1D]",
          border: "border-[#D4C3A3]/30",
          iconColor: "text-[#7F1D1D]",
          tabsContainer: "flex items-center gap-1 bg-[#FAF6EE] border border-[#D4C3A3]/60 p-1 rounded-lg",
          tabActive: "bg-[#7F1D1D] text-white px-3.5 py-1.5 font-semibold text-xs rounded-md shadow-xs transition-all cursor-pointer",
          tabInactive: "text-[#5C2D11]/70 hover:text-[#7F1D1D] hover:bg-[#FAF0D9] px-3.5 py-1.5 text-xs rounded-md transition-all cursor-pointer"
        };
    }
  };

  const styles = getThemeStyles();

  const getIcon = (type: "teaching" | "placement" | "internship") => {
    switch (type) {
      case "teaching":
        return <GraduationCap className="w-4 h-4" />;
      case "placement":
        return <Award className="w-4 h-4" />;
      case "internship":
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-6 depth-card-3d z-index-10 cursor-pointer ${styles.card}`}
    >
      <div className={`border-b pb-4 ${styles.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 text-3d-lift cursor-pointer ${styles.textTitle}`}>
            <Briefcase className={`w-5 h-5 ${styles.iconColor}`} />
            Professional Career Timeline
          </h2>
          <p className={`text-sm mt-1 ${styles.textMuted}`}>
            Explore Vicky's academic teaching, placement department responsibilities, and industry software development internships.
          </p>
        </div>

        {/* Tab Controls to switch modes */}
        <div className={styles.tabsContainer}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playAudioCue("nav-click");
              setActiveTab("roadmap");
            }}
            className={activeTab === "roadmap" ? styles.tabActive : styles.tabInactive}
          >
            <span className="flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" />
              Career Roadmap
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playAudioCue("nav-click");
              setActiveTab("chronicle");
            }}
            className={activeTab === "chronicle" ? styles.tabActive : styles.tabInactive}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Detailed Chronicle
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="w-full"
        >
          {activeTab === "roadmap" ? (
            <CareerRoadmap currentTheme={currentTheme} />
          ) : (
            <StaggerContainer className="relative border-l pl-6 ml-3 space-y-8 flex flex-col animate-none" style={{ borderColor: currentTheme === "developer" ? "#06b6d4" : undefined }}>
              {EXPERIENCES.map((exp, index) => {
                const readingTime = calculateReadingTime(exp.description, exp.highlights);
                return (
                  <div key={index} className="relative group">
                     {/* Bullet node on timeline */}
                    <div className={`absolute -left-10 top-1.5 p-1.5 z-10 ${styles.bullet}`}>
                      {getIcon(exp.type)}
                    </div>
       
                    {/* Item Card Content */}
                    <div className={`flex flex-col gap-3 ${styles.itemCard}`}>
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 ${styles.border}`}>
                        <div className="flex flex-col">
                          <h3 className={`text-base font-bold transition-colors ${styles.textPrimary} ${styles.textHover}`}>
                            {exp.role}
                          </h3>
                          <span className={`text-xs font-semibold mt-0.5 ${styles.textMuted}`}>
                            {exp.organization}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                          <span className={styles.badge}>{exp.period}</span>
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${styles.subtext}`} title="Estimated deep-dive reading time">
                            <Clock className="w-3 h-3" />
                            {readingTime.label}
                          </span>
                        </div>
                      </div>
       
                      <p className={`text-xs sm:text-sm leading-relaxed ${styles.textSecondary}`}>
                        {exp.description}
                      </p>
       
                      {/* Highlights list */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${styles.textMuted}`}>
                          Key Contributions & Achievements:
                        </span>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                          {exp.highlights.map((high, idx) => (
                            <li key={idx} className={`flex items-start gap-2 text-xs ${styles.textSecondary}`}>
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
                              <span className="leading-snug">{high}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerContainer>
          )}
        </motion.div>
      </AnimatePresence>
    </StaggerContainer>
  );
}
