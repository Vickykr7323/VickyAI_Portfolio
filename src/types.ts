export type ThemeId = "minimal" | "glass" | "developer" | "academic";

export type SectionId = 
  | "home" 
  | "experience" 
  | "academics" 
  | "projects" 
  | "skills"
  | "notes"
  | "placement"
  | "contact";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tech: string[];
  description: string;
  features: string[];
  role?: string;
  link?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
  type: "teaching" | "placement" | "internship";
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details?: string;
}

export interface Certification {
  name: string;
  provider: string;
}

export interface ImageSlots {
  hero: string;   // Slot 1: Office/Desk professional photo (Blue Blazer)
  campus: string; // Slot 2: Academic/Campus dress (Blue Shirt, Red Tie)
  casual: string; // Slot 3: Outdoor casual/checked shirt profile
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    dataUrl?: string;
    content?: string;
  };
}



export interface Testimonial {
  name: string;
  role: string;
  organization: string;
  text: string;
  avatar?: string;
}

export interface SearchSelection {
  type: "note" | "project" | "research";
  id?: string;
  tab?: "journals" | "conferences" | "patents" | "workshops";
  title?: string;
}

export interface Note {
  id: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  keyTakeaways: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  isStarred?: boolean;
  isRead?: boolean;
  isCustom?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface QuizAttempt {
  noteId: string;
  score: number;
  passed: boolean;
  answers: number[];
}


