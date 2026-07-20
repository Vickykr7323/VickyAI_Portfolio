import React, { useState, useEffect, useRef } from "react";
import { ImageSlots, ThemeId } from "@/types";
import { VICKY_INFO, TESTIMONIALS } from "../data";
import { MapPin, Mail, Phone, Linkedin, Github, FileText, Bot, ArrowRight, BookOpen, GraduationCap, Award, Briefcase, FolderGit2, Users, Sparkles, Eye, Play, Pause, FastForward, RotateCcw, Activity, TrendingUp, LineChart, BarChart3 } from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { AnimatePresence, motion } from "motion/react";
import { playAudioCue } from "@/utils/audio";
import Achievements from "./Achievements";

interface HeroProps {
  images: ImageSlots;
  currentTheme: ThemeId;
  onNavigate: (section: any) => void;
  onPlayVideoIntro?: () => void;
}

export default function Hero({ images, currentTheme, onNavigate, onPlayVideoIntro }: HeroProps) {
  const isPlaceholder = typeof images.hero === "string" && (images.hero.startsWith("<svg") || images.hero.startsWith("data:image/svg") || images.hero.includes("<svg") || !images.hero);

  const roles = [
    "Assistant Professor (Computer Science)",
    "Full-Stack Software Engineer (MERN)",
    "Placement Department Officer & Recruiter",
    "AI Curriculum & Laboratory Innovator",
    "Academic Research Lead (NLP & ML)",
    "Career Advisor & Resume Mentor"
  ];

  const [roleIdx, setRoleIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [colorIdx, setColorIdx] = useState(0);


  // States for testimonial carousel
  const [testiIdx, setTestiIdx] = useState(0);

  // Interactive 3D Name rotation states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const nameRef = useRef<HTMLDivElement>(null);

  const handleMouseMoveName = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = nameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / rect.height * 25);
    setRotateY(x / rect.width * 25);
  };

  const handleMouseLeaveName = () => {
    setRotateX(0);
    setRotateY(0);
  };



  const rgbColors = [
    "#00E5FF", // Neon cyan
    "#FF1E56", // Vibrant pink-red
    "#39FF14", // Neon green
    "#FFB300", // Warm amber/gold
    "#8F00FF", // Electric violet
    "#FF007F"  // Neon magenta
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % roles.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentStr = roles[roleIdx];
    let i = 0;
    setTypedText("");
    
    const typingInterval = setInterval(() => {
      if (i < currentStr.length) {
        setTypedText(currentStr.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    setColorIdx((prev) => (prev + 1) % rgbColors.length);

    return () => {
      clearInterval(typingInterval);
    };
  }, [roleIdx]);

  // Testimonial automatic rotation
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setTestiIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(testimonialTimer);
  }, []);

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          container: "font-mono bg-black text-cyan-400 border-2 border-cyan-500 p-6 rounded-none",
          badge: "bg-cyan-500/10 border border-cyan-500 text-cyan-400 text-sm px-3 py-1 rounded-none font-bold",
          h1: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black uppercase text-cyan-400 leading-tight",
          h2: "text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-neutral-400 mt-2",
          btnPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-3 rounded-none flex items-center gap-2",
          btnSecondary: "border-2 border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-bold px-5 py-3 rounded-none flex items-center gap-2",
          imgFrame: "border-4 border-cyan-500 rounded-none p-1",
          card: "bg-black border border-cyan-500 p-4 rounded-none",
          summaryText: "text-sm md:text-base leading-relaxed text-neutral-200 max-w-2xl",
          socialGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-neutral-300 border-t border-b border-cyan-500/30 py-4 my-2",
          socialIcon: "text-cyan-400 flex-shrink-0",
          statsIconWrapper: "p-2 rounded-none bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex-shrink-0",
          statsValue: "text-2xl sm:text-3xl font-black tracking-tight text-white leading-none",
          statsLabel: "text-xs sm:text-sm text-neutral-400 mt-1 leading-normal",
          border: "border-cyan-500/30 font-mono",
          textPrimary: "text-white font-bold",
          textSecondary: "text-neutral-200",
          textMuted: "text-neutral-400"
        };
      case "glass":
        return {
          container: "font-sans bg-[#0B0F19]/40 backdrop-blur-md text-white border border-white/10 p-8 rounded-2xl shadow-xl shadow-violet-950/10",
          badge: "bg-violet-950/40 border border-violet-800/30 text-violet-300 text-sm px-4 py-1.5 rounded-full font-semibold",
          h1: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-violet-400 bg-clip-text text-transparent gradient-text-3d cursor-pointer",
          h2: "text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-violet-400 mt-2",
          btnPrimary: "bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/25",
          btnSecondary: "bg-violet-950/30 border border-white/5 hover:bg-violet-950/50 text-violet-300 font-medium px-5 py-3 rounded-xl flex items-center gap-2",
          imgFrame: "bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1.5 rounded-2xl shadow-lg shadow-violet-500/10",
          card: "bg-[#1A1333]/40 backdrop-blur-md border border-white/5 p-5 rounded-xl shadow-sm",
          summaryText: "text-sm md:text-base leading-relaxed text-slate-300 max-w-2xl",
          socialGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-slate-400 border-t border-b border-white/5 py-4 my-2",
          socialIcon: "text-violet-500 flex-shrink-0",
          statsIconWrapper: "p-2 rounded-lg bg-violet-950/40 text-violet-400 border border-violet-900/30 flex-shrink-0",
          statsValue: "text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none",
          statsLabel: "text-xs sm:text-sm text-slate-400 mt-1 leading-normal",
          border: "border-white/10",
          textPrimary: "text-slate-100",
          textSecondary: "text-slate-300",
          textMuted: "text-slate-400"
        };
      case "minimal":
        return {
          container: "font-sans bg-white text-[#111111] border border-neutral-200 p-8 rounded-3xl",
          badge: "bg-neutral-50 border border-neutral-250 text-neutral-900 text-xs px-4 py-1.5 rounded-full font-bold",
          h1: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black",
          h2: "text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 mt-2",
          btnPrimary: "bg-neutral-950 hover:bg-black text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm",
          btnSecondary: "bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-855 font-semibold px-6 py-3 rounded-full flex items-center gap-2",
          imgFrame: "bg-white border border-neutral-200 p-2 rounded-3xl hover:shadow-md transition-shadow duration-300",
          card: "bg-white border border-neutral-150 p-5 rounded-2xl shadow-3xs",
          summaryText: "text-sm md:text-base leading-relaxed text-neutral-700 max-w-2xl font-medium",
          socialGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-neutral-600 border-t border-b border-neutral-150 py-4 my-2",
          socialIcon: "text-neutral-900 flex-shrink-0",
          statsIconWrapper: "p-2 rounded-lg bg-neutral-100 text-neutral-900 flex-shrink-0",
          statsValue: "text-2xl sm:text-3xl font-bold tracking-tight text-black leading-none",
          statsLabel: "text-xs sm:text-sm text-neutral-500 mt-1 leading-normal",
          border: "border-neutral-200/50",
          textPrimary: "text-black font-bold",
          textSecondary: "text-neutral-700 font-medium",
          textMuted: "text-neutral-500"
        };
      case "academic":
      default:
        return {
          container: "font-serif bg-[#FDFBF7] text-[#2A1E17] border border-[#D4C3A3] p-8 rounded-xl shadow-md",
          badge: "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] text-xs px-4 py-1.5 rounded-md font-bold",
          h1: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-[#5A1010]",
          h2: "text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#7F1D1D] mt-2",
          btnPrimary: "bg-[#7F1D1D] hover:bg-[#5A1010] text-white font-serif font-medium px-5 py-3 rounded-md flex items-center gap-2 shadow-sm transition-all duration-200",
          btnSecondary: "bg-[#FDFBF7] border border-[#D4C3A3] hover:bg-[#FAF0D9] text-[#5C2D11] font-serif font-medium px-5 py-3 rounded-md flex items-center gap-2 transition-all duration-200",
          imgFrame: "bg-[#FAF6EE] border border-[#D4C3A3] p-2 rounded-xl shadow-sm",
          card: "bg-[#FAF6EE] border border-[#D4C3A3]/70 p-5 rounded-lg shadow-sm",
          summaryText: "text-sm md:text-base leading-relaxed text-[#4A3B32] max-w-2xl font-serif",
          socialGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-[#5C4533] border-t border-b border-[#D4C3A3]/50 py-4 my-2 font-serif",
          socialIcon: "text-[#7F1D1D] flex-shrink-0",
          statsIconWrapper: "p-2 rounded-lg bg-[#FAF0D9] text-[#7F1D1D] flex-shrink-0",
          statsValue: "text-2xl sm:text-3xl font-bold tracking-tight text-[#5A1010] leading-none font-serif",
          statsLabel: "text-xs sm:text-sm text-[#5C4533] mt-1 leading-normal font-serif",
          border: "border-[#D4C3A3]/40",
          textPrimary: "text-[#5A1010] font-bold font-serif",
          textSecondary: "text-[#4A3B32] font-serif",
          textMuted: "text-[#5C4533] font-serif"
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-8 depth-card-3d z-index-10 cursor-pointer ${styles.container}`}
    >
      {/* Upper Bio Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" onClick={(e) => e.stopPropagation()}>
        {/* Bio Text Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex">
            <span className={styles.badge}>Gulzar Group of Institutes</span>
          </div>

          <div className="flex flex-col gap-1">
            <div 
              ref={nameRef}
              onMouseMove={handleMouseMoveName}
              onMouseLeave={handleMouseLeaveName}
              className="perspective-1000 transform-style-3d cursor-pointer inline-block w-fit"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <h1 className={`${styles.h1} select-none text-3d-name-${currentTheme} text-3d-lift`}>
                {VICKY_INFO.name}
              </h1>
            </div>
            <div className="relative min-h-[56px] xs:min-h-[48px] sm:min-h-[40px] md:min-h-[48px] flex items-center overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={roleIdx}
                  initial={{ opacity: 0.95 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.95 }}
                  className={`${styles.h2} absolute left-0 right-0 py-1 font-semibold flex items-center gap-1 transition-all duration-300`}
                  style={{ 
                    color: rgbColors[colorIdx], 
                    textShadow: currentTheme === "developer" || currentTheme === "glass" ? `0 0 15px ${rgbColors[colorIdx]}55` : "none" 
                  }}
                >
                  <span>{typedText}</span>
                  <span className="w-[3px] h-[1.3em] bg-current animate-pulse inline-block" />
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          <p className={styles.summaryText}>
            {VICKY_INFO.summary}
          </p>

          {/* Social Links & Contact Details */}
          <div className={styles.socialGrid}>
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 flex-shrink-0 ${styles.socialIcon}`} />
              <span>{VICKY_INFO.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className={`w-4 h-4 flex-shrink-0 ${styles.socialIcon}`} />
              <a href={`mailto:${VICKY_INFO.email}`} className="hover:underline">{VICKY_INFO.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className={`w-4 h-4 flex-shrink-0 ${styles.socialIcon}`} />
              <a href={`tel:${VICKY_INFO.phone}`} className="hover:underline">{VICKY_INFO.phone}</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={VICKY_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a href={VICKY_INFO.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Call to Action Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button
              id="cta-mock-interview"
              onMouseEnter={() => playAudioCue("nav-hover")}
              onClick={(e) => {
                e.stopPropagation();
                playAudioCue("nav-click");
                onNavigate("placement");
              }}
              className={styles.btnPrimary}
            >
              <Briefcase className="w-4 h-4" />
              Try Mock Interview
              <ArrowRight className="w-4 h-4" />
            </button>

            {onPlayVideoIntro && (
              <button
                id="cta-play-video-intro"
                onMouseEnter={() => playAudioCue("nav-hover")}
                onClick={(e) => {
                  e.stopPropagation();
                  playAudioCue("nav-click");
                  onPlayVideoIntro();
                }}
                className={styles.btnSecondary}
              >
                <Play className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                <span>Watch Video Intro</span>
              </button>
            )}
          </div>
        </div>

        {/* Portrait Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full relative">

          {/* Ambient Background Glow */}
          {!isPlaceholder && (
            <div className="absolute inset-0 rounded-full blur-3xl bg-indigo-500/10 dark:bg-indigo-500/20 animate-pulse pointer-events-none" />
          )}

          <div className={`max-w-xs sm:max-w-sm w-full animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden ${styles.imgFrame}`}>
            <div className="aspect-3/4 rounded-lg overflow-hidden relative bg-gray-50 flex items-center justify-center border border-gray-100 shadow-lg">
              {isPlaceholder ? (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: images.hero }}
                />
              ) : (
                <img
                  src={images.hero}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes("/image/hero.jpg")) {
                      target.src = "/images/hero.png";
                    } else if (target.src.includes("/images/hero.png")) {
                      target.src = "/image/hero.png";
                    }
                  }}
                  alt="Vicky Kumar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Component */}
      <Achievements currentTheme={currentTheme} />

      {/* Testimonials Carousel Section */}
      <div className={`mt-8 border-t pt-8 ${styles.border}`} onClick={(e) => e.stopPropagation()}>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center justify-center gap-1.5 text-center ${styles.textMuted}`}>
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          Testimonials & Student Recommendations
        </h3>

        <div className="relative max-w-3xl mx-auto min-h-[160px] flex flex-col items-center justify-center">
          <div className={`w-full p-6 text-center rounded-2xl relative border ${currentTheme === "developer" ? "border-cyan-500/30 bg-black text-neutral-200" : currentTheme === "glass" ? "border-white/5 bg-[#1A1333]/30" : "border-neutral-150 bg-neutral-50/50"}`}>
            <p className={`text-sm sm:text-base italic leading-relaxed ${styles.summaryText} mx-auto mb-4`}>
              "{TESTIMONIALS[testiIdx].text}"
            </p>
            <div className="flex flex-col items-center">
              <span className={`text-xs font-bold ${styles.textPrimary}`}>{TESTIMONIALS[testiIdx].name}</span>
              <span className={`text-[10px] uppercase font-semibold mt-0.5 ${styles.textMuted}`}>
                {TESTIMONIALS[testiIdx].role} • {TESTIMONIALS[testiIdx].organization}
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 mt-4 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudioCue("nav-click");
                setTestiIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
              }}
              className={`p-1.5 rounded-full border hover:bg-neutral-500/10 transition-colors ${styles.border}`}
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <div className="flex gap-1">
              {TESTIMONIALS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === testiIdx ? "w-4 bg-indigo-500" : "bg-neutral-500/40"
                  }`}
                ></div>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudioCue("nav-click");
                setTestiIdx((prev) => (prev + 1) % TESTIMONIALS.length);
              }}
              className={`p-1.5 rounded-full border hover:bg-neutral-500/10 transition-colors ${styles.border}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </StaggerContainer>
  );
}
