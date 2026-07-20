import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Download, 
  FileText, 
  BookOpen, 
  Terminal, 
  Settings, 
  Wrench, 
  CheckCircle,
  FolderTree
} from "lucide-react";
import { 
  generateProjectGuideMd, 
  generateProjectGuidePdf, 
  PROJECT_GUIDE_SECTIONS 
} from "../utils/projectGuideGenerator";

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
}

export default function ProjectGuideModal({ isOpen, onClose, currentTheme }: ProjectGuideModalProps) {
  const handleDownloadMd = () => {
    try {
      generateProjectGuideMd();
    } catch (e) {
      console.error("Markdown download failed", e);
    }
  };

  const handleDownloadPdf = () => {
    try {
      generateProjectGuidePdf();
    } catch (e) {
      console.error("PDF download failed", e);
    }
  };

  // Get icons dynamically based on sections
  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 1:
        return <Terminal className="w-5 h-5 text-cyan-500" />;
      case 2:
        return <Settings className="w-5 h-5 text-emerald-500" />;
      case 3:
        return <Wrench className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-violet-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className={`relative w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10 ${
              currentTheme === "developer" 
                ? "bg-[#090C10] border-2 border-cyan-500 text-cyan-400 font-mono rounded-none" :
              currentTheme === "glass" 
                ? "bg-slate-950/90 border border-violet-500/25 text-white rounded-2xl backdrop-blur-xl" :
              currentTheme === "academic" 
                ? "bg-[#FAF6EE] border-2 border-[#D4C3A3] text-[#2A1E17] font-serif rounded-lg" :
              "bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-sans"
            }`}
          >
            {/* Modal Header */}
            <div className={`p-6 flex items-center justify-between border-b ${
              currentTheme === "developer" ? "border-cyan-950" :
              currentTheme === "glass" ? "border-white/10" :
              currentTheme === "academic" ? "border-[#E8DFC5]" :
              "border-neutral-100"
            }`}>
              <div>
                <span className={`text-[10px] uppercase tracking-widest font-extrabold block mb-0.5 ${
                  currentTheme === "developer" ? "text-cyan-500" : "text-indigo-500"
                }`}>
                  System Specifications & Customization
                </span>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span>Step-by-Step Project Guide</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                    Downloadable
                  </span>
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer text-sm font-bold flex items-center gap-1 border border-transparent hover:border-gray-150 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 select-text">
              {/* Top Banner introducing the Guide */}
              <div className={`p-4 rounded-xl border ${
                currentTheme === "developer" ? "bg-black border-cyan-950/60" :
                currentTheme === "glass" ? "bg-white/5 border-white/5" :
                currentTheme === "academic" ? "bg-[#FAF0D9] border-[#E8DFC5]" :
                "bg-neutral-50 border-neutral-100"
              }`}>
                <p className="text-xs leading-relaxed opacity-90">
                  This blueprint contains a comprehensive breakdown of the entire architecture, directory configurations, 
                  and step-by-step deployment structures for Vicky Kumar's Portfolio platform. Click the download buttons 
                  below to save these guidelines locally.
                </p>
                
                {/* Download Actions inside the Banner */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Blueprint (PDF)</span>
                  </button>

                  <button
                    onClick={handleDownloadMd}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg transition-all cursor-pointer active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Markdown (.md)</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Sections Grid */}
              <div className="space-y-6">
                {PROJECT_GUIDE_SECTIONS.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getSectionIcon(idx)}
                      <h3 className="text-sm font-extrabold tracking-tight">
                        {section.title}
                      </h3>
                    </div>
                    <div className={`pl-7 space-y-2 border-l-2 ml-2 ${
                      currentTheme === "developer" ? "border-cyan-950" :
                      currentTheme === "glass" ? "border-white/5" :
                      currentTheme === "academic" ? "border-[#E8DFC5]" :
                      "border-neutral-100"
                    }`}>
                      {section.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2 text-xs leading-relaxed opacity-85">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Section 5: Directories Map */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-rose-500" />
                    <h3 className="text-sm font-extrabold tracking-tight">
                      5. Architectural Map & Code Directories
                    </h3>
                  </div>
                  <div className={`pl-7 space-y-3 border-l-2 ml-2 ${
                    currentTheme === "developer" ? "border-cyan-950" :
                    currentTheme === "glass" ? "border-white/5" :
                    currentTheme === "academic" ? "border-[#E8DFC5]" :
                    "border-neutral-100"
                  }`}>
                    <div className="text-xs space-y-1.5 opacity-85">
                      <p>
                        📁 <code className="bg-black/10 px-1 py-0.5 rounded text-rose-600 font-semibold font-mono">/src/App.tsx</code> — Primary routing, theme styling, splash intro screen, and direct customer email feedback.
                      </p>
                      <p>
                        📁 <code className="bg-black/10 px-1 py-0.5 rounded text-rose-600 font-semibold font-mono">/src/components/</code> — Highly modular, interactive dashboard modules including the Academics hub, Placement quiz portal, and MediaVault.
                      </p>
                      <p>
                        📁 <code className="bg-black/10 px-1 py-0.5 rounded text-rose-600 font-semibold font-mono">/src/utils/</code> — Modular system background tasks (audio synthetics, PDF engines, project exporters).
                      </p>
                      <p>
                        📁 <code className="bg-black/10 px-1 py-0.5 rounded text-rose-600 font-semibold font-mono">/src/data/</code> — Curated offline databases with preloaded examination questions and lesson syllabus maps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 flex justify-end gap-3 border-t bg-black/5 ${
              currentTheme === "developer" ? "border-cyan-950" :
              currentTheme === "glass" ? "border-white/10" :
              currentTheme === "academic" ? "border-[#E8DFC5]" :
              "border-neutral-100"
            }`}>
              <button
                onClick={onClose}
                className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-lg ${
                  currentTheme === "developer" ? "border border-cyan-800 text-cyan-400 hover:bg-cyan-500/10" :
                  currentTheme === "glass" ? "bg-white/10 hover:bg-white/20 text-white" :
                  currentTheme === "academic" ? "bg-[#FAF6EE] border border-[#D4C3A3] text-[#7F1D1D]" :
                  "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
