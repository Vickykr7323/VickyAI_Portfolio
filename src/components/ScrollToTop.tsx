import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { ThemeId } from "@/types";
import Tooltip from "./Tooltip";

interface ScrollToTopProps {
  currentTheme: ThemeId;
}

export default function ScrollToTop({ currentTheme }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Check if scroll is beyond 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Theme styling mapping for the ScrollToTop button
  const getButtonStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          btnClass: "bg-black border-2 border-cyan-500 text-cyan-400 font-mono shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.85)]",
          iconClass: "w-5 h-5",
          containerClass: "rounded-none",
        };
      case "glass":
        return {
          btnClass: "bg-slate-950/80 backdrop-blur-md border border-violet-500/40 text-violet-300 hover:text-white hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]",
          iconClass: "w-5 h-5",
          containerClass: "rounded-xl",
        };
      case "minimal":
        return {
          btnClass: "bg-neutral-900 text-white hover:bg-black shadow-xs border border-neutral-800",
          iconClass: "w-5 h-5",
          containerClass: "rounded-full",
        };
      case "academic":
      default:
        return {
          btnClass: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_20px_rgba(79,70,229,0.55)] border border-indigo-500/30",
          iconClass: "w-5 h-5",
          containerClass: "rounded-full",
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50">
          <Tooltip content="Scroll back to top" theme={currentTheme} position="left" delay={0.15}>
            <motion.button
              id="scroll-to-top-btn"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={scrollToTop}
              className={`p-3.5 flex items-center justify-center transition-all duration-300 group cursor-pointer ${styles.containerClass} ${styles.btnClass}`}
              aria-label="Scroll to Top"
            >
              <ArrowUp className={`${styles.iconClass} transition-transform duration-300 group-hover:-translate-y-0.5`} />
            </motion.button>
          </Tooltip>
        </div>
      )}
    </AnimatePresence>
  );
}
