import React, { useState, useEffect } from "react";
import { ThemeId } from "@/types";
import { 
  Mail, Phone, MapPin, Calendar, Clock, Send, CheckCircle, Loader2, 
  Sparkles, MessageSquare, Briefcase, ChevronDown, ChevronUp, Github, 
  Linkedin, Twitter, Instagram, Facebook, Youtube, GraduationCap, 
  Layers, ExternalLink, HelpCircle, Heart, User, Check, RefreshCw, AlertCircle,
  Search, Inbox, Lock, EyeOff, LogOut, FileText, CheckCircle2, HardDrive, Info
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/StaggeredView";
import { motion, AnimatePresence } from "motion/react";
import { playAudioCue } from "@/utils/audio";
import { initAuth, googleSignIn, logout } from "../utils/firebaseAuth";
import { createDriveFolder, uploadInquiryBackup, listPotentialAttachments } from "../utils/googleDrive";

interface ContactProps {
  currentTheme: ThemeId;
}

export default function Contact({ currentTheme }: ContactProps) {
  // Google Drive & Firebase Auth States
  const [gUser, setGUser] = useState<any>(null);
  const [gToken, setGToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [selectedDriveFile, setSelectedDriveFile] = useState<any | null>(null);
  const [driveBackupStatus, setDriveBackupStatus] = useState<"idle" | "backing_up" | "success" | "error">("idle");
  const [driveBackupId, setDriveBackupId] = useState<string | null>(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "", // Honeypot spam protection
  });

  // Human Captcha / Spam Protection Puzzle
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaNum1] = useState(() => Math.floor(Math.random() * 9) + 2);
  const [captchaNum2] = useState(() => Math.floor(Math.random() * 8) + 2);
  
  // Validation / Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [emailDispatchResult, setEmailDispatchResult] = useState<any>(null);
  const [submittedAutoReply, setSubmittedAutoReply] = useState("");

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHoneypot, setNewsletterHoneypot] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(13);

  // FAQ Accordion expanded state (index -> boolean)
  const [expandedFaq, setExpandedFaq] = useState<Record<number, boolean>>({
    0: true, // open the first FAQ by default
  });

  // Real-Time Live Message Feed State
  const [messages, setMessages] = useState<any[]>([]);
  const [inboxEmail, setInboxEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const loadDriveFiles = async (t: string) => {
    try {
      const files = await listPotentialAttachments(t);
      setDriveFiles(files);
    } catch (err) {
      console.error("Error loading drive files:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    playAudioCue("nav-click");
    try {
      const result = await googleSignIn();
      if (result) {
        setGUser(result.user);
        setGToken(result.accessToken);
        loadDriveFiles(result.accessToken);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignOut = async () => {
    playAudioCue("nav-click");
    await logout();
    setGUser(null);
    setGToken(null);
    setDriveFiles([]);
    setSelectedDriveFile(null);
  };

  const fetchMessages = async (emailQuery = "") => {
    setIsLoadingMessages(true);
    setMessagesError("");
    try {
      // Retrieve local submissions if running offline/static (such as GitHub Pages)
      const localSubmissionsStr = localStorage.getItem("academic_submissions");
      const localSubmissions = localSubmissionsStr ? JSON.parse(localSubmissionsStr) : [];

      const url = emailQuery 
        ? `/api/contact/messages?email=${encodeURIComponent(emailQuery.trim())}`
        : "/api/contact/messages";
      
      const response = await fetch(url).catch(() => null);
      if (response && response.ok) {
        const serverData = await response.json();
        // Merge server-side messages with local-side submissions to have full durability in both environments!
        const merged = [...localSubmissions, ...serverData].filter(
          (v, i, a) => a.findIndex(t => t.id === v.id) === i
        );
        setMessages(merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } else {
        // Fallback to purely local submissions on static host (e.g. GitHub Pages)
        if (emailQuery) {
          const filtered = localSubmissions.filter((m: any) => m.email.toLowerCase() === emailQuery.toLowerCase());
          setMessages(filtered);
        } else {
          setMessages(localSubmissions);
        }
      }
    } catch (err) {
      setMessagesError("Connection to messages server failed.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up Google Auth state change listener
    const unsubscribe = initAuth(
      (user, token) => {
        setGUser(user);
        setGToken(token);
        loadDriveFiles(token);
      },
      () => {
        setGUser(null);
        setGToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          titleClass: "text-2xl font-black text-cyan-400 font-mono uppercase tracking-wider mb-2",
          cardClass: "bg-[#090C10] border-2 border-cyan-950 hover:border-cyan-500 transition-all duration-300 p-6 font-mono text-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
          formCardClass: "bg-black border-2 border-cyan-950 p-6 font-mono text-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
          inputClass: "w-full bg-black border border-cyan-900 text-cyan-400 p-3 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 rounded-none placeholder:text-cyan-950",
          selectClass: "w-full bg-black border border-cyan-900 text-cyan-400 p-3 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 rounded-none",
          buttonClass: "w-full border-2 border-cyan-500 bg-cyan-500 hover:bg-black text-black hover:text-cyan-400 font-bold py-3 text-xs font-mono uppercase tracking-widest cursor-pointer transition-all active:scale-98 shadow-[0_0_10px_rgba(0,229,255,0.2)] disabled:opacity-50",
          accentText: "text-cyan-400 font-bold",
          labelClass: "block text-[10px] font-bold uppercase tracking-wider text-cyan-500/70 mb-1.5",
          badgeClass: "border border-cyan-500 text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded-none text-[9px] uppercase font-bold",
          faqHeaderClass: "w-full flex justify-between items-center text-left py-4 border-b border-cyan-950/40 text-cyan-400 font-mono text-xs uppercase font-bold cursor-pointer hover:text-cyan-300",
          faqContentClass: "py-3 text-xs font-mono text-cyan-500 leading-relaxed",
          socialIconClass: "p-2.5 bg-cyan-950/20 border border-cyan-900 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-all rounded-none",
        };
      case "glass":
        return {
          titleClass: "text-3xl font-extrabold text-white font-sans tracking-tight mb-2 bg-gradient-to-r from-violet-200 via-fuchsia-100 to-indigo-200 bg-clip-text text-transparent",
          cardClass: "bg-slate-950/45 backdrop-blur-md border border-white/10 hover:border-violet-500/30 transition-all duration-300 p-6 rounded-2xl text-slate-300 shadow-xl",
          formCardClass: "bg-slate-950/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-slate-300 shadow-xl",
          inputClass: "w-full bg-white/5 border border-white/10 text-white p-3 text-xs rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-slate-500",
          selectClass: "w-full bg-slate-950 border border-white/10 text-white p-3 text-xs rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
          buttonClass: "w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 text-xs rounded-xl cursor-pointer transition-all active:scale-98 shadow-lg shadow-violet-500/25 disabled:opacity-50",
          accentText: "text-violet-300 font-semibold",
          labelClass: "block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5",
          badgeClass: "bg-violet-950/40 border border-violet-800/20 text-violet-300 px-2.5 py-0.5 rounded-full text-[9px] font-semibold",
          faqHeaderClass: "w-full flex justify-between items-center text-left py-4 border-b border-white/5 text-white font-semibold text-xs cursor-pointer hover:text-violet-300 transition-colors",
          faqContentClass: "py-3 text-xs text-slate-300 leading-relaxed",
          socialIconClass: "p-2.5 bg-white/5 border border-white/10 text-slate-300 hover:bg-gradient-to-tr hover:from-violet-600 hover:to-indigo-600 hover:text-white hover:border-violet-400 transition-all rounded-xl",
        };
      case "academic":
        return {
          titleClass: "text-2xl font-bold text-[#7F1D1D] font-serif tracking-tight mb-2",
          cardClass: "bg-[#FAF6EE] border border-[#D4C3A3] hover:border-[#7F1D1D]/50 transition-all duration-300 p-6 rounded-lg text-[#2A1E17] font-serif shadow-xs",
          formCardClass: "bg-[#FAF6EE] border border-[#D4C3A3] p-6 rounded-lg text-[#2A1E17] font-serif shadow-xs",
          inputClass: "w-full bg-white border border-[#D4C3A3] text-[#2A1E17] p-3 text-xs rounded-md focus:outline-none focus:border-[#7F1D1D] focus:ring-1 focus:ring-[#7F1D1D]/10 placeholder:text-[#2A1E17]/40",
          selectClass: "w-full bg-white border border-[#D4C3A3] text-[#2A1E17] p-3 text-xs rounded-md focus:outline-none focus:border-[#7F1D1D] focus:ring-1 focus:ring-[#7F1D1D]/10",
          buttonClass: "w-full bg-[#7F1D1D] hover:bg-[#5A1010] text-white font-bold py-3 text-xs rounded-md cursor-pointer transition-all active:scale-98 shadow-sm disabled:opacity-50",
          accentText: "text-[#7F1D1D] font-bold",
          labelClass: "block text-[10px] font-bold uppercase tracking-wider text-[#5C4533]/80 mb-1.5",
          badgeClass: "bg-[#FAF0D9] border border-[#D4C3A3]/50 text-[#5C4533] px-2.5 py-0.5 rounded-sm text-[9px] font-semibold",
          faqHeaderClass: "w-full flex justify-between items-center text-left py-4 border-b border-[#D4C3A3]/60 text-[#7F1D1D] font-serif text-sm font-semibold cursor-pointer hover:text-[#5A1010] transition-colors",
          faqContentClass: "py-3 text-xs text-[#5C4533] font-serif leading-relaxed",
          socialIconClass: "p-2.5 bg-white border border-[#D4C3A3] text-[#5C4533] hover:bg-[#7F1D1D] hover:text-white hover:border-[#7F1D1D] transition-all rounded-md",
        };
      case "minimal":
      default:
        return {
          titleClass: "text-3xl font-black text-neutral-900 font-sans tracking-tight mb-2",
          cardClass: "bg-white border border-neutral-100 hover:border-neutral-300 transition-all duration-300 p-6 rounded-2xl text-neutral-600 shadow-3xs",
          formCardClass: "bg-white border border-neutral-100 p-6 rounded-2xl text-neutral-800 shadow-3xs",
          inputClass: "w-full bg-neutral-50 border border-neutral-200 text-neutral-900 p-3 text-xs rounded-xl focus:outline-none focus:border-black focus:bg-white placeholder:text-neutral-400",
          selectClass: "w-full bg-neutral-50 border border-neutral-200 text-neutral-900 p-3 text-xs rounded-xl focus:outline-none focus:border-black focus:bg-white",
          buttonClass: "w-full bg-neutral-950 hover:bg-black text-white font-bold py-3 text-xs rounded-full cursor-pointer transition-all active:scale-98 shadow-sm disabled:opacity-50",
          accentText: "text-neutral-900 font-bold",
          labelClass: "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5",
          badgeClass: "bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-0.5 rounded-full text-[9px] font-semibold",
          faqHeaderClass: "w-full flex justify-between items-center text-left py-4 border-b border-neutral-100 text-neutral-900 font-bold text-xs cursor-pointer hover:text-neutral-600 transition-colors",
          faqContentClass: "py-3 text-xs text-neutral-600 leading-relaxed",
          socialIconClass: "p-2.5 bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all rounded-full",
        };
    }
  };

  const s = getThemeStyles();

  // Social Links List with appropriate links and identifiers
  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/vickykr802302" },
    { name: "GitHub", icon: Github, url: "https://github.com/vickykr802302" },
    { name: "X", icon: Twitter, url: "https://x.com/vickykr802302" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/vickykr802302" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/vickykr802302" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@vickykr802302" },
    { name: "Google Scholar", icon: GraduationCap, url: "https://scholar.google.com" },
    { name: "ResearchGate", icon: Layers, url: "https://researchgate.net" },
    { name: "LeetCode", icon: Sparkles, url: "https://leetcode.com/vickykr802302" },
    { name: "HackerRank", icon: HelpCircle, url: "https://hackerrank.com/vickykr802302" },
  ];

  // FAQ list matching requested outline
  const faqs = [
    {
      q: "Are you available for freelance development work?",
      a: "Yes! Alongside my academic teachings, I am open to consulting or developing web applications, customized outcome-based learning software, or chatbot integrations.",
    },
    {
      q: "Can I collaborate on research publications?",
      a: "Absolutely. My research interests include Machine Learning models, educational technology platforms, and highly scalable web engines. Please submit an inquiry detailing your research intent.",
    },
    {
      q: "Do you mentor students for placements and coding?",
      a: "Yes, mentoring is my passion. As a placement department officer and Assistant Professor at GGI, I run programming bootcamps and review resumes. Use my interactive Placement Office tools on this portfolio!",
    },
    {
      q: "How quickly do you respond to submitted inquiries?",
      a: "I usually read and reply to all valid submissions within 24 hours via email.",
    },
    {
      q: "Can I hire you for customized academic web development?",
      a: "Certainly! I specialize in modern full-stack developer technologies (MERN stack) and AI application systems.",
    },
    {
      q: "Are you available for technical talks, bootcamps, or campus workshops?",
      a: "Yes. I routinely deliver lectures and hands-on laboratory workshops on OOP languages (Java, C++, Python), Data Structures, and MERN application stacks.",
    }
  ];

  // Real-time inline validation helper
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Full Name is required.";
        }
        if (trimmed.length < 2) {
          return "Full Name must be at least 2 characters long.";
        }
        if (!/^[a-zA-Z\s.-]+$/.test(trimmed)) {
          return "Name should only contain letters, spaces, dots, or hyphens.";
        }
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Email address is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address (e.g., yourname@domain.com).";
        }
        return "";
      }
      case "phone": {
        const trimmed = value.trim();
        if (!trimmed) return ""; // Optional field, empty is valid
        const cleanPhone = trimmed.replace(/[\s\-()]/g, "");
        if (cleanPhone && !/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
          return "Please enter a valid phone number (7 to 15 digits).";
        }
        return "";
      }
      case "subject": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Inquiry Subject is required.";
        }
        if (trimmed.length < 3) {
          return "Subject must be at least 3 characters long.";
        }
        return "";
      }
      case "message": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Message body is required.";
        }
        if (trimmed.length < 10) {
          return `Message must be at least 10 characters long (currently ${trimmed.length} characters).`;
        }
        if (value.length > 2000) {
          return `Message must not exceed 2000 characters (currently ${value.length} characters).`;
        }
        return "";
      }
      case "captcha": {
        const trimmed = value.trim();
        if (!trimmed) {
          return "Verification answer is required.";
        }
        const parsed = parseInt(trimmed);
        if (isNaN(parsed) || parsed !== (captchaNum1 + captchaNum2)) {
          return `Verification sum is incorrect. Solve: ${captchaNum1} + ${captchaNum2} = ?`;
        }
        return "";
      }
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate in real-time as the user types
    const errorMsg = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (errorMsg) {
        copy[name] = errorMsg;
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleInputBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFocusedField(null);
    const errorMsg = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (errorMsg) {
        copy[name] = errorMsg;
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleInputFocus = (name: string) => {
    setFocusedField(name);
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCaptchaAnswer(val);
    const errorMsg = validateField("captcha", val);
    setErrors((prev) => {
      const copy = { ...prev };
      if (errorMsg) {
        copy.captcha = errorMsg;
      } else {
        delete copy.captcha;
      }
      return copy;
    });
  };

  const handleCaptchaBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, captcha: true }));
    setFocusedField(null);
    const errorMsg = validateField("captcha", e.target.value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (errorMsg) {
        copy.captcha = errorMsg;
      } else {
        delete copy.captcha;
      }
      return copy;
    });
  };

  // Zod-like Custom Validator for full submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    const fields = ["name", "email", "phone", "subject", "message"];
    fields.forEach((field) => {
      const val = formData[field as keyof typeof formData];
      const errorMsg = validateField(field, val);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
      newTouched[field] = true;
    });

    const captchaError = validateField("captcha", captchaAnswer);
    if (captchaError) {
      newErrors.captcha = captchaError;
    }
    newTouched.captcha = true;

    setErrors(newErrors);
    setTouched(newTouched);
    return Object.keys(newErrors).length === 0;
  };

  const performGoogleDriveBackup = async (
    name: string,
    subject: string,
    message: string,
    autoReply: string,
    attachedFile: any
  ) => {
    if (!gToken) return;
    setDriveBackupStatus("backing_up");
    try {
      // 1. Create or retrieve folder "Prof_Vicky_Kumar_Portfolio_Inquiries"
      const folderId = await createDriveFolder(gToken, "Prof_Vicky_Kumar_Portfolio_Inquiries");
      
      // 2. Draft content
      const fileContent = `VICKY KUMAR PORTFOLIO INQUIRY BACKUP
====================================
Sender: ${name}
Subject: ${subject}
Date: ${new Date().toLocaleString("en-IN")}
Attached File from Drive: ${attachedFile ? `${attachedFile.name} (ID: ${attachedFile.id})` : "None"}

Message Body:
------------------------------------
${message}

------------------------------------
AI ASSISTANT RESPONSE:
------------------------------------
${autoReply}
====================================
`;

      const safeSubject = subject.replace(/[^a-zA-Z0-9_\s-]/g, "").slice(0, 40);
      const fileName = `Inquiry_${name.replace(/\s+/g, "_")}_${safeSubject}_${Date.now()}.txt`;
      
      const fileId = await uploadInquiryBackup(gToken, folderId, fileName, fileContent);
      setDriveBackupId(fileId);
      setDriveBackupStatus("success");
    } catch (err) {
      console.error("Google Drive Backup Error:", err);
      setDriveBackupStatus("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      playAudioCue("nav-hover");
      return;
    }

    playAudioCue("nav-click");
    setFormStatus("submitting");
    setApiErrorMessage("");
    setDriveBackupStatus("idle");
    setDriveBackupId(null);

    // Prepare payload, including selected Google Drive attachment if any
    const payload = {
      ...formData,
      googleDriveAttachment: selectedDriveFile ? {
        id: selectedDriveFile.id,
        name: selectedDriveFile.name,
        link: selectedDriveFile.webViewLink,
      } : null
    };

    let serverSucceeded = false;
    let autoReply = "";
    let inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // 1. Try server POST first (unless we are explicitly on GitHub Pages)
    const isGitHubPages = window.location.hostname.endsWith("github.io");
    if (!isGitHubPages) {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          serverSucceeded = true;
          autoReply = data.autoReply || "";
          inquiryId = data.inquiryId || inquiryId;
          setEmailDispatchResult(data.emailDispatch || null);
          setSubmittedAutoReply(autoReply);
          setFormStatus("success");
          setInboxEmail(formData.email);
          setSearchedEmail(formData.email);
          playAudioCue("card-click");
        } else {
          const data = await response.json().catch(() => ({}));
          console.warn("Server POST returned error status:", response.status, data);
        }
      } catch (err) {
        console.warn("Server POST failed. Falling back to client-side mode...", err);
      }
    }

    // 2. Client-side fallback mode (if server fails or we are on static GitHub Pages)
    if (!serverSucceeded) {
      console.log("Using secure static fallback mode for GitHub Pages...");
      
      // Local AI Auto-reply generation
      const subjectLower = (formData.subject || "").toLowerCase();
      const messageLower = (formData.message || "").toLowerCase();
      
      if (subjectLower.includes("placement") || subjectLower.includes("resume") || subjectLower.includes("career") || subjectLower.includes("job") || messageLower.includes("placement")) {
        autoReply = `Hello ${formData.name},\n\nThank you for reaching out regarding career preparation and placements. As an Assistant Professor and member of GGI's Placement Cell, I am deeply committed to guiding students. I have received your message and will review your career goals. Let's schedule a session to review your resume format or run a mock interview. Feel free to use the interactive Placement Office simulator in the meantime!\n\nBest regards,\nProf. Vicky Kumar`;
      } else if (subjectLower.includes("project") || subjectLower.includes("mern") || subjectLower.includes("research") || subjectLower.includes("paper") || messageLower.includes("mern")) {
        autoReply = `Hello ${formData.name},\n\nThank you for reaching out about collaboration and engineering projects. I am highly interested in full-stack technologies (MERN stack), Machine Learning applications, and Outcome-Based Education mapping. I have logged your message and will review your proposal details. I look forward to exploring how we can build or publish this research together.\n\nWarm regards,\nProf. Vicky Kumar`;
      } else {
        autoReply = `Hello ${formData.name},\n\nThank you for your message. I have received your inquiry regarding "${formData.subject}" and appreciate you getting in touch. I review my portfolio submission log daily and will reply to your email (${formData.email}) with a detailed response within 24 hours. Let's connect soon!\n\nBest wishes,\nProf. Vicky Kumar`;
      }

      setSubmittedAutoReply(autoReply);

      // Save inquiry to localStorage under 'academic_submissions' for local messages board durability
      const localSubmissionsStr = localStorage.getItem("academic_submissions");
      let localSubmissions = localSubmissionsStr ? JSON.parse(localSubmissionsStr) : [];
      
      const newInquiry = {
        id: inquiryId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        autoReply: autoReply,
        timestamp: new Date().toISOString(),
        googleDriveAttachment: payload.googleDriveAttachment,
        isLocalOffline: true
      };

      localSubmissions.push(newInquiry);
      localStorage.setItem("academic_submissions", JSON.stringify(localSubmissions));

      setFormStatus("success");
      setInboxEmail(formData.email);
      setSearchedEmail(formData.email);
      playAudioCue("card-click");
    }

    // 3. Trigger Google Drive Backup if Google Drive is authorized
    if (gToken) {
      await performGoogleDriveBackup(formData.name, formData.subject, formData.message, autoReply, selectedDriveFile);
    }

    // Refresh inbox feed
    fetchMessages(formData.email);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    playAudioCue("nav-click");
    setNewsletterStatus("submitting");
    setNewsletterMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: newsletterEmail,
          honeypot: newsletterHoneypot
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus("success");
        setNewsletterMessage(data.message);
        setNewsletterEmail("");
        playAudioCue("card-click");
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(data.error || "Subscription failed.");
      }
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMessage("Failed to reach server. Try again shortly.");
    }
  };

  const toggleFaq = (index: number) => {
    playAudioCue("nav-hover");
    setExpandedFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      honeypot: "",
    });
    setCaptchaAnswer("");
    setFormStatus("idle");
    setErrors({});
    setTouched({});
    setFocusedField(null);
    setEmailDispatchResult(null);
    setSubmittedAutoReply("");
  };

  // Google Maps Redirection Coordinator
  const handleOpenGoogleMaps = () => {
    playAudioCue("nav-click");
    window.open("https://maps.google.com/?q=Gulzar+Group+of+Institutes+Ludhiana+Punjab", "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 select-none" id="portfolio-contact-view">
      
      {/* 1. Header Section */}
      <div className="text-center md:text-left max-w-3xl">
        <h2 className={s.titleClass}>📬 Get in Touch</h2>
        <p className={`text-xs md:text-sm leading-relaxed opacity-80 ${
          currentTheme === "academic" ? "font-serif italic" : ""
        }`}>
          I'm always open to discussing new opportunities, collaborations, research, freelance work, or simply having a conversation. Let's build something scalable.
        </p>
      </div>

      {/* 2. Primary 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Contact Cards & Info (Grid-5) */}
        <div className="lg:col-span-5 space-y-6">
          <StaggerContainer className="flex flex-col gap-6">
            
            {/* Quick Summary Profile Card */}
            <StaggerItem>
              <div className={`${s.cardClass} relative overflow-hidden`}>
                {currentTheme === "developer" && (
                  <div className="absolute top-0 right-0 text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 font-bold uppercase tracking-widest border-l border-b border-cyan-800">
                    VICKY.INF
                  </div>
                )}
                
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4 border-b border-gray-150/10 pb-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Vicky Kumar</span>
                </h3>
                
                <div className="space-y-4 text-xs">
                  <p className="leading-relaxed">
                    <strong className={s.accentText}>Assistant Professor of Computer Science</strong>
                    <br />
                    Department of CSE & Applications
                    <br />
                    <span className="opacity-80">Gulzar Group of Institutes, Ludhiana, Punjab, India</span>
                  </p>

                  <div className="border-t border-gray-150/10 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="opacity-70">Availability Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-semibold text-[9px] animate-pulse">
                        ● Available for Opportunities
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="opacity-70">Response Speed:</span>
                      <span className="font-semibold text-neutral-300">Usually replies within 24 hours</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="opacity-70">Preferred Channel:</span>
                      <span className="font-semibold text-indigo-400 underline">vickykr802302@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Availability Detail Card */}
            <StaggerItem>
              <div className={s.cardClass}>
                <h3 className="text-sm font-bold flex items-center gap-2 mb-3.5 border-b border-gray-150/10 pb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Availability & Timezone</span>
                </h3>
                <div className="space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="opacity-70 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Working Days:
                    </span>
                    <span className="font-semibold">Monday - Saturday</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="opacity-70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Working Hours:
                    </span>
                    <span className="font-semibold">9:00 AM - 4:30 PM (IST)</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="opacity-70 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Time Zone:
                    </span>
                    <span className="font-semibold text-indigo-400">Asia/Kolkata (GMT+5:30)</span>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Quick Communications Contact Cards Grid */}
            <StaggerItem>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="mailto:vickykr802302@gmail.com"
                  className={`${s.cardClass} hover:scale-103 transition-transform text-center flex flex-col items-center justify-center py-4`}
                  onMouseEnter={() => playAudioCue("nav-hover")}
                >
                  <Mail className="w-6 h-6 text-indigo-400 mb-1" />
                  <span className="text-[10px] font-bold block">Email Me</span>
                  <span className="text-[8px] opacity-65 truncate w-full">vickykr802302@gmail.com</span>
                </a>

                <a 
                  href="tel:8340223956"
                  className={`${s.cardClass} hover:scale-103 transition-transform text-center flex flex-col items-center justify-center py-4`}
                  onMouseEnter={() => playAudioCue("nav-hover")}
                >
                  <Phone className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-[10px] font-bold block">Call Me</span>
                  <span className="text-[8px] opacity-65">+91 8340223956</span>
                </a>

                <a 
                  href="https://wa.me/918340223956"
                  target="_blank"
                  className={`${s.cardClass} hover:scale-103 transition-transform text-center flex flex-col items-center justify-center py-4`}
                  onMouseEnter={() => playAudioCue("nav-hover")}
                >
                  <MessageSquare className="w-6 h-6 text-teal-400 mb-1" />
                  <span className="text-[10px] font-bold block">WhatsApp</span>
                  <span className="text-[8px] opacity-65">Instant Chat Open</span>
                </a>

                <a 
                  href="https://calendly.com"
                  target="_blank"
                  className={`${s.cardClass} hover:scale-103 transition-transform text-center flex flex-col items-center justify-center py-4`}
                  onMouseEnter={() => playAudioCue("nav-hover")}
                >
                  <Calendar className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-[10px] font-bold block">Schedule Meeting</span>
                  <span className="text-[8px] opacity-65">1:1 Consultation</span>
                </a>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>

        {/* RIGHT COLUMN: Interactive Form & Spam slider protection (Grid-7) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {formStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={s.formCardClass}
              >
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold">Message Processed Successfully!</h3>
                  <p className="text-xs opacity-80 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-indigo-400">{formData.name}</span>. Your inquiry has been processed. A local backup has been logged in your browser session for direct portfolio index synchronization.
                  </p>

                  {/* Google Drive Backup Status feedback */}
                  {gToken && (
                    <div className="my-3 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-150/10 rounded-xl text-left max-w-md mx-auto text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-indigo-400">
                        <HardDrive className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span>Google Drive Backup Synchronization</span>
                      </div>
                      {driveBackupStatus === "backing_up" && (
                        <p className="opacity-70 flex items-center gap-1.5 text-[11px]">
                          <Loader2 className="w-3 h-3 animate-spin text-current" /> Backing up inquiry file to your Drive folder...
                        </p>
                      )}
                      {driveBackupStatus === "success" && (
                        <p className="text-emerald-500 flex items-center gap-1.5 text-[11px] font-semibold">
                          <Check className="w-3.5 h-3.5" /> Synchronized! Created file in Drive folder "Prof_Vicky_Kumar_Portfolio_Inquiries"
                        </p>
                      )}
                      {driveBackupStatus === "error" && (
                        <p className="text-rose-500 flex items-center gap-1.5 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Backup sync failed. Ensure your Drive has sufficient storage.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Offline/Static Fallback Help Callout with mailto and WhatsApp triggers */}
                  <div className="my-4 p-4 border border-amber-500/15 bg-amber-500/5 rounded-xl max-w-md mx-auto text-xs text-left space-y-3">
                    <p className="text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      <span>Static Environment Optimization Triggered</span>
                    </p>
                    <p className="opacity-80 leading-relaxed text-[11px]">
                      Since this portfolio is deployed on a static web provider (like GitHub Pages), direct automatic SMTP email forwarding might be offline. 
                      <strong> To ensure Prof. Vicky Kumar reviews this instantly, please choose a quick dispatch shortcut below:</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <a
                        href={`mailto:vickykr802302@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Dear Prof. Vicky Kumar,\n\nMy name is ${formData.name}.\n\nInquiry Details:\n${formData.message}\n\nAI Auto-reply copy generated:\n"${submittedAutoReply}"\n\nBest regards,\n${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`)}`}
                        onClick={() => playAudioCue("nav-click")}
                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-md text-decoration-none"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Draft Direct Email</span>
                      </a>
                      <a
                        href={`https://wa.me/918340223956?text=${encodeURIComponent(`Hello Sir, my name is ${formData.name}. I submitted an inquiry regarding "${formData.subject}": ${formData.message.slice(0, 100)}...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playAudioCue("nav-click")}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-md text-decoration-none"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Sir</span>
                      </a>
                    </div>
                  </div>

                  {/* Elegant AI response display copy */}
                  {submittedAutoReply && (
                    <div className="my-5 p-5 text-left rounded-xl bg-indigo-50/30 dark:bg-black/40 border border-indigo-500/20 text-xs space-y-3 max-w-md mx-auto transition-all">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-gray-150/5 pb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Instant Auto-Reply from Vicky Kumar's AI Agent</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic whitespace-pre-line text-[12px]">
                        "{submittedAutoReply}"
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1 text-center">
                        You can search your email ({formData.email}) in the Message Board below to track Prof. Vicky's follow-up history.
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button
                      onClick={handleResetForm}
                      className={s.buttonClass}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${s.formCardClass} space-y-4 text-left`}
              >
                {/* Honeypot Spam Protection (Invisibly positioned) */}
                <div className="hidden">
                  <label htmlFor="form-honeypot">Do not fill this if human</label>
                  <input
                    id="form-honeypot"
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-name" className={s.labelClass}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="form-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur("name", formData.name)}
                        onFocus={() => handleInputFocus("name")}
                        placeholder="e.g. Rahul Sharma"
                        className={`${s.inputClass} ${
                          touched.name && errors.name 
                            ? "border-rose-500 ring-1 ring-rose-500/20" 
                            : touched.name && !errors.name && formData.name
                            ? "border-emerald-500 ring-1 ring-emerald-500/20"
                            : ""
                        }`}
                        aria-label="Your full name"
                      />
                      {touched.name && !errors.name && formData.name && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {/* Guidance / Help Tip */}
                    {focusedField === "name" && !errors.name && (
                      <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> At least 2 characters. Letters, spaces, dots, or hyphens.
                      </p>
                    )}
                    {touched.name && errors.name && (
                      <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                    {touched.name && !errors.name && formData.name && (
                      <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" /> Name format is verified.
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-email" className={s.labelClass}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        id="form-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur("email", formData.email)}
                        onFocus={() => handleInputFocus("email")}
                        placeholder="e.g. rahul@ggi.ac.in"
                        className={`${s.inputClass} ${
                          touched.email && errors.email 
                            ? "border-rose-500 ring-1 ring-rose-500/20" 
                            : touched.email && !errors.email && formData.email
                            ? "border-emerald-500 ring-1 ring-emerald-500/20"
                            : ""
                        }`}
                        aria-label="Your email address"
                      />
                      {touched.email && !errors.email && formData.email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {/* Guidance / Help Tip */}
                    {focusedField === "email" && !errors.email && (
                      <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Enter a valid email address so Vicky can reach you.
                      </p>
                    )}
                    {touched.email && errors.email && (
                      <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                    {touched.email && !errors.email && formData.email && (
                      <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" /> Email address is valid.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-phone" className={s.labelClass}>
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="form-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur("phone", formData.phone)}
                        onFocus={() => handleInputFocus("phone")}
                        placeholder="e.g. +91 98765 43210"
                        className={`${s.inputClass} ${
                          touched.phone && errors.phone 
                            ? "border-rose-500 ring-1 ring-rose-500/20" 
                            : touched.phone && !errors.phone && formData.phone
                            ? "border-emerald-500 ring-1 ring-emerald-500/20"
                            : ""
                        }`}
                        aria-label="Your phone number"
                      />
                      {touched.phone && !errors.phone && formData.phone && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {/* Guidance / Help Tip */}
                    {focusedField === "phone" && (
                      <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Optional. Enter a contact number for direct calls/WhatsApp.
                      </p>
                    )}
                    {touched.phone && errors.phone && (
                      <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                    {touched.phone && !errors.phone && formData.phone && (
                      <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" /> Phone number is valid.
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-subject" className={s.labelClass}>
                      Inquiry Subject *
                    </label>
                    <div className="relative">
                      <input
                        id="form-subject"
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur("subject", formData.subject)}
                        onFocus={() => handleInputFocus("subject")}
                        placeholder="e.g. Career Guidance / Resume Critique"
                        className={`${s.inputClass} ${
                          touched.subject && errors.subject 
                            ? "border-rose-500 ring-1 ring-rose-500/20" 
                            : touched.subject && !errors.subject && formData.subject
                            ? "border-emerald-500 ring-1 ring-emerald-500/20"
                            : ""
                        }`}
                        aria-label="Subject of your message"
                      />
                      {touched.subject && !errors.subject && formData.subject && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {focusedField === "subject" && !errors.subject && (
                      <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> At least 3 characters. e.g. Freelance project, consulting, mentorship.
                      </p>
                    )}
                    {touched.subject && errors.subject && (
                      <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                    {touched.subject && !errors.subject && formData.subject && (
                      <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" /> Subject is verified.
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="form-message" className={s.labelClass}>
                      Your Message *
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Interactive guidance status label for the counter */}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        formData.message.length === 0
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                          : formData.message.length < 10
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : formData.message.length <= 1800
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}>
                        {formData.message.length === 0
                          ? "Empty"
                          : formData.message.length < 10
                          ? `Needs ${10 - formData.message.length} more chars`
                          : formData.message.length <= 1800
                          ? "Perfect length"
                          : `${2000 - formData.message.length} chars remaining`}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {formData.message.length} / 2000
                      </span>
                    </div>
                  </div>

                  {/* Character limit micro progress bar */}
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden mb-1.5">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        formData.message.length < 10 
                          ? "bg-amber-500" 
                          : formData.message.length <= 1800 
                          ? "bg-emerald-500" 
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min((formData.message.length / 2000) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      id="form-message"
                      required
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur("message", formData.message)}
                      onFocus={() => handleInputFocus("message")}
                      placeholder="Enter detailed message contents. If seeking coding reviews or placement bootcamps, specify details..."
                      className={`${s.inputClass} resize-none ${
                        touched.message && errors.message 
                          ? "border-rose-500 ring-1 ring-rose-500/20" 
                          : touched.message && !errors.message && formData.message
                          ? "border-emerald-500 ring-1 ring-emerald-500/20"
                          : ""
                      }`}
                      aria-label="Detailed message text"
                    />
                    {touched.message && !errors.message && formData.message.length >= 10 && (
                      <span className="absolute right-3 bottom-3 text-emerald-500">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {focusedField === "message" && !errors.message && (
                    <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Please enter at least 10 and up to 2000 characters. Keep it brief yet descriptive.
                    </p>
                  )}
                  {touched.message && errors.message && (
                    <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                  {touched.message && !errors.message && formData.message.length >= 10 && (
                    <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> Message length is approved.
                    </p>
                  )}
                </div>

                {/* Human Bot Captcha Sum Protection */}
                <div className="space-y-1.5">
                  <label htmlFor="form-captcha" className={s.labelClass}>
                    Human Verification *
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs font-mono font-bold bg-neutral-100 dark:bg-black/40 border border-gray-150/10 px-3 py-2 flex items-center gap-2 whitespace-nowrap">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                      Please solve: {captchaNum1} + {captchaNum2} = ?
                    </span>
                    <div className="relative flex-grow sm:max-w-[150px]">
                      <input
                        id="form-captcha"
                        type="text"
                        required
                        value={captchaAnswer}
                        onChange={handleCaptchaChange}
                        onBlur={handleCaptchaBlur}
                        onFocus={() => handleInputFocus("captcha")}
                        placeholder="Your sum answer"
                        className={`${s.inputClass} text-center ${
                          touched.captcha && errors.captcha 
                            ? "border-rose-500 ring-1 ring-rose-500/20" 
                            : touched.captcha && !errors.captcha && captchaAnswer
                            ? "border-emerald-500 ring-1 ring-emerald-500/20"
                            : ""
                        }`}
                        aria-label="Enter verification math sum result"
                      />
                      {touched.captcha && !errors.captcha && captchaAnswer && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                  {focusedField === "captcha" && !errors.captcha && (
                    <p className="text-[10px] text-indigo-400 dark:text-indigo-300 font-mono flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Solves the simple sum so the portfolio server knows you're human.
                    </p>
                  )}
                  {touched.captcha && errors.captcha && (
                    <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.captcha}
                    </p>
                  )}
                  {touched.captcha && !errors.captcha && captchaAnswer && (
                    <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> Verification challenge solved successfully!
                    </p>
                  )}
                </div>

                {/* Google Drive Integration & Attachments Module */}
                <div className="p-4 bg-neutral-50 dark:bg-[#0d1117] border border-dashed border-gray-150/15 rounded-xl space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-150/5 pb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-400" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">Google Drive Integration</h4>
                        <p className="text-[10px] text-neutral-400">Link your account to attach files and save backups</p>
                      </div>
                    </div>
                    {gUser ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-[10px] font-mono">
                          <img src={gUser.photoURL} alt={gUser.displayName} referrerPolicy="no-referrer" className="w-3.5 h-3.5 rounded-full" />
                          <span className="max-w-[80px] truncate">{gUser.displayName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGoogleSignOut}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] rounded font-mono flex items-center gap-1 transition-all"
                          title="Sign Out Google Account"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isAuthenticating}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider rounded font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        {isAuthenticating ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <HardDrive className="w-3 h-3" />
                            <span>Connect Drive</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {gUser ? (
                    <div className="space-y-2">
                      <label htmlFor="form-drive-attachment" className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Select Attachment from your Google Drive:
                      </label>
                      {driveFiles.length > 0 ? (
                        <div className="relative">
                          <select
                            id="form-drive-attachment"
                            className="w-full bg-neutral-100 dark:bg-black border border-gray-150/10 text-xs p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-neutral-200"
                            value={selectedDriveFile ? selectedDriveFile.id : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                setSelectedDriveFile(null);
                              } else {
                                const found = driveFiles.find((f: any) => f.id === val);
                                setSelectedDriveFile(found || null);
                                playAudioCue("nav-hover");
                              }
                            }}
                          >
                            <option value="">-- No file attached --</option>
                            {driveFiles.map((f: any) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.mimeType === "application/vnd.google-apps.folder" ? "Folder" : f.fileExtension || "File"})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="p-3 bg-neutral-100 dark:bg-black/60 rounded border border-gray-150/5 text-[10px] text-neutral-400 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-amber-500" />
                          <span>No PDF, Doc, or Zip files detected in your root Google Drive folder. Add some to attach!</span>
                        </div>
                      )}
                      {selectedDriveFile && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Attached: <strong>{selectedDriveFile.name}</strong></span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDriveFile(null)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors text-xs font-mono px-1"
                          >
                            × Clear
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] opacity-75 italic leading-relaxed">
                      Connect your Google Drive securely to easily attach code files, resumes, or academic papers from your personal storage, or auto-sync your submission logs as backup files!
                    </p>
                  )}
                </div>

                {/* API General/Rate Limiting Errors */}
                {apiErrorMessage && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{apiErrorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className={`${s.buttonClass} flex items-center justify-center gap-2`}
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Transmitting Inquiry Securely...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-current" />
                        <span>Submit Secure Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Styled Interactive Mock Location Map */}
      <div className={s.cardClass}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-150/10 pb-3">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Gulzar Group of Institutes, Ludhiana, India</span>
            </h3>
            <span className="text-[10px] opacity-70">CSE Block C, Cabin F-12, Ludhiana-Chandigarh Highway, Khanna, Punjab</span>
          </div>

          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => {
                playAudioCue("nav-hover");
                setMapZoom((prev) => Math.min(prev + 1, 18));
              }}
              className="p-1.5 bg-neutral-100 dark:bg-black border border-gray-150/10 hover:border-indigo-400 text-xs font-bold font-mono text-current cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in map"
            >
              +
            </button>
            <button
              onClick={() => {
                playAudioCue("nav-hover");
                setMapZoom((prev) => Math.max(prev - 1, 10));
              }}
              className="p-1.5 bg-neutral-100 dark:bg-black border border-gray-150/10 hover:border-indigo-400 text-xs font-bold font-mono text-current cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out map"
            >
              -
            </button>
            <button
              onClick={handleOpenGoogleMaps}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              aria-label="Open location in Google Maps"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Visual Map Render Frame */}
        <div className="relative w-full h-64 overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-gray-150/10 flex items-center justify-center">
          {/* Real styled OpenStreetMap embed framed seamlessly based on theme */}
          <iframe
            title="Professor Vicky Kumar GGI Campus Location Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=76.1952304840088%2C30.710777555627252%2C76.22359752655031%2C30.725917411649772&amp;layer=mapnik&amp;marker=30.718348398188152%2C76.20941400527954`}
            width="100%"
            height="100%"
            className={`border-0 w-full h-full opacity-80 filter saturate-75 ${
              currentTheme === "developer" ? "invert hue-rotate-180 brightness-90 contrast-125" : ""
            }`}
          />
          <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 text-[9px] text-cyan-400 font-mono tracking-wider pointer-events-none rounded">
            SCALE_ZOOM: {mapZoom}00M
          </div>
          <div className="absolute bottom-3 right-3 bg-black/75 px-2.5 py-1 text-[9px] text-neutral-400 font-mono pointer-events-none rounded">
            Map Marker: GGI Campus, Ludhiana, Punjab
          </div>
        </div>
      </div>

      {/* 4. Social Links with Interactive Scale & Glow Effects */}
      <div className={`${s.cardClass} text-center space-y-6`}>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">🌐 Professional Networks & Socials</h3>
          <p className="text-[10px] opacity-70 mt-1">Connect, collaborate, review technical repositories, or follow academic slides across platforms.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 py-2">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playAudioCue("nav-hover")}
                className={`${s.socialIconClass} group flex items-center gap-2 cursor-pointer`}
                title={`Open Vicky's ${social.name} profile`}
                aria-label={`Vicky Kumar on ${social.name}`}
              >
                <IconComponent className="w-4 h-4 group-hover:scale-115 transition-transform" />
                <span className="text-[10px] font-bold hidden sm:inline">{social.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* 5. FAQ Accordion Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Accordion List (Grid-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border-b border-gray-150/10 pb-2">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-[10px] opacity-70">Find quick responses to typical course, project, or career inquiries.</p>
          </div>

          <div className="divide-y divide-gray-150/10 border-t border-b border-gray-150/10">
            {faqs.map((faq, index) => {
              const isExpanded = !!expandedFaq[index];
              return (
                <div key={index} className="py-1">
                  <button
                    onClick={() => toggleFaq(index)}
                    className={s.faqHeaderClass}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className={s.faqContentClass}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Newsletter Subscription Panel (Grid-4) */}
        <div className="lg:col-span-4">
          <div className={s.cardClass}>
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Newsletter Updates</span>
              </h3>
              <p className="text-[10px] leading-relaxed opacity-75">
                Subscribe to receive immediate email notices regarding research publications, lecture syllabi, and local placement drives.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3 text-left">
              {/* Newsletter Honeypot Spam Check */}
              <div className="hidden">
                <input
                  type="text"
                  name="newsletterHoneypot"
                  value={newsletterHoneypot}
                  onChange={(e) => setNewsletterHoneypot(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="newsletter-email" className={s.labelClass}>
                  Email Address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="e.g. mentee@gmail.com"
                  className={s.inputClass}
                  aria-label="Newsletter email input"
                />
              </div>

              {newsletterMessage && (
                <p className={`text-[10px] font-mono leading-relaxed ${
                  newsletterStatus === "success" ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {newsletterMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={newsletterStatus === "submitting" || !newsletterEmail}
                className={`${s.buttonClass} text-[10px] py-2.5 font-bold flex items-center justify-center gap-2`}
              >
                {newsletterStatus === "submitting" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-current" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe to Updates</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
