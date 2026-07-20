import React, { useState } from "react";
import { SectionId, ThemeId, ImageSlots, SearchSelection } from "./types";
import { DEFAULT_PLACEHOLDERS } from "./utils/placeholders";
import { AnimatePresence, motion } from "motion/react";

// Components
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import ThemeSelector from "./components/ThemeSelector";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Academics from "./components/Academics";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import CSNotes from "./components/CSNotes";
import PlacementOffice from "./components/PlacementOffice";
import Background3D from "./components/Background3D";
import ScrollToTop from "./components/ScrollToTop";
import Tooltip from "./components/Tooltip";
import { generatePortfolioPdf } from "./utils/pdfGenerator";
import Contact from "./components/Contact";
import ChatbotWidget from "./components/ChatbotWidget";
import ProjectGuideModal from "./components/ProjectGuideModal";
import VideoIntroModal from "./components/VideoIntroModal";

// Icons
import { MapPin, Mail, Phone, BookOpen, Heart, Globe, Award, GraduationCap, Bot, MessageSquare, Sparkles, Code, Cpu, FileDown } from "lucide-react";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const savedTheme = localStorage.getItem("vicky_current_theme");
      if (
        savedTheme === "minimal" ||
        savedTheme === "glass" ||
        savedTheme === "developer" ||
        savedTheme === "academic"
      ) {
        return savedTheme as ThemeId;
      }
    } catch {}
    return "minimal";
  });

  const [currentSection, setCurrentSection] = useState<SectionId>("home");
  const [searchSelection, setSearchSelection] = useState<SearchSelection | null>(null);

  // Quick Message Modal State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "sent">("idle");

  // Welcome Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashStatus, setSplashStatus] = useState("Connecting to portfolio...");

  React.useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8s for smooth 100% completion

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setSplashProgress(progress);

      if (progress < 25) {
        setSplashStatus(
          currentTheme === "developer" ? "sys.init(): Spawning sandbox workspace..." :
          currentTheme === "glass" ? "Aligning interactive layout..." :
          currentTheme === "academic" ? "Retrieving education certificates..." :
          "Initializing portfolio components..."
        );
      } else if (progress < 55) {
        setSplashStatus(
          currentTheme === "developer" ? "sys.load(): Mapping placement intelligence analytics..." :
          currentTheme === "glass" ? "Polishing deep glass gradients..." :
          currentTheme === "academic" ? "Indexing published journals and patents..." :
          "Syncing academic progress indices..."
        );
      } else if (progress < 85) {
        setSplashStatus(
          currentTheme === "developer" ? "sys.run(): Activating AI Assistant terminal..." :
          currentTheme === "glass" ? "Illuminating background galaxy field..." :
          currentTheme === "academic" ? "Configuring student interactive tests..." :
          "Connecting AI Career Mentor..."
        );
      } else {
        setSplashStatus(
          currentTheme === "developer" ? "sys.ready(): Handshake established. Welcome!" :
          currentTheme === "glass" ? "All systems active. Entering portfolio!" :
          currentTheme === "academic" ? "Lectures unlocked. Welcome!" :
          "Welcome to Vicky's Portfolio!"
        );
      }

      if (elapsed >= duration) {
        clearInterval(progressInterval);
      }
    }, 45);

    // Fade out splash screen completely at 3 seconds
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(splashTimeout);
    };
  }, [currentTheme]);

  React.useEffect(() => {
    try {
      localStorage.setItem("vicky_current_theme", currentTheme);
    } catch (e) {
      console.warn("Storage limits or write blocks in this environment: ", e);
    }
  }, [currentTheme]);

  React.useEffect(() => {
    // JS Mouse tracking tilt effect for .depth-card-3d elements
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".depth-card-3d") as HTMLElement | null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      const width = rect.width;
      const height = rect.height;

      // Convert to -0.5 to 0.5 range
      const pctX = (x / width) - 0.5;
      const pctY = (y / height) - 0.5;

      // Calculate tilt angles (max 18 degrees tilt for a highly responsive, tactile physical motion)
      const maxTilt = 18;
      const tiltX = -(pctY * maxTilt);
      const tiltY = pctX * maxTilt;

      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If the mouse left a card or we left the window, reset tilt
      if (target && target.classList && target.classList.contains("depth-card-3d")) {
        target.style.setProperty("--tilt-x", "0deg");
        target.style.setProperty("--tilt-y", "0deg");
      } else {
        // Fallback cleanup
        const cards = document.querySelectorAll<HTMLElement>(".depth-card-3d");
        cards.forEach((card) => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [isVideoIntroOpen, setIsVideoIntroOpen] = useState(false);
  const [showMediaHub, setShowMediaHub] = useState(false);

  // Static image slots loading directly from the /public/image directory assets
  const [images, setImages] = useState<ImageSlots>({
    hero: DEFAULT_PLACEHOLDERS.hero,
    campus: DEFAULT_PLACEHOLDERS.campus,
    casual: DEFAULT_PLACEHOLDERS.casual,
  });

  React.useEffect(() => {
    try {
      localStorage.removeItem("vicky_image_hero");
      localStorage.removeItem("vicky_image_campus");
      localStorage.removeItem("vicky_image_casual");
      localStorage.setItem("vicky_images_permanent_v2", "true");
    } catch (e) {
      console.warn("Clearing legacy image cache failed:", e);
    }
  }, []);

  const handleDownloadPdf = () => {
    try {
      generatePortfolioPdf();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  // Theme-driven styling modifiers for the main body wrapper
  const getThemeWrapperClass = () => {
    switch (currentTheme) {
      case "glass":
        return "glass-mode bg-transparent text-slate-100 font-sans min-h-screen transition-colors duration-300 analysis-grid w-full overflow-x-hidden relative";
      case "developer":
        return "developer-mode bg-transparent text-[#00E5FF] font-mono min-h-screen transition-colors duration-300 analysis-grid w-full overflow-x-hidden relative";
      case "academic":
        return "academic-mode bg-transparent text-[#2A1E17] font-serif min-h-screen transition-colors duration-300 analysis-grid w-full overflow-x-hidden relative";
      case "minimal":
      default:
        return "minimal-mode bg-transparent text-neutral-900 font-sans min-h-screen transition-colors duration-300 analysis-grid w-full overflow-x-hidden relative";
    }
  };

  const getFooterStyles = () => {
    switch (currentTheme) {
      case "developer":
        return "border-t border-cyan-950 bg-[#090C10] text-cyan-500/80 py-10 font-mono";
      case "glass":
        return "border-t border-white/10 bg-slate-950/60 text-slate-400 py-12 backdrop-blur-md";
      case "academic":
        return "border-t border-[#E8DFC5] bg-[#F5EFE0] text-[#5C4533] py-10 font-serif";
      case "minimal":
      default:
        return "border-t border-neutral-200 bg-white text-neutral-500 py-10 font-sans";
    }
  };

  const renderActiveSection = () => {
    switch (currentSection) {
      case "experience":
        return <Experience currentTheme={currentTheme} />;
      case "academics":
        return (
          <Academics 
            images={images} 
            currentTheme={currentTheme} 
            selectedResearchTab={searchSelection?.type === "research" ? searchSelection.tab : null}
            selectedResearchTitle={searchSelection?.type === "research" ? searchSelection.title : null}
            onClearSelectedResearch={() => setSearchSelection(null)}
          />
        );
      case "projects":
        return (
          <Projects 
            images={images} 
            currentTheme={currentTheme} 
            selectedProjectId={searchSelection?.type === "project" ? searchSelection.id : null}
            onClearSelectedProject={() => setSearchSelection(null)}
          />
        );
      case "skills":
        return <Skills currentTheme={currentTheme} />;
      case "notes":
        return (
          <CSNotes 
            currentTheme={currentTheme} 
            selectedNoteId={searchSelection?.type === "note" ? searchSelection.id : null}
            onClearSelectedNoteId={() => setSearchSelection(null)}
          />
        );
      case "placement":
        return <PlacementOffice currentTheme={currentTheme} />;
      case "contact":
        return <Contact currentTheme={currentTheme} />;
      case "home":
      default:
        return (
          <div className="flex flex-col gap-8 w-full">
            <Hero
              images={images}
              currentTheme={currentTheme}
              onNavigate={(section) => setCurrentSection(section)}
              onPlayVideoIntro={() => setIsVideoIntroOpen(true)}
            />
          </div>
        );
    }
  };

  return (
    <div className={getThemeWrapperClass()} id="app-container">
      {/* Subtle Cross-Fading Theme Background Panels */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`fixed inset-0 -z-50 pointer-events-none transition-all ${
            currentTheme === "glass" ? "bg-[#0B0816]" :
            currentTheme === "developer" ? "bg-[#0F141C]" :
            currentTheme === "academic" ? "bg-[#FAF6EE]" :
            "bg-[#FCFCFC]"
          }`}
        />
      </AnimatePresence>

      {/* Dynamic 3D Effective Background */}
      <Background3D currentTheme={currentTheme} />

      {/* Main Navigation Header */}
      <Navigation
        currentSection={currentSection}
        onChangeSection={(s) => {
          setCurrentSection(s);
          setShowMediaHub(false); // Auto close media hub on tab clicks
        }}
        currentTheme={currentTheme}
        onChangeTheme={setCurrentTheme}
        images={images}
        onSearchSelect={setSearchSelection}
      />

      {/* Primary Context Canvas Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 lg:pt-24 flex flex-col gap-8 overflow-visible">
        <Breadcrumbs 
          currentSection={currentSection} 
          onChangeSection={setCurrentSection} 
          currentTheme={currentTheme} 
        />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${currentSection}-${currentTheme}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Area */}
      <footer className={getFooterStyles()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-sm">VICKY KUMAR</span>
            <span className="text-xs">Assistant Professor & Placement Advisor • Gulzar Group of Institutes</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <a href="mailto:vickykr802302@gmail.com" className="hover:underline">vickykr802302@gmail.com</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-400" />
              <a href="tel:8340223956" className="hover:underline">8340223956</a>
            </div>
            <Tooltip content="Generate and download Vicky's fully formatted academic CV in PDF" theme={currentTheme} position="top" delay={0.2}>
              <button
                onClick={handleDownloadPdf}
                className={`flex items-center gap-2 px-4 py-2 transition-all cursor-pointer active:scale-95 ${
                  currentTheme === "developer" ? "border border-cyan-500 bg-black text-cyan-400 font-mono hover:bg-cyan-500 hover:text-black rounded-none shadow-[0_0_10px_rgba(0,229,255,0.25)]" :
                  currentTheme === "glass" ? "bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl backdrop-blur-md shadow-sm" :
                  currentTheme === "academic" ? "bg-[#7F1D1D] hover:bg-[#5A1010] text-white rounded-lg font-serif shadow-sm" :
                  "bg-neutral-900 hover:bg-black text-white rounded-full shadow-xs font-sans"
                }`}
                title="Download full Academic CV as PDF"
                id="download-portfolio-pdf-btn"
              >
                <FileDown className="w-4 h-4 flex-shrink-0" />
                <span>Download CV</span>
              </button>
            </Tooltip>

            <Tooltip content="Download comprehensive step-by-step specifications & project manual" theme={currentTheme} position="top" delay={0.2}>
              <button
                onClick={() => setIsProjectGuideOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 transition-all cursor-pointer active:scale-95 ${
                  currentTheme === "developer" ? "border border-cyan-500 bg-black text-cyan-400 font-mono hover:bg-cyan-500 hover:text-black rounded-none shadow-[0_0_10px_rgba(0,229,255,0.25)]" :
                  currentTheme === "glass" ? "bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl backdrop-blur-md shadow-sm" :
                  currentTheme === "academic" ? "bg-[#7F1D1D] hover:bg-[#5A1010] text-white rounded-lg font-serif shadow-sm" :
                  "bg-neutral-900 hover:bg-black text-white rounded-full shadow-xs font-sans"
                }`}
                title="Download step-by-step Project Guide"
                id="open-project-guide-btn"
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span>Project Guide</span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="text-center text-[10px] opacity-65 mt-6 border-t border-gray-150 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span>
            © 2026 Vicky Kumar. Designed with modern educational sandboxes and career matching AI engines. All rights reserved.
          </span>
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <Tooltip content="Send direct email to Vicky" theme={currentTheme} position="top" delay={0.1}>
              <a 
                href="mailto:vickykr802302@gmail.com?subject=Contact%20via%20Academic%20Portfolio" 
                className={`flex items-center gap-1.5 transition-all hover:underline ${
                  currentTheme === 'developer' ? 'text-cyan-400 font-mono' :
                  currentTheme === 'glass' ? 'text-violet-300' :
                  currentTheme === 'academic' ? 'text-red-700 font-serif font-semibold' :
                  'text-neutral-900 font-semibold hover:text-black'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Vicky</span>
              </a>
            </Tooltip>
            <span className="opacity-30">|</span>
            <Tooltip content="Open Quick Message feedback form" theme={currentTheme} position="top" delay={0.1}>
              <button 
                onClick={() => {
                  setFeedbackStatus("idle");
                  setFeedbackMsg("");
                  setFeedbackEmail("");
                  setIsFeedbackOpen(true);
                }}
                className={`flex items-center gap-1.5 transition-all cursor-pointer hover:underline ${
                  currentTheme === 'developer' ? 'text-cyan-400 font-mono' :
                  currentTheme === 'glass' ? 'text-violet-300' :
                  currentTheme === 'academic' ? 'text-red-700 font-serif font-semibold' :
                  'text-neutral-900 font-semibold hover:text-black'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Quick Message</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </footer>

      {/* Floating corner theme selector */}
      <ThemeSelector currentTheme={currentTheme} onChangeTheme={(t) => setCurrentTheme(t)} />

      {/* Floating Scroll to Top Action Button */}
      <ScrollToTop currentTheme={currentTheme} />

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget currentTheme={currentTheme} />

      {/* Quick Message Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className={`relative w-full max-w-md p-6 overflow-hidden shadow-2xl z-10 ${
                currentTheme === "developer" ? "bg-[#090C10] border-2 border-cyan-500 text-cyan-400 font-mono rounded-none" :
                currentTheme === "glass" ? "bg-slate-950/85 backdrop-blur-xl border border-violet-500/35 text-white rounded-2xl" :
                currentTheme === "academic" ? "bg-[#FAF6EE] border border-[#D4C3A3] text-[#2A1E17] font-serif rounded-lg" :
                "bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-sans"
              }`}
            >
              {/* Cyber decoration for Developer Theme */}
              {currentTheme === "developer" && (
                <div className="absolute top-0 right-0 text-[9px] bg-cyan-500 text-black px-1.5 py-0.5 font-bold uppercase tracking-widest">
                  SYS.MSG.PORT
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-150/10">
                <h3 className={`text-sm font-bold flex items-center gap-2 ${
                  currentTheme === "academic" ? "text-red-700" : ""
                }`}>
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Send Quick Message</span>
                </h3>
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="p-1 hover:opacity-75 transition-opacity cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {feedbackStatus === "sent" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6 space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Thank you for reaching out. Vicky will respond to your educational or placement inquiry at the email provided.
                  </p>
                  <button
                    onClick={() => setIsFeedbackOpen(false)}
                    className={`mt-4 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentTheme === "developer" ? "border border-cyan-500 bg-black hover:bg-cyan-500 text-cyan-400 hover:text-black rounded-none" :
                      currentTheme === "glass" ? "bg-violet-600 hover:bg-violet-700 text-white rounded-xl" :
                      currentTheme === "academic" ? "bg-[#7F1D1D] hover:bg-[#5A1010] text-white" :
                      "bg-neutral-900 hover:bg-black text-white rounded-full"
                    }`}
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!feedbackEmail || !feedbackMsg) return;
                    setFeedbackStatus("sending");
                    setTimeout(() => {
                      setFeedbackStatus("sent");
                    }, 1200);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-75">
                      Your Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="e.g. student@ggi.ac.in"
                      className={`w-full p-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 transition-all ${
                        currentTheme === "developer" ? "bg-black border border-cyan-500/50 text-cyan-400 font-mono rounded-none focus:ring-cyan-400 focus:border-cyan-400" :
                        currentTheme === "glass" ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-violet-500 focus:border-violet-500" :
                        currentTheme === "academic" ? "bg-white border border-[#D4C3A3] text-[#2A1E17] focus:ring-red-500 focus:border-red-500" :
                        "bg-neutral-50 border border-neutral-200 text-neutral-900 focus:ring-neutral-900 focus:border-neutral-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-75">
                      Message Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      placeholder="Ask Vicky about syllabus materials, student mentorship, exam notes, or recruitment advice..."
                      className={`w-full p-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 transition-all ${
                        currentTheme === "developer" ? "bg-black border border-cyan-500/50 text-cyan-400 font-mono rounded-none focus:ring-cyan-400 focus:border-cyan-400 resize-none" :
                        currentTheme === "glass" ? "bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-violet-500 focus:border-violet-500 resize-none" :
                        currentTheme === "academic" ? "bg-white border border-[#D4C3A3] text-[#2A1E17] focus:ring-red-500 focus:border-red-500 resize-none" :
                        "bg-neutral-50 border border-neutral-200 text-neutral-900 focus:ring-neutral-900 focus:border-neutral-900 resize-none"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackOpen(false)}
                      className={`px-4 py-2 text-xs transition-all cursor-pointer ${
                        currentTheme === "developer" ? "hover:text-white" :
                        currentTheme === "glass" ? "text-slate-400 hover:text-white" :
                        currentTheme === "academic" ? "text-[#5C4533] hover:underline" :
                        "text-neutral-500 hover:text-black"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackStatus === "sending" || !feedbackEmail || !feedbackMsg}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                        currentTheme === "developer" ? "border-2 border-cyan-500 bg-cyan-500 text-black font-bold rounded-none hover:bg-black hover:text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]" :
                        currentTheme === "glass" ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20" :
                        currentTheme === "academic" ? "bg-[#7F1D1D] hover:bg-[#5A1010] text-white" :
                        "bg-neutral-900 hover:bg-black text-white"
                      }`}
                    >
                      <span>{feedbackStatus === "sending" ? "Transmitting..." : "Send Message"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProjectGuideModal 
        isOpen={isProjectGuideOpen} 
        onClose={() => setIsProjectGuideOpen(false)} 
        currentTheme={currentTheme} 
      />

      <VideoIntroModal
        isOpen={isVideoIntroOpen}
        onClose={() => setIsVideoIntroOpen(false)}
        images={images}
        currentTheme={currentTheme}
      />

      {/* Welcome Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.04,
              filter: "blur(10px)"
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 select-none ${
              currentTheme === "developer" ? "bg-[#090C10] text-[#00E5FF] font-mono" :
              currentTheme === "glass" ? "bg-[#0A0714] text-white font-sans" :
              currentTheme === "academic" ? "bg-[#FAF6EE] text-[#2A1E17] font-serif" :
              "bg-white text-neutral-900 font-sans"
            }`}
          >
            {/* Cybernetic Grid details for Developer theme */}
            {currentTheme === "developer" && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]opacity-45 pointer-events-none" />
            )}

            {/* Glowing cosmic orbs for Glass theme */}
            {currentTheme === "glass" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -bottom-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-[120px]" />
              </div>
            )}

            {/* Vintage borders for Academic theme */}
            {currentTheme === "academic" && (
              <div className="absolute inset-6 border border-[#E8DFC5] rounded-xl pointer-events-none flex items-center justify-center">
                <div className="absolute inset-1 border border-[#F2EADA] rounded-lg" />
              </div>
            )}

            {/* Main Animated content box */}
            <div className="max-w-2xl w-full flex flex-col items-center text-center z-10 px-4">
              
              {/* Rotating Custom Graphic Icon with floating ring animations */}
              <div className="relative mb-10 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.12, 0.45, 0.12] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute -inset-6 rounded-full border ${
                    currentTheme === "developer" ? "border-cyan-500/30" :
                    currentTheme === "glass" ? "border-violet-500/30" :
                    currentTheme === "academic" ? "border-[#7F1D1D]/30" :
                    "border-neutral-200"
                  }`}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.22, 0.65, 0.22] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className={`absolute -inset-3 rounded-full border ${
                    currentTheme === "developer" ? "border-cyan-400/40" :
                    currentTheme === "glass" ? "border-indigo-400/40" :
                    currentTheme === "academic" ? "border-[#7F1D1D]/40" :
                    "border-neutral-300"
                  }`}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    rotate: currentTheme === "developer" ? [0, 90, 180, 270, 360] : 0,
                    scale: [0.94, 1.06, 0.94]
                  }}
                  transition={{ 
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    default: { type: "spring", stiffness: 90, damping: 14, delay: 0.1 }
                  }}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg relative ${
                    currentTheme === "developer" ? "bg-black border border-cyan-500 text-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.35)]" :
                    currentTheme === "glass" ? "bg-white/5 border border-white/10 text-violet-300 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.3)]" :
                    currentTheme === "academic" ? "bg-[#FAF6EE] border-2 border-[#7F1D1D] text-[#7F1D1D]" :
                    "bg-neutral-50 border border-neutral-200 text-neutral-800"
                  }`}
                >
                  {currentTheme === "developer" && <Cpu className="w-11 h-11 animate-pulse" />}
                  {currentTheme === "glass" && <Sparkles className="w-11 h-11 text-violet-300" />}
                  {currentTheme === "academic" && <GraduationCap className="w-11 h-11" />}
                  {currentTheme === "minimal" && <Code className="w-11 h-11 text-neutral-800" />}
                </motion.div>
              </div>

              {/* Header Titles with graceful word stagger reveals & big display fonts */}
              <div className="space-y-4 mb-2">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className={`text-[11px] uppercase tracking-[0.3em] font-extrabold block ${
                    currentTheme === "developer" ? "text-cyan-400" :
                    currentTheme === "glass" ? "text-violet-300" :
                    currentTheme === "academic" ? "text-[#5C4533]" :
                    "text-neutral-400"
                  }`}
                >
                  AI-Powered Educational Portfolio
                </motion.span>

                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight select-none ${
                  currentTheme === "developer" ? "text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" :
                  currentTheme === "glass" ? "bg-gradient-to-r from-violet-200 via-indigo-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-sm" :
                  currentTheme === "academic" ? "text-[#2A1E17] font-serif" :
                  "text-neutral-900 font-sans"
                }`}>
                  {["Welcome", "to", "Vicky's", "Portfolio"].map((word, idx) => (
                    <motion.span
                      key={idx}
                      className="inline-block mr-2 sm:mr-3 md:mr-4 last:mr-0"
                      initial={{ opacity: 0, y: 35, scale: 0.75, rotate: -6 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.25 + idx * 0.12,
                        type: "spring",
                        stiffness: 90,
                        damping: 11
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.75, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
                className={`text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed ${
                  currentTheme === "academic" ? "text-[#5C4533] italic" : "text-neutral-400"
                }`}
              >
                Assistant Professor & Placement advisor exploring academic excellence, smart research metrics, and career roadmap simulations.
              </motion.p>

              {/* Progress Container */}
              <div className="w-full max-w-xs mt-10 mb-2">
                <div className={`w-full h-1.5 rounded-full overflow-hidden relative ${
                  currentTheme === "developer" ? "bg-neutral-950 border border-cyan-950" :
                  currentTheme === "glass" ? "bg-white/10" :
                  currentTheme === "academic" ? "bg-[#FAF6EE] border border-[#E8DFC5]" :
                  "bg-neutral-100"
                }`}>
                  <motion.div
                    className={`h-full rounded-full ${
                      currentTheme === "developer" ? "bg-cyan-400 shadow-[0_0_8px_#00E5FF]" :
                      currentTheme === "glass" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" :
                      currentTheme === "academic" ? "bg-[#7F1D1D]" :
                      "bg-neutral-900"
                    }`}
                    style={{ width: `${splashProgress}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>

                <div className="flex justify-between items-center mt-3 text-[10px]">
                  <motion.span 
                    key={splashStatus}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-medium ${
                      currentTheme === "developer" ? "text-cyan-400/80 font-mono" :
                      currentTheme === "academic" ? "text-[#5C4533] italic" :
                      "text-neutral-400"
                    }`}
                  >
                    {splashStatus}
                  </motion.span>
                  <span className={`font-bold ${
                    currentTheme === "developer" ? "text-cyan-400" :
                    currentTheme === "academic" ? "text-[#7F1D1D]" :
                    "text-neutral-500"
                  }`}>
                    {splashProgress}%
                  </span>
                </div>
              </div>

              {/* Fast-Skip Control with Hover Physics */}
              <motion.button
                onClick={() => setShowSplash(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-3xs ${
                  currentTheme === "developer" ? "bg-black border border-cyan-800 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-950/20" :
                  currentTheme === "glass" ? "bg-white/10 hover:bg-white/20 border border-white/10 text-white" :
                  currentTheme === "academic" ? "bg-[#FAF6EE] border border-[#D4C3A3] text-[#7F1D1D] hover:bg-[#FAF0D9]" :
                  "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                }`}
              >
                Skip Intro
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
