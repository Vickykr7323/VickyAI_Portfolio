import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeId } from "@/types";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  theme?: ThemeId;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  key?: any;
}

export default function Tooltip({ 
  content, 
  children, 
  theme = "minimal", 
  position = "top", 
  delay = 0.25 
}: TooltipProps) {
  const [show, setShow] = useState(false);
  let timeoutId: any = null;

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setShow(true);
    }, delay * 1000);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setShow(false);
  };

  const getTooltipStyles = () => {
    switch (theme) {
      case "developer":
        return "bg-black border border-cyan-500 text-cyan-400 font-mono shadow-[0_0_10px_rgba(0,229,255,0.45)] text-[10px] rounded-none px-2 py-1";
      case "glass":
        return "bg-slate-950/90 backdrop-blur-md border border-violet-500/30 text-violet-200 font-sans shadow-lg text-[10px] rounded-lg px-2.5 py-1";
      case "academic":
        return "bg-[#FAF6EE] border border-[#D4C3A3] text-[#5C2D11] font-serif shadow-md text-[10px] rounded-md px-2 py-1";
      case "minimal":
      default:
        return "bg-neutral-900 text-white font-sans text-[10px] rounded-full px-2.5 py-1 shadow-sm";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "bottom" ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "bottom" ? -4 : 4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={`absolute pointer-events-none z-[200] whitespace-nowrap ${getPositionClasses()} ${getTooltipStyles()}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
