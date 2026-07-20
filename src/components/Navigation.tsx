import React, { useState, useEffect } from "react";
import { SectionId, ThemeId, ImageSlots, SearchSelection } from "@/types";
import { 
  Home, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  UserCheck, 
  Menu, 
  X,
  Award,
  Notebook,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Tooltip from "./Tooltip";

interface NavigationProps {
  currentSection: SectionId;
  onChangeSection: (section: SectionId) => void;
  currentTheme: ThemeId;
  onChangeTheme?: (theme: ThemeId) => void;
  images?: ImageSlots;
  onSearchSelect?: (selection: SearchSelection) => void;
}

export default function Navigation({ 
  currentSection, 
  onChangeSection, 
  currentTheme, 
  images 
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Synchronize mobile menu open state to body class
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-nav-open");
    } else {
      document.body.classList.remove("mobile-nav-open");
    }
    return () => {
      document.body.classList.remove("mobile-nav-open");
    };
  }, [isOpen]);

  const navItems: { id: SectionId; label: string; icon: React.ComponentType<any> }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Award },
    { id: "notes", label: "CS Notes", icon: Notebook },
    { id: "placement", label: "Placement Office", icon: UserCheck },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Styling helpers based on theme to ensure cohesive and immersive look matching the active theme
  const getNavStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          header: "border-b border-cyan-950/80 bg-[#0F141C]/95 backdrop-blur-md text-[#00E5FF] font-mono",
          logo: "text-base lg:text-md xl:text-lg font-bold tracking-wider text-cyan-400 flex-shrink-0",
          itemActive: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-none",
          itemInactive: "text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/20 border border-transparent",
          mobileBtn: "border border-cyan-500/30 text-cyan-400 p-1.5",
          mobileMenu: "absolute left-0 right-0 top-14 bg-[#0F141C]/98 border-b border-cyan-950 shadow-2xl z-50",
          mobileItemActive: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold",
          mobileItemInactive: "text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/20 border border-transparent",
        };
      case "glass":
        return {
          header: "border-b border-white/10 bg-slate-950/40 backdrop-blur-xl text-white font-sans",
          logo: "text-base lg:text-md xl:text-lg font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight flex-shrink-0",
          itemActive: "bg-violet-600/25 text-violet-200 border border-violet-500/35 rounded-lg shadow-lg shadow-violet-500/10",
          itemInactive: "text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
          mobileBtn: "text-violet-400 p-1.5 bg-violet-950/20 rounded-xl",
          mobileMenu: "absolute left-0 right-0 top-14 bg-[#0B0816]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50",
          mobileItemActive: "bg-violet-600/25 text-violet-200 border border-violet-500/35 shadow-lg shadow-violet-500/10 rounded-lg",
          mobileItemInactive: "text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg",
        };
      case "academic":
        return {
          header: "border-b border-[#D4C3A3] bg-[#FAF6EE]/95 backdrop-blur-md text-[#5C2D11] font-serif shadow-sm",
          logo: "text-base lg:text-md xl:text-lg font-serif font-bold text-[#7F1D1D] tracking-tight flex-shrink-0",
          itemActive: "text-[#7F1D1D] border-b-2 border-[#7F1D1D] font-bold",
          itemInactive: "text-[#5C2D11]/75 hover:text-[#7F1D1D] font-medium transition-colors duration-200",
          mobileBtn: "text-[#7F1D1D] p-2 hover:bg-[#FAF0D9] rounded-lg",
          mobileMenu: "absolute left-0 right-0 top-14 bg-[#FAF6EE] border-b border-[#D4C3A3] shadow-lg z-50",
          mobileItemActive: "text-[#7F1D1D] bg-[#FAF0D9] font-bold",
          mobileItemInactive: "text-[#5C2D11]/75 hover:text-[#7F1D1D] font-medium transition-colors duration-200",
        };
      case "minimal":
      default:
        return {
          header: "border-b border-neutral-200 bg-white/95 backdrop-blur-md text-neutral-850 font-sans",
          logo: "text-base lg:text-md xl:text-lg font-extrabold text-neutral-900 tracking-tight flex-shrink-0",
          itemActive: "bg-neutral-950 text-white rounded-full font-semibold",
          itemInactive: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all duration-200",
          mobileBtn: "text-neutral-800 bg-neutral-100 p-2 rounded-full",
          mobileMenu: "absolute left-0 right-0 top-14 bg-white border-b border-neutral-200 shadow-lg z-50",
          mobileItemActive: "bg-neutral-950 text-white font-semibold rounded-full",
          mobileItemInactive: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 rounded-full",
        };
    }
  };

  const styles = getNavStyles();

  const getShapeClass = () => {
    switch (currentTheme) {
      case "glass":
        return "rounded-full border-violet-400/50 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 transition-all duration-300 ring-2 ring-violet-950/20 bg-slate-900";
      case "developer":
        return "rounded-full border border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.4)] ring-1 ring-black bg-black";
      case "academic":
        return "rounded-full border-[#D4C3A3] shadow-xs ring-2 ring-[#FAF0D9] bg-[#FAF6EE]";
      case "minimal":
      default:
        return "rounded-full border-neutral-200 shadow-sm transition-all duration-300 bg-white";
    }
  };

  const tooltips: Record<SectionId, string> = {
    home: "Academic Overview & Main Introduction",
    experience: "Review Teaching, Placement & Dev Experience",
    academics: "Browse Scholarly Papers, Publications & Credentials",
    projects: "Explore Engineering Projects & AI Systems",
    skills: "Inspect Technical Strengths & IIT Certifications",
    notes: "Read or Compose CS Syllabus Study Notes",
    placement: "Access Quiz Kits, Mock Prep & Resume Critique Tools",
    contact: "Send a Direct Inquiry or Message to Vicky Kumar",
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${styles.header}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
          
          {/* Logo area */}
          <div className="flex-shrink-0 flex items-center gap-2 lg:gap-3">
            <div className={`w-8 h-8 lg:w-9 lg:h-9 flex-shrink-0 overflow-hidden rounded-full relative border transition-all duration-300 ${getShapeClass()}`}>
              {images?.hero?.startsWith("<svg") ? (
                <div 
                  className="w-full h-full scale-[1.3] origin-center flex items-center justify-center rounded-full" 
                  dangerouslySetInnerHTML={{ __html: images.hero }} 
                />
              ) : (
                <img 
                  src={images?.hero} 
                  alt="Vicky Kumar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-full" 
                  id="avatar-image-logo"
                />
              )}
            </div>
            <span className={`${styles.logo} cursor-pointer`} onClick={() => onChangeSection("home")}>
              VICKY KUMAR
            </span>
            {currentTheme === "developer" && <span className="animate-pulse">_</span>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <Tooltip 
                  key={item.id} 
                  content={tooltips[item.id] || "Navigate"} 
                  theme={currentTheme} 
                  position="bottom" 
                  delay={0.1}
                >
                  <button
                    onClick={() => onChangeSection(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                      isActive ? styles.itemActive : styles.itemInactive
                    }`}
                    id={`nav-link-${item.id}`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-1.5 focus:outline-none transition-colors ${styles.mobileBtn}`}
              aria-label="Toggle navigation menu"
              id="mobile-nav-toggle"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`xl:hidden w-full overflow-hidden ${styles.mobileMenu}`}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChangeSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all duration-150 rounded-md ${
                      isActive ? styles.mobileItemActive : styles.mobileItemInactive
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
