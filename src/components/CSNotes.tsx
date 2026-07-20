import React, { useState, useEffect } from "react";
import { ThemeId, Note, QuizQuestion, QuizAttempt } from "@/types";
import { 
  Notebook, Search, Plus, Trash2, Edit, Star, CheckSquare, Sparkles, 
  ChevronRight, ArrowLeftRight, Code, ListFilter, Copy, Check, Info,
  AlertCircle, BookOpen, Layers, Lightbulb, Tag, Flame, HelpCircle, Trophy, RefreshCw
} from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { playAudioCue } from "@/utils/audio";
import { PRELOADED_NOTES } from "../data/preloadedNotes";
import { PLACEMENT_QUIZZES } from "../data/placementQuizzes";

interface CSNotesProps {
  currentTheme: ThemeId;
  selectedNoteId?: string | null;
  onClearSelectedNoteId?: () => void;
}

export type { Note };


export default function CSNotes({ 
  currentTheme,
  selectedNoteId = null,
  onClearSelectedNoteId
}: CSNotesProps) {
  // Load notes from localstorage if available, otherwise fallback to preloaded
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([
    "Programming",
    "Core CS",
    "Database",
    "Networking",
    "Software Development",
    "Web Development",
    "Frontend",
    "Backend",
    "Development Tools",
    "System Administration",
    "AI",
    "Data Science",
    "Big Data",
    "Cloud",
    "Cloud & DevOps",
    "Security",
    "Mobile",
    "Emerging Technology",
    "Mathematics",
    "Software Engineering",
    "Software Architecture",
    "Hardware & Embedded",
    "Advanced Computing"
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  
  // Tab states: "grid" for visualizer deck, "flashcard" for quiz-style study, "create" for editor
  const [activeTab, setActiveTab] = useState<"grid" | "flashcard" | "create">("grid");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Dynamic Subject Manager State
  const [isManagingSubjects, setIsManagingSubjects] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [renamingSubjectIdx, setRenamingSubjectIdx] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Sync selectedNoteId from prop
  useEffect(() => {
    if (selectedNoteId && notes.length > 0) {
      const found = notes.find(n => n.id === selectedNoteId);
      if (found) {
        setSelectedNote(found);
        setActiveTab("grid");
        setTimeout(() => {
          const el = document.getElementById(`note-card-${selectedNoteId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 200);
      }
    }
  }, [selectedNoteId, notes]);
  
  // Create Note Form States
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Programming");
  const [formDifficulty, setFormDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [formSummary, setFormSummary] = useState("");
  const [formTakeawayInput, setFormTakeawayInput] = useState("");
  const [formTakeaways, setFormTakeaways] = useState<string[]>([]);
  const [formTagsInput, setFormTagsInput] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formLang, setFormLang] = useState("javascript");
  const [formError, setFormError] = useState("");

  // Flashcard states
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStats, setStudyStats] = useState({ mastered: 0, reviewing: 0 });
  const [studyMode, setStudyMode] = useState<"standard" | "reverse">("standard");

  // Code snippet copied states
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Interactive Placement Mock Quiz States
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttempt>>({});
  const [activeQuizNoteId, setActiveQuizNoteId] = useState<string | null>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [chosenAnswerIdx, setChosenAnswerIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load and sync localStorage
  useEffect(() => {
    const stored = localStorage.getItem("vicky_cs_notes");
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        setNotes(PRELOADED_NOTES);
      }
    } else {
      setNotes(PRELOADED_NOTES);
      localStorage.setItem("vicky_cs_notes", JSON.stringify(PRELOADED_NOTES));
    }

    const DEFAULT_SUBJECTS = [
      "Programming",
      "Core CS",
      "Database",
      "Networking",
      "Software Development",
      "Web Development",
      "Frontend",
      "Backend",
      "Development Tools",
      "System Administration",
      "AI",
      "Data Science",
      "Big Data",
      "Cloud",
      "Cloud & DevOps",
      "Security",
      "Mobile",
      "Emerging Technology",
      "Mathematics",
      "Software Engineering",
      "Software Architecture",
      "Hardware & Embedded",
      "Advanced Computing"
    ];
    const storedSubjects = localStorage.getItem("vicky_cs_subjects");
    if (storedSubjects) {
      try {
        setSubjects(JSON.parse(storedSubjects));
      } catch (e) {
        setSubjects(DEFAULT_SUBJECTS);
      }
    } else {
      setSubjects(DEFAULT_SUBJECTS);
      localStorage.setItem("vicky_cs_subjects", JSON.stringify(DEFAULT_SUBJECTS));
    }

    const storedAttempts = localStorage.getItem("vicky_cs_quiz_attempts");
    if (storedAttempts) {
      try {
        setQuizAttempts(JSON.parse(storedAttempts));
      } catch (e) {
        setQuizAttempts({});
      }
    } else {
      setQuizAttempts({});
    }
  }, []);

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("vicky_cs_notes", JSON.stringify(updatedNotes));
  };

  const saveSubjectsToStorage = (updatedSubjects: string[]) => {
    setSubjects(updatedSubjects);
    localStorage.setItem("vicky_cs_subjects", JSON.stringify(updatedSubjects));
  };

  // Quiz helper functions
  const handleStartQuiz = (noteId: string) => {
    playAudioCue("nav-click");
    setActiveQuizNoteId(noteId);
    setQuizQuestionIdx(0);
    setSelectedAnswers([]);
    setChosenAnswerIdx(null);
    setQuizSubmitted(false);
  };

  const handleChooseAnswer = (optionIdx: number) => {
    playAudioCue("card-click");
    setChosenAnswerIdx(optionIdx);
  };

  const handleNextQuizQuestion = (questionsCount: number) => {
    if (chosenAnswerIdx === null) return;
    playAudioCue("nav-click");

    const updatedAnswers = [...selectedAnswers, chosenAnswerIdx];
    setSelectedAnswers(updatedAnswers);
    setChosenAnswerIdx(null);

    if (quizQuestionIdx + 1 < questionsCount) {
      setQuizQuestionIdx(prev => prev + 1);
    } else {
      // Calculate final score
      const questions = PLACEMENT_QUIZZES[activeQuizNoteId!] || [];
      let score = 0;
      updatedAnswers.forEach((ansIdx, idx) => {
        if (ansIdx === questions[idx]?.correctIdx) {
          score += 1;
        }
      });
      const passed = score >= 2; // Pass threshold: 2/3 or 3/3

      const newAttempt: QuizAttempt = {
        noteId: activeQuizNoteId!,
        score,
        passed,
        answers: updatedAnswers
      };

      const updatedAttempts = {
        ...quizAttempts,
        [activeQuizNoteId!]: newAttempt
      };

      setQuizAttempts(updatedAttempts);
      localStorage.setItem("vicky_cs_quiz_attempts", JSON.stringify(updatedAttempts));
      setQuizSubmitted(true);
    }
  };

  const handleRetakeQuiz = (noteId: string) => {
    handleStartQuiz(noteId);
  };


  // Categories list (dynamic and merges user-created custom subjects)
  const categories = ["All", ...Array.from(new Set([...subjects, ...notes.map(n => n.category)]))];
  
  // Tags list
  const tags = ["All", ...Array.from(new Set(notes.flatMap(n => n.tags)))];

  // Filters
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesTag = selectedTag === "All" || note.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const getReadingTime = (note: Note): number => {
    let text = (note.title || "") + " " + (note.summary || "") + " " + (note.category || "");
    if (note.keyTakeaways && Array.isArray(note.keyTakeaways)) {
      text += " " + note.keyTakeaways.join(" ");
    }
    if (note.codeSnippet?.code) {
      text += " " + note.codeSnippet.code;
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    // Estimated reading time based on average 200 words per minute speed, minimum 1 minute
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleToggleStar = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioCue("nav-click");
    const updated = notes.map(n => n.id === noteId ? { ...n, isStarred: !n.isStarred } : n);
    saveNotesToStorage(updated);
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, isStarred: !selectedNote.isStarred });
    }
  };

  const handleToggleRead = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioCue("nav-click");
    const updated = notes.map(n => n.id === noteId ? { ...n, isRead: !n.isRead } : n);
    saveNotesToStorage(updated);
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, isRead: !selectedNote.isRead });
    }
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this CS Note?")) {
      playAudioCue("nav-click");
      const updated = notes.filter(n => n.id !== noteId);
      saveNotesToStorage(updated);
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
      }
    }
  };

  const handleCopyCode = (noteId: string, codeText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codeText);
    setCopiedNoteId(noteId);
    playAudioCue("card-click");
    setTimeout(() => {
      setCopiedNoteId(null);
    }, 2000);
  };

  // Subject operations
  const handleAddSubject = () => {
    const trimmed = newSubjectName.trim();
    if (!trimmed) return;
    if (subjects.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert("Subject already exists!");
      return;
    }
    playAudioCue("card-click");
    const updated = [...subjects, trimmed];
    saveSubjectsToStorage(updated);
    setNewSubjectName("");
  };

  const handleRenameSubject = (index: number) => {
    const newVal = renameValue.trim();
    if (!newVal) return;
    const oldVal = subjects[index];
    if (newVal.toLowerCase() === oldVal.toLowerCase()) {
      setRenamingSubjectIdx(null);
      return;
    }
    if (subjects.some((s, idx) => idx !== index && s.toLowerCase() === newVal.toLowerCase())) {
      alert("Subject already exists!");
      return;
    }
    playAudioCue("card-click");
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = newVal;
    saveSubjectsToStorage(updatedSubjects);

    // Also update all notes in this subject
    const updatedNotes = notes.map(n => n.category === oldVal ? { ...n, category: newVal } : n);
    saveNotesToStorage(updatedNotes);

    // Update current selected note or filters
    if (selectedNote && selectedNote.category === oldVal) {
      setSelectedNote({ ...selectedNote, category: newVal });
    }
    if (selectedCategory === oldVal) {
      setSelectedCategory(newVal);
    }
    setRenamingSubjectIdx(null);
  };

  const handleDeleteSubject = (index: number) => {
    const target = subjects[index];
    if (window.confirm(`Are you sure you want to delete "${target}"? All notes in this category will be reassigned to "General".`)) {
      playAudioCue("nav-click");
      const updatedSubjects = subjects.filter((_, idx) => idx !== index);
      saveSubjectsToStorage(updatedSubjects);

      // Reassign notes
      const updatedNotes = notes.map(n => n.category === target ? { ...n, category: "General" } : n);
      saveNotesToStorage(updatedNotes);

      // Update current selection
      if (selectedNote && selectedNote.category === target) {
        setSelectedNote({ ...selectedNote, category: "General" });
      }
      if (selectedCategory === target) {
        setSelectedCategory("All");
      }
    }
  };

  // Takeaway form handler
  const handleAddTakeaway = () => {
    if (formTakeawayInput.trim()) {
      setFormTakeaways([...formTakeaways, formTakeawayInput.trim()]);
      setFormTakeawayInput("");
      playAudioCue("nav-click");
    }
  };

  const handleRemoveTakeaway = (idx: number) => {
    setFormTakeaways(formTakeaways.filter((_, i) => i !== idx));
    playAudioCue("nav-click");
  };

  // Prepopulate form states to start editing
  const handleStartEdit = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioCue("nav-click");
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormDifficulty(note.difficulty);
    setFormSummary(note.summary);
    setFormTakeaways(note.keyTakeaways);
    setFormTagsInput(note.tags.join(", "));
    setFormCode(note.codeSnippet ? note.codeSnippet.code : "");
    setFormLang(note.codeSnippet ? note.codeSnippet.language : "javascript");
    setFormError("");
    setActiveTab("create");
  };

  const handleCancelEdit = () => {
    playAudioCue("nav-click");
    setEditingNoteId(null);
    setFormTitle("");
    setFormCategory(subjects[0] || "Frontend Development");
    setFormDifficulty("Beginner");
    setFormSummary("");
    setFormTakeaways([]);
    setFormTagsInput("");
    setFormCode("");
    setFormError("");
    setActiveTab("grid");
  };

  // Submit dynamic note (creates new or updates edited)
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Note title is required.");
      return;
    }
    if (!formSummary.trim()) {
      setFormError("Brief summary overview is required.");
      return;
    }
    if (formTakeaways.length === 0) {
      setFormError("Please add at least one core key takeaway/bullet point.");
      return;
    }

    const processedTags = formTagsInput
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    let updated: Note[];

    if (editingNoteId) {
      // Edit mode
      updated = notes.map(n => {
        if (n.id === editingNoteId) {
          return {
            ...n,
            title: formTitle.trim(),
            category: formCategory,
            tags: processedTags.length > 0 ? processedTags : ["general"],
            difficulty: formDifficulty,
            summary: formSummary.trim(),
            keyTakeaways: formTakeaways,
            codeSnippet: formCode.trim() ? { language: formLang, code: formCode.trim() } : undefined,
          };
        }
        return n;
      });
      playAudioCue("card-click");
    } else {
      // Create mode
      const newNote: Note = {
        id: "custom-" + Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        tags: processedTags.length > 0 ? processedTags : ["general"],
        difficulty: formDifficulty,
        summary: formSummary.trim(),
        keyTakeaways: formTakeaways,
        codeSnippet: formCode.trim() ? { language: formLang, code: formCode.trim() } : undefined,
        isStarred: false,
        isRead: false,
        isCustom: true
      };
      updated = [newNote, ...notes];
      playAudioCue("card-click");
    }

    saveNotesToStorage(updated);

    // If selectedNote was edited, update its visual details
    if (editingNoteId) {
      const updatedSel = updated.find(n => n.id === editingNoteId);
      if (updatedSel) {
        setSelectedNote(updatedSel);
      }
    } else if (updated[0]) {
      setSelectedNote(updated[0]);
    }

    // Reset Form
    setEditingNoteId(null);
    setFormTitle("");
    setFormCategory(subjects[0] || "Programming");
    setFormDifficulty("Beginner");
    setFormSummary("");
    setFormTakeaways([]);
    setFormTagsInput("");
    setFormCode("");
    setFormError("");

    // Return to grid list
    setActiveTab("grid");
  };

  const handleResetToPreloaded = () => {
    if (window.confirm("Restore original curated system notes and subjects? This will wipe your custom edits.")) {
      playAudioCue("card-click");
      
      const DEFAULT_SUBJECTS = [
        "Programming",
        "Core CS",
        "Database",
        "Networking",
        "Software Development",
        "Web Development",
        "Frontend",
        "Backend",
        "Development Tools",
        "System Administration",
        "AI",
        "Data Science",
        "Big Data",
        "Cloud",
        "Cloud & DevOps",
        "Security",
        "Mobile",
        "Emerging Technology",
        "Mathematics",
        "Software Engineering",
        "Software Architecture",
        "Hardware & Embedded",
        "Advanced Computing"
      ];

      saveNotesToStorage(PRELOADED_NOTES);
      saveSubjectsToStorage(DEFAULT_SUBJECTS);
      setSelectedNote(null);
      setEditingNoteId(null);
    }
  };

  // Theme support class generator
  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          tabsContainer: "border-b border-cyan-500/30 pb-3 mb-4 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap",
          tabActive: "bg-cyan-500 text-black px-4 py-2 font-bold font-mono text-xs",
          tabInactive: "border border-cyan-500/40 text-cyan-400/80 px-4 py-2 hover:bg-cyan-500/20 font-mono text-xs",
          controlBtn: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded-none text-xs flex items-center gap-1 font-mono",
          textTitle: "text-cyan-400 text-2xl sm:text-3xl font-black",
          textMuted: "text-neutral-400 text-sm",
          textPrimary: "text-white font-bold text-sm sm:text-base",
          textSecondary: "text-neutral-200 text-xs sm:text-sm",
          tagBadge: "bg-cyan-950 border border-cyan-500/50 text-cyan-400 text-[10px] px-2 py-0.5 rounded-none font-mono",
          difficultyBadge: (diff: string) => {
            if (diff === "Beginner") return "border border-emerald-500/50 bg-emerald-950/40 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-none";
            if (diff === "Intermediate") return "border border-amber-500/50 bg-amber-950/40 text-amber-400 text-[9px] px-1.5 py-0.5 rounded-none";
            return "border border-red-500/50 bg-red-950/40 text-red-400 text-[9px] px-1.5 py-0.5 rounded-none";
          },
          searchBox: "bg-black text-cyan-400 border border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded-none px-3 py-2 text-xs font-mono w-full",
          selectBox: "bg-black text-cyan-400 border border-cyan-500 focus:outline-none rounded-none px-3 py-2 text-xs font-mono",
          noteCard: "bg-black border border-cyan-500/50 hover:border-cyan-400 p-4 rounded-none transition-all flex flex-col justify-between h-full relative",
          detailedArea: "bg-[#090C12] border-l-2 border-cyan-500 p-5 font-mono",
          codeBlock: "bg-neutral-950 border border-cyan-500/40 p-3 text-cyan-400 text-xs font-mono rounded-none overflow-x-auto",
          formInput: "bg-black border border-cyan-500 text-cyan-400 rounded-none p-2 text-xs font-mono w-full focus:ring-1 focus:ring-cyan-500 focus:outline-none",
          flashcardFrame: "bg-black border-2 border-cyan-500 h-80 flex flex-col justify-center items-center p-6 text-center cursor-pointer relative rounded-none shadow-lg",
          subjectManagerBg: "p-4 border-2 border-cyan-500 bg-black font-mono",
          subjectManagerHeader: "text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1",
          subjectListContainer: "flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-none border border-cyan-500 bg-black p-2",
          subjectListItem: "flex items-center justify-between gap-2 p-1.5 bg-black border border-cyan-500/30 text-xs text-cyan-400",
          interactiveText: "text-cyan-500/85 hover:text-cyan-300 transition-colors cursor-pointer",
          interactivePrimary: "text-cyan-400 hover:text-cyan-300 font-mono",
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          tabsContainer: "flex gap-2 bg-[#1A1333]/40 border border-white/5 p-1 rounded-lg mb-5 overflow-x-auto scrollbar-none",
          tabActive: "bg-violet-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm",
          tabInactive: "text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors",
          controlBtn: "bg-[#1A1333]/40 border border-white/5 hover:bg-violet-900/40 text-violet-300 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold",
          textTitle: "text-white text-2xl sm:text-3xl font-extrabold",
          textMuted: "text-slate-400 text-sm",
          textPrimary: "text-slate-200 text-sm sm:text-base font-semibold",
          textSecondary: "text-slate-300 text-xs sm:text-sm",
          tagBadge: "bg-violet-950/40 border border-violet-800/20 text-violet-300 text-[10px] px-2 py-0.5 rounded-md",
          difficultyBadge: (diff: string) => {
            if (diff === "Beginner") return "bg-emerald-950/30 border border-emerald-800/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded-md";
            if (diff === "Intermediate") return "bg-amber-950/30 border border-amber-800/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-md";
            return "bg-rose-950/30 border border-rose-800/20 text-rose-300 text-[9px] px-1.5 py-0.5 rounded-md";
          },
          searchBox: "bg-slate-950/50 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-lg px-3 py-2 text-xs w-full",
          selectBox: "bg-slate-950/50 text-white border border-white/10 focus:outline-none rounded-lg px-3 py-2 text-xs",
          noteCard: "bg-[#161226]/40 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 p-4 rounded-xl transition-all flex flex-col justify-between h-full relative shadow-3xs",
          detailedArea: "bg-[#120E22]/60 border border-white/10 backdrop-blur-md p-5 rounded-2xl",
          codeBlock: "bg-slate-950/80 border border-white/5 p-3 text-violet-300 text-xs font-mono rounded-lg overflow-x-auto",
          formInput: "bg-slate-950/50 border border-white/10 text-white rounded-lg p-2 text-xs w-full focus:ring-1 focus:ring-violet-500 focus:outline-none",
          flashcardFrame: "bg-slate-900/60 backdrop-blur-md border border-white/10 h-80 flex flex-col justify-center items-center p-6 text-center cursor-pointer relative rounded-2xl shadow-xl shadow-violet-950/20",
          subjectManagerBg: "p-4 rounded-xl border border-dashed border-violet-500/40 bg-[#1A1333]/30 backdrop-blur-xs",
          subjectManagerHeader: "text-violet-300 font-bold uppercase tracking-wider flex items-center gap-1",
          subjectListContainer: "flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-none border border-white/5 bg-slate-950/40 p-2 rounded-lg",
          subjectListItem: "flex items-center justify-between gap-2 p-1.5 bg-[#161226]/40 border border-white/5 text-xs text-slate-200",
          interactiveText: "text-slate-400 hover:text-white transition-colors cursor-pointer",
          interactivePrimary: "text-violet-300 hover:text-white font-semibold",
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-200 text-neutral-850 rounded-3xl p-6 shadow-xs font-sans",
          tabsContainer: "flex gap-2 bg-neutral-50 p-1 rounded-full mb-5 border border-neutral-200 overflow-x-auto scrollbar-none",
          tabActive: "bg-neutral-950 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-sm",
          tabInactive: "text-neutral-600 hover:text-neutral-950 px-5 py-2.5 rounded-full text-xs transition-colors",
          controlBtn: "bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 rounded-full text-xs flex items-center gap-1 font-semibold",
          textTitle: "text-black text-2xl sm:text-3xl font-extrabold",
          textMuted: "text-neutral-500 text-sm",
          textPrimary: "text-black text-sm sm:text-base font-bold",
          textSecondary: "text-neutral-700 text-xs sm:text-sm",
          tagBadge: "bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] px-2 py-0.5 rounded-full font-medium",
          difficultyBadge: (diff: string) => {
            if (diff === "Beginner") return "bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-emerald-150";
            if (diff === "Intermediate") return "bg-amber-50 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-amber-150";
            return "bg-rose-50 text-rose-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold border border-rose-150";
          },
          searchBox: "bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-full px-4 py-2 text-xs w-full",
          selectBox: "bg-neutral-50 text-neutral-800 border border-neutral-200 focus:outline-none rounded-full px-4 py-2 text-xs",
          noteCard: "bg-white border border-neutral-150 hover:border-neutral-900 hover:shadow-xs p-5 rounded-2xl transition-all flex flex-col justify-between h-full relative",
          detailedArea: "bg-neutral-50 border border-neutral-200 p-6 rounded-2xl",
          codeBlock: "bg-neutral-900 text-white p-4 text-xs font-mono rounded-xl overflow-x-auto",
          formInput: "bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl p-2.5 text-xs w-full focus:ring-1 focus:ring-neutral-900 focus:outline-none",
          flashcardFrame: "bg-white border-2 border-neutral-900 h-80 flex flex-col justify-center items-center p-6 text-center cursor-pointer relative rounded-3xl shadow-sm",
          subjectManagerBg: "p-5 rounded-2xl border border-neutral-200 bg-neutral-50",
          subjectManagerHeader: "text-black font-bold uppercase tracking-wider flex items-center gap-1",
          subjectListContainer: "flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-none border border-neutral-200 bg-white p-2 rounded-xl",
          subjectListItem: "flex items-center justify-between gap-2 p-1.5 bg-neutral-50 border border-neutral-150 text-xs text-neutral-800",
          interactiveText: "text-neutral-500 hover:text-black transition-colors cursor-pointer",
          interactivePrimary: "text-neutral-900 hover:text-black font-semibold",
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          tabsContainer: "flex gap-2 bg-[#FAF6EE] border border-[#D4C3A3]/60 p-1 rounded-md mb-5 overflow-x-auto scrollbar-none",
          tabActive: "bg-[#7F1D1D] text-white px-4 py-2 rounded-md text-xs font-semibold shadow-xs",
          tabInactive: "text-[#5C2D11]/80 hover:text-[#7F1D1D] px-4 py-2 rounded-md text-xs transition-colors",
          controlBtn: "bg-[#FAF6EE] border border-[#D4C3A3] hover:bg-[#FAF0D9] text-[#5C2D11] px-3 py-1.5 rounded-md text-xs flex items-center gap-1 font-medium font-serif",
          textTitle: "text-[#5A1010] text-2xl sm:text-3xl font-bold font-serif",
          textMuted: "text-[#5C4533] text-sm",
          textPrimary: "text-[#5A1010] text-sm sm:text-base font-bold",
          textSecondary: "text-[#4A3B32] text-xs sm:text-sm font-serif",
          tagBadge: "bg-[#FAF0D9] border border-[#D4C3A3]/50 text-[#5C2D11] text-[10px] px-2 py-0.5 rounded-xs",
          difficultyBadge: (diff: string) => {
            if (diff === "Beginner") return "bg-emerald-50 border border-emerald-300 text-emerald-850 text-[9px] px-1.5 py-0.5 rounded-xs";
            if (diff === "Intermediate") return "bg-amber-50 border border-amber-300 text-amber-850 text-[9px] px-1.5 py-0.5 rounded-xs";
            return "bg-rose-50 border border-rose-300 text-rose-850 text-[9px] px-1.5 py-0.5 rounded-xs";
          },
          searchBox: "bg-[#FAF6EE] text-[#2A1E17] border border-[#D4C3A3] focus:outline-none focus:ring-1 focus:ring-[#7F1D1D] rounded-md px-3 py-2 text-xs w-full",
          selectBox: "bg-[#FAF6EE] text-[#2A1E17] border border-[#D4C3A3] focus:outline-none rounded-md px-3 py-2 text-xs",
          noteCard: "bg-[#FAF6EE]/50 border border-[#D4C3A3]/60 hover:border-[#7F1D1D] p-5 rounded-lg transition-all flex flex-col justify-between h-full relative",
          detailedArea: "bg-[#FAF6EE] border-l-4 border-[#7F1D1D] p-6 rounded-md border-r border-t border-b border-[#D4C3A3]/40",
          codeBlock: "bg-[#21160F] text-[#FAF6EE] p-4 text-xs font-mono rounded-md overflow-x-auto",
          formInput: "bg-[#FAF6EE] border border-[#D4C3A3] text-[#2A1E17] rounded-md p-2 text-xs w-full focus:ring-1 focus:ring-[#7F1D1D] focus:outline-none",
          flashcardFrame: "bg-[#FAF6EE] border-2 border-[#7F1D1D] h-80 flex flex-col justify-center items-center p-6 text-center cursor-pointer relative rounded-xl shadow-md",
          subjectManagerBg: "p-5 rounded-lg border-2 border-dashed border-[#D4C3A3] bg-[#FAF6EE] font-serif",
          subjectManagerHeader: "text-[#5A1010] font-bold uppercase tracking-wider flex items-center gap-1 font-serif",
          subjectListContainer: "flex flex-col gap-1.5 max-h-48 overflow-y-auto scrollbar-none border border-[#D4C3A3]/60 bg-[#FAF0D9]/50 p-2 rounded-md",
          subjectListItem: "flex items-center justify-between gap-2 p-1.5 bg-[#FAF6EE] border border-[#D4C3A3]/40 text-xs text-[#2A1E17] font-serif",
          interactiveText: "text-[#5C4533] hover:text-[#7F1D1D] transition-colors cursor-pointer",
          interactivePrimary: "text-[#7F1D1D] hover:text-[#5A1010] font-serif",
        };
    }
  };

  const styles = getThemeStyles();

  // Next / Prev flashcard study handler
  const handleFlashcardNav = (dir: "next" | "prev") => {
    playAudioCue("nav-click");
    setIsFlipped(false);
    setTimeout(() => {
      if (dir === "next") {
        setFlashcardIndex((prev) => (prev + 1) % filteredNotes.length);
      } else {
        setFlashcardIndex((prev) => (prev - 1 + filteredNotes.length) % filteredNotes.length);
      }
    }, 150);
  };

  const handleStudyMark = (type: "mastered" | "reviewing") => {
    playAudioCue("card-click");
    setStudyStats((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    handleFlashcardNav("next");
  };

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-6 depth-card-3d z-index-10 cursor-pointer ${styles.card}`}
    >
      {/* Header section with tabs */}
      <div className="border-b pb-4 border-dashed border-gray-300/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className={`flex items-center gap-2 text-3d-lift cursor-pointer ${styles.textTitle}`}>
            <Notebook className="w-7 h-7 text-indigo-500 animate-pulse flex-shrink-0" />
            Computer Science Notes Hub
          </h2>
          <p className={`mt-1 leading-relaxed ${styles.textMuted}`}>
            Review standard revision templates, design cheatsheets, study interactive code blocks, or create custom revision files.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            id="tab-note-grid"
            onClick={() => { playAudioCue("nav-click"); setActiveTab("grid"); }}
            className={`transition-all rounded-md text-xs font-semibold ${
              activeTab === "grid" ? "bg-violet-600 text-white px-3 py-1.5" : "bg-neutral-150/10 hover:bg-neutral-200/20 text-gray-400 px-3 py-1.5"
            }`}
          >
            Study Deck
          </button>
          <button
            id="tab-note-flashcard"
            onClick={() => { playAudioCue("nav-click"); setActiveTab("flashcard"); setIsFlipped(false); }}
            className={`transition-all rounded-md text-xs font-semibold ${
              activeTab === "flashcard" ? "bg-violet-600 text-white px-3 py-1.5" : "bg-neutral-150/10 hover:bg-neutral-200/20 text-gray-400 px-3 py-1.5"
            }`}
          >
            Interactive Flashcards
          </button>
          <button
            id="tab-note-create"
            onClick={() => { playAudioCue("nav-click"); setActiveTab("create"); }}
            className={`transition-all rounded-md text-xs font-semibold flex items-center gap-1 ${
              activeTab === "create" ? "bg-violet-600 text-white px-3 py-1.5" : "bg-neutral-150/10 hover:bg-neutral-200/20 text-gray-400 px-3 py-1.5"
            }`}
          >
            <Plus className="w-3 h-3" /> Create Note
          </button>
          <button
            onClick={() => { playAudioCue("nav-click"); setIsManagingSubjects(!isManagingSubjects); }}
            className={`transition-all rounded-md text-xs font-semibold flex items-center gap-1 ${
              isManagingSubjects ? "bg-indigo-600 text-white px-3 py-1.5" : "bg-neutral-150/10 hover:bg-neutral-200/20 text-gray-400 px-3 py-1.5"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Manage Subjects
          </button>
          <button
            onClick={handleResetToPreloaded}
            className={styles.controlBtn}
            title="Wipe custom edits and restore original curated syllabus files"
          >
            Reset Curated
          </button>
        </div>
      </div>

      {/* Dynamic Subject Management Interface */}
      {isManagingSubjects && (
        <div className={`animate-in slide-in-from-top-4 duration-350 ${styles.subjectManagerBg}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={styles.subjectManagerHeader}>
              <Layers className="w-4 h-4 animate-pulse" />
              Dynamic CS Subjects List Manager
            </h4>
            <button
              onClick={() => setIsManagingSubjects(false)}
              className={`text-xs ${styles.interactiveText}`}
            >
              Close [x]
            </button>
          </div>
          
          <p className={`text-xs mb-4 leading-relaxed ${styles.textMuted}`}>
            Create new subjects (e.g., Frontend, Backend, Databases, AI, Systems) to group and organize your computer science notes. Updates here synchronize instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Add New Subject */}
            <div className="flex flex-col gap-2">
              <span className={`text-xs font-semibold ${styles.textSecondary}`}>Create New CS Subject</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Cloud & DevOps, Cyber Security"
                  className={styles.formInput}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubject(); } }}
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
                >
                  Create
                </button>
              </div>
            </div>

            {/* Right side: Active subjects list */}
            <div className="flex flex-col gap-2">
              <span className={`text-xs font-semibold ${styles.textSecondary}`}>Active Syllabus Subjects ({subjects.length})</span>
              <div className={styles.subjectListContainer}>
                {subjects.map((sub, index) => (
                  <div key={sub} className={styles.subjectListItem}>
                    {renamingSubjectIdx === index ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="bg-neutral-900 border border-indigo-500 text-white rounded p-0.5 text-xs flex-1 focus:outline-none"
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleRenameSubject(index); } }}
                        />
                        <button
                          onClick={() => handleRenameSubject(index)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setRenamingSubjectIdx(null)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium">{sub}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setRenamingSubjectIdx(index); setRenameValue(sub); }}
                            className={`text-[10px] ${styles.interactivePrimary}`}
                            title="Rename subject"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(index)}
                            className="text-red-500 hover:text-red-400 text-[10px]"
                            title="Delete subject"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW 1: STUDY DECK GRID WITH DETAIL DRAWER */}
      {activeTab === "grid" && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, tags, or concepts..."
                className={`pl-9 ${styles.searchBox}`}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs">
                <ListFilter className="w-3 h-3 text-gray-400" />
                <span className={styles.textMuted}>Subject:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.selectBox}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 text-xs ml-2">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className={styles.textMuted}>Tag:</span>
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className={styles.selectBox}
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Notes deck grid (7 cols or full if no selection) */}
            <div className={`${selectedNote ? "lg:col-span-6" : "lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-4`}>
              {filteredNotes.length === 0 ? (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300/20 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-indigo-500 mx-auto mb-2 animate-bounce" />
                  <p className={styles.textPrimary}>No matching CS notes found.</p>
                  <p className={`text-xs mt-1 ${styles.textMuted}`}>Try widening your query or adding a new note card.</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    id={`note-card-${note.id}`}
                    key={note.id}
                    onClick={() => { playAudioCue("card-click"); setSelectedNote(note); }}
                    className={`${styles.noteCard} ${selectedNote?.id === note.id ? "ring-2 ring-violet-500" : ""}`}
                  >
                    <div>
                      {/* Badge / Difficulty header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                            {note.category}
                          </span>
                          <span className="text-[10px] opacity-30 text-gray-400">•</span>
                          <span className={`text-[9px] font-mono flex items-center gap-1 ${styles.textMuted}`} title="Estimated reading time">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-450/70" /> {getReadingTime(note)} min
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {quizAttempts[note.id] && (
                            <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-none mr-1 ${
                              quizAttempts[note.id].passed 
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                                : "bg-red-500/15 text-red-400 border border-red-500/25"
                            }`}>
                              {quizAttempts[note.id].passed ? "READY" : "FAILED"}
                            </span>
                          )}
                          <span className={styles.difficultyBadge(note.difficulty)}>
                            {note.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Title & Star status */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`text-sm sm:text-base font-bold leading-snug hover:text-indigo-400 transition-colors ${styles.textPrimary}`}>
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => handleToggleStar(note.id, e)}
                            className="p-1 hover:bg-neutral-100/10 rounded"
                            title="Toggle Star"
                          >
                            <Star className={`w-3.5 h-3.5 ${note.isStarred ? "text-amber-400 fill-amber-400" : "text-gray-400"}`} />
                          </button>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className={`line-clamp-3 text-xs mb-4 leading-relaxed ${styles.textSecondary}`}>
                        {note.summary}
                      </p>
                    </div>

                    {/* Bottom row: tags and quick details */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {note.tags.map((tag) => (
                          <span key={tag} className={styles.tagBadge}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-gray-300/20 pt-2 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleToggleRead(note.id, e)}
                            className={`flex items-center gap-0.5 ${styles.interactiveText}`}
                          >
                            <CheckSquare className={`w-3 h-3 ${note.isRead ? "text-emerald-400" : ""}`} />
                            <span>{note.isRead ? "Read" : "Mark Read"}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleStartEdit(note, e)}
                            className={`flex items-center gap-0.5 p-0.5 ${styles.interactivePrimary}`}
                            title="Edit this note"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          {note.isCustom && (
                            <button
                              onClick={(e) => handleDeleteNote(note.id, e)}
                              className="text-red-500 hover:text-red-400 p-0.5"
                              title="Delete custom note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className={`flex items-center gap-0.5 ${styles.textMuted}`}>
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note Detail Panel (5 cols) */}
            {selectedNote && (
              <div className="lg:col-span-6 flex flex-col gap-4 animate-in fade-in-25 duration-300">
                <div className={styles.detailedArea}>
                  {/* Panel Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-300/20 mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedNote(null)}
                        className={`text-xs flex items-center gap-1 ${styles.interactivePrimary}`}
                      >
                        <ArrowLeftRight className="w-3 h-3" /> Close Panel
                      </button>
                      <button
                        onClick={(e) => handleStartEdit(selectedNote, e)}
                        className={`text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded ${styles.interactivePrimary}`}
                      >
                        <Edit className="w-3 h-3" /> Edit Note
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={styles.difficultyBadge(selectedNote.difficulty)}>
                        {selectedNote.difficulty}
                      </span>
                      <button
                        onClick={(e) => handleToggleStar(selectedNote.id, e)}
                        className="p-1 rounded bg-neutral-100/10"
                      >
                        <Star className={`w-4 h-4 ${selectedNote.isStarred ? "text-amber-400 fill-amber-400" : "text-gray-400"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Meta */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${styles.interactivePrimary}`}>
                      {selectedNote.category}
                    </span>
                    <span className="text-[10px] opacity-30 text-gray-400">•</span>
                    <span className="text-[10px] font-mono opacity-70 flex items-center gap-1" title="Estimated reading time">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {getReadingTime(selectedNote)} min read
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-tight">
                    {selectedNote.title}
                  </h2>

                  {/* Full Summary */}
                  <p className="text-xs sm:text-sm leading-relaxed mt-3 opacity-90">
                    {selectedNote.summary}
                  </p>

                  {/* Core Takeaways (The awesome checklist structure!) */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3 opacity-80">
                      <Layers className="w-3.5 h-3.5" />
                      Core Concepts & Bullet Points
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {selectedNote.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed opacity-90">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Associated Code block if any */}
                  {selectedNote.codeSnippet && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold font-mono uppercase flex items-center gap-1 ${styles.interactivePrimary}`}>
                          <Code className="w-3.5 h-3.5" />
                          Code Reference ({selectedNote.codeSnippet.language})
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(selectedNote.id, selectedNote.codeSnippet!.code, e)}
                          className={`flex items-center gap-1 text-[10px] font-mono bg-neutral-100/10 px-2 py-0.5 rounded ${styles.interactiveText}`}
                        >
                          {copiedNoteId === selectedNote.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className={styles.codeBlock}>
                        <code>{selectedNote.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Interactive Placement Mock Quiz Simulator */}
                  <div className="mt-6 border-t border-dashed border-gray-300/20 pt-5">
                    {(() => {
                      const quizQuestions = PLACEMENT_QUIZZES[selectedNote.id];
                      const attempt = quizAttempts[selectedNote.id];

                      if (!quizQuestions) {
                        return (
                          <div className="bg-neutral-100/5 p-4 rounded-xl text-center border border-dashed border-gray-300/10">
                            <HelpCircle className="w-6 h-6 text-indigo-400 mx-auto mb-1 opacity-70" />
                            <span className="text-xs font-semibold block text-gray-200">Placement Quiz Simulator</span>
                            <span className={`text-[10px] ${styles.textMuted} mt-1 block`}>
                              Quizzes are custom pre-curated for standard computer science subjects. Custom revision cards do not contain mock assessments.
                            </span>
                          </div>
                        );
                      }

                      // Case 1: Quiz is currently active (taking it now)
                      if (activeQuizNoteId === selectedNote.id) {
                        const currentQ = quizQuestions[quizQuestionIdx];

                        if (quizSubmitted) {
                          // Quiz just completed, show results
                          const score = attempt?.score ?? 0;
                          const passed = attempt?.passed ?? false;

                          return (
                            <div className="bg-neutral-150/5 border border-indigo-500/20 p-4 sm:p-5 rounded-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-left">
                              <div className="flex items-center justify-between gap-3 border-b border-dashed border-gray-300/15 pb-3">
                                <div className="flex items-center gap-2">
                                  <Trophy className={`w-5 h-5 ${passed ? "text-amber-400" : "text-slate-400"}`} />
                                  <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Assessment Results</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${passed ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
                                  {passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>

                              <div className="text-center py-2">
                                <span className="text-2xl sm:text-3xl font-black block tracking-tight text-white">
                                  {score} / 3 Correct
                                </span>
                                <p className={`text-xs mt-1 font-medium ${styles.textSecondary}`}>
                                  {passed 
                                    ? "Placement Ready! You have mastered the core mechanics of this topic."
                                    : "Keep learning! Re-read the revision points above and try again."}
                                </p>
                              </div>

                              {/* Review Questions */}
                              <div className="flex flex-col gap-3 mt-1 max-h-60 overflow-y-auto pr-1">
                                {quizQuestions.map((q, idx) => {
                                  const userAns = attempt?.answers?.[idx];
                                  const isCorrect = userAns === q.correctIdx;
                                  return (
                                    <div key={idx} className="bg-black/25 border border-gray-300/5 p-3 rounded-lg text-xs flex flex-col gap-1.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="font-semibold text-gray-200">Q{idx + 1}: {q.question}</span>
                                        <span className={`font-mono text-[9px] px-1 rounded ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                          {isCorrect ? "Correct" : "Incorrect"}
                                        </span>
                                      </div>
                                      <p className="text-[11px] opacity-85 text-gray-300">
                                        Your answer: <span className="font-medium text-white">{q.options[userAns ?? 0]}</span>
                                      </p>
                                      {!isCorrect && (
                                        <p className="text-[11px] text-emerald-400">
                                          Correct: <span className="font-medium">{q.options[q.correctIdx]}</span>
                                        </p>
                                      )}
                                      <p className={`text-[10px] ${styles.textMuted} italic bg-white/5 p-1.5 rounded mt-1`}>
                                        Explanation: {q.explanation}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="flex gap-2 w-full pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleRetakeQuiz(selectedNote.id)}
                                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-lg font-bold"
                                >
                                  Retake Assessment
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveQuizNoteId(null)}
                                  className="flex-1 text-center bg-neutral-100/10 hover:bg-neutral-150/15 text-xs py-2 rounded-lg font-semibold text-white"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // Render active question
                        return (
                          <div className="bg-neutral-150/5 border border-indigo-500/30 p-4 sm:p-5 rounded-xl flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-200 text-left">
                            <div className="flex items-center justify-between border-b border-dashed border-gray-300/15 pb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                Placement Mock Interview Simulator
                              </span>
                              <span className="text-[10px] font-mono opacity-85 text-gray-300">
                                Question {quizQuestionIdx + 1} of 3
                              </span>
                            </div>

                            <h5 className="text-xs sm:text-sm font-bold text-gray-250 leading-snug">
                              {currentQ.question}
                            </h5>

                            <div className="flex flex-col gap-2">
                              {currentQ.options.map((option, idx) => {
                                const isSelected = chosenAnswerIdx === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleChooseAnswer(idx)}
                                    className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                                      isSelected
                                        ? "bg-indigo-600/25 border-indigo-500 text-white shadow"
                                        : "bg-black/20 border-gray-300/10 hover:bg-black/40 text-gray-300"
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                                      isSelected ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400"
                                    }`}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="flex-1 leading-normal">{option}</span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="flex justify-between items-center gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => setActiveQuizNoteId(null)}
                                className={`text-[10px] underline hover:no-underline ${styles.textMuted}`}
                              >
                                Cancel Assessment
                              </button>
                              <button
                                type="button"
                                disabled={chosenAnswerIdx === null}
                                onClick={() => handleNextQuizQuestion(quizQuestions.length)}
                                className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                                  chosenAnswerIdx !== null
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                                    : "bg-gray-300/15 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {quizQuestionIdx === 2 ? "Finish & Score" : "Next Question"}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Case 2: Quiz not started yet
                      return (
                        <div className="bg-[#12111E]/45 border border-indigo-500/15 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5 flex-shrink-0">
                              <HelpCircle className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Placement Readiness MCQ</span>
                                {attempt && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    attempt.passed 
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                                      : "bg-red-500/15 text-red-400 border border-red-500/25"
                                  }`}>
                                    {attempt.passed ? `${attempt.score}/3 PASSED` : `${attempt.score}/3 FAILED`}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] leading-relaxed mt-1 ${styles.textMuted}`}>
                                Simulate a technical hiring interview with 3 custom multiple-choice placement questions. Pass threshold: 66%.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStartQuiz(selectedNote.id)}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-lg font-bold flex-shrink-0 transition-all shadow-md active:scale-95"
                          >
                            {attempt ? "Retake Assessment" : "Test Placement Readiness"}
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* User interactive star-rating note block */}
                  <div className="mt-5 border-t border-dashed border-gray-300/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className={`text-[10px] font-mono ${styles.textMuted}`}>
                      Stored locally in browser state cache.
                    </span>
                    <button
                      onClick={(e) => handleToggleRead(selectedNote.id, e)}
                      className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold ${
                        selectedNote.isRead 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      {selectedNote.isRead ? "Marked as Studied" : "Mark as Studied"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER VIEW 2: REVISION FLASHCARDS */}
      {activeTab === "flashcard" && (
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 py-4">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold flex items-center justify-center gap-1.5">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              Active Revision Flashcard study
            </h3>
            <p className={`text-xs mt-1 ${styles.textMuted}`}>
              Flip the cards to test your computer science knowledge. Hit space or click to flip.
            </p>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-gray-300/20 rounded-xl">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className={styles.textPrimary}>No flashcards to study.</p>
              <p className={`text-xs mt-1 ${styles.textMuted}`}>Try selecting "All" categories or create a new custom note card.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Study Mode Selector & Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono px-1 border-b border-dashed border-gray-300/10 pb-4">
                <div className="flex items-center gap-1.5 bg-neutral-100/5 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { playAudioCue("nav-click"); setStudyMode("standard"); setIsFlipped(false); }}
                    className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                      studyMode === "standard"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-450 hover:text-white"
                    }`}
                  >
                    Standard (Concept → Definition)
                  </button>
                  <button
                    type="button"
                    onClick={() => { playAudioCue("nav-click"); setStudyMode("reverse"); setIsFlipped(false); }}
                    className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                      studyMode === "reverse"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-450 hover:text-white"
                    }`}
                  >
                    Reverse (Definition → Concept)
                  </button>
                </div>
                
                <span className={styles.textMuted}>
                  Card {flashcardIndex + 1} of {filteredNotes.length}
                </span>
              </div>

              {/* 3D Flashcard Perspective Container */}
              <div 
                id="revision-flashcard"
                onClick={() => { playAudioCue("card-click"); setIsFlipped(!isFlipped); }}
                className="perspective-1000 w-full h-96 cursor-pointer relative"
              >
                {/* 3D Card Rotator */}
                <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""}`}>
                  
                  {/* FRONT SIDE */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-0 flex flex-col justify-between p-6 ${styles.flashcardFrame.replace("h-80", "h-full").replace(/\brelative\b/g, "")} border border-indigo-500/30 shadow-lg ${isFlipped ? "pointer-events-none z-0" : "z-10"}`}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className={`${styles.tagBadge} uppercase tracking-widest text-[10px] font-bold`}>
                          {filteredNotes[flashcardIndex].category}
                        </span>
                        <span className="text-[10px] opacity-30 text-gray-400">•</span>
                        <span className="text-[10px] font-mono opacity-70 flex items-center gap-1 text-indigo-450/80" title="Estimated reading time">
                          <BookOpen className="w-3.5 h-3.5" /> {getReadingTime(filteredNotes[flashcardIndex])} min
                        </span>
                      </div>
                      <span className={styles.difficultyBadge(filteredNotes[flashcardIndex].difficulty)}>
                        {filteredNotes[flashcardIndex].difficulty}
                      </span>
                    </div>

                    {studyMode === "standard" ? (
                      /* Standard Front: Concept Title */
                      <div className="flex flex-col items-center text-center gap-4 my-auto">
                        <BookOpen className="w-10 h-10 text-indigo-400 opacity-80" />
                        <h2 className="text-xl sm:text-3xl font-black max-w-lg leading-tight tracking-tight">
                          {filteredNotes[flashcardIndex].title}
                        </h2>
                        <span className={`text-xs ${styles.textMuted} bg-indigo-500/10 px-2 py-1 rounded`}>
                          Question Card
                        </span>
                      </div>
                    ) : (
                      /* Reverse Front: Definition / Clues */
                      <div className="flex flex-col items-start text-left gap-4 my-auto overflow-y-auto scrollbar-none max-h-[75%] w-full">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                          Identify this Computer Science Concept:
                        </span>
                        <p className="text-sm sm:text-base leading-relaxed font-medium opacity-95 italic">
                          "{filteredNotes[flashcardIndex].summary}"
                        </p>
                        <div className="w-full h-px bg-slate-300/10 my-1" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Key Takeaways / Clues:
                        </span>
                        <ul className="flex flex-col gap-1.5 w-full">
                          {filteredNotes[flashcardIndex].keyTakeaways.slice(0, 2).map((takeaway, i) => (
                            <li key={i} className="text-xs flex items-start gap-1.5 leading-relaxed opacity-90">
                              <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-xs italic opacity-60 w-full">
                      <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Click card block to flip and see other side</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between p-6 ${styles.flashcardFrame.replace("h-80", "h-full").replace(/\brelative\b/g, "")} border border-emerald-500/30 shadow-lg ${isFlipped ? "z-10" : "pointer-events-none z-0"}`}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
                          Core Concept Answer
                        </span>
                        <span className="text-[10px] opacity-30 text-gray-400">•</span>
                        <span className="text-[10px] font-mono opacity-70 flex items-center gap-1 text-emerald-450/80" title="Estimated reading time">
                          <BookOpen className="w-3.5 h-3.5" /> {getReadingTime(filteredNotes[flashcardIndex])} min
                        </span>
                      </div>
                      <span className={styles.difficultyBadge(filteredNotes[flashcardIndex].difficulty)}>
                        {filteredNotes[flashcardIndex].difficulty}
                      </span>
                    </div>

                    {studyMode === "standard" ? (
                      /* Standard Back: Definition / Answers */
                      <div className="flex flex-col items-start text-left gap-3 my-auto overflow-y-auto scrollbar-none max-h-[75%] w-full">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Concept Explanation:
                        </span>
                        <p className="text-xs sm:text-sm leading-relaxed font-semibold opacity-95">
                          {filteredNotes[flashcardIndex].summary}
                        </p>
                        <div className="w-full h-px bg-slate-300/10 my-1" />
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                          Core Bullet Points:
                        </span>
                        <ul className="flex flex-col gap-1.5 w-full">
                          {filteredNotes[flashcardIndex].keyTakeaways.slice(0, 3).map((takeaway, i) => (
                            <li key={i} className="text-[11px] sm:text-xs flex items-start gap-1.5 leading-relaxed opacity-90">
                              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      /* Reverse Back: Concept Name Revealed */
                      <div className="flex flex-col items-center text-center gap-4 my-auto">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                          Target Concept Name:
                        </span>
                        <h2 className="text-xl sm:text-3xl font-black max-w-lg leading-tight tracking-tight text-emerald-400">
                          {filteredNotes[flashcardIndex].title}
                        </h2>
                        <span className={`text-xs ${styles.textMuted} bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20`}>
                          Category: {filteredNotes[flashcardIndex].category}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono w-full text-slate-400">
                      <span>Click to flip back</span>
                      <div className="flex gap-3">
                        <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
                          Mastered: {studyStats.mastered}
                        </span>
                        <span className={`font-semibold flex items-center gap-0.5 ${styles.interactivePrimary}`}>
                          Review: {studyStats.reviewing}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Navigation and Study inputs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleFlashcardNav("prev")}
                    className={`flex-1 sm:flex-initial text-xs px-4 py-2.5 transition-colors ${styles.controlBtn}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFlashcardNav("next")}
                    className={`flex-1 sm:flex-initial text-xs px-4 py-2.5 transition-colors ${styles.controlBtn}`}
                  >
                    Next Card
                  </button>
                </div>

                {isFlipped && (
                  <div className="flex gap-2 w-full sm:w-auto animate-in fade-in-50 duration-200">
                    <button
                      onClick={() => handleStudyMark("reviewing")}
                      className="flex-1 sm:flex-initial border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1"
                    >
                      Need Review
                    </button>
                    <button
                      onClick={() => handleStudyMark("mastered")}
                      className="flex-1 sm:flex-initial border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1"
                    >
                      Mastered!
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW 3: CREATE / EDIT NOTE CUSTOM EDITOR */}
      {activeTab === "create" && (
        <form onSubmit={handleCreateNote} className="max-w-3xl mx-auto w-full flex flex-col gap-5 animate-in fade-in-30 duration-300">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {editingNoteId ? "Edit Computer Science Revision File" : "Create Custom Computer Science Revision File"}
            </h3>
            <p className={`text-xs mt-0.5 ${styles.textMuted}`}>
              {editingNoteId 
                ? "Refine the structural layout, bullet points, or code sample for this computer science topic."
                : "Introduce new algorithmic blueprints or class study notes. Changes persist instantly in your local system memory."}
            </p>
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold opacity-80">Note Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., QuickSort Partitioning Mechanics"
                className={styles.formInput}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold opacity-80">Subject / Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className={styles.formInput}
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                {/* Fallback option if a note has a custom category not in active subjects */}
                {formCategory && !subjects.includes(formCategory) && (
                  <option value={formCategory}>{formCategory}</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold opacity-80">Topic Difficulty</label>
              <div className="flex gap-2">
                {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => { playAudioCue("nav-click"); setFormDifficulty(level); }}
                    className={`flex-1 text-xs py-2 rounded-lg font-semibold border transition-all ${
                      formDifficulty === level 
                        ? "bg-violet-600 border-violet-500 text-white" 
                        : `border-gray-300/40 opacity-70 hover:opacity-100 ${styles.interactiveText}`
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags comma-separated */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold opacity-80">Tags (comma-separated)</label>
              <input
                type="text"
                value={formTagsInput}
                onChange={(e) => setFormTagsInput(e.target.value)}
                placeholder="e.g., dsa, sorting, interview"
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Brief Summary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold opacity-80">Brief Summary Overview *</label>
            <textarea
              required
              rows={3}
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
              placeholder="Provide a high-level conceptual explanation of the topic..."
              className={styles.formInput}
            />
          </div>

          {/* Dynamic Takeaways List */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold opacity-80 flex items-center justify-between">
              <span>Core Key Takeaways / Revision Bullets (Add at least 1) *</span>
              <span className={`text-[10px] font-normal ${styles.textMuted}`}>Add sequential points to review</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formTakeawayInput}
                onChange={(e) => setFormTakeawayInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTakeaway(); } }}
                placeholder="Type bullet point details and click Add..."
                className={styles.formInput}
              />
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-lg text-xs font-bold flex-shrink-0"
              >
                Add Bullet
              </button>
            </div>
            
            {/* Takeaways pillbox listing */}
            {formTakeaways.length > 0 && (
              <div className={`flex flex-col gap-2 mt-2 p-3 ${styles.subjectListContainer}`}>
                {formTakeaways.map((takeaway, index) => (
                  <div key={index} className={`flex items-center justify-between gap-3 text-xs p-2 ${styles.subjectListItem}`}>
                    <span className="flex items-start gap-1.5 leading-relaxed">
                      <span className={`font-bold ${styles.interactivePrimary}`}>{index + 1}.</span> {takeaway}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(index)}
                      className="text-red-500 hover:text-red-400 font-mono text-[10px] px-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional Code Snippet */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold opacity-80">Reference Code Snippet (Optional)</label>
              <select
                value={formLang}
                onChange={(e) => setFormLang(e.target.value)}
                className={`text-[11px] focus:outline-none ${styles.selectBox}`}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <textarea
              rows={5}
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="// Insert supporting code or code queries here..."
              className={`font-mono text-xs ${styles.formInput}`}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dashed border-gray-300/20">
            <button
              type="button"
              onClick={handleCancelEdit}
              className={`px-4 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-100/10 ${styles.interactiveText}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg text-xs font-bold"
            >
              {editingNoteId ? "Save Changes" : "Create Revision File"}
            </button>
          </div>
        </form>
      )}
    </StaggerContainer>
  );
}
