import React, { useState, useEffect, useRef } from "react";
import { ThemeId } from "@/types";
import { BookOpen, UserCheck, Bot, FileText, Send, Sparkles, RefreshCw, Star, ArrowRight, ClipboardCheck, AlertCircle, Mic, MicOff, Volume2, VolumeX, Globe, Languages, Play, Square, Info, Plus, Users, CheckCircle2 } from "lucide-react";
import { StaggerContainer } from "@/components/StaggeredView";
import { playAudioCue } from "@/utils/audio";

const parseBoldText = (text: string, currentTheme: ThemeId) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  const boldColor = currentTheme === "developer" ? "text-cyan-400" : currentTheme === "glass" ? "text-white" : currentTheme === "minimal" ? "text-emerald-950 font-black" : "text-slate-900";
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className={`font-bold ${boldColor}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const parseMarkdownToReact = (text: string, currentTheme: ThemeId) => {
  if (!text) return null;
  const lines = text.split("\n");
  
  const h4Color = currentTheme === "developer" ? "text-cyan-400 font-bold" : currentTheme === "glass" ? "text-violet-400" : currentTheme === "minimal" ? "text-emerald-850" : "text-indigo-600";
  const h3Color = currentTheme === "developer" ? "text-white border-b border-cyan-500/30 pb-1 font-bold" : currentTheme === "glass" ? "text-violet-300 border-b border-white/10 pb-1" : currentTheme === "minimal" ? "text-emerald-900 border-b border-neutral-100/50 pb-1" : "text-indigo-700 border-b border-indigo-100 pb-1";
  const h2Color = currentTheme === "developer" ? "text-white font-extrabold" : currentTheme === "glass" ? "text-violet-200" : currentTheme === "minimal" ? "text-neutral-950" : "text-indigo-900";
  const textColor = currentTheme === "developer" ? "text-neutral-200" : currentTheme === "glass" ? "text-slate-200" : currentTheme === "minimal" ? "text-[#2D312E]" : "text-slate-800";
  
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return <h4 key={idx} className={`text-xs sm:text-sm font-bold mt-3 mb-1.5 ${h4Color}`}>{line.replace("### ", "")}</h4>;
    }
    if (line.startsWith("## ")) {
      return <h3 key={idx} className={`text-sm sm:text-base font-extrabold mt-4 mb-2 ${h3Color}`}>{line.replace("## ", "")}</h3>;
    }
    if (line.startsWith("# ")) {
      return <h2 key={idx} className={`text-base sm:text-lg font-black mt-5 mb-3 ${h2Color}`}>{line.replace("# ", "")}</h2>;
    }
    
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.substring(2);
      return (
        <li key={idx} className={`ml-4 list-disc my-1 ${textColor}`}>
          {parseBoldText(content, currentTheme)}
        </li>
      );
    }
    
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className={`ml-4 list-decimal my-1 ${textColor}`}>
          {parseBoldText(numMatch[2], currentTheme)}
        </li>
      );
    }

    if (line.trim() === "") {
      return <div key={idx} className="h-1.5" />;
    }

    return <p key={idx} className={`my-1 leading-relaxed ${textColor}`}>{parseBoldText(line, currentTheme)}</p>;
  });
};

interface PlacementOfficeProps {
  currentTheme: ThemeId;
}

export default function PlacementOffice({ currentTheme }: PlacementOfficeProps) {
  const [activeTab, setActiveTab] = useState<"interview" | "resume" | "feedback">("interview");

  // Mock Interview States
  const [interviewTopic, setInterviewTopic] = useState("MERN Stack & Full-Stack Development");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState<"START" | "CONTINUE" | "END">("START");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastFeedback, setLastFeedback] = useState("");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [scoresList, setScoresList] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState("");
  const [textNarrative, setTextNarrative] = useState("");
  const [stageCount, setStageCount] = useState(1);

  // Resume Analyzer States
  const [resumeText, setResumeText] = useState("");
  const [critiqueResult, setCritiqueResult] = useState("");
  const [critiqueLoading, setCritiqueLoading] = useState(false);

  // Alumni Feedback States
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [newFeedbackName, setNewFeedbackName] = useState("");
  const [newFeedbackBatch, setNewFeedbackBatch] = useState("Class of 2025");
  const [newFeedbackDegree, setNewFeedbackDegree] = useState("MCA");
  const [newFeedbackCompany, setNewFeedbackCompany] = useState("");
  const [newFeedbackPosition, setNewFeedbackPosition] = useState("");
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [newFeedbackComment, setNewFeedbackComment] = useState("");
  const [newFeedbackError, setNewFeedbackError] = useState("");
  const [newFeedbackSuccess, setNewFeedbackSuccess] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchAlumniFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/alumni/feedback");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeedbackList(data);
      }
    } catch (e) {
      console.error("Failed to fetch alumni feedback:", e);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewFeedbackError("");
    setNewFeedbackSuccess("");

    if (!newFeedbackName.trim() || newFeedbackName.trim().length < 2) {
      setNewFeedbackError("Name must be at least 2 characters.");
      return;
    }
    if (!newFeedbackComment.trim() || newFeedbackComment.trim().length < 10) {
      setNewFeedbackError("Testimonial content must be at least 10 characters.");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/alumni/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFeedbackName,
          batch: newFeedbackBatch,
          degree: newFeedbackDegree,
          company: newFeedbackCompany || "GGI Alumni",
          position: newFeedbackPosition || "Software Engineer",
          rating: newFeedbackRating,
          comment: newFeedbackComment
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewFeedbackSuccess(data.message || "Feedback submitted successfully!");
        setNewFeedbackName("");
        setNewFeedbackCompany("");
        setNewFeedbackPosition("");
        setNewFeedbackComment("");
        setNewFeedbackRating(5);
        fetchAlumniFeedback(); // Reload feedback list
      } else {
        setNewFeedbackError(data.error || "Failed to submit feedback.");
      }
    } catch (e) {
      console.error(e);
      setNewFeedbackError("Network error. Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  useEffect(() => {
    fetchAlumniFeedback();
  }, []);

  // Voice & Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState("");
  const [speechLang, setSpeechLang] = useState<"en-US" | "en-IN">("en-IN");
  const [interimText, setInterimText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoRead, setAutoRead] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Stop any voice or speech on tab change or interview end
  useEffect(() => {
    if (activeTab !== "interview" || !interviewStarted) {
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        setIsListening(false);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  }, [activeTab, interviewStarted]);

  // Cleanup synthesis and speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakQuestion = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Stop any current speaking first
    window.speechSynthesis.cancel();

    // Strip markdown formatting from the text before speaking
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/- /g, "")
      .replace(/\d+\./g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang === "en-IN" && v.name.toLowerCase().includes("male")) ||
                          voices.find(v => v.lang.startsWith("en-IN")) ||
                          voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("male")) ||
                          voices.find(v => v.lang.startsWith("en"));
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
    } else {
      setSpeechError("");
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        setSpeechError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        return;
      }
      
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = speechLang;
        
        rec.onstart = () => {
          setIsListening(true);
          setInterimText("");
        };
        
        rec.onresult = (event: any) => {
          let interim = "";
          let final = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript + " ";
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
            setUserAnswer(prev => prev + final);
          }
          setInterimText(interim);
        };
        
        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "not-allowed") {
            setSpeechError("Microphone permission denied. Please allow microphone access in your browser address bar.");
          } else {
            setSpeechError(`Speech error: ${event.error}`);
          }
          setIsListening(false);
        };
        
        rec.onend = () => {
          setIsListening(false);
          setInterimText("");
        };
        
        recognitionRef.current = rec;
        rec.start();
      } catch (err: any) {
        console.error("Failed to start SpeechRecognition:", err);
        setSpeechError("Failed to initiate microphone access.");
        setIsListening(false);
      }
    }
  };

  const startInterview = async () => {
    setLoading(true);
    setInterviewStarted(true);
    setCurrentStage("START");
    setScoresList([]);
    setStageCount(1);
    setLastFeedback("");
    setLastScore(null);
    setInterviewSummary("");
    
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: interviewTopic, stage: "START" }),
      });
      const data = await res.json();
      setCurrentQuestion(data.nextQuestion || data.question || "What is your experience with " + interviewTopic + "?");
      
      const narrativeText = data.text || "Welcome to your mock interview! Let's get started.";
      setTextNarrative(narrativeText);
      
      if (autoRead) {
        setTimeout(() => speakQuestion(narrativeText), 100);
      }
    } catch (e) {
      console.error(e);
      setCurrentQuestion("Could you explain the primary differences between SQL and MongoDB databases inside a MERN Stack architecture?");
      const narrativeText = "Welcome! Let's start with a core database design question.";
      setTextNarrative(narrativeText);
      
      if (autoRead) {
        setTimeout(() => speakQuestion(narrativeText), 100);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    const nextStage = stageCount >= 3 ? "END" : "CONTINUE";
    
    // Turn off listening when submitting
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
    
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: interviewTopic,
          userResponse: userAnswer,
          stage: nextStage,
        }),
      });
      const data = await res.json();
      
      setLastFeedback(data.feedback || "Good effort. Make sure to specify core framework concepts.");
      
      const scoreNum = Number(data.score);
      if (!isNaN(scoreNum) && scoreNum > 0) {
        setLastScore(scoreNum);
        setScoresList(prev => [...prev, scoreNum]);
      } else {
        setLastScore(7);
        setScoresList(prev => [...prev, 7]);
      }

      setUserAnswer("");

      if (nextStage === "END") {
        setCurrentStage("END");
        setInterviewSummary(data.summary || "You performed exceptionally well overall! Keep practicing key Data Structures and system design patterns.");
        
        const endNarrative = data.text || "Interview complete! Let's look at your feedback summary.";
        setTextNarrative(endNarrative);
        
        if (autoRead) {
          setTimeout(() => speakQuestion(endNarrative), 100);
        }
      } else {
        setStageCount(prev => prev + 1);
        setCurrentQuestion(data.nextQuestion || "What is your approach to handling API error codes in Express?");
        
        const nextNarrativeText = data.text || "Let's move on to the next question.";
        setTextNarrative(nextNarrativeText);
        
        if (autoRead) {
          setTimeout(() => speakQuestion(nextNarrativeText), 100);
        }
      }
    } catch (e) {
      console.error(e);
      // Offline fallback simulation
      setLastFeedback("Excellent overview. You correctly addressed the structural schema variations.");
      setLastScore(8);
      setScoresList(prev => [...prev, 8]);
      setUserAnswer("");
      if (nextStage === "END") {
        setCurrentStage("END");
        const summaryText = "Overall Score: 85%. Strong grasp of basic schemas. Action items: Revise indexing and caching strategies.";
        setInterviewSummary(summaryText);
        
        const endNarrative = "Interview complete! Let's look at your feedback summary.";
        setTextNarrative(endNarrative);
        
        if (autoRead) {
          setTimeout(() => speakQuestion(endNarrative), 100);
        }
      } else {
        setStageCount(prev => prev + 1);
        const fallbackQuestion = "Excellent! How do you handle asynchronous operations in Node.js? Compare Promises and async/await.";
        setCurrentQuestion(fallbackQuestion);
        
        const nextNarrativeText = `Excellent! Let's move to our next question: ${fallbackQuestion}`;
        setTextNarrative(nextNarrativeText);
        
        if (autoRead) {
          setTimeout(() => speakQuestion(nextNarrativeText), 100);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const runResumeCritique = async () => {
    if (!resumeText.trim()) return;
    setCritiqueLoading(true);
    setCritiqueResult("");
    
    try {
      const res = await fetch("/api/resume-critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setCritiqueResult(data.analysis);
    } catch (e) {
      console.error(e);
      setCritiqueResult("Failed to calculate critique. Please check your network connection.");
    } finally {
      setCritiqueLoading(false);
    }
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          card: "bg-black border-2 border-cyan-500 text-neutral-200 font-mono p-5 rounded-none",
          tabsContainer: "border-b border-cyan-500/30 pb-3 mb-4 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap max-w-full",
          tabActive: "bg-cyan-500 text-black px-4 py-2 font-bold font-mono text-xs flex-shrink-0",
          tabInactive: "border border-cyan-500/40 text-cyan-400/80 px-4 py-2 hover:bg-cyan-500/20 font-mono text-xs flex-shrink-0",
          input: "bg-black border border-cyan-500 text-neutral-100 p-3 rounded-none outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-xs placeholder:text-cyan-500/30",
          btn: "bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-none flex items-center gap-1.5 font-mono text-xs",
          btnDanger: "border border-red-500 text-red-500 hover:bg-red-950/20 px-4 py-2 rounded-none font-mono text-xs",
          chatBubble: "border border-cyan-500/50 bg-black/60 p-4 rounded-none text-neutral-200",
          textTitle: "text-cyan-400 text-2xl sm:text-3xl font-black font-mono",
          textMuted: "text-neutral-400 text-xs sm:text-sm font-mono",
          textPrimary: "text-white font-bold text-sm sm:text-base font-mono",
          textSecondary: "text-neutral-200 text-xs sm:text-sm font-mono",
          accentText: "text-cyan-400 font-mono font-bold",
          accentCard: "bg-black border border-cyan-500/40 p-4 rounded-none",
          secondaryCard: "bg-black border border-cyan-500/30 p-4 rounded-none",
          border: "border-cyan-500/30",
        };
      case "glass":
        return {
          card: "bg-slate-950/40 backdrop-blur-md border border-white/10 text-white rounded-xl p-6 shadow-lg shadow-violet-950/10",
          tabsContainer: "flex gap-2 bg-[#1A1333]/40 border border-white/5 p-1 rounded-lg mb-5 overflow-x-auto scrollbar-none whitespace-nowrap max-w-full",
          tabActive: "bg-violet-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm flex-shrink-0",
          tabInactive: "text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs transition-colors flex-shrink-0",
          input: "bg-[#1A1333]/40 border border-white/10 text-white p-3 rounded-xl outline-none focus:border-violet-500 text-xs sm:text-sm focus:ring-1 focus:ring-violet-500",
          btn: "bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-violet-600/20 flex items-center gap-1.5 text-xs sm:text-sm",
          btnDanger: "bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-950/40 px-4 py-2 rounded-xl text-xs",
          chatBubble: "bg-[#1A1333]/50 border border-white/5 p-4 rounded-xl",
          textTitle: "text-white text-2xl sm:text-3xl font-extrabold",
          textMuted: "text-slate-400 text-xs sm:text-sm",
          textPrimary: "text-slate-200 text-sm sm:text-base",
          textSecondary: "text-slate-300 text-xs sm:text-sm",
          accentText: "text-violet-400",
          accentCard: "bg-[#1A1333]/40 border border-white/10 p-4 rounded-xl",
          secondaryCard: "bg-[#1A1333]/40 border border-white/5 p-4 rounded-xl",
          border: "border-white/10",
        };
      case "minimal":
        return {
          card: "bg-white border border-neutral-200 text-neutral-850 rounded-3xl p-6 shadow-xs font-sans",
          tabsContainer: "flex gap-2 bg-neutral-50 p-1 rounded-full mb-5 border border-neutral-200 overflow-x-auto scrollbar-none whitespace-nowrap max-w-full",
          tabActive: "bg-neutral-950 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-sm flex-shrink-0",
          tabInactive: "text-neutral-600 hover:text-neutral-950 px-5 py-2.5 rounded-full text-xs transition-colors flex-shrink-0",
          input: "bg-white border border-neutral-250 text-neutral-800 p-3 rounded-2xl outline-none focus:ring-1 focus:ring-neutral-950 text-xs sm:text-sm shadow-3xs",
          btn: "bg-neutral-950 hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-xs flex items-center gap-1.5 text-xs sm:text-sm",
          btnDanger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-xs font-semibold",
          chatBubble: "bg-neutral-50 border border-neutral-150 p-5 rounded-2xl shadow-3xs",
          textTitle: "text-black text-2xl sm:text-3xl font-extrabold",
          textMuted: "text-neutral-500 text-xs sm:text-sm",
          textPrimary: "text-black text-sm sm:text-base font-bold",
          textSecondary: "text-neutral-700 text-xs sm:text-sm",
          accentText: "text-neutral-900 font-extrabold",
          accentCard: "bg-neutral-50/20 border border-neutral-200 p-4 rounded-3xl",
          secondaryCard: "bg-white border border-neutral-200 p-4 rounded-2xl shadow-3xs",
          border: "border-neutral-200/50",
        };
      case "academic":
      default:
        return {
          card: "bg-[#FDFBF7] border border-[#D4C3A3] text-[#2A1E17] rounded-xl p-6 shadow-md font-serif",
          tabsContainer: "flex gap-2 bg-[#FAF6EE] border border-[#D4C3A3]/60 p-1 rounded-md mb-5 overflow-x-auto scrollbar-none whitespace-nowrap max-w-full",
          tabActive: "bg-[#7F1D1D] text-white px-4 py-2 rounded-md text-xs font-semibold shadow-xs flex-shrink-0",
          tabInactive: "text-[#5C2D11]/80 hover:text-[#7F1D1D] px-4 py-2 rounded-md text-xs transition-colors flex-shrink-0",
          input: "bg-white border border-[#D4C3A3] p-3 rounded-md outline-[#7F1D1D] focus:ring-1 focus:ring-[#7F1D1D] text-xs sm:text-sm text-[#2A1E17] font-serif",
          btn: "bg-[#7F1D1D] hover:bg-[#5A1010] text-white px-5 py-2.5 rounded-md font-medium flex items-center gap-1.5 shadow-xs text-xs sm:text-sm transition-all duration-200 font-serif",
          btnDanger: "bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-xs font-serif",
          chatBubble: "bg-[#FAF6EE] border border-[#D4C3A3]/50 p-4 rounded-md shadow-2xs font-serif",
          textTitle: "text-[#5A1010] text-2xl sm:text-3xl font-bold font-serif",
          textMuted: "text-[#5C4533] text-xs sm:text-sm font-serif",
          textPrimary: "text-[#5A1010] text-sm sm:text-base font-bold font-serif",
          textSecondary: "text-[#4A3B32] text-xs sm:text-sm font-serif",
          accentText: "text-[#7F1D1D] font-bold font-serif",
          accentCard: "bg-[#FAF0D9]/40 border border-[#D4C3A3] p-4 rounded-md font-serif",
          secondaryCard: "bg-white border border-[#D4C3A3]/70 p-4 rounded-md font-serif shadow-2xs",
          border: "border-[#D4C3A3]/40",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <StaggerContainer 
      onMouseEnter={() => playAudioCue("card-hover")}
      onClick={() => playAudioCue("card-click")}
      className={`flex flex-col gap-6 depth-card-3d z-index-10 cursor-pointer ${styles.card}`}
    >
      {/* Header */}
      <div className={`border-b pb-4 ${currentTheme === "developer" ? "border-cyan-500/30" : "border-gray-150"}`}>
        <h2 className={`flex items-center gap-2 text-3d-lift cursor-pointer ${styles.textTitle}`}>
          <UserCheck className={`w-6 h-6 flex-shrink-0 animate-pulse ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-500"}`} />
          Vicky's Placement & Mock Interview Office
        </h2>
        <p className={`mt-1.5 leading-relaxed ${styles.textMuted}`}>
          Simulate a campus recruitment drive. Answer data structures or stack questions and get real-time scores, or paste your resume for a professional critique.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className={styles.tabsContainer}>
        <button
          id="btn-tab-interview"
          onClick={() => setActiveTab("interview")}
          className={activeTab === "interview" ? styles.tabActive : styles.tabInactive}
        >
          Mock Interviewer Simulator
        </button>
        <button
          id="btn-tab-resume"
          onClick={() => setActiveTab("resume")}
          className={activeTab === "resume" ? styles.tabActive : styles.tabInactive}
        >
          AI CV Analyzer & Optimizer
        </button>
        <button
          id="btn-tab-feedback"
          onClick={() => setActiveTab("feedback")}
          className={activeTab === "feedback" ? styles.tabActive : styles.tabInactive}
        >
          Placed Alumni Feedback
        </button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === "interview" ? (
        <div className="flex flex-col gap-5">
          {!interviewStarted ? (
            <div className="flex flex-col gap-4 max-w-xl mx-auto text-center py-6">
              <Bot className={`w-12 h-12 mx-auto animate-bounce ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`} />
              <div className="flex flex-col">
                <span className={`text-base font-bold ${styles.textPrimary}`}>Configure Placement Interview Topic</span>
                <span className={`text-xs mt-1 ${styles.textMuted}`}>Select a core topic and begin a customized academic mock interview session</span>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <select
                  id="select-interview-topic"
                  value={interviewTopic}
                  onChange={(e) => setInterviewTopic(e.target.value)}
                  className={`p-3 text-sm bg-transparent border rounded-md outline-none ${
                    currentTheme === "developer"
                      ? "bg-black text-cyan-400 border-cyan-500 font-mono"
                      : currentTheme === "glass"
                      ? "bg-[#1A1333] text-white border-white/10"
                      : "bg-white text-slate-800 border-gray-200 focus:ring-1 focus:ring-indigo-500"
                  }`}
                >
                  <option value="MERN Stack & Full-Stack Development" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>MERN Stack & Web Development</option>
                  <option value="Data Structures & Core Algorithms" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>Data Structures & Core Algorithms</option>
                  <option value="C++ Object Oriented Programming" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>C++ Object Oriented Programming</option>
                  <option value="Python Scripting & Machine Learning" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>Python Scripting & Machine Learning</option>
                  <option value="DBMS & Database Administration" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>DBMS & Database Administration</option>
                </select>

                <button
                  id="btn-start-interview"
                  onClick={startInterview}
                  className={`w-full justify-center mt-2 ${styles.btn}`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  Initiate Recruitment Mock Interview
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interview Screen */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${styles.accentCard}`}>
                  <span className={`text-xs font-semibold ${styles.accentText}`}>
                    Topic: {interviewTopic}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    currentTheme === "developer" 
                      ? "bg-black text-cyan-400 border border-cyan-500" 
                      : currentTheme === "glass"
                      ? "bg-violet-950 text-white border border-white/10"
                      : "bg-white text-indigo-900 border border-indigo-200"
                  }`}>
                    Question {stageCount} of 3
                  </span>
                </div>

                {/* Narrator Speaks */}
                <div className={styles.chatBubble}>
                  <div className={`flex items-center justify-between border-b pb-2 mb-2 ${
                    currentTheme === "developer" ? "border-cyan-500/20" : "border-gray-100/10"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Bot className={`w-4 h-4 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-500"}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${styles.textPrimary}`}>Prof. Vicky Kumar (Interviewer)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakQuestion(textNarrative)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                          isSpeaking
                            ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                            : currentTheme === "developer"
                            ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                            : currentTheme === "glass"
                            ? "bg-violet-950/40 border-violet-500/30 text-violet-300 hover:bg-violet-500/20"
                            : currentTheme === "minimal"
                            ? "bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200"
                            : "bg-[#FAF0D9] border-[#D4C3A3] text-[#7F1D1D] hover:bg-[#FAF0D9]/80"
                        }`}
                        title={isSpeaking ? "Stop Speaking" : "Listen to Vicky's Question"}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Mute</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Out</span>
                          </>
                        )}
                      </button>
                      
                      {/* Auto Read option */}
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoRead}
                          onChange={(e) => setAutoRead(e.target.checked)}
                          className="w-3 h-3 accent-indigo-600 rounded"
                        />
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${styles.textMuted}`}>Auto</span>
                      </label>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-serif italic ${styles.textSecondary}`}>
                    "{textNarrative}"
                  </p>
                </div>

                {/* Current Question Display */}
                {currentStage !== "END" && (
                  <div className={`p-4 border rounded-xl flex flex-col gap-2 ${styles.accentCard}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"
                    }`}>Question Segment:</span>
                    <p className={`text-sm font-bold leading-normal ${styles.textPrimary}`}>
                      {currentQuestion}
                    </p>
                  </div>
                )}

                {/* User Answer Area */}
                {currentStage !== "END" && (
                  <div className="flex flex-col gap-2.5">
                    {/* Voice Assistant Panel */}
                    <div className={`flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between p-3 rounded-xl border border-dashed text-left ${styles.secondaryCard}`}>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${styles.textPrimary}`}>
                          <Mic className={`w-3.5 h-3.5 ${isListening ? "text-red-500 animate-pulse" : styles.accentText}`} />
                          Conduct Interview via Voice-to-Text
                        </span>
                        <span className={`text-[10px] ${styles.textMuted}`}>
                          Speak your technical answers naturally. The engine transcribes in real-time.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {/* Language Selection */}
                        <div className="flex items-center gap-1 border border-neutral-300/40 dark:border-white/10 px-2 py-1 rounded-lg text-[10px] font-mono">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <select
                            value={speechLang}
                            onChange={(e) => setSpeechLang(e.target.value as "en-US" | "en-IN")}
                            className="bg-transparent text-[10px] border-none outline-none cursor-pointer focus:ring-0 py-0"
                            title="Select speech recognition language"
                          >
                            <option value="en-IN" className="bg-slate-900 text-white">English (India)</option>
                            <option value="en-US" className="bg-slate-900 text-white">English (US)</option>
                          </select>
                        </div>

                        {/* Mic Button */}
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            isListening
                              ? "bg-red-500 text-white animate-pulse"
                              : currentTheme === "developer"
                              ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                              : currentTheme === "glass"
                              ? "bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30"
                              : currentTheme === "minimal"
                              ? "bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200"
                              : "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] hover:bg-[#FAF0D9]/80"
                          }`}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-3 h-3" />
                              <span>Stop Mic</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3 h-3" />
                              <span>Start Speaking</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Speech Error Display */}
                    {speechError && (
                      <div className="text-[10px] text-red-500 flex items-center gap-1 px-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{speechError}</span>
                      </div>
                    )}

                    {/* Interim text/Transcript feedback */}
                    {isListening && (
                      <div className={`p-2 border rounded-lg border-dashed text-xs flex flex-col gap-1 text-left ${styles.secondaryCard}`}>
                        <span className="text-[9px] opacity-60 uppercase font-black text-red-500 tracking-wider flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-red-500 animate-ping"></span>
                          Listening in Real-Time:
                        </span>
                        <p className={`italic text-[11px] ${styles.textSecondary}`}>
                          {interimText ? `"${interimText}"` : "Say your technical answer out loud..."}
                        </p>
                      </div>
                    )}

                    <textarea
                      id="text-user-answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your structured professional answer here... Describe coding concepts, design structures, or complexities."
                      className={`h-24 text-sm ${styles.input}`}
                    />

                    <div className="flex justify-between items-center mt-1">
                      <button
                        onClick={() => {
                          setInterviewStarted(false);
                          setCurrentStage("START");
                        }}
                        className={styles.btnDanger}
                      >
                        Cancel Interview
                      </button>

                      <button
                        id="btn-submit-answer"
                        onClick={submitAnswer}
                        disabled={loading || !userAnswer.trim()}
                        className={styles.btn}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Evaluating answer...
                          </>
                        ) : (
                          <>
                            Submit Technical Answer
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* End Results Summary */}
                {currentStage === "END" && (
                  <div className={`border p-5 flex flex-col gap-4 animate-in fade-in duration-300 ${styles.accentCard}`}>
                    <div className={`flex items-center gap-2 border-b pb-2 ${
                      currentTheme === "developer" ? "border-cyan-500/30" : "border-gray-150"
                    }`}>
                      <ClipboardCheck className={`w-5 h-5 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`} />
                      <span className={`text-sm font-bold ${styles.textPrimary}`}>Placement Assessment Report</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Overall score */}
                      <div className={`p-4 text-center ${styles.secondaryCard}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${styles.textMuted}`}>Overall Placement Readiness</span>
                        <span className={`text-4xl font-black mt-2 block ${
                          currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"
                        }`}>
                          {Math.round(scoresList.reduce((a, b) => a + b, 0) / (scoresList.length || 1)) * 10}%
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Strengths lists */}
                      <div className={`p-4 flex flex-col gap-1.5 justify-center ${styles.secondaryCard}`}>
                        <span className={`text-xs font-bold ${styles.textPrimary}`}>Assessed Strengths:</span>
                        <div className={`flex flex-col gap-1 text-xs ${styles.textSecondary}`}>
                          <span className="flex items-center gap-1"><span className="text-emerald-500 font-bold">✔</span> Good schema understanding</span>
                          <span className="flex items-center gap-1"><span className="text-emerald-500 font-bold">✔</span> Sound technical terminology</span>
                          <span className="flex items-center gap-1"><span className="text-emerald-500 font-bold">✔</span> Clear structure logic</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed font-serif italic border-l-4 pl-3 ${styles.textSecondary} ${
                      currentTheme === "developer" ? "border-cyan-500" : "border-indigo-500"
                    }`}>
                      "{interviewSummary}"
                    </p>

                    <button
                      onClick={() => setInterviewStarted(false)}
                      className={`self-center ${styles.btn}`}
                    >
                      Restart Another Session
                    </button>
                  </div>
                )}
              </div>

              {/* Live Scoring Side panel */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Last evaluation score info */}
                {lastFeedback && (
                  <div className={`p-4 shadow-3xs flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 ${styles.secondaryCard}`}>
                    <div className={`flex items-center justify-between border-b pb-2 ${
                      currentTheme === "developer" ? "border-cyan-500/20" : "border-gray-100"
                    }`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>Last Answer Score:</span>
                      {lastScore !== null && (
                        <span className={`text-sm font-black px-2 py-0.5 rounded-full ${
                          currentTheme === "developer" 
                            ? "text-cyan-400 bg-black border border-cyan-500" 
                            : "text-emerald-600 bg-emerald-50 border border-emerald-100"
                        }`}>
                          {lastScore} / 10
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-bold uppercase ${styles.textMuted}`}>Interviewer Critique:</span>
                      <p className={`text-[11px] italic leading-relaxed ${styles.textSecondary}`}>
                        "{lastFeedback}"
                      </p>
                    </div>
                  </div>
                )}

                {/* General placement tips */}
                <div className={`p-4 flex gap-3 rounded-xl border ${
                  currentTheme === "developer" 
                    ? "bg-black border-cyan-500/40 text-cyan-400" 
                    : currentTheme === "glass"
                    ? "bg-[#1A1333]/30 border-white/5 text-white"
                    : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    currentTheme === "developer" ? "text-cyan-400" : "text-amber-600"
                  }`} />
                  <div>
                    <span className="text-xs font-bold block">Vicky's Interview Guidelines:</span>
                    <p className={`text-[11px] leading-relaxed mt-1 ${
                      currentTheme === "developer" ? "text-cyan-400/80" : currentTheme === "glass" ? "text-slate-300" : "text-neutral-600"
                    }`}>
                      Include practical technical keywords! Mention time complexities (e.g. O(1)), stack behaviors (LIFO), database patterns (indexing), or React hook structures to score highest in evaluations!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "resume" ? (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Side */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.textMuted}`}>
                <FileText className={`w-4 h-4 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-500"}`} />
                Paste Raw Resume Text
              </span>
              <p className={`text-xs leading-relaxed ${styles.textSecondary}`}>
                Copy and paste your entire resume content (or your CV highlights, projects, and experiences) below. Vicky's automated placement engine will analyze keyword coverage, layout balance, and ATS-compliance!
              </p>

              <textarea
                id="text-resume-upload"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste CV elements here... e.g. Name, Education, Projects (React, Node, Java), Skills, Certifications."
                className={`w-full h-80 p-3 text-xs resize-none font-mono ${styles.input}`}
              />

              <button
                id="btn-analyze-resume"
                onClick={runResumeCritique}
                disabled={critiqueLoading || !resumeText.trim()}
                className={`w-full justify-center ${styles.btn}`}
              >
                {critiqueLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing CV Keywords...
                  </>
                ) : (
                  <>
                    Analyze CV for Placement
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Critique Report Output */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.textMuted}`}>
                <ClipboardCheck className={`w-4 h-4 animate-pulse ${
                  currentTheme === "developer" ? "text-cyan-400" : "text-emerald-500"
                }`} />
                Academic CV Evaluation Report
              </span>

              <div className={`p-4 min-h-[380px] h-full flex flex-col overflow-y-auto max-h-[460px] ${styles.secondaryCard}`}>
                {critiqueLoading ? (
                  <div className="m-auto text-center flex flex-col gap-3 items-center">
                    <Bot className={`w-10 h-10 animate-spin ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`} />
                    <span className={`text-xs font-semibold ${
                      currentTheme === "developer" ? "text-cyan-400" : "text-indigo-900"
                    }`}>Running multi-factor keywords assessment...</span>
                  </div>
                ) : critiqueResult ? (
                  <div className={`prose prose-sm text-xs sm:text-sm leading-relaxed max-w-none w-full ${
                    currentTheme === "developer" ? "text-cyan-400" : "text-slate-800"
                  }`}>
                    <div className="font-sans flex flex-col gap-1 w-full text-left">
                      {parseMarkdownToReact(critiqueResult, currentTheme)}
                    </div>
                  </div>
                ) : (
                  <div className={`m-auto text-center flex flex-col gap-2 items-center ${styles.textMuted}`}>
                    <FileText className="w-10 h-10 stroke-1" />
                    <span className="text-xs italic">Submit your resume text to compute matching scores and keyword action items</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Share Feedback Form (Left/Right) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className={`p-5 flex flex-col gap-4 border ${styles.accentCard}`}>
                <div>
                  <h3 className={`text-sm font-bold flex items-center gap-1.5 ${styles.accentText}`}>
                    <Plus className="w-4 h-4" /> Share Your Placement Story
                  </h3>
                  <p className={`text-[11px] leading-relaxed mt-1 ${styles.textSecondary}`}>
                    Were you placed under Professor Vicky Kumar's guidance? Submit your feedback to inspire fellow juniors!
                  </p>
                </div>

                <form onSubmit={handleAddFeedback} className="flex flex-col gap-3.5">
                  {newFeedbackError && (
                    <div className="text-[11px] font-bold text-red-500 bg-red-500/10 p-2.5 border border-red-500/20 rounded-lg">
                      ✕ {newFeedbackError}
                    </div>
                  )}

                  {newFeedbackSuccess && (
                    <div className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 p-2.5 border border-emerald-500/20 rounded-lg">
                      ✓ {newFeedbackSuccess}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={newFeedbackName}
                      onChange={(e) => setNewFeedbackName(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                        Degree
                      </label>
                      <select
                        value={newFeedbackDegree}
                        onChange={(e) => setNewFeedbackDegree(e.target.value)}
                        className={`p-3 text-xs bg-transparent border rounded-md outline-none ${
                          currentTheme === "developer"
                            ? "bg-black text-cyan-400 border-cyan-500 font-mono animate-none"
                            : currentTheme === "glass"
                            ? "bg-[#1A1333] text-white border-white/10"
                            : "bg-white text-slate-800 border-gray-200"
                        }`}
                      >
                        <option value="MCA" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>MCA</option>
                        <option value="BCA" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>BCA</option>
                        <option value="B.Tech CSE" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>B.Tech CSE</option>
                        <option value="M.Tech" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>M.Tech</option>
                        <option value="B.Tech IT" className={currentTheme === "developer" ? "bg-black text-cyan-400" : currentTheme === "glass" ? "bg-[#1A1333] text-white" : ""}>B.Tech IT</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                        Batch
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Class of 2025"
                        value={newFeedbackBatch}
                        onChange={(e) => setNewFeedbackBatch(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                        Placed Company
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. TCS"
                        value={newFeedbackCompany}
                        onChange={(e) => setNewFeedbackCompany(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                        Job Title / Role
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Systems Engineer"
                        value={newFeedbackPosition}
                        onChange={(e) => setNewFeedbackPosition(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewFeedbackRating(star)}
                          className="p-0.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newFeedbackRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-300 dark:text-neutral-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${styles.textMuted}`}>
                      Placement Testimonial
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details of your placement preparation, mock interview experiences, and how Prof. Vicky Kumar guided your learning..."
                      value={newFeedbackComment}
                      onChange={(e) => setNewFeedbackComment(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 transition-all resize-none ${styles.input}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback || !newFeedbackName.trim() || !newFeedbackComment.trim()}
                    className={`w-full justify-center mt-2 cursor-pointer active:scale-98 disabled:opacity-40 ${styles.btn}`}
                  >
                    {submittingFeedback ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Submitting Success Story...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Publish My Success Story
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Testimonials List Display (Right/Left) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.textMuted}`}>
                  <Users className={`w-4 h-4 ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-500"}`} />
                  Placed Alumni Success Testimonials ({feedbackList.length})
                </span>
                <button
                  onClick={fetchAlumniFeedback}
                  title="Reload testimonials"
                  className={`p-1.5 rounded-full border transition-all cursor-pointer hover:rotate-180 ${
                    currentTheme === "developer" ? "border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 animate-none" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {feedbackLoading && feedbackList.length === 0 ? (
                <div className="m-auto text-center flex flex-col gap-3 py-16 items-center w-full">
                  <RefreshCw className={`w-8 h-8 animate-spin ${currentTheme === "developer" ? "text-cyan-400" : "text-indigo-600"}`} />
                  <span className={`text-xs ${styles.textMuted}`}>Fetching verified placement feedback...</span>
                </div>
              ) : feedbackList.length === 0 ? (
                <div className="m-auto text-center flex flex-col gap-2 py-16 items-center w-full">
                  <Users className="w-12 h-12 stroke-1 text-neutral-400" />
                  <span className="text-xs italic text-neutral-400">No alumni success stories posted yet. Be the first to share!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[660px] pr-1 scrollbar-thin scrollbar-thumb-indigo-500/10">
                  {feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 flex flex-col gap-3 border transition-all hover:translate-x-1 ${styles.secondaryCard}`}
                    >
                      {/* Name & Placed Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${styles.textPrimary}`}>
                            {item.name}
                            <span className={`text-[10px] font-normal ${styles.textMuted}`}>
                              ({item.degree} • {item.batch})
                            </span>
                          </h4>
                          <p className="text-[11px] font-semibold mt-0.5 text-indigo-500 dark:text-indigo-400">
                            Placed at <span className={styles.accentText}>{item.company}</span> as <span className="italic">{item.position}</span>
                          </p>
                        </div>

                        {/* Verified/Rating side */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                          {item.verified && (
                            <span className="flex items-center gap-1 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Verified Placement
                            </span>
                          )}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3 h-3 ${
                                  idx < item.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-neutral-200 dark:text-neutral-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className={`text-[11px] leading-relaxed italic ${styles.textSecondary}`}>
                        "{item.comment}"
                      </p>

                      {/* Timestamp */}
                      <span className={`text-[9px] text-right ${styles.textMuted}`}>
                        Posted on {new Date(item.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </StaggerContainer>
  );
}
