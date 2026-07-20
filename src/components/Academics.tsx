import React, { useState, useRef } from "react";
import { ImageSlots, ThemeId } from "@/types";
import { EDUCATION, CERTIFICATIONS, ACADEMIC_STRENGTHS, RESEARCH_INTERESTS, PUBLICATIONS, PATENTS, CONFERENCES, WORKSHOPS_FDPS } from "../data";
import { GraduationCap, Award, BookOpen, Heart, CheckSquare, Sparkles, FileText, FileSpreadsheet, Lightbulb, CalendarDays } from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { playAudioCue } from "@/utils/audio";

interface AcademicsProps {
  images: ImageSlots;
  currentTheme: ThemeId;
  selectedResearchTab?: "journals" | "conferences" | "patents" | "workshops" | null;
  selectedResearchTitle?: string | null;
  onClearSelectedResearch?: () => void;
}

export default function Academics({ 
  images, 
  currentTheme,
  selectedResearchTab = null,
  selectedResearchTitle = null,
  onClearSelectedResearch
}: AcademicsProps) {
  const isPlaceholder = images.campus.startsWith("<svg") || images.campus.startsWith("data:image/svg");
  const [researchTab, setResearchTab] = useState<"journals" | "conferences" | "patents" | "workshops">("journals");

  React.useEffect(() => {
    if (selectedResearchTab) {
      setResearchTab(selectedResearchTab);
    }
  }, [selectedResearchTab]);

  React.useEffect(() => {
    if (selectedResearchTitle) {
      setTimeout(() => {
        const el = document.getElementById(`research-${selectedResearchTitle.replace(/\s+/g, "-").toLowerCase()}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    }
  }, [selectedResearchTitle]);

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          innerCard: "bg-black border border-cyan-500/50 p-4 rounded-none",
          badge: "bg-cyan-500/10 border border-cyan-500 text-cyan-400 px-2.5 py-0.5 text-xs rounded-none",
          bullet: "text-cyan-400",
          imgFrame: "border-2 border-cyan-500 rounded-none p-1",
          textTitle: "text-cyan-400",
          textPrimary: "text-white font-bold",
          textSecondary: "text-neutral-200",
          textMuted: "text-neutral-400",
          border: "border-cyan-500/30",
          iconColor: "text-cyan-400",
          cardBg: "bg-black border-cyan-500/50"
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          innerCard: "bg-[#1A1333]/40 border border-white/5 p-4 rounded-lg",
          badge: "bg-violet-950/40 border border-violet-800/30 text-violet-300 px-3 py-1 text-xs rounded-full",
          bullet: "text-violet-400",
          imgFrame: "bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 rounded-lg shadow-md",
          textTitle: "text-white",
          textPrimary: "text-slate-100",
          textSecondary: "text-slate-300",
          textMuted: "text-slate-400",
          border: "border-white/10",
          iconColor: "text-violet-500",
          cardBg: "bg-[#1A1333]/40 border-white/5"
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-200 text-neutral-850 rounded-3xl p-6 shadow-xs font-sans",
          innerCard: "bg-white border border-neutral-150 p-5 rounded-2xl shadow-3xs",
          badge: "bg-neutral-50 border border-neutral-250 text-neutral-900 px-3 py-1 text-xs rounded-full font-bold",
          bullet: "text-neutral-950",
          imgFrame: "bg-white border border-neutral-200 p-2 rounded-2xl",
          textTitle: "text-black font-extrabold",
          textPrimary: "text-black font-bold",
          textSecondary: "text-neutral-700 font-medium",
          textMuted: "text-neutral-500",
          border: "border-neutral-200/50",
          iconColor: "text-neutral-900",
          cardBg: "bg-white border-neutral-150"
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          innerCard: "bg-[#FAF6EE] border border-[#D4C3A3]/60 p-4 rounded-md shadow-sm",
          badge: "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] px-2.5 py-0.5 text-xs rounded-md font-bold",
          bullet: "text-[#7F1D1D]",
          imgFrame: "bg-[#FAF6EE] border border-[#D4C3A3] p-1.5 rounded-md",
          textTitle: "text-[#5A1010] font-bold font-serif",
          textPrimary: "text-[#5A1010] font-bold font-serif",
          textSecondary: "text-[#4A3B32] font-serif",
          textMuted: "text-[#5C4533] font-serif",
          border: "border-[#D4C3A3]/40",
          iconColor: "text-[#7F1D1D]",
          cardBg: "bg-[#FAF6EE] border-[#D4C3A3]/50"
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
          <GraduationCap className={`w-5 h-5 ${styles.iconColor}`} />
          Academic & Educational Foundation
        </h2>
        <p className={`text-sm mt-1 ${styles.textMuted}`}>
          Explore Vicky's university degrees, academic achievements, research orientations, and industrial credentials.
        </p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Education Timeline & Certifications */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Degrees */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${styles.textMuted}`}>
              <BookOpen className={`w-4 h-4 ${styles.iconColor}`} />
              Academic Degrees
            </h3>
            <div className="space-y-4">
              {EDUCATION.map((edu, idx) => (
                <div key={idx} className={`${styles.innerCard} depth-card-3d`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className={`font-bold text-sm leading-snug ${styles.textPrimary}`}>
                      {edu.degree}
                    </span>
                    <span className={styles.badge}>{edu.period}</span>
                  </div>
                  <span className={`text-xs font-semibold block mb-1 ${styles.textMuted}`}>
                    {edu.institution}
                  </span>
                  {edu.details && (
                    <p className={`text-xs leading-relaxed mt-1 ${styles.textSecondary}`}>
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Badge Gallery */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${styles.textMuted}`}>
              <Award className={`w-4 h-4 ${styles.iconColor}`} />
              IIT & Industry Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((cert, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 border rounded-lg backdrop-blur-xs shadow-2xs hover:shadow-xs transition-shadow duration-300 depth-card-3d ${styles.border} ${currentTheme === "developer" ? "bg-black" : currentTheme === "glass" ? "bg-[#1A1333]/40" : "bg-white/50"}`}
                >
                  <div className={`p-2 rounded-lg ${currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold leading-tight ${styles.textPrimary}`}>
                      {cert.name}
                    </span>
                    <span className={`text-[11px] mt-0.5 leading-normal ${styles.textMuted}`}>
                      Verified by: {cert.provider}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research, Patents, Conferences & Workshops */}
          <div className="mt-2">
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${styles.textMuted}`}>
              <FileText className={`w-4 h-4 ${styles.iconColor}`} />
              Research, Patents & Workshops
            </h3>
            
            {/* Sub-tab list */}
            <div className={`flex flex-wrap gap-2 mb-4 pb-2 border-b ${styles.border}`}>
              <button
                onClick={(e) => { e.stopPropagation(); playAudioCue("nav-click"); setResearchTab("journals"); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  researchTab === "journals"
                    ? currentTheme === "developer" ? "bg-cyan-500 text-black font-bold" : currentTheme === "glass" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "bg-neutral-950 text-white font-bold"
                    : currentTheme === "developer" ? "text-cyan-400 hover:bg-cyan-950/20" : currentTheme === "glass" ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                Journals ({PUBLICATIONS.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playAudioCue("nav-click"); setResearchTab("conferences"); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  researchTab === "conferences"
                    ? currentTheme === "developer" ? "bg-cyan-500 text-black font-bold" : currentTheme === "glass" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "bg-neutral-950 text-white font-bold"
                    : currentTheme === "developer" ? "text-cyan-400 hover:bg-cyan-950/20" : currentTheme === "glass" ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                Conferences ({CONFERENCES.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playAudioCue("nav-click"); setResearchTab("patents"); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  researchTab === "patents"
                    ? currentTheme === "developer" ? "bg-cyan-500 text-black font-bold" : currentTheme === "glass" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "bg-neutral-950 text-white font-bold"
                    : currentTheme === "developer" ? "text-cyan-400 hover:bg-cyan-950/20" : currentTheme === "glass" ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                Patents ({PATENTS.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playAudioCue("nav-click"); setResearchTab("workshops"); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  researchTab === "workshops"
                    ? currentTheme === "developer" ? "bg-cyan-500 text-black font-bold" : currentTheme === "glass" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "bg-neutral-950 text-white font-bold"
                    : currentTheme === "developer" ? "text-cyan-400 hover:bg-cyan-950/20" : currentTheme === "glass" ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                FDPs & Workshops ({WORKSHOPS_FDPS.length})
              </button>
            </div>

            {/* List containers */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {researchTab === "journals" && PUBLICATIONS.map((pub, idx) => {
                const isSelected = selectedResearchTitle === pub.title;
                return (
                  <div 
                    key={idx} 
                    id={`research-${pub.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`${styles.innerCard} depth-card-3d ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.01] shadow-md transition-all duration-300 border-indigo-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-400" : "bg-[#FAF0D9] text-[#7F1D1D] flex-shrink-0"}`}>
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-snug ${styles.textPrimary}`}>
                          {pub.title}
                        </span>
                        <span className={`text-[10px] font-semibold mt-1 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`}>
                          {pub.journal} • {pub.year}
                        </span>
                        <span className={`text-[9px] mt-0.5 font-medium ${styles.textMuted}`}>
                          First Author: {pub.author}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {researchTab === "conferences" && CONFERENCES.map((conf, idx) => {
                const isSelected = selectedResearchTitle === conf.title;
                return (
                  <div 
                    key={idx} 
                    id={`research-${conf.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`${styles.innerCard} depth-card-3d ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.01] shadow-md transition-all duration-300 border-indigo-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-snug ${styles.textPrimary}`}>
                          {conf.title}
                        </span>
                        <span className={`text-[10px] font-semibold mt-1 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`}>
                          {conf.venue} • {conf.year}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {researchTab === "patents" && PATENTS.map((pat, idx) => {
                const isSelected = selectedResearchTitle === pat.title;
                return (
                  <div 
                    key={idx} 
                    id={`research-${pat.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`${styles.innerCard} depth-card-3d ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.01] shadow-md transition-all duration-300 border-indigo-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-400" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                        <Lightbulb className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-snug ${styles.textPrimary}`}>
                          {pat.title}
                        </span>
                        <span className={`text-[10px] font-semibold mt-1 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`}>
                          Registration No: {pat.regNo} ({pat.status})
                        </span>
                        <span className={`text-[9px] mt-0.5 font-medium ${styles.textMuted}`}>
                          Year of Publication: {pat.year}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {researchTab === "workshops" && WORKSHOPS_FDPS.map((wf, idx) => (
                <div key={idx} className={`${styles.innerCard} depth-card-3d`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${currentTheme === "developer" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-50 text-violet-600 border border-violet-100"}`}>
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold leading-snug ${styles.textPrimary}`}>
                          {wf.name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          wf.type.includes("Conducted") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-sans" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-sans"
                        }`}>
                          {wf.type}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold mt-1 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`}>
                        {wf.organizer} • {wf.duration} ({wf.year})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Campus Photo and Strengths */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Photo frame */}
          <div className="flex justify-center relative">
            <div className={`w-full max-w-xs relative overflow-hidden ${styles.imgFrame}`}>
              <div className="aspect-3/4 rounded-lg overflow-hidden relative bg-gray-50 flex items-center justify-center border border-gray-100 shadow-lg">
                {isPlaceholder ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: images.campus }}
                  />
                ) : (
                  <img
                    src={images.campus || "/image/campus.jpg"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes("/image/campus.jpg")) {
                        target.src = "/images/campus.jfif";
                      } else if (target.src.includes("/images/campus.jfif")) {
                        target.src = "/image/campus.jfif";
                      }
                    }}
                    alt="Vicky Kumar on Campus"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Interests & Strengths Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Academic Strengths */}
            <div className={`p-4 border rounded-xl backdrop-blur-xs shadow-3xs ${styles.border} ${currentTheme === "developer" ? "bg-black" : currentTheme === "glass" ? "bg-[#1A1333]/40" : "bg-white/55"}`}>
              <span className={`text-xs font-bold flex items-center gap-1 mb-2 ${styles.textPrimary}`}>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                Academic Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ACADEMIC_STRENGTHS.map((str, idx) => (
                  <span
                    key={idx}
                    className={`${
                      currentTheme === "developer" 
                        ? "bg-black text-cyan-400 border border-cyan-500" 
                        : currentTheme === "glass" 
                        ? "bg-violet-950/50 text-violet-300 border border-violet-800/30" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    } px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-medium`}
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>

            {/* Research interests */}
            <div className={`p-4 border rounded-xl backdrop-blur-xs shadow-3xs ${styles.border} ${currentTheme === "developer" ? "bg-black" : currentTheme === "glass" ? "bg-[#1A1333]/40" : "bg-white/55"}`}>
              <span className={`text-xs font-bold flex items-center gap-1 mb-2 ${styles.textPrimary}`}>
                <Heart className="w-3.5 h-3.5 text-red-500" />
                Research Orientation
              </span>
              <ul className="space-y-1.5">
                {RESEARCH_INTERESTS.map((res, idx) => (
                  <li key={idx} className={`flex items-start gap-1.5 text-xs ${styles.textSecondary}`}>
                    <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StaggerContainer>
  );
}
