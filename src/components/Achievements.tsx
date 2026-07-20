import React, { useState, useEffect } from "react";
import { ThemeId } from "@/types";
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  FileText, 
  Users, 
  Award, 
  Eye, 
  X, 
  Download,
  Lightbulb,
  Cpu,
  Code,
  Binary,
  BookOpen,
  Sparkles,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface AchievementsProps {
  currentTheme: ThemeId;
}

const METRICS = {
  metricExp: 1,
  metricStudents: 500,
  metricProjects: 10,
  metricPapers: 1,
  metricWorkshops: 11,
  metricCertificates: 7,
  metricReach: 50,
};

const BADGES = [
  {
    id: "patent-ai",
    title: "Patented Inventor",
    subtitle: "Indian Patent Office",
    category: "research",
    icon: Lightbulb,
    description: "Published patent IN202511099231: 'An AI-Driven Smart Outcome Assessment System for Academic Progress Mapping'. Establishes a framework for smart learner capability mapping.",
    color: "from-amber-400 via-yellow-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    accolade: "IN Patent Published • 2025",
  },
  {
    id: "pub-journal",
    title: "Scholarly Author",
    subtitle: "IJETCS Journal",
    category: "research",
    icon: FileText,
    description: "Author of peer-reviewed paper: 'An Empirical Analysis of Outcome-Based Education (OBE) in CS Instruction using GenAI Assessment Engines' in IJETCS.",
    color: "from-blue-400 via-indigo-500 to-violet-500",
    glowColor: "rgba(59, 130, 246, 0.4)",
    accolade: "Journal Publication • 2025",
  },
  {
    id: "conf-ieee",
    title: "IEEE Scholar",
    subtitle: "IEEE ICALT Conference",
    category: "research",
    icon: BookOpen,
    description: "Presented peer-reviewed research on 'Real-time Student Career Fit Analysis and Skill Gap Remediation using Generative Prompt Framing' at the IEEE ICALT conference.",
    color: "from-sky-400 via-cyan-500 to-teal-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    accolade: "IEEE ICALT Speaker • 2025",
  },
  {
    id: "conf-acm",
    title: "ACM Bio-Visionary",
    subtitle: "ACM CODS-COMAD",
    category: "research",
    icon: Cpu,
    description: "Published and presented 'A Lightweight Facial recognition Model for Edge-constrained Classroom Attendance Logging' at ACM CODS-COMAD conference.",
    color: "from-purple-400 via-fuchsia-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.4)",
    accolade: "ACM Speaker • 2024",
  },
  {
    id: "cert-iitb-py",
    title: "IIT Python Expert",
    subtitle: "IIT Bombay Certification",
    category: "academic",
    icon: Code,
    description: "Awarded Elite Python Programming Certification by IIT Bombay, validating profound expertise in scripting, object models, and syntax optimization.",
    color: "from-emerald-400 via-teal-500 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    accolade: "IIT Bombay Certified • 2024",
  },
  {
    id: "cert-iitb-jv",
    title: "IIT Java Specialist",
    subtitle: "IIT Bombay Certification",
    category: "academic",
    icon: Binary,
    description: "Awarded Elite subject-matter certification in Java Programming by IIT Bombay, demonstrating mastery of multi-threaded systems and JVM optimization.",
    color: "from-orange-400 via-red-500 to-amber-500",
    glowColor: "rgba(249, 115, 22, 0.4)",
    accolade: "IIT Bombay Certified • 2024",
  },
  {
    id: "cert-iitk-dsa",
    title: "IIT DS&A Authority",
    subtitle: "NPTEL (IIT Kharagpur)",
    category: "academic",
    icon: Award,
    description: "Earned Elite certification in Data Structures & Algorithms from NPTEL / IIT Kharagpur, validating deep mathematical and algorithmic design foundations.",
    color: "from-rose-400 via-pink-500 to-purple-500",
    glowColor: "rgba(244, 63, 94, 0.4)",
    accolade: "IIT Kharagpur Certified • 2024",
  },
  {
    id: "placement-catalyst",
    title: "Placement Catalyst",
    subtitle: "GGI Placement Cell",
    category: "academic",
    icon: Users,
    description: "Coordinated campus placement drives and career-guidance workshops resulting in 150+ corporate student offers in core engineering and MERN roles.",
    color: "from-violet-400 via-fuchsia-500 to-fuchsia-600",
    glowColor: "rgba(139, 92, 246, 0.4)",
    accolade: "GGI Placement Cell • 2025",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function Achievements({ currentTheme }: AchievementsProps) {
  const [activeMetric, setActiveMetric] = useState<number | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<3 | 6 | 12>(12);
  const [autoSync, setAutoSync] = useState(false);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);

  const openMetricModal = (index: number) => {
    setActiveMetric(index);
    setTimeRange(12);
    setAutoSync(false);
    setIsModalLoading(true);
    const timer = setTimeout(() => {
      setIsModalLoading(false);
    }, 400);
  };

  const exportToCSV = (index: number, rangeLimit?: number) => {
    const item = stats[index];
    const currentRange = rangeLimit || timeRange;
    const dataPoints = item.sparklineData.slice(-currentRange);

    const headers = ["Metric Label", "Overall Value", "Context Description", "Time Period", "Month", "Month Value"];
    const escapeCSV = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = dataPoints.map(dp => [
      item.label,
      item.value,
      item.description,
      `Last ${currentRange} Months`,
      dp.month,
      dp.value.toString()
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fileName = `vicky_portfolio_${item.label.toLowerCase().replace(/\s+/g, "_")}_last_${currentRange}_months.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (autoSync && activeMetric !== null && !isModalLoading) {
      exportToCSV(activeMetric, timeRange);
    }
  }, [timeRange, autoSync, activeMetric, isModalLoading]);

  const getChartColors = (theme: ThemeId) => {
    switch (theme) {
      case "developer":
        return {
          stroke: "#00E5FF",
          tooltipBg: "bg-black/95",
          tooltipBorder: "border-cyan-500/50",
          tooltipText: "text-cyan-400 font-mono text-[10px]",
          container: "bg-cyan-950/10 border border-cyan-500/20 rounded-none p-2 mt-4 mb-2",
          title: "text-[10px] text-cyan-500/70 uppercase tracking-widest font-mono mb-1.5"
        };
      case "glass":
        return {
          stroke: "#A78BFA",
          tooltipBg: "bg-slate-900/95",
          tooltipBorder: "border-white/10",
          tooltipText: "text-violet-300 font-sans text-[10px]",
          container: "bg-white/5 border border-white/5 rounded-xl p-2.5 mt-4 mb-2",
          title: "text-[10px] text-slate-400 font-sans mb-1.5"
        };
      case "minimal":
        return {
          stroke: "#171717",
          tooltipBg: "bg-white",
          tooltipBorder: "border-neutral-200",
          tooltipText: "text-neutral-950 font-sans text-[10px]",
          container: "bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 mt-4 mb-2",
          title: "text-[10px] text-neutral-400 font-sans mb-1.5"
        };
      case "academic":
      default:
        return {
          stroke: "#7F1D1D",
          tooltipBg: "bg-[#FAF6EE]",
          tooltipBorder: "border-[#D4C3A3]",
          tooltipText: "text-[#5A1010] font-serif text-[10px]",
          container: "bg-[#FAF0D9]/40 border border-[#D4C3A3]/50 rounded-lg p-2.5 mt-4 mb-2",
          title: "text-[10px] text-[#5C4533]/80 font-serif italic mb-1.5"
        };
    }
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border border-cyan-500 p-3 sm:p-4 rounded-none font-mono cursor-pointer hover:border-cyan-400 hover:bg-cyan-950/20 active:bg-cyan-900/30",
          statsIconWrapper: "p-2 rounded-none bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex-shrink-0",
          statsValue: "text-base xs:text-lg sm:text-xl lg:text-xs xl:text-base 2xl:text-lg font-black tracking-tight text-white leading-none",
          statsLabel: "text-[10px] xs:text-xs sm:text-xs lg:text-[9px] xl:text-[11px] 2xl:text-xs text-neutral-400 mt-1 leading-snug",
          modalOverlay: "fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50",
          modalContent: "bg-black border-2 border-cyan-500 p-5 sm:p-6 max-w-sm w-full rounded-none font-mono text-cyan-400 relative shadow-[0_0_30px_rgba(0,229,255,0.25)]",
          modalCloseBtn: "absolute top-3 right-3 text-cyan-500 hover:text-white transition-colors p-1 border border-transparent hover:border-cyan-500",
          modalTitle: "text-base font-black text-white tracking-wider mb-2 uppercase border-b border-cyan-500/30 pb-1.5 flex items-center gap-2",
          modalDesc: "text-xs text-neutral-300 leading-relaxed",
          modalExportBtn: "mt-4 w-full py-1.5 px-3 border border-cyan-500 bg-black hover:bg-cyan-500 hover:text-black text-cyan-400 font-mono text-[11px] transition-all flex items-center justify-center gap-1.5 uppercase",
          modalSelect: "bg-black text-cyan-400 border border-cyan-500/50 text-[10px] font-mono px-1.5 py-0.5 rounded-none focus:outline-none focus:border-cyan-400 cursor-pointer",
        };
      case "glass":
        return {
          card: "bg-[#1A1333]/40 backdrop-blur-md border border-white/5 p-3.5 sm:p-4 lg:p-3 xl:p-4 rounded-xl shadow-sm font-sans cursor-pointer hover:bg-violet-950/30 hover:border-white/20 active:scale-[0.98]",
          statsIconWrapper: "p-2 rounded-lg bg-violet-950/40 text-violet-400 border border-violet-900/30 flex-shrink-0",
          statsValue: "text-base xs:text-lg sm:text-xl lg:text-xs xl:text-base 2xl:text-lg font-bold tracking-tight text-white leading-none",
          statsLabel: "text-[10px] xs:text-xs sm:text-xs lg:text-[9px] xl:text-[11px] 2xl:text-xs text-slate-400 mt-1 leading-snug",
          modalOverlay: "fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4 z-50",
          modalContent: "bg-[#1A1333]/90 backdrop-blur-xl border border-white/10 p-5 sm:p-6 max-w-sm w-full rounded-2xl shadow-2xl font-sans text-white relative",
          modalCloseBtn: "absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/5 hover:bg-white/10",
          modalTitle: "text-base font-bold text-white mb-2 flex items-center gap-2",
          modalDesc: "text-xs text-slate-300 leading-relaxed",
          modalExportBtn: "mt-4 w-full py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/10",
          modalSelect: "bg-[#1A1333]/80 text-violet-200 border border-white/10 text-[10px] font-sans px-1.5 py-0.5 rounded focus:outline-none focus:border-white/30 cursor-pointer",
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-150 p-3.5 sm:p-4 lg:p-3 xl:p-4 rounded-2xl shadow-3xs font-sans cursor-pointer hover:border-neutral-300 hover:shadow-xs active:scale-[0.98]",
          statsIconWrapper: "p-2 rounded-lg bg-neutral-100 text-neutral-900 flex-shrink-0",
          statsValue: "text-base xs:text-lg sm:text-xl lg:text-xs xl:text-base 2xl:text-lg font-bold tracking-tight text-black leading-none",
          statsLabel: "text-[10px] xs:text-xs sm:text-xs lg:text-[9px] xl:text-[11px] 2xl:text-xs text-neutral-500 mt-1 leading-snug",
          modalOverlay: "fixed inset-0 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50",
          modalContent: "bg-white border border-neutral-200 p-5 sm:p-6 max-w-sm w-full rounded-2xl shadow-xl font-sans text-neutral-900 relative",
          modalCloseBtn: "absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-100",
          modalTitle: "text-base font-bold text-neutral-900 mb-2 flex items-center gap-2",
          modalDesc: "text-xs text-neutral-600 leading-relaxed",
          modalExportBtn: "mt-4 w-full py-2 px-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
          modalSelect: "bg-neutral-50 text-neutral-800 border border-neutral-200 text-[10px] font-sans px-1.5 py-0.5 rounded focus:outline-none focus:border-neutral-400 cursor-pointer",
        };
      case "academic":
      default:
        return {
          card: "bg-[#FAF6EE] border border-[#D4C3A3]/70 p-3.5 sm:p-4 lg:p-3 xl:p-4 rounded-lg shadow-sm font-serif cursor-pointer hover:bg-[#FAF0D9] hover:border-[#C0A880] active:scale-[0.98]",
          statsIconWrapper: "p-2 rounded-lg bg-[#FAF0D9] text-[#7F1D1D] flex-shrink-0",
          statsValue: "text-base xs:text-lg sm:text-xl lg:text-xs xl:text-base 2xl:text-lg font-bold tracking-tight text-[#5A1010] leading-none font-serif",
          statsLabel: "text-[10px] xs:text-xs sm:text-xs lg:text-[9px] xl:text-[11px] 2xl:text-xs text-[#5C4533] mt-1 leading-snug font-serif",
          modalOverlay: "fixed inset-0 bg-[#1e1711]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50",
          modalContent: "bg-[#FAF6EE] border-2 border-[#D4C3A3] p-5 sm:p-6 max-w-sm w-full rounded-lg shadow-lg font-serif text-[#5A1010] relative",
          modalCloseBtn: "absolute top-3 right-3 text-[#5C4533] hover:text-[#7F1D1D] transition-colors p-1 rounded-md hover:bg-[#FAF0D9]",
          modalTitle: "text-base font-bold text-[#5A1010] mb-2 font-serif border-b-2 border-[#EADFC9] pb-1 flex items-center gap-2",
          modalDesc: "text-xs text-[#5C4533] leading-relaxed font-serif",
          modalExportBtn: "mt-4 w-full py-2 px-3 bg-[#7F1D1D] hover:bg-[#5A1010] text-white rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 font-serif",
          modalSelect: "bg-[#FAF0D9]/50 text-[#5C4533] border border-[#D4C3A3] text-[10px] font-serif italic px-1.5 py-0.5 rounded focus:outline-none focus:border-[#5A1010] cursor-pointer",
        };
    }
  };

  const styles = getThemeStyles();
  const chartColors = getChartColors(currentTheme);

  const stats = [
    { 
      label: "Experience", 
      value: `${METRICS.metricExp} ${METRICS.metricExp === 1 ? "Year" : "Years"}`, 
      icon: Briefcase,
      description: "Dedicated Computer Science academician with a professional focus on core programming methodologies, Outcome-Based Education (OBE) design, and interactive student learning environments.",
      sparklineData: [
        { month: "Aug", value: 0.1 },
        { month: "Sep", value: 0.2 },
        { month: "Oct", value: 0.3 },
        { month: "Nov", value: 0.4 },
        { month: "Dec", value: 0.5 },
        { month: "Jan", value: 0.6 },
        { month: "Feb", value: 0.65 },
        { month: "Mar", value: 0.75 },
        { month: "Apr", value: 0.8 },
        { month: "May", value: 0.9 },
        { month: "Jun", value: 0.95 },
        { month: "Jul", value: 1.0 },
      ]
    },
    { 
      label: "Students Mentored", 
      value: `${METRICS.metricStudents}+`, 
      icon: GraduationCap,
      description: "Successfully guided and mentored more than 500 undergraduate and graduate students in technical skill acquisition, research methodologies, and hands-on laboratory experiences.",
      sparklineData: [
        { month: "Aug", value: 380 },
        { month: "Sep", value: 395 },
        { month: "Oct", value: 410 },
        { month: "Nov", value: 420 },
        { month: "Dec", value: 430 },
        { month: "Jan", value: 445 },
        { month: "Feb", value: 450 },
        { month: "Mar", value: 465 },
        { month: "Apr", value: 475 },
        { month: "May", value: 485 },
        { month: "Jun", value: 495 },
        { month: "Jul", value: 500 },
      ]
    },
    { 
      label: "Projects Guided", 
      value: `${METRICS.metricProjects}+ Guided`, 
      icon: FolderGit2,
      description: "Supervised and advised 10+ student-led hardware and software projects, specializing in building modern MERN-stack web portals, secure JWT systems, and face-recognition logging tools.",
      sparklineData: [
        { month: "Aug", value: 3 },
        { month: "Sep", value: 3 },
        { month: "Oct", value: 4 },
        { month: "Nov", value: 5 },
        { month: "Dec", value: 5 },
        { month: "Jan", value: 6 },
        { month: "Feb", value: 6 },
        { month: "Mar", value: 7 },
        { month: "Apr", value: 8 },
        { month: "May", value: 9 },
        { month: "Jun", value: 10 },
        { month: "Jul", value: 10 },
      ]
    },
    { 
      label: "Research Papers", 
      value: `${METRICS.metricPapers} Published`, 
      icon: FileText,
      description: "Co-authored peer-reviewed research publications on advanced educational modeling, focusing on integrating machine learning with automatic skill assessments and placement predictions.",
      sparklineData: [
        { month: "Aug", value: 0 },
        { month: "Sep", value: 0 },
        { month: "Oct", value: 0 },
        { month: "Nov", value: 0 },
        { month: "Dec", value: 0 },
        { month: "Jan", value: 1 },
        { month: "Feb", value: 1 },
        { month: "Mar", value: 1 },
        { month: "Apr", value: 1 },
        { month: "May", value: 1 },
        { month: "Jun", value: 1 },
        { month: "Jul", value: 1 },
      ]
    },
    { 
      label: "Workshops", 
      value: `${METRICS.metricWorkshops} Sessions`, 
      icon: Users,
      description: "Organized and delivered 11 campus-wide technical sessions, training students in advanced DS&A principles, mock-interview preparation, resume building, and placement coordination.",
      sparklineData: [
        { month: "Aug", value: 2 },
        { month: "Sep", value: 3 },
        { month: "Oct", value: 4 },
        { month: "Nov", value: 5 },
        { month: "Dec", value: 6 },
        { month: "Jan", value: 7 },
        { month: "Feb", value: 7 },
        { month: "Mar", value: 8 },
        { month: "Apr", value: 9 },
        { month: "May", value: 10 },
        { month: "Jun", value: 11 },
        { month: "Jul", value: 11 },
      ]
    },
    { 
      label: "IIT Certifications", 
      value: `${METRICS.metricCertificates} Earned`, 
      icon: Award,
      description: "Holds 7 elite technical certifications awarded by India's premier IITs, validating profound subject mastery in database systems, compilers, algorithms, and pedagogy.",
      sparklineData: [
        { month: "Aug", value: 3 },
        { month: "Sep", value: 3 },
        { month: "Oct", value: 4 },
        { month: "Nov", value: 4 },
        { month: "Dec", value: 5 },
        { month: "Jan", value: 5 },
        { month: "Feb", value: 6 },
        { month: "Mar", value: 6 },
        { month: "Apr", value: 6 },
        { month: "May", value: 7 },
        { month: "Jun", value: 7 },
        { month: "Jul", value: 7 },
      ]
    },
    { 
      label: "Reached Portfolio", 
      value: `${METRICS.metricReach}+ Visitors`, 
      icon: Eye,
      description: "Gained enthusiastic engagement with this personal academic portfolio from students looking for study syllabus notes, mock interviews, or expert career consultations.",
      sparklineData: [
        { month: "Aug", value: 5 },
        { month: "Sep", value: 8 },
        { month: "Oct", value: 12 },
        { month: "Nov", value: 15 },
        { month: "Dec", value: 20 },
        { month: "Jan", value: 24 },
        { month: "Feb", value: 28 },
        { month: "Mar", value: 32 },
        { month: "Apr", value: 38 },
        { month: "May", value: 42 },
        { month: "Jun", value: 47 },
        { month: "Jul", value: 50 },
      ]
    },
  ];

  return (
    <>
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mt-4" 
        onClick={(e) => e.stopPropagation()}
      >
        {stats.map((s, index) => {
          const Icon = s.icon;
          return (
            <div 
              key={index} 
              className={`flex items-start gap-2.5 sm:gap-3 transition-all duration-300 hover:scale-[1.02] ${styles.card}`}
              onClick={() => openMetricModal(index)}
            >
              <div className={styles.statsIconWrapper}>
                <Icon className="w-5 h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={styles.statsValue}>{s.value}</span>
                <span className={styles.statsLabel}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🏅 INTERACTIVE ACADEMIC & RESEARCH BADGES SECTION */}
      <div className="mt-8 border-t pt-8 border-gray-150/10" onClick={(e) => e.stopPropagation()}>
        {currentTheme === "developer" ? (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
              <span>// DECRYPTED ACCLAIM INSIGNIAS</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Hover pointer over encryption nodes to compile credential metadata.
            </p>
          </div>
        ) : currentTheme === "glass" ? (
          <div className="mb-6">
            <h3 className="text-lg font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-sans flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
              <span>Scholarly Insignias & Milestones</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Hover on each holographic sigil to project the academic accolade details.
            </p>
          </div>
        ) : currentTheme === "academic" ? (
          <div className="mb-6">
            <h3 className="text-lg font-bold font-serif text-[#7F1D1D] flex items-center gap-2 border-b border-[#D4C3A3]/50 pb-1.5">
              <Award className="w-5 h-5 text-[#7F1D1D] animate-pulse" />
              <span>Academic Milestones & Research Accolades</span>
            </h3>
            <p className="text-xs text-[#5C4533] font-serif italic mt-1">
              Position your cursor over an honor to inspect its official scholarly citation.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-base font-bold text-neutral-900 font-sans flex items-center gap-2">
              <Award className="w-5 h-5 text-neutral-800 animate-pulse" />
              <span>Interactive Achievements & Badges</span>
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-1">
              Hover over each interactive badge to learn more about Vicky's contributions.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {BADGES.map((badge) => {
            const IconComponent = badge.icon;
            const isHovered = hoveredBadgeId === badge.id;

            // Define theme-based container styles for badges
            const getBadgeCardStyles = () => {
              switch (currentTheme) {
                case "developer":
                  return {
                    container: `border rounded-none p-4 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-visible transition-all duration-300 ${
                      isHovered 
                        ? "bg-cyan-950/20 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-[1.03]" 
                        : "bg-black border-cyan-950 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                    }`,
                    iconBg: `w-12 h-12 flex items-center justify-center rounded-none border mb-3 transition-all duration-300 ${
                      isHovered 
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 scale-110 rotate-3 shadow-[0_0_10px_rgba(0,229,255,0.4)]" 
                        : "bg-cyan-950/10 border-cyan-950/60 text-cyan-500/60"
                    }`,
                    title: "text-xs font-bold font-mono tracking-wider text-white",
                    subtitle: "text-[9px] font-mono uppercase tracking-widest text-cyan-500/70 mt-1",
                  };
                case "glass":
                  return {
                    container: `backdrop-blur-md border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-visible transition-all duration-500 ${
                      isHovered 
                        ? "bg-white/10 border-violet-400/50 shadow-[0_0_20px_rgba(139,92,246,0.25)] scale-[1.05] -translate-y-1" 
                        : "bg-[#1A1333]/30 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10 hover:text-white"
                    }`,
                    iconBg: `w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-500 ${
                      isHovered 
                        ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white scale-110 rotate-[8deg] shadow-lg shadow-violet-500/20" 
                        : "bg-violet-950/40 text-violet-400/70"
                    }`,
                    title: "text-xs font-bold text-white tracking-wide",
                    subtitle: "text-[9px] font-sans font-medium uppercase tracking-wider text-violet-300 mt-1",
                  };
                case "academic":
                  return {
                    container: `border rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-visible transition-all duration-300 ${
                      isHovered 
                        ? "bg-[#FAF0D9] border-[#C0A880] shadow-md scale-[1.03]" 
                        : "bg-[#FAF6EE] border-[#D4C3A3]/60 text-[#5C4533] hover:bg-[#FAF0D9]/50 hover:border-[#C0A880]"
                    }`,
                    iconBg: `w-12 h-12 flex items-center justify-center rounded-full mb-3 border-2 transition-all duration-300 ${
                      isHovered 
                        ? "bg-[#7F1D1D] border-[#7F1D1D] text-white scale-110 shadow-sm" 
                        : "bg-white border-[#D4C3A3]/50 text-[#7F1D1D]"
                    }`,
                    title: "text-xs font-bold font-serif text-[#5A1010] leading-snug",
                    subtitle: "text-[9px] font-serif italic text-[#7F1D1D]/75 mt-0.5",
                  };
                case "minimal":
                default:
                  return {
                    container: `border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-visible transition-all duration-300 ${
                      isHovered 
                        ? "bg-neutral-950 border-neutral-950 text-white shadow-md scale-[1.03]" 
                        : "bg-white border-neutral-150 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                    }`,
                    iconBg: `w-12 h-12 flex items-center justify-center rounded-xl mb-3 transition-all duration-300 ${
                      isHovered 
                        ? "bg-white text-neutral-950 scale-110" 
                        : "bg-neutral-50 text-neutral-800"
                    }`,
                    title: "text-xs font-bold tracking-tight leading-snug",
                    subtitle: "text-[9px] font-sans uppercase font-semibold text-neutral-400 mt-1",
                  };
              }
            };

            const cardStyle = getBadgeCardStyles();

            // Hover tooltip styles tailored strictly to the theme
            const getTooltipStyles = () => {
              switch (currentTheme) {
                case "developer":
                  return "bg-black border-2 border-cyan-500 font-mono text-cyan-400 text-left p-3.5 shadow-[0_0_25px_rgba(0,229,255,0.4)] w-64 rounded-none z-[60]";
                case "glass":
                  return "bg-[#140F26]/95 backdrop-blur-xl border border-violet-500/40 font-sans text-white text-left p-4 shadow-2xl shadow-violet-500/20 w-64 rounded-xl z-[60]";
                case "academic":
                  return "bg-[#FAF6EE] border-2 border-[#D4C3A3] font-serif text-[#5A1010] text-left p-4 shadow-lg w-64 rounded-lg z-[60]";
                case "minimal":
                default:
                  return "bg-neutral-950 border border-neutral-800 text-white font-sans text-left p-4 shadow-xl w-64 rounded-xl z-[60]";
              }
            };

            return (
              <div
                key={badge.id}
                className={cardStyle.container}
                onMouseEnter={() => setHoveredBadgeId(badge.id)}
                onMouseLeave={() => setHoveredBadgeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredBadgeId(hoveredBadgeId === badge.id ? null : badge.id);
                }}
              >
                {/* Visual Glow Layer (Theme dependent) */}
                {isHovered && currentTheme === "glass" && (
                  <div 
                    className="absolute inset-0 -z-10 rounded-2xl opacity-40 blur-lg transition-opacity" 
                    style={{ background: `radial-gradient(circle, ${badge.glowColor} 0%, transparent 70%)` }}
                  />
                )}

                {/* Badge Icon Emblem */}
                <div className={cardStyle.iconBg}>
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                </div>

                {/* Badge Labels */}
                <h4 className={cardStyle.title}>{badge.title}</h4>
                <span className={cardStyle.subtitle}>{badge.subtitle}</span>

                {/* Micro-stars decoration for hovered badges */}
                {isHovered && (
                  <div className="absolute top-2 right-2 flex gap-0.5 animate-pulse">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  </div>
                )}

                {/* Tooltip Overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 ${getTooltipStyles()}`}
                    >
                      {/* Arrow tail */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${
                        currentTheme === "developer" ? "border-t-black" :
                        currentTheme === "glass" ? "border-t-[#140F26]" :
                        currentTheme === "academic" ? "border-t-[#FAF6EE]" :
                        "border-t-neutral-950"
                      }`} />

                      {/* Header banner inside tooltip */}
                      <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-white/10">
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                          currentTheme === "developer" ? "bg-cyan-500 text-black" :
                          currentTheme === "glass" ? "bg-violet-600 text-white" :
                          currentTheme === "academic" ? "bg-[#FAF0D9] text-[#7F1D1D]" :
                          "bg-white text-neutral-950 font-bold"
                        }`}>
                          {badge.category === "research" ? "Research Honoree" : "Academic Leader"}
                        </span>
                        <span className={`text-[9px] font-bold ${
                          currentTheme === "developer" ? "text-slate-400" :
                          currentTheme === "glass" ? "text-violet-300" :
                          currentTheme === "academic" ? "text-[#5C4533] italic" :
                          "text-neutral-400"
                        }`}>
                          {badge.accolade}
                        </span>
                      </div>

                      <h5 className={`text-xs font-bold leading-tight ${
                        currentTheme === "academic" ? "font-serif text-[#7F1D1D]" : "text-white"
                      }`}>
                        {badge.title}
                      </h5>
                      <p className={`text-[10px] mt-1.5 leading-relaxed font-normal ${
                        currentTheme === "developer" ? "text-slate-300" :
                        currentTheme === "glass" ? "text-slate-200" :
                        currentTheme === "academic" ? "text-[#5C4533]" :
                        "text-neutral-300"
                      }`}>
                        {badge.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeMetric !== null && (
          <div className={styles.modalOverlay} onClick={() => setActiveMetric(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={styles.modalContent} 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setActiveMetric(null)}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
              
              <AnimatePresence mode="wait">
                {isModalLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {currentTheme === "developer" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-cyan-950 border border-cyan-500/30 animate-pulse flex-shrink-0" />
                          <div className="h-4 bg-cyan-950 border border-cyan-500/30 w-24 animate-pulse" />
                        </div>
                        <div className="h-7 bg-cyan-950 border border-cyan-500/40 w-36 animate-pulse" />
                        <div className="space-y-2 pt-1">
                          <div className="h-3 bg-cyan-950/40 border border-cyan-500/20 w-full animate-pulse" />
                          <div className="h-3 bg-cyan-950/40 border border-cyan-500/20 w-5/6 animate-pulse" />
                          <div className="h-3 bg-cyan-950/40 border border-cyan-500/20 w-2/3 animate-pulse" />
                        </div>
                      </div>
                    )}
                    {currentTheme === "glass" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-violet-950/50 rounded-md animate-pulse flex-shrink-0" />
                          <div className="h-4 bg-violet-950/50 rounded w-24 animate-pulse" />
                        </div>
                        <div className="h-7 bg-violet-900/40 rounded-lg w-36 animate-pulse" />
                        <div className="space-y-2 pt-1">
                          <div className="h-3 bg-violet-950/30 rounded w-full animate-pulse" />
                          <div className="h-3 bg-violet-950/30 rounded w-5/6 animate-pulse" />
                          <div className="h-3 bg-violet-950/30 rounded w-2/3 animate-pulse" />
                        </div>
                      </div>
                    )}
                    {currentTheme === "minimal" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-neutral-100 rounded-md animate-pulse flex-shrink-0" />
                          <div className="h-4 bg-neutral-100 rounded w-24 animate-pulse" />
                        </div>
                        <div className="h-7 bg-neutral-150 rounded-lg w-36 animate-pulse" />
                        <div className="space-y-2 pt-1">
                          <div className="h-3 bg-neutral-100 rounded w-full animate-pulse" />
                          <div className="h-3 bg-neutral-100 rounded w-5/6 animate-pulse" />
                          <div className="h-3 bg-neutral-100 rounded w-2/3 animate-pulse" />
                        </div>
                      </div>
                    )}
                    {(currentTheme === "academic" || !currentTheme) && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-[#EADFC9]/80 rounded animate-pulse flex-shrink-0" />
                          <div className="h-4 bg-[#EADFC9]/80 rounded w-24 animate-pulse" />
                        </div>
                        <div className="h-7 bg-[#EADFC9] rounded w-36 animate-pulse" />
                        <div className="space-y-2 pt-1">
                          <div className="h-3 bg-[#EADFC9]/50 rounded w-full animate-pulse" />
                          <div className="h-3 bg-[#EADFC9]/50 rounded w-5/6 animate-pulse" />
                          <div className="h-3 bg-[#EADFC9]/50 rounded w-2/3 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <motion.div variants={itemVariants} className={`${styles.modalTitle} flex justify-between items-center pr-6`}>
                      <div className="flex items-center gap-2">
                        {React.createElement(stats[activeMetric].icon, { className: "w-5 h-5 flex-shrink-0" })}
                        <span>{stats[activeMetric].label}</span>
                      </div>
                      <select
                        id="time-range-select"
                        className={styles.modalSelect}
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value) as 3 | 6 | 12)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={12} className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-violet-200" : currentTheme === "minimal" ? "bg-white text-neutral-800" : "bg-[#FAF6EE] text-[#5C4533]"}>Last 12 Months</option>
                        <option value={6} className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-violet-200" : currentTheme === "minimal" ? "bg-white text-neutral-800" : "bg-[#FAF6EE] text-[#5C4533]"}>Last 6 Months</option>
                        <option value={3} className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-violet-200" : currentTheme === "minimal" ? "bg-white text-neutral-800" : "bg-[#FAF6EE] text-[#5C4533]"}>Last 3 Months</option>
                      </select>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="text-xl font-black mb-3 tracking-tight">
                      {stats[activeMetric].value}
                    </motion.div>
                    
                    <motion.p variants={itemVariants} className={styles.modalDesc}>
                      {stats[activeMetric].description}
                    </motion.p>
 
                    {/* Growth Trajectory Sparkline */}
                    <motion.div variants={itemVariants} className={chartColors.container}>
                      <div className={chartColors.title}>
                        Growth Trajectory (Last {timeRange} Months)
                      </div>
                      <div className="h-20 w-full" style={{ minWidth: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={stats[activeMetric].sparklineData.slice(-timeRange)} 
                            margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                          >
                            <defs>
                              <linearGradient id={`gradient-${currentTheme}-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.stroke} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={chartColors.stroke} stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className={`text-[10px] px-1.5 py-0.5 shadow-sm rounded border ${chartColors.tooltipBorder} ${chartColors.tooltipBg} ${chartColors.tooltipText}`}>
                                      {`${payload[0].payload.month}: ${payload[0].value}`}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={chartColors.stroke}
                              strokeWidth={1.5}
                              fillOpacity={1}
                              fill={`url(#gradient-${currentTheme}-${activeMetric})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>

                    {/* Auto-download Checkbox */}
                    <motion.div 
                      variants={itemVariants}
                      className="mt-3 flex items-center gap-2 cursor-pointer select-none"
                      onClick={() => setAutoSync(!autoSync)}
                    >
                      <input
                        id="auto-sync-csv"
                        type="checkbox"
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-3.5 h-3.5 cursor-pointer accent-current ${
                          currentTheme === "developer" 
                            ? "border border-cyan-500 bg-black text-cyan-400" 
                            : currentTheme === "glass" 
                            ? "border border-white/10 bg-violet-950/40 text-violet-400" 
                            : currentTheme === "minimal" 
                            ? "border border-neutral-300 bg-neutral-50 text-neutral-900" 
                            : "border border-[#D4C3A3] bg-[#FAF0D9]/50 text-[#7F1D1D]"
                        }`}
                      />
                      <label 
                        htmlFor="auto-sync-csv" 
                        className={`text-[11px] leading-none cursor-pointer ${
                          currentTheme === "developer" 
                            ? "font-mono text-cyan-500/80 uppercase" 
                            : currentTheme === "glass" 
                            ? "font-sans text-slate-400" 
                            : currentTheme === "minimal" 
                            ? "font-sans text-neutral-500" 
                            : "font-serif italic text-[#5C4533]/80"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Auto-download CSV on time-range change
                      </label>
                    </motion.div>

                    <motion.button 
                      variants={itemVariants}
                      className={styles.modalExportBtn}
                      onClick={() => exportToCSV(activeMetric)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Data</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
