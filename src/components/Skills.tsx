import React, { useState } from "react";
import { ThemeId } from "@/types";
import { Award, Cpu, Wrench, GraduationCap, Lightbulb, CheckCircle2, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/StaggeredView";
import { motion } from "motion/react";
import { playAudioCue } from "@/utils/audio";

interface SkillsProps {
  currentTheme: ThemeId;
}

interface Skill {
  name: string;
  level: number; // 0 to 100
  status: "Expert" | "Proficient" | "Intermediate";
  keywords: string[];
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: Skill[];
}

export default function Skills({ currentTheme }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectedSkillQA, setSelectedSkillQA] = useState<{ q: string; a: string } | null>(null);

  const categories: SkillCategory[] = [
    {
      title: "Full-Stack & Enterprise (MERN & Spring)",
      icon: Cpu,
      skills: [
        { name: "React.js", level: 90, status: "Expert", keywords: ["Hooks", "Context API", "Virtual DOM", "Performance"] },
        { name: "Node.js & Express", level: 86, status: "Proficient", keywords: ["RESTful APIs", "JWT Auth", "Middleware", "Event Loop"] },
        { name: "MongoDB & Database Modeling", level: 85, status: "Proficient", keywords: ["Aggregation Pipelines", "Indexing", "Mongoose"] },
        { name: "SpringBoot Framework", level: 88, status: "Proficient", keywords: ["Spring MVC", "Auto-Configuration", "Microservices", "Spring Security"] },
        { name: "Java Servlets", level: 82, status: "Intermediate", keywords: ["Lifecycle", "HttpServlet", "Web Containers", "Request Dispatcher"] },
        { name: "Tailwind CSS & Responsive UI", level: 92, status: "Expert", keywords: ["Flexbox/Grid", "Custom Configs", "Transitions"] },
      ],
    },
    {
      title: "Programming Languages & CS Core",
      icon: GraduationCap,
      skills: [
        { name: "Java Programming", level: 92, status: "Expert", keywords: ["Multithreading", "JVM Internals", "Collections", "OOP", "Garbage Collection"] },
        { name: "Python Development", level: 90, status: "Expert", keywords: ["Asyncio", "Generators", "Metaprogramming", "Decorators", "Pandas"] },
        { name: "C / C++ Systems Programming", level: 89, status: "Proficient", keywords: ["Pointers", "Memory Allocation", "STL", "RAII", "Templates"] },
        { name: "Data Structures & Algorithms", level: 96, status: "Expert", keywords: ["Trees & Graphs", "Dynamic Programming", "Complexity Analysis"] },
        { name: "Operating Systems Internals", level: 87, status: "Proficient", keywords: ["Process Sync", "Scheduling", "Virtual Memory", "Deadlocks"] },
        { name: "Software Engineering Principles", level: 91, status: "Expert", keywords: ["SOLID Design", "GoF Design Patterns", "CI/CD", "TDD"] },
      ],
    },
    {
      title: "Database Connectivity & Tools",
      icon: Wrench,
      skills: [
        { name: "JDBC Database Connectivity", level: 88, status: "Proficient", keywords: ["DriverManager", "PreparedStatements", "Transactions", "ResultSet"] },
        { name: "Database Management Systems", level: 88, status: "Proficient", keywords: ["SQL", "Normalization", "ACID Properties", "Indexing"] },
        { name: "Technical Mock Interviewing", level: 95, status: "Expert", keywords: ["DSA Coding Prep", "Resume Building", "FAANG Coaching"] },
        { name: "Git & Version Control", level: 88, status: "Proficient", keywords: ["Gitflow", "Rebase", "Merge Conflicts", "PR Reviews"] },
        { name: "AI/ML Integration (Gemini SDK)", level: 85, status: "Proficient", keywords: ["LLM Orchestration", "Vector Embeddings", "AI Agents"] },
      ],
    },
  ];

  // Professional interview flashcards / QA to show dynamic classroom style
  const placementFlashcards: { [key: string]: { q: string; a: string }[] } = {
    "Data Structures (DSA)": [
      { q: "What is the primary difference between a Stack and a Queue?", a: "A Stack follows Last-In-First-Out (LIFO) protocol where insertions and deletions happen at the top, whereas a Queue follows First-In-First-Out (FIFO) where insertions happen at the rear and deletions at the front." },
      { q: "Why is a binary search tree (BST) search faster than a simple linked list?", a: "BST search takes O(log N) average time complexity because half of the tree is skipped at each step, whereas linked list search takes linear O(N) since we must traverse nodes sequentially." }
    ],
    "React.js": [
      { q: "What is the virtual DOM and how does React optimize rendering?", a: "The virtual DOM is an in-memory representation of real HTML. React calculates diffs (the reconciliation process) and batches updates to update only the modified DOM nodes, avoiding slow full-page reflows." }
    ],
    "Spring Boot & Java": [
      { q: "What is Auto-Configuration in Spring Boot?", a: "Spring Boot auto-configuration attempts to automatically configure your Spring application based on the jar dependencies that you have added. For example, if H2 DB jar is on the classpath, it automatically configures an in-memory database connection." },
      { q: "What is the JVM (Java Virtual Machine) and how does it achieve platform independence?", a: "The JVM compiles Java source code (.java) into intermediate bytecode (.class) rather than machine-specific code. Any operating system running a compatible JVM can execute this bytecode, achieving 'Write Once, Run Anywhere' (WORA)." }
    ],
    "JDBC & Servlets": [
      { q: "Why should you use PreparedStatement instead of Statement in JDBC?", a: "PreparedStatement compiles SQL queries beforehand, enabling parameter insertion. This significantly improves performance for repeated queries and prevents SQL Injection attacks by escaping inputs automatically." },
      { q: "Explain the lifecycle of a Java Servlet.", a: "A servlet lifecycle consists of: 1. Loading and instantiation, 2. Initialization via the init() method, 3. Request handling via the service() method (which routes to doGet/doPost), and 4. Destruction via the destroy() method before removal from memory." }
    ],
    "C & C++ Programming": [
      { q: "What is a Pointer in C/C++ and what is a memory leak?", a: "A pointer is a variable that stores the memory address of another variable. A memory leak occurs when memory is allocated dynamically on the Heap (using malloc or new) but is not deallocated (using free or delete) before losing reference to it." },
      { q: "Explain RAII and Smart Pointers in C++.", a: "Resource Acquisition Is Initialization (RAII) ties resource management to object lifetimes. Smart pointers like std::unique_ptr and std::shared_ptr implement RAII by automatically releasing heap-allocated memory once the pointer goes out of scope." }
    ],
    "Software Engineering": [
      { q: "What are the SOLID principles in Object-Oriented Design?", a: "SOLID stands for: Single Responsibility, Open-Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (prefer client-specific fine-grained interfaces), and Dependency Inversion (depend on abstractions, not concretions)." }
    ],
    "Python & Operating Systems": [
      { q: "What is the GIL (Global Interpreter Lock) in Python?", a: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once in CPython. This makes single-threaded Python programs fast but restricts CPU-bound multithreaded performance (mitigated by multiprocessing or asyncio)." },
      { q: "Explain Virtual Memory and Paging in Operating Systems.", a: "Virtual Memory separates physical memory from user logical memory. Paging divides physical memory into fixed-size blocks called frames, and logical memory into blocks called pages, enabling non-contiguous physical allocation mapped via a Page Table." }
    ]
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          badgeActive: "bg-cyan-500 text-black font-bold",
          badgeInactive: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20",
          progressBg: "bg-slate-900 border border-cyan-500/45",
          progressBar: "bg-cyan-400",
          box: "bg-black border border-cyan-500 p-4 rounded-none",
          heading: "text-xl font-black uppercase text-cyan-400 tracking-wider",
          textTitle: "text-cyan-400 text-2xl sm:text-3xl font-black",
          textMuted: "text-neutral-400 text-sm sm:text-base",
          textPrimary: "text-white font-bold text-sm sm:text-base",
          flashcardBg: "bg-neutral-950 border border-cyan-500/30 text-neutral-200 p-4 rounded-none",
          subjectBtn: "bg-black hover:bg-cyan-500/10 text-cyan-400 font-bold text-xs px-2.5 py-1.5 rounded-none border border-cyan-500 flex items-center gap-1 transition-colors",
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          badgeActive: "bg-violet-600 text-white font-semibold shadow-sm",
          badgeInactive: "bg-[#1A1333]/40 text-gray-400 hover:text-white hover:bg-violet-900/30 border border-white/5",
          progressBg: "bg-[#1A1333]/50 border border-white/5",
          progressBar: "bg-gradient-to-r from-violet-500 to-fuchsia-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]",
          box: "bg-[#1A1333]/55 border border-white/5 p-4 rounded-xl",
          heading: "text-xl font-bold tracking-tight bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent gradient-text-3d cursor-pointer",
          textTitle: "text-white text-2xl sm:text-3xl font-extrabold",
          textMuted: "text-slate-400 text-sm sm:text-base",
          textPrimary: "text-slate-200 text-sm sm:text-base",
          flashcardBg: "bg-violet-950/30 border border-white/5 text-slate-200 p-4 rounded-xl",
          subjectBtn: "bg-[#1A1333]/50 hover:bg-violet-900/50 text-violet-300 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-1 transition-colors",
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-205 text-neutral-800 rounded-3xl p-6 shadow-xs font-sans",
          badgeActive: "bg-neutral-900 text-white font-bold shadow-xs",
          badgeInactive: "bg-neutral-50/45 text-neutral-600 hover:text-neutral-900 border border-neutral-200",
          progressBg: "bg-neutral-100",
          progressBar: "bg-neutral-850",
          box: "bg-white border border-neutral-200 p-5 rounded-2xl shadow-2xs",
          heading: "text-xl font-bold text-neutral-900 tracking-tight",
          textTitle: "text-neutral-900 text-2xl sm:text-3xl font-bold",
          textMuted: "text-neutral-505 text-sm sm:text-base",
          textPrimary: "text-neutral-900 text-sm sm:text-base",
          flashcardBg: "bg-neutral-50 border border-neutral-150 text-neutral-800 p-4 rounded-2xl",
          subjectBtn: "bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-bold text-xs px-2.5 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1 transition-colors",
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          badgeActive: "bg-[#7F1D1D] text-white font-bold shadow-xs rounded-md",
          badgeInactive: "bg-[#FAF6EE] text-[#5C2D11]/70 border border-[#D4C3A3]/60 hover:text-[#7F1D1D] hover:bg-[#FAF0D9] rounded-md",
          progressBg: "bg-[#FAF6EE] border border-[#D4C3A3]/50 rounded-md",
          progressBar: "bg-[#7F1D1D] rounded-md",
          box: "bg-[#FAF6EE] border border-[#D4C3A3]/60 p-5 rounded-md shadow-sm",
          heading: "text-xl font-bold text-[#5A1010] tracking-tight font-serif",
          textTitle: "text-[#5A1010] text-2xl sm:text-3xl font-bold font-serif",
          textMuted: "text-[#5C4533] text-sm sm:text-base font-serif",
          textPrimary: "text-[#5A1010] text-sm sm:text-base font-bold font-serif",
          flashcardBg: "bg-white border border-[#D4C3A3]/50 text-[#2A1E17] p-4 rounded-md shadow-2xs font-serif",
          subjectBtn: "bg-[#FAF0D9] hover:bg-[#FAF6EE] text-[#7F1D1D] font-bold text-xs px-2.5 py-1.5 rounded-md border border-[#D4C3A3] flex items-center gap-1 transition-colors font-serif",
        };
    }
  };

  const styles = getThemeStyles();
  const currentCategoryObj = categories[activeCategory];

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-6 depth-card-3d z-index-10 cursor-pointer ${styles.card}`}
    >
      {/* Header */}
      <div className={`border-b pb-4 ${
        currentTheme === "developer" ? "border-cyan-500/30" : currentTheme === "glass" ? "border-white/10" : "border-gray-150"
      }`}>
        <h2 className={`flex items-center gap-2 text-3d-lift cursor-pointer ${styles.textTitle}`}>
          <Award className={`w-6 h-6 animate-pulse flex-shrink-0 ${
            currentTheme === "developer" ? "text-cyan-400" : "text-indigo-500"
          }`} />
          Technical Skill Matrix & Assessment Sandbox
        </h2>
        <p className={`mt-1.5 leading-relaxed ${styles.textMuted}`}>
          Explore Vicky Kumar's professional engineering toolchain, academic specialties, and interactive recruitment interview flashcards.
        </p>
      </div>

      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button
              key={idx}
              id={`skill-cat-${idx}`}
              onClick={() => {
                setActiveCategory(idx);
                setSelectedSkillQA(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeCategory === idx ? styles.badgeActive : styles.badgeInactive
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Skills Matrix layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Skills proficiency meters */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className={styles.heading}>Skill Proficiency Indicators</h3>
          <div className="flex flex-col gap-5">
            {currentCategoryObj.skills.map((skill, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className={`font-bold flex items-center gap-1.5 ${styles.textPrimary}`}>
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                      currentTheme === "developer" ? "text-cyan-400" : "text-emerald-500"
                    }`} />
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                      currentTheme === "developer" 
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                        : currentTheme === "glass" 
                        ? "bg-violet-950/50 text-violet-300" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {skill.status}
                    </span>
                    <span className={`font-bold ${styles.textPrimary}`}>{skill.level}%</span>
                  </div>
                </div>

                {/* Meter container */}
                <div className={`w-full h-2 rounded-full overflow-hidden ${styles.progressBg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${styles.progressBar}`}
                  />
                </div>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {skill.keywords.map((kw, i) => (
                    <span key={i} className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${
                      currentTheme === "developer" 
                        ? "bg-cyan-500/10 text-cyan-400" 
                        : currentTheme === "glass" 
                        ? "bg-violet-950/50 text-violet-300" 
                        : "bg-slate-500/10 text-slate-500"
                    }`}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Flashcard simulator */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className={`flex flex-col gap-3.5 ${styles.box}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.textTitle.includes("text-cyan-400") ? "text-cyan-400" : "text-indigo-600"}`}>
              <Lightbulb className="w-5 h-5 text-amber-500 animate-pulse flex-shrink-0" />
              Recruitment Q&A Flashcard Simulator
            </h3>
            <p className={`leading-relaxed ${styles.textMuted}`}>
              Click a primary subject below to simulate a real placement department technical interview question answered by Professor Vicky.
            </p>

            <div className="flex flex-wrap gap-2 my-1">
              {Object.keys(placementFlashcards).map((subject, idx) => (
                <button
                  key={idx}
                  id={`flashcard-subject-${idx}`}
                  onClick={() => {
                    const qaList = placementFlashcards[subject];
                    const randomQA = qaList[Math.floor(Math.random() * qaList.length)];
                    setSelectedSkillQA(randomQA);
                  }}
                  className={styles.subjectBtn}
                >
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  {subject} Q&A
                </button>
              ))}
            </div>

            {selectedSkillQA ? (
              <motion.div
                key={selectedSkillQA.q}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.flashcardBg}
              >
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${styles.textTitle.includes("text-cyan-400") ? "text-cyan-400" : "text-indigo-600"}`}>Interview Question</span>
                  <p className="font-extrabold leading-snug text-sm sm:text-base">"{selectedSkillQA.q}"</p>
                </div>
                <div className="border-t border-gray-200/20 pt-2.5 mt-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${styles.textTitle.includes("text-cyan-400") ? "text-amber-400" : "text-emerald-600"}`}>Professor Vicky's Verified Answer</span>
                  <p className="leading-relaxed text-xs sm:text-sm">{selectedSkillQA.a}</p>
                </div>
              </motion.div>
            ) : (
              <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 ${
                currentTheme === "developer" 
                  ? "border-cyan-500/30 rounded-none" 
                  : currentTheme === "glass" 
                  ? "border-violet-900/30" 
                  : "border-gray-300/40"
              }`}>
                <Sparkles className={`w-6 h-6 animate-bounce flex-shrink-0 ${
                  currentTheme === "developer" ? "text-cyan-400" : "text-indigo-400"
                }`} />
                <span className={`italic font-medium ${styles.textMuted}`}>Select a placement subject to begin technical Q&A drill</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaggerContainer>
  );
}
