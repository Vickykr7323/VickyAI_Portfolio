import React, { useState, useRef } from "react";
import { ImageSlots, ThemeId } from "@/types";
import { PROJECTS, VICKY_INFO } from "../data";
import { FolderGit2, Cpu, Sparkles, Check, Send, AlertCircle, RefreshCw, Zap, Clock } from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { playAudioCue } from "@/utils/audio";
import { calculateReadingTime } from "@/utils/readingTime";

interface ProjectsProps {
  images: ImageSlots;
  currentTheme: ThemeId;
  selectedProjectId?: string | null;
  onClearSelectedProject?: () => void;
}

export default function Projects({ 
  images, 
  currentTheme,
  selectedProjectId = null,
  onClearSelectedProject
}: ProjectsProps) {
  const isPlaceholder = images.casual.startsWith("<svg") || images.casual.startsWith("data:image/svg");



  React.useEffect(() => {
    if (selectedProjectId) {
      setTimeout(() => {
        const el = document.getElementById(`project-${selectedProjectId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    }
  }, [selectedProjectId]);

  // AI Match Simulator state
  const [resumeExtract, setResumeExtract] = useState("Fresh MCA Graduate skilled in JavaScript, React, Node.js, Express, MongoDB, and Data Structures. Experienced in C++ and Python.");
  const [jobRequirement, setJobRequirement] = useState("Looking for a MERN Stack developer intern with strong understanding of React components, Express REST APIs, and MongoDB schema design. Knowledge of Data Structures is a plus.");
  const [simulating, setSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>({
    score: 88,
    matchedKeywords: ["React", "Node.js", "Express", "MongoDB", "Data Structures", "JavaScript"],
    missingKeywords: ["REST API design"],
    feedback: "Exceptional match! The student possesses 90% of your required technology stack, especially core full-stack web and logical computer science fundamentals.",
  });

  const runSimulation = () => {
    setSimulating(true);
    setMatchResult(null);
    setTimeout(() => {
      // Basic match engine calculation
      const resume = resumeExtract.toLowerCase();
      const job = jobRequirement.toLowerCase();
      const allKeywords = [
        "react", "node", "express", "mongodb", "javascript", "python", "java", "c++", "data structures", "dsa", "sql", "api"
      ];
      
      const foundInJob = allKeywords.filter(k => job.includes(k));
      const matched = foundInJob.filter(k => resume.includes(k));
      const missing = foundInJob.filter(k => !resume.includes(k));

      let score = 50;
      if (foundInJob.length > 0) {
        score = Math.round((matched.length / foundInJob.length) * 100);
      }

      setMatchResult({
        score: score || 70,
        matchedKeywords: matched.map(k => k.toUpperCase()),
        missingKeywords: missing.length > 0 ? missing.map(k => k.toUpperCase()) : ["NONE IDENTIFIED"],
        feedback: score > 80 
          ? "Highly recommended candidate! Excellent alignment across main tech frameworks and software principles."
          : score > 60 
          ? "Good match potential. May require quick training on missing components before active production deployment."
          : "Moderate alignment. Suggest reviewing foundational prerequisites."
      });
      setSimulating(false);
    }, 1500);
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          innerCard: "bg-black border border-cyan-500/50 p-4 rounded-none",
          btn: "bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-none flex items-center gap-1.5",
          imgFrame: "border border-cyan-500 rounded-none p-1",
          badge: "border border-cyan-500 text-cyan-400 px-2 py-0.5 text-[10px] rounded-none font-bold flex items-center gap-1 bg-cyan-500/10",
          textTitle: "text-cyan-400",
          textPrimary: "text-white font-bold",
          textSecondary: "text-neutral-200",
          textMuted: "text-neutral-400",
          border: "border-cyan-500/30",
          iconColor: "text-cyan-400",
          simCard: "border-2 border-cyan-500 bg-black p-5 rounded-none flex flex-col gap-4 font-mono text-cyan-400",
          simInput: "text-xs border border-cyan-500 bg-black text-neutral-100 rounded-none p-2 h-16 outline-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-cyan-500/30",
          simResult: "bg-black border border-cyan-500 rounded-none p-4 flex flex-col gap-3 text-neutral-100",
          simTitle: "text-xs font-bold text-cyan-400 flex items-center gap-1",
          simDesc: "text-[10px] text-neutral-300 leading-relaxed",
          simLabel: "text-[10px] font-bold text-neutral-400 mb-1"
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          innerCard: "bg-[#1A1333]/40 border border-white/5 p-4 rounded-lg",
          btn: "bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-violet-600/20 flex items-center gap-1.5",
          imgFrame: "bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 rounded-lg",
          badge: "bg-violet-950/40 border border-violet-800/30 text-violet-300 px-2.5 py-1 text-[10px] sm:text-xs rounded-full flex items-center gap-1",
          textTitle: "text-white",
          textPrimary: "text-slate-100",
          textSecondary: "text-slate-300",
          textMuted: "text-slate-400",
          border: "border-white/10",
          iconColor: "text-violet-500",
          simCard: "border border-white/10 bg-[#1A1333]/40 p-5 rounded-xl flex flex-col gap-4 text-white",
          simInput: "text-xs border border-white/10 bg-[#0F0A1F] text-white rounded-lg p-2 h-16 outline-violet-500 focus:ring-1 focus:ring-violet-500",
          simResult: "bg-[#140E26] border border-white/10 rounded-lg p-4 flex flex-col gap-3",
          simTitle: "text-xs font-bold text-white flex items-center gap-1",
          simDesc: "text-[10px] text-slate-400 leading-relaxed",
          simLabel: "text-[10px] font-bold text-slate-400 mb-1"
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-200 text-neutral-850 rounded-3xl p-6 shadow-xs font-sans",
          innerCard: "bg-white border border-neutral-150 p-5 rounded-2xl shadow-3xs",
          btn: "bg-neutral-950 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold shadow-xs flex items-center gap-1.5",
          imgFrame: "bg-white border border-neutral-200 p-2 rounded-2xl",
          badge: "bg-neutral-50 border border-neutral-250 text-neutral-900 px-3 py-1 text-[10px] sm:text-xs rounded-full font-bold flex items-center gap-1",
          textTitle: "text-black font-extrabold",
          textPrimary: "text-black font-bold",
          textSecondary: "text-neutral-700 font-medium",
          textMuted: "text-neutral-500",
          border: "border-neutral-200/50",
          iconColor: "text-neutral-900",
          simCard: "border border-neutral-200 bg-neutral-50/20 p-5 rounded-2xl flex flex-col gap-4 shadow-3xs",
          simInput: "text-xs border border-neutral-250 bg-white text-neutral-800 rounded-xl p-2 h-16 outline-neutral-900 focus:ring-1 focus:ring-neutral-900",
          simResult: "bg-white border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 shadow-3xs",
          simTitle: "text-xs font-extrabold text-neutral-900 flex items-center gap-1",
          simDesc: "text-[10px] text-neutral-600 leading-relaxed font-medium",
          simLabel: "text-[10px] font-bold text-neutral-500 mb-1"
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          innerCard: "bg-[#FAF6EE] border border-[#D4C3A3]/60 p-4 rounded-md shadow-sm",
          btn: "bg-[#7F1D1D] hover:bg-[#5A1010] text-white px-4 py-2 rounded-md font-medium flex items-center gap-1.5 shadow-xs transition-colors duration-200 font-serif",
          imgFrame: "bg-[#FAF6EE] border border-[#D4C3A3] p-1 rounded-md shadow-sm",
          badge: "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] px-2.5 py-1 text-[10px] sm:text-xs rounded-md font-bold flex items-center gap-1",
          textTitle: "text-[#5A1010] font-bold font-serif",
          textPrimary: "text-[#5A1010] font-bold font-serif",
          textSecondary: "text-[#4A3B32] font-serif",
          textMuted: "text-[#5C4533] font-serif",
          border: "border-[#D4C3A3]/30",
          iconColor: "text-[#7F1D1D]",
          simCard: "border border-[#D4C3A3]/60 bg-[#FAF6EE]/50 p-5 rounded-lg flex flex-col gap-4 shadow-sm",
          simInput: "text-xs border border-[#D4C3A3] bg-white text-[#2A1E17] rounded-md p-2 h-16 outline-[#7F1D1D] focus:ring-1 focus:ring-[#7F1D1D] font-serif",
          simResult: "bg-white border border-[#D4C3A3]/50 rounded-md p-4 flex flex-col gap-3 shadow-2xs font-serif",
          simTitle: "text-xs font-bold text-[#5A1010] flex items-center gap-1 font-serif",
          simDesc: "text-[10px] text-[#4A3B32] leading-relaxed font-serif",
          simLabel: "text-[10px] font-bold text-[#5C4533] mb-1 font-serif"
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-8 depth-card-3d z-index-10 cursor-pointer ${styles.card}`}
    >
      {/* Header */}
      <div className={`border-b pb-4 ${styles.border}`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 text-3d-lift cursor-pointer ${styles.textTitle}`}>
          <FolderGit2 className={`w-5 h-5 ${styles.iconColor}`} />
          Technical Portfolios & Academic Projects
        </h2>
        <p className={`text-sm mt-1 ${styles.textMuted}`}>
          Explore Vicky's engineering projects, featuring the AI-powered Job Portal and matching simulation model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Projects Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {PROJECTS.map((p, idx) => {
            const readingTime = calculateReadingTime(p.description, p.features);
            const isSelected = selectedProjectId === p.id;
            return (
              <div 
                key={idx} 
                id={`project-${p.id}`}
                className={`${styles.innerCard} depth-card-3d ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.01] shadow-md transition-all duration-300' : ''}`}
              >
                <div className={`flex items-center justify-between gap-2 border-b pb-3 mb-3 ${styles.border}`}>
                  <div className="flex flex-col">
                    <span className="text-sm uppercase font-bold text-indigo-500 tracking-wider">
                      {p.subtitle}
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold mt-0.5 ${styles.textPrimary}`}>
                      {p.title}
                    </h3>
                  </div>
                  <div className={styles.badge} title="Estimated deep-dive reading time">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime.label}</span>
                  </div>
                </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${styles.textSecondary}`}>
                {p.description}
              </p>

              {/* Bullet Features */}
              <div className="mt-4 flex flex-col gap-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${styles.textMuted}`}>
                  Key Specifications:
                </span>
                <ul className="space-y-1.5">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className={`flex items-start gap-2 text-xs ${styles.textSecondary}`}>
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Tags */}
              <div className={`flex flex-wrap gap-1.5 mt-5 pt-3 border-t ${styles.border}`}>
                {p.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className={`${
                      currentTheme === "developer" 
                        ? "bg-black text-cyan-400 border border-cyan-500/55" 
                        : currentTheme === "glass" 
                        ? "bg-violet-950/50 text-violet-300 border border-violet-800/30" 
                        : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    } px-2.5 py-0.5 text-[10px] sm:text-xs rounded-full font-semibold`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        </div>

        {/* Right Side: AI Match Simulator Mockup */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Bio Side View */}
          <div className={`flex flex-col border rounded-xl p-4 shadow-3xs items-center text-center relative ${styles.border} ${currentTheme === "developer" ? "bg-black" : currentTheme === "glass" ? "bg-slate-950/40 backdrop-blur-md" : "bg-white/45"}`}>
            <div className={`w-32 h-32 overflow-hidden relative bg-gray-50 flex items-center justify-center border border-gray-100 mb-3 rounded-full shadow-md ${styles.imgFrame}`}>
              {isPlaceholder ? (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: images.casual }}
                />
              ) : (
                <img
                  src={images.casual || "/image/casual.jpg"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes("/image/casual.jpg")) {
                      target.src = "/images/casual.jfif";
                    } else if (target.src.includes("/images/casual.jfif")) {
                      target.src = "/image/casual.jfif";
                    }
                  }}
                  alt="Vicky Kumar Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                />
              )}
            </div>
            <span className={`text-xs font-bold ${styles.textPrimary}`}>{VICKY_INFO.name}</span>
            <span className={`text-[10px] mt-0.5 ${styles.textMuted}`}>Author & Creator of AI Job Portal</span>
          </div>

          {/* Simulator Box */}
          <div className={styles.simCard}>
            <div className={`flex items-center gap-1.5 pb-2 border-b ${styles.border}`}>
              <Cpu className={`w-4 h-4 animate-spin ${styles.iconColor}`} />
              <span className={styles.simTitle}>
                AI Job Recommendation Simulator
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              </span>
            </div>

            <p className={styles.simDesc}>
              Test the core matching algorithm from Vicky's <strong>AI-Based Job Portal (MERN)</strong> project. Input resume snippets and job postings below:
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label className={styles.simLabel}>Student CV Content:</label>
                <textarea
                  value={resumeExtract}
                  onChange={(e) => setResumeExtract(e.target.value)}
                  className={styles.simInput}
                />
              </div>

              <div className="flex flex-col">
                <label className={styles.simLabel}>Job Specification:</label>
                <textarea
                  value={jobRequirement}
                  onChange={(e) => setJobRequirement(e.target.value)}
                  className={styles.simInput}
                />
              </div>

              <button
                onClick={runSimulation}
                disabled={simulating}
                className={`w-full justify-center ${styles.btn}`}
              >
                {simulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Keywords...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Calculate Match Percentage
                  </>
                )}
              </button>
            </div>

            {/* Results Box */}
            {matchResult && (
              <div className={`${styles.simResult} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`flex items-center justify-between gap-2 border-b pb-2 ${styles.border}`}>
                  <span className={`text-[10px] font-bold uppercase ${styles.textMuted}`}>Match Score:</span>
                  <span className={`text-base font-black px-2.5 py-0.5 rounded-full ${
                    matchResult.score > 80 
                      ? currentTheme === "developer" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : currentTheme === "developer" ? "bg-amber-400/20 text-amber-400 border border-amber-400" : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {matchResult.score}%
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className={`text-[9px] font-bold uppercase ${styles.textMuted}`}>Matched Tech Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matchedKeywords.map((kw: string, i: number) => (
                      <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                        currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-455 border border-cyan-500/30" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {matchResult.missingKeywords[0] !== "NONE IDENTIFIED" && (
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[9px] font-bold uppercase ${styles.textMuted}`}>Skill Gaps Identified:</span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingKeywords.map((kw: string, i: number) => (
                        <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                          currentTheme === "developer" ? "bg-red-950 text-red-400 border border-red-500/30" : "bg-red-50 text-red-600"
                        }`}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className={`text-[11px] italic leading-relaxed ${styles.textSecondary}`}>
                  "{matchResult.feedback}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaggerContainer>
  );
}
