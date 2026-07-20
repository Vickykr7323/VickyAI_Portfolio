import React from "react";
import { SectionId, ThemeId } from "@/types";
import { 
  Home, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  Notebook, 
  UserCheck, 
  Bot, 
  ChevronRight,
  Mail
} from "lucide-react";
import { playAudioCue } from "@/utils/audio";

interface BreadcrumbsProps {
  currentSection: SectionId;
  onChangeSection: (section: SectionId) => void;
  currentTheme: ThemeId;
}

const sectionConfig: Record<SectionId, { label: string; icon: React.ComponentType<any> }> = {
  home: { label: "Home", icon: Home },
  experience: { label: "Career & Experience", icon: Briefcase },
  academics: { label: "Academic Foundation", icon: GraduationCap },
  projects: { label: "Projects & Research", icon: FolderGit2 },
  skills: { label: "Core Skills", icon: Award },
  notes: { label: "CS Study Notes", icon: Notebook },
  placement: { label: "Placement Office", icon: UserCheck },
  contact: { label: "Contact Vicky", icon: Mail }
};

export default function Breadcrumbs({ 
  currentSection, 
  onChangeSection, 
  currentTheme
}: BreadcrumbsProps) {
  
  const getThemeContainerClass = () => {
    switch (currentTheme) {
      case "developer":
        return "font-mono text-[11px] uppercase tracking-wider text-cyan-400 bg-black/60 border border-cyan-500/30 p-2.5 flex items-center flex-wrap gap-1.5 select-none rounded-none w-full shadow-[0_0_15px_rgba(6,182,212,0.05)]";
      case "glass":
        return "font-sans text-xs text-slate-300 bg-slate-950/45 backdrop-blur-xl border border-white/10 px-4 py-3 flex items-center flex-wrap gap-2 select-none rounded-2xl shadow-xl shadow-violet-950/10 w-full";
      case "academic":
        return "font-serif text-sm text-[#5C4533] bg-[#FDFBF7] border border-[#D4C3A3] px-4 py-3 flex items-center flex-wrap gap-2 select-none rounded-xl shadow-sm w-full";
      case "minimal":
      default:
        return "font-sans text-xs text-neutral-500 bg-neutral-50/70 border border-neutral-200 px-4 py-2.5 flex items-center flex-wrap gap-1.5 select-none rounded-2xl shadow-3xs w-full";
    }
  };

  const getThemeItemClass = (isActive: boolean) => {
    if (isActive) {
      switch (currentTheme) {
        case "developer":
          return "text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 flex items-center gap-1";
        case "glass":
          return "text-violet-200 bg-violet-600/20 border border-violet-500/30 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shadow-sm shadow-violet-500/5";
        case "academic":
          return "text-[#7F1D1D] font-bold font-serif flex items-center gap-1.5";
        case "minimal":
        default:
          return "text-neutral-950 font-semibold bg-white border border-neutral-200 shadow-3xs px-2.5 py-1 rounded-full flex items-center gap-1.5";
      }
    } else {
      switch (currentTheme) {
        case "developer":
          return "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 px-2 py-0.5 border border-transparent transition-all duration-150 cursor-pointer flex items-center gap-1";
        case "glass":
          return "text-slate-400 hover:text-white hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5";
        case "academic":
          return "text-[#5C4533]/80 hover:text-[#7F1D1D] hover:underline transition-all duration-150 cursor-pointer flex items-center gap-1.5";
        case "minimal":
        default:
          return "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1.5";
      }
    }
  };

  const getSeparatorElement = () => {
    switch (currentTheme) {
      case "developer":
        return <span className="text-cyan-600/60 font-bold mx-1.5">/</span>;
      case "glass":
        return <ChevronRight className="w-3.5 h-3.5 text-violet-500/40" />;
      case "academic":
        return <span className="text-[#D4C3A3] font-serif font-bold text-sm mx-1">›</span>;
      case "minimal":
      default:
        return <ChevronRight className="w-3 h-3 text-neutral-300" />;
    }
  };

  const handleClick = (section: SectionId) => {
    playAudioCue("nav-click");
    onChangeSection(section);
  };

  const isHome = currentSection === "home";
  const HomeIcon = sectionConfig.home.icon;
  const CurrentIcon = sectionConfig[currentSection]?.icon || Home;

  return (
    <div 
      className="w-full flex items-center overflow-x-auto no-scrollbar"
      id="breadcrumbs-wrapper"
    >
      <div 
        className={getThemeContainerClass()} 
        id="breadcrumbs-container"
      >
        {/* Home Item */}
        <button
          onClick={() => handleClick("home")}
          className={getThemeItemClass(isHome)}
          id="breadcrumb-btn-home"
          type="button"
          disabled={isHome}
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>{sectionConfig.home.label}</span>
        </button>

        {/* Dynamic Inner Item */}
        {!isHome && (
          <>
            {getSeparatorElement()}
            <button
              onClick={() => handleClick(currentSection)}
              className={getThemeItemClass(true)}
              id={`breadcrumb-btn-${currentSection}`}
              type="button"
              disabled={true}
            >
              <CurrentIcon className="w-3.5 h-3.5" />
              <span>{sectionConfig[currentSection]?.label || currentSection}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
