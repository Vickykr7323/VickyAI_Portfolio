import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeId } from "@/types";
import { playAudioCue } from "@/utils/audio";
import { 
  GraduationCap, 
  Layers, 
  Award, 
  Cpu, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Rocket,
  Search,
  Filter,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckSquare,
  Square
} from "lucide-react";

interface CareerRoadmapProps {
  currentTheme: ThemeId;
}

export interface RoadmapNode {
  id: string;
  period: string;
  title: string;
  organization: string;
  status: "completed" | "current" | "projected";
  iconType: "education" | "internship" | "professor" | "ai" | "phd" | "leadership";
  description: string;
  milestones: string[];
  skills: string[];
  growthFocus: string;
}

const currentYear = new Date().getFullYear();

const DEFAULT_ROADMAP_NODES: RoadmapNode[] = [
  {
    id: "bca",
    period: `${currentYear - 7} – ${currentYear - 4}`,
    title: "Foundational CS & Early Software Building",
    organization: "Maharaja College / VKSU",
    status: "completed",
    iconType: "education",
    description: "Acquired deep foundational understanding of Object-Oriented Programming, Data Structures, and Core Operating Systems design while building initial desktop scripts.",
    milestones: [
      "Mastered C, C++, and Core Java development standards.",
      "Graduated with top marks in primary algorithmic courses.",
      "Engineered early custom local projects and basic data dashboards."
    ],
    skills: ["C", "C++", "Java", "DSA", "SQL"],
    growthFocus: "Transitioning from basic procedural syntax to scalable object-oriented architectural systems."
  },
  {
    id: "mca-interns",
    period: `${currentYear - 3} – ${currentYear - 1}`,
    title: "MCA Specialization & MERN Stack Internships",
    organization: "TMU, Croma Campus & Intellipaat",
    status: "completed",
    iconType: "internship",
    description: "Deepened engineering expertise in Full-Stack Web Technologies, NoSQL Databases, and server-database structures while executing industrial MERN internships.",
    milestones: [
      "Secured MERN and MEAN Developer Specialization credentials.",
      "Developed end-to-end full-stack web applications with JWT authentication.",
      "Optimized query speeds and modeled complex relational/document databases."
    ],
    skills: ["React", "Express", "MongoDB", "Node.js", "JWT", "AWS"],
    growthFocus: "Industrial scalability, backend API designs, and real-time database models."
  },
  {
    id: "startup-edu",
    period: `${currentYear - 2} – ${currentYear - 1}`,
    title: "Education Sector Startup Business",
    organization: "Independent EdTech Venture",
    status: "completed",
    iconType: "leadership",
    description: "Started and scaled his own startup business in the education sector, designing and launching automated placement tools, resume optimization platforms, and coding bootcamps.",
    milestones: [
      "Co-founded and successfully executed full-stack EdTech operations.",
      "Built interactive platforms for outcome training, serving hundreds of students.",
      "Successfully launched specialized training bootcamps with industry-led curriculums."
    ],
    skills: ["Startup Growth", "EdTech Product", "SaaS Engineering", "Business Strategy"],
    growthFocus: "Designing and deploying independent educational solutions at scale with real-world outcomes."
  },
  {
    id: "current-role",
    period: `${currentYear - 1} – Present`,
    title: "Assistant Professor & Placement Lead",
    organization: "Gulzar Group of Institutes",
    status: "current",
    iconType: "professor",
    description: "Delivering modern computer science instruction while executing technical placement drives, aptitude training camps, and interview coaching.",
    milestones: [
      "Coordinating on-campus placement drives and industry guest-lectures.",
      "Aligned curriculum with Outcome-Based Education (OBE) rubrics.",
      "Conducted resume reviews, soft-skills training, and technical mock interviews."
    ],
    skills: ["OBE Pedagogy", "Career Mentoring", "Python", "Technical Training", "Academic Administration"],
    growthFocus: "Unifying educational standards with industry hiring requirements to boost student employment."
  },
  {
    id: "future-phd",
    period: `${currentYear} – ${currentYear + 6} (Projected)`,
    title: "PhD Enrolment & CS Pedagogical Research",
    organization: "Top-Tier Research University",
    status: "projected",
    iconType: "phd",
    description: `Enrolling in PhD in ${currentYear}. Carrying out advanced CS research in intelligent teaching assistants, adaptive machine learning, and automatic student evaluation models.`,
    milestones: [
      `Enrol in PhD program in ${currentYear} to research AI-driven pedagogy and ML.`,
      `Publish research papers & design testing frameworks in ${currentYear + 4}-${currentYear + 5}.`,
      `Complete thesis writing & successful dissertation defense in ${currentYear + 6}.`
    ],
    skills: ["Research Pedagogy", "Data Analytics", "Deep Learning", "SciPy", "Academic Writing"],
    growthFocus: "Pioneering next-generation adaptive curriculum frameworks for technical institutes."
  },
  {
    id: "future-hod",
    period: `${currentYear + 9} (Projected)`,
    title: "Head of Department (HOD)",
    organization: "School of Computer Science & Engineering",
    status: "projected",
    iconType: "professor",
    description: "Serving as Head of Department to direct academic curriculum, research labs, institutional accreditation standards, and faculty development initiatives.",
    milestones: [
      "Oversee departmental operations and syllabus upgrades matching real-world industry demands.",
      "Foster active research collaborations and secure regional institutional accreditations.",
      "Direct technical training programs to raise on-campus placement rates."
    ],
    skills: ["Academic Leadership", "Syllabus Design", "Strategic Planning", "Faculty Management"],
    growthFocus: "Elevating departmental academic standards and placement performance."
  },
  {
    id: "future-leadership",
    period: `${currentYear + 14} (Projected)`,
    title: "Director or Dean of Academics",
    organization: "Strategic Educational University Enterprise",
    status: "projected",
    iconType: "leadership",
    description: "Directing strategic institutional placement architectures, enterprise global tech partner frameworks, and curriculum engineering at an executive scale.",
    milestones: [
      "Establish deep multi-national corporate recruitment alliances with top tech giants.",
      "Build incubation labs in collaboration with primary software enterprises.",
      "Oversee comprehensive outcome systems driving 100% campus recruitment rates."
    ],
    skills: ["Executive Strategy", "Industry Alliances", "Incubation", "Public Speaking", "Organizational Leadership"],
    growthFocus: "Fostering standard-setting academic-corporate ecosystems that produce world-class leaders."
  }
];

// Metrics mapper for Syncing to the Growth Engine

export default function CareerRoadmap({ currentTheme }: CareerRoadmapProps) {
  // Stateful nodes list
  const [nodes, setNodes] = useState<RoadmapNode[]>(() => {
    try {
      const saved = localStorage.getItem("vicky_portfolio_custom_roadmap_v2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return DEFAULT_ROADMAP_NODES;
  });

  const [activeNodeId, setActiveNodeId] = useState<string>("current-role");
  const [filter, setFilter] = useState<"all" | "past" | "future">("all");

  // Milestone checklists
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("vicky_portfolio_checked_milestones_v2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {};
  });

  // Adding Custom Nodes Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customOrg, setCustomOrg] = useState("");
  const [customPeriod, setCustomPeriod] = useState("");
  const [customStatus, setCustomStatus] = useState<"completed" | "current" | "projected">("projected");
  const [customIcon, setCustomIcon] = useState<"education" | "internship" | "professor" | "ai" | "phd" | "leadership">("leadership");
  const [customDesc, setCustomDesc] = useState("");
  const [customMilestones, setCustomMilestones] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [customGrowth, setCustomGrowth] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const saveNodes = (updatedNodes: RoadmapNode[]) => {
    setNodes(updatedNodes);
    try {
      localStorage.setItem("vicky_portfolio_custom_roadmap_v2", JSON.stringify(updatedNodes));
    } catch (e) {}
  };

  const toggleMilestone = (nodeId: string, milestoneIdx: number) => {
    playAudioCue("card-click");
    setCheckedMilestones(prev => {
      const key = `${nodeId}-${milestoneIdx}`;
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("vicky_portfolio_checked_milestones_v2", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };



  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customOrg || !customPeriod) {
      setFormError("Please fill in Title, Organization, and Period.");
      return;
    }

    setFormError(null);
    playAudioCue("card-click");
    const newId = `custom-${Date.now()}`;
    const milestonesArray = customMilestones
      ? customMilestones.split("\n").filter(line => line.trim().length > 0)
      : ["Accomplish standard training targets", "Scale core project development", "Direct academic achievements"];

    const skillsArray = customSkills
      ? customSkills.split(",").map(s => s.trim()).filter(s => s.length > 0)
      : ["Pedagogy", "Engineering", "Leadership"];

    const newNode: RoadmapNode = {
      id: newId,
      period: customPeriod,
      title: customTitle,
      organization: customOrg,
      status: customStatus,
      iconType: customIcon,
      description: customDesc || "Custom configured career roadmap milestone node added interactively by the user.",
      milestones: milestonesArray,
      skills: skillsArray,
      growthFocus: customGrowth || "Continuing technical mentoring and leadership advancements."
    };

    const updatedNodes = [...nodes, newNode];
    saveNodes(updatedNodes);
    setActiveNodeId(newId);

    // Reset fields
    setCustomTitle("");
    setCustomOrg("");
    setCustomPeriod("");
    setCustomStatus("projected");
    setCustomIcon("leadership");
    setCustomDesc("");
    setCustomMilestones("");
    setCustomSkills("");
    setCustomGrowth("");
    setShowAddForm(false);
  };

  const deleteCustomNode = (id: string) => {
    playAudioCue("card-click");
    const updatedNodes = nodes.filter(n => n.id !== id);
    saveNodes(updatedNodes);
    // Switch active node back to default current role
    setActiveNodeId("current-role");
  };

  const resetToDefaultNodes = () => {
    playAudioCue("card-click");
    setNodes(DEFAULT_ROADMAP_NODES);
    setActiveNodeId("current-role");
    localStorage.removeItem("vicky_portfolio_custom_roadmap_v2");
    setShowResetConfirm(false);
  };

  const filteredNodes = nodes.filter(node => {
    if (filter === "past") return node.status === "completed" || node.status === "current";
    if (filter === "future") return node.status === "projected";
    return true;
  });

  // Make sure active node exists in filtered list, otherwise set first available
  const activeNode = filteredNodes.find(n => n.id === activeNodeId) || filteredNodes[0] || nodes[0] || DEFAULT_ROADMAP_NODES[0];

  const handleNodeClick = (id: string) => {
    playAudioCue("card-click");
    setActiveNodeId(id);
  };

  const navigateNode = (direction: "prev" | "next") => {
    playAudioCue("card-hover");
    const currentIndex = filteredNodes.findIndex(n => n.id === activeNode.id);
    if (direction === "prev" && currentIndex > 0) {
      setActiveNodeId(filteredNodes[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < filteredNodes.length - 1) {
      setActiveNodeId(filteredNodes[currentIndex + 1].id);
    }
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          wrapper: "bg-black border border-cyan-500 p-5 font-mono text-cyan-400 rounded-none",
          title: "text-cyan-400 font-bold text-lg border-b border-cyan-500/30 pb-2 mb-4 flex items-center gap-2",
          filterBtnActive: "bg-cyan-500 text-black font-bold border border-cyan-500 px-3 py-1 rounded-none text-xs cursor-pointer",
          filterBtnInactive: "bg-black text-cyan-400/70 hover:text-cyan-400 border border-cyan-500/30 hover:border-cyan-500 px-3 py-1 rounded-none text-xs transition-colors cursor-pointer",
          timelineTrack: "bg-slate-900 border border-cyan-500/30 h-2 rounded-none my-6 relative",
          timelineProgress: "bg-cyan-400 h-full rounded-none shadow-[0_0_8px_rgba(0,229,255,0.8)]",
          nodeBtnCompleted: "border-2 border-cyan-400 bg-black text-cyan-400 shadow-[0_0_6px_rgba(0,229,255,0.4)]",
          nodeBtnCurrent: "border-2 border-cyan-400 bg-cyan-400 text-black font-extrabold animate-pulse shadow-[0_0_12px_rgba(0,229,255,0.9)]",
          nodeBtnProjected: "border-2 border-cyan-500/40 border-dashed bg-black text-cyan-400/60 hover:border-cyan-400",
          activeNodeDetails: "border border-cyan-500 bg-black p-5 rounded-none flex flex-col gap-4",
          nodeHeader: "border-b border-cyan-500/30 pb-3 flex flex-col gap-1.5",
          badgeCompleted: "bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-[10px] px-2 py-0.5 rounded-none uppercase font-bold",
          badgeCurrent: "bg-cyan-400 text-black text-[10px] px-2 py-0.5 rounded-none uppercase font-black tracking-wider",
          badgeProjected: "bg-black border border-dashed border-cyan-500/60 text-cyan-400 text-[10px] px-2 py-0.5 rounded-none uppercase",
          quoteBox: "bg-black border-l-4 border-cyan-500 pl-4 py-2 italic text-cyan-400/90 text-xs",
          tag: "bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-[10px] px-2 py-0.5 rounded-none",
          bulletIcon: "text-cyan-500",
          accentText: "text-cyan-500 font-bold",
          navBtn: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black p-1.5 transition-colors rounded-none bg-black cursor-pointer",
          desc: "text-neutral-200 text-xs sm:text-sm leading-relaxed",
          milestoneText: "text-neutral-200 text-xs leading-relaxed"
        };
      case "glass":
        return {
          wrapper: "bg-slate-950/80 backdrop-blur-md border border-white/10 p-6 text-white rounded-2xl shadow-lg",
          title: "text-white font-bold text-lg border-b border-white/10 pb-2 mb-4 flex items-center gap-2",
          filterBtnActive: "bg-violet-600 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md shadow-violet-500/20 cursor-pointer",
          filterBtnInactive: "bg-[#1A1333]/40 text-slate-400 hover:text-white border border-white/10 hover:border-violet-500/30 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer",
          timelineTrack: "bg-slate-900 border border-white/5 h-2.5 rounded-full my-6 relative",
          timelineProgress: "bg-gradient-to-r from-violet-500 to-fuchsia-450 h-full rounded-full shadow-md shadow-fuchsia-500/20",
          nodeBtnCompleted: "border-2 border-violet-500 bg-slate-900 text-violet-450 shadow-md shadow-violet-500/10",
          nodeBtnCurrent: "border-2 border-fuchsia-400 bg-fuchsia-500 text-slate-950 font-bold shadow-lg shadow-fuchsia-500/30 ring-4 ring-fuchsia-500/20",
          nodeBtnProjected: "border-2 border-slate-750 bg-slate-900 text-slate-500 hover:border-violet-500/40",
          activeNodeDetails: "border border-white/5 bg-[#1A1333]/50 p-6 rounded-xl flex flex-col gap-4",
          nodeHeader: "border-b border-white/5 pb-3 flex flex-col gap-1.5",
          badgeCompleted: "bg-violet-950/40 border border-violet-800/30 text-violet-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold",
          badgeCurrent: "bg-fuchsia-500 text-slate-950 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold tracking-wider",
          badgeProjected: "bg-slate-900 border border-slate-700 text-slate-400 text-[10px] px-2.5 py-0.5 rounded-full",
          quoteBox: "bg-violet-950/20 border-l-4 border-fuchsia-400 pl-4 py-2 italic text-slate-300 text-xs rounded-r-md",
          tag: "bg-violet-950/30 border border-violet-900/30 text-violet-300 text-[10px] px-2.5 py-0.5 rounded-full",
          bulletIcon: "text-fuchsia-400",
          accentText: "text-fuchsia-400 font-semibold",
          navBtn: "border border-violet-900/50 text-violet-300 hover:bg-violet-950/40 p-2 transition-colors rounded-full bg-slate-900 cursor-pointer",
          desc: "text-slate-300 text-xs sm:text-sm leading-relaxed",
          milestoneText: "text-slate-300 text-xs leading-relaxed"
        };
      case "minimal":
        return {
          wrapper: "bg-white border border-neutral-250 p-6 text-neutral-800 rounded-3xl shadow-xs",
          title: "text-neutral-900 font-bold text-lg border-b border-neutral-200 pb-2 mb-4 flex items-center gap-2",
          filterBtnActive: "bg-neutral-900 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-xs cursor-pointer",
          filterBtnInactive: "bg-neutral-50/45 text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer",
          timelineTrack: "bg-neutral-100 border border-neutral-200 h-2 rounded-full my-6 relative",
          timelineProgress: "bg-neutral-900 h-full rounded-full",
          nodeBtnCompleted: "border-2 border-neutral-800 bg-white text-neutral-800 shadow-xs",
          nodeBtnCurrent: "border-2 border-neutral-900 bg-neutral-950 text-white font-bold ring-4 ring-neutral-900/10",
          nodeBtnProjected: "border-2 border-neutral-300 border-dashed bg-white text-neutral-500 hover:border-neutral-800/50",
          activeNodeDetails: "border border-neutral-200 bg-neutral-50/10 p-6 rounded-2xl flex flex-col gap-4",
          nodeHeader: "border-b border-neutral-200 pb-3 flex flex-col gap-1.5",
          badgeCompleted: "bg-neutral-50 border border-neutral-200 text-neutral-800 text-[10px] px-3 py-0.5 rounded-full font-semibold",
          badgeCurrent: "bg-neutral-900 text-white text-[10px] px-3 py-0.5 rounded-full font-bold",
          badgeProjected: "bg-white border border-neutral-200 text-neutral-500 text-[10px] px-3 py-0.5 rounded-full",
          quoteBox: "bg-neutral-50/30 border-l-4 border-neutral-800 pl-4 py-2 italic text-neutral-700 text-xs rounded-r-lg",
          tag: "bg-neutral-50 border border-neutral-200 text-neutral-800 text-[10px] px-3 py-0.5 rounded-full",
          bulletIcon: "text-neutral-800",
          accentText: "text-neutral-850 font-semibold",
          navBtn: "border border-neutral-200 text-neutral-800 hover:bg-neutral-50 p-2 transition-colors rounded-full bg-white cursor-pointer",
          desc: "text-neutral-800 text-xs sm:text-sm leading-relaxed",
          milestoneText: "text-neutral-800 text-xs leading-relaxed"
        };
      case "academic":
      default:
        return {
          wrapper: "bg-white border border-slate-200 p-6 text-slate-800 rounded-lg shadow-xs",
          title: "text-slate-900 font-bold text-lg border-b border-slate-100 pb-2 mb-4 flex items-center gap-2",
          filterBtnActive: "bg-indigo-600 text-white font-semibold px-3 py-1 rounded-md text-xs cursor-pointer",
          filterBtnInactive: "bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1 rounded-md text-xs transition-colors cursor-pointer",
          timelineTrack: "bg-slate-100 border border-slate-200 h-2.5 rounded-md my-6 relative",
          timelineProgress: "bg-indigo-600 h-full rounded-md",
          nodeBtnCompleted: "border-2 border-indigo-600 bg-white text-indigo-600 shadow-xs",
          nodeBtnCurrent: "border-2 border-indigo-600 bg-indigo-600 text-white font-semibold ring-4 ring-indigo-600/15",
          nodeBtnProjected: "border-2 border-slate-300 bg-slate-50 text-slate-400 hover:border-indigo-400",
          activeNodeDetails: "border border-slate-200 bg-slate-50/50 p-6 rounded-md flex flex-col gap-4",
          nodeHeader: "border-b border-slate-200 pb-3 flex flex-col gap-1.5",
          badgeCompleted: "bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-md font-semibold",
          badgeCurrent: "bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold",
          badgeProjected: "bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-md",
          quoteBox: "bg-indigo-50/40 border-l-4 border-indigo-600 pl-4 py-2 italic text-slate-600 text-xs rounded-r-md",
          tag: "bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-md",
          bulletIcon: "text-indigo-600",
          accentText: "text-indigo-600 font-semibold",
          navBtn: "border border-slate-200 text-slate-600 hover:bg-slate-100 p-2 transition-colors rounded-md bg-white cursor-pointer",
          desc: "text-slate-600 text-xs sm:text-sm leading-relaxed",
          milestoneText: "text-slate-600 text-xs leading-relaxed"
        };
    }
  };

  const styles = getThemeStyles();

  const getIcon = (type: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="w-4 h-4" />;
      case "internship":
        return <Layers className="w-4 h-4" />;
      case "professor":
        return <Award className="w-4 h-4" />;
      case "ai":
        return <Cpu className="w-4 h-4" />;
      case "phd":
        return <BookOpen className="w-4 h-4" />;
      case "leadership":
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  // Find index of activeNode in the current array to calculate the global progress percent
  const globalIndex = nodes.findIndex(n => n.id === activeNode.id);
  const totalGlobalNodes = nodes.length;
  const progressPercent = totalGlobalNodes > 1 ? (globalIndex / (totalGlobalNodes - 1)) * 100 : 0;

  return (
    <div className={styles.wrapper} id="career-roadmap-section">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4 border-b border-inherit pb-4">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 m-0 text-inherit">
          <Rocket className="w-5 h-5 text-inherit" />
          <span>Interactive Career Roadmap & Future Projections</span>
        </h3>
        
        {/* Interactive Filters and Creation Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters Group */}
          <div className="flex items-center gap-1.5 bg-inherit/5 p-1 rounded-lg border border-inherit/10">
            <Filter className="w-3.5 h-3.5 opacity-60 ml-1" />
            <button 
              onClick={() => { playAudioCue("nav-click"); setFilter("all"); }}
              className={filter === "all" ? styles.filterBtnActive : styles.filterBtnInactive}
            >
              All
            </button>
            <button 
              onClick={() => { playAudioCue("nav-click"); setFilter("past"); }}
              className={filter === "past" ? styles.filterBtnActive : styles.filterBtnInactive}
            >
              Past & Active
            </button>
            <button 
              onClick={() => { playAudioCue("nav-click"); setFilter("future"); }}
              className={filter === "future" ? styles.filterBtnActive : styles.filterBtnInactive}
            >
              Projections
            </button>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { playAudioCue("card-click"); setShowAddForm(!showAddForm); }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 border border-amber-500/20 cursor-pointer active:scale-95 transition-all"
              title="Add a custom milestone node to this timeline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs opacity-80 leading-relaxed mb-4">
        Click on any milestone node below to review Vicky's academic achievements or interactively check off initiatives. Sync career benchmarks directly to the Growth Engine to simulate career trajectories!
      </p>

      {/* Add Custom Node Form Container */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleAddCustomNode}
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border border-dashed border-inherit/35 rounded-xl bg-white/[0.02] p-4 text-inherit text-left font-mono"
          >
            <h4 className="text-sm font-bold mb-3 flex items-center gap-1.5 text-inherit">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Configure New Career Projection / Milestone</span>
            </h4>

            {formError && (
              <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Dev or Stanford PhD Research"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={customOrg}
                  onChange={e => setCustomOrg(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Period (e.g. 2026 - 2028) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 – 2028"
                  value={customPeriod}
                  onChange={e => setCustomPeriod(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Chronological Status</label>
                <select
                  value={customStatus}
                  onChange={e => setCustomStatus(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 rounded border border-inherit/25 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="projected">Projected (Future Target)</option>
                  <option value="current">Current (Active Focus)</option>
                  <option value="completed">Completed (Past Milestone)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Milestone Category / Icon</label>
                <select
                  value={customIcon}
                  onChange={e => setCustomIcon(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 rounded border border-inherit/25 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="leadership">Leadership & Strategy</option>
                  <option value="professor">Professor / Mentoring</option>
                  <option value="phd">PhD / Academic Research</option>
                  <option value="ai">AI / Computing Focus</option>
                  <option value="education">Education & Degrees</option>
                  <option value="internship">Internship & Software Experience</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Objective Summary Description</label>
              <textarea
                rows={2}
                placeholder="Briefly summarize the primary objective or strategy of this milestone..."
                value={customDesc}
                onChange={e => setCustomDesc(e.target.value)}
                className="w-full text-xs p-2 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Key Initiatives (One Per Line)</label>
                <textarea
                  rows={3}
                  placeholder="Initiative A&#10;Initiative B&#10;Initiative C"
                  value={customMilestones}
                  onChange={e => setCustomMilestones(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Core Tech / Focus Tags (Comma-Sep)</label>
                <textarea
                  rows={3}
                  placeholder="React, PyTorch, leadership, OBE"
                  value={customSkills}
                  onChange={e => setCustomSkills(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-75 block mb-1">Growth Engine Focus Quote</label>
                <textarea
                  rows={3}
                  placeholder="Pioneering next generation systems..."
                  value={customGrowth}
                  onChange={e => setCustomGrowth(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-inherit/25 bg-black/50 text-inherit focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-inherit/10 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded text-xs border border-inherit/25 hover:bg-inherit/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer"
              >
                Add Milestone Node
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Horizontal Interactive Timeline Line */}
      <div className="w-full overflow-x-auto scrollbar-thin pb-2" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-[700px] lg:min-w-0 w-full relative px-4 sm:px-8 py-8 border border-dashed border-inherit/20 rounded-xl bg-inherit/10">
          {/* Track Line */}
          <div className={styles.timelineTrack}>
            <motion.div 
              className={styles.timelineProgress} 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Nodes Grid */}
          <div className="absolute top-1/2 left-4 sm:left-8 right-4 sm:right-8 -translate-y-1/2 flex justify-between">
            {nodes.map((node, idx) => {
              const isFilteredOut = !filteredNodes.some(fn => fn.id === node.id);
              const isNodeActive = activeNode.id === node.id;
              
              // Generate node button styling based on status and active state
              let nodeBtnClass = styles.nodeBtnProjected;
              if (node.status === "completed") nodeBtnClass = styles.nodeBtnCompleted;
              if (node.status === "current") nodeBtnClass = styles.nodeBtnCurrent;
              
              if (isNodeActive && node.status !== "current") {
                nodeBtnClass = `${nodeBtnClass} ring-4 ring-offset-2 ring-inherit border-inherit scale-110 z-20`;
              }

              return (
                <motion.div 
                  key={node.id} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: isFilteredOut ? 0.25 : 1 }}
                  whileHover={{ scale: isFilteredOut ? 1 : 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`flex flex-col items-center relative ${isFilteredOut ? "saturate-50 pointer-events-none" : ""}`}
                >
                  {/* Clickable Node */}
                  <motion.button
                    onClick={() => handleNodeClick(node.id)}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${nodeBtnClass}`}
                    title={`${node.title} (${node.period})`}
                  >
                    {getIcon(node.iconType)}
                  </motion.button>

                  {/* Period Label Floating */}
                  <span className="absolute -bottom-7 whitespace-nowrap text-[9px] sm:text-xs font-bold font-mono tracking-tight text-inherit">
                    {node.period.split(" ")[0]}
                  </span>

                  {/* Growth Project Tag Indicator */}
                  {node.status === "projected" && (
                    <span className="absolute -top-7 whitespace-nowrap text-[8px] tracking-widest uppercase font-black opacity-75">
                      Growth
                    </span>
                  )}
                  {node.status === "current" && (
                    <span className="absolute -top-7 whitespace-nowrap text-[8px] tracking-widest uppercase font-black text-emerald-600 dark:text-emerald-400 animate-pulse">
                      Active
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Details Box (Animated transition on swap) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className={styles.activeNodeDetails}
        >
          {/* Header Info */}
          <div className={styles.nodeHeader}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-inherit/20 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono">
                <Calendar className="w-3.5 h-3.5 text-inherit" />
                {activeNode.period}
              </span>
              
              <div className="flex items-center gap-2">
                {activeNode.status === "completed" && <span className={styles.badgeCompleted}>Completed</span>}
                {activeNode.status === "current" && <span className={styles.badgeCurrent}>Currently Active</span>}
                {activeNode.status === "projected" && <span className={styles.badgeProjected}>Projected</span>}
              </div>
            </div>

            <div className="mt-1">
              <h4 className="text-base sm:text-lg font-bold text-inherit m-0">
                {activeNode.title}
              </h4>
              <p className="text-xs font-mono opacity-85 mt-0.5">
                {activeNode.organization}
              </p>
            </div>
          </div>

          {/* Overarching Mission Description */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">Overarching Objective & Strategy:</span>
            <p className={styles.desc}>
              {activeNode.description}
            </p>
          </div>

          {/* Key Achievements / Targets Grid */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4 mt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                {activeNode.status === "projected" ? "Projected Key Initiatives:" : "Key Contributions & Benchmarks:"}
              </span>
              {/* Dynamic node completion calculation */}
              <div className="flex items-center gap-2 bg-inherit/10 px-2 py-0.5 rounded border border-inherit/10">
                <div className="w-16 bg-neutral-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${currentTheme === "developer" ? "bg-cyan-450" : "bg-indigo-550"}`}
                    style={{ 
                      width: `${Math.round(
                        (activeNode.milestones.filter((_, mIdx) => checkedMilestones[`${activeNode.id}-${mIdx}`]).length / 
                        Math.max(1, activeNode.milestones.length)) * 100
                      )}%` 
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold opacity-80">
                  {activeNode.milestones.filter((_, mIdx) => checkedMilestones[`${activeNode.id}-${mIdx}`]).length}/{activeNode.milestones.length}
                </span>
              </div>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-1.5">
              {activeNode.milestones.map((milestone, idx) => {
                const isChecked = !!checkedMilestones[`${activeNode.id}-${idx}`];
                return (
                  <motion.li 
                    key={idx} 
                    onClick={() => toggleMilestone(activeNode.id, idx)}
                    className={`flex items-start gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                      isChecked 
                        ? (currentTheme === "developer" ? "bg-cyan-500/5 border-cyan-500/30 text-cyan-200" : "bg-indigo-500/5 border-indigo-500/30 text-indigo-400")
                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-inherit" />
                    ) : (
                      <Square className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-500" />
                    )}
                    <span className={`text-xs leading-relaxed ${isChecked ? "line-through opacity-75" : ""}`}>
                      {milestone}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Growth Strategy Box */}
          <div className="mt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-1">Primary Growth Alignment:</span>
            <div className={styles.quoteBox}>
              "{activeNode.growthFocus}"
            </div>
          </div>

          {/* Bottom Competencies Tags & Navigation */}
          <div className="border-t border-inherit/20 pt-4 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 max-w-full sm:max-w-[70%]">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mr-1.5">Core Focus:</span>
              {activeNode.skills.map((skill, idx) => (
                <span key={idx} className={styles.tag}>{skill}</span>
              ))}
            </div>

            {/* If it's a custom node, show Delete Button */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!DEFAULT_ROADMAP_NODES.some(n => n.id === activeNode.id) && (
                <button
                  onClick={() => deleteCustomNode(activeNode.id)}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-500/20 rounded-md flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Delete this custom node"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Node</span>
                </button>
              )}

              {/* Previous/Next Nav buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateNode("prev")}
                  disabled={filteredNodes.findIndex(n => n.id === activeNode.id) === 0}
                  className={`${styles.navBtn} disabled:opacity-30 disabled:pointer-events-none`}
                  title="Previous Milestone"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold">
                  {filteredNodes.findIndex(n => n.id === activeNode.id) + 1} / {filteredNodes.length}
                </span>
                <button
                  onClick={() => navigateNode("next")}
                  disabled={filteredNodes.findIndex(n => n.id === activeNode.id) === filteredNodes.length - 1}
                  className={`${styles.navBtn} disabled:opacity-30 disabled:pointer-events-none`}
                  title="Next Milestone"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
