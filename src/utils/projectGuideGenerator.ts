import { jsPDF } from "jspdf";

// The full structural specification content of the system
export const PROJECT_GUIDE_SECTIONS = [
  {
    title: "1. Executive System Overview",
    bullets: [
      "Project Name: Professor Vicky Kumar's Academic Portfolio, Media Vault & Placement Hub",
      "Core Technologies: React (Vite), TypeScript, Tailwind CSS, Motion (framer-motion), jsPDF, Recharts, Lucide Icons",
      "Goal: A responsive, multi-theme interactive portfolio designed for academics, computer science education, student placement, and CV customization.",
      "Primary User Personas: Students (searching notes/taking quizzes), HR recruiters (reviewing credentials), and Professor Vicky himself (managing photos/data)."
    ]
  },
  {
    title: "2. Key Modules & Functional Architecture",
    bullets: [
      "A. Active Home & Hero: Dynamic welcoming system with custom canvas background animations, word-by-word entry effects, and introductory skip controls.",
      "B. Professional Timeline: Visual rendering of Professor tenure, Placement advisory roles, Freelance consulting, and MERN engineering history.",
      "C. Student Placement Office: Simulated campus recruitment cell featuring technical mock quizzes, live scoring meters, and resume optimizer systems.",
      "D. CS Notes & Curriculum: Digital syllabus hub providing reading guides on Java, Python, DBMS, and DSA with automated word-counts and read-time calculators.",
      "E. Academics & Scholarly Works: Structured repository of published research patents, peer-reviewed journals, certifications, and conferences.",
      "F. AI Chatbot Assistant: Contextual assistant powered by Google GenAI to help users instantly fetch syllabus information and guide student placements.",
      "G. Media Vault & Customizer: Browser-based LocalStorage synchronization engine allowing instant drag-and-drop replacement of all portrait assets."
    ]
  },
  {
    title: "3. Step-by-Step Customization Guide",
    bullets: [
      "Step 1 (Asset Copying): Place your portrait photos (JPEG/PNG) in the '/public/images/' directory.",
      "Step 2 (Configuration Mapping): Open '/src/utils/placeholders.ts' and update default file names to map your assets.",
      "Step 3 (Curriculum and Notes): Edit '/src/data/preloadedNotes.ts' to load your custom computer science course syllabus.",
      "Step 4 (Database Sync): Enable Firestore database provisioning via 'set_up_firebase' to persist student scores and messages in real-time.",
      "Step 5 (Theme Setup): Select from four default skins (Developer Terminal, Academic Serif, Minimalist, Glassmorphism) inside the theme selector."
    ]
  },
  {
    title: "4. Commands, Compilation & Build System",
    bullets: [
      "Development Launch: Run 'npm run dev' to boot up the hot-reload server locally on port 3000.",
      "Linting Audits: Run 'npm run lint' or 'tsc --noEmit' to run type safety checks on TypeScript modules.",
      "Production Build: Run 'npm run build' to bundle assets into highly-optimized, static files under the 'dist/' folder.",
      "HMR Exclusions: Hot Module Replacement is turned off for smoother multi-tab agent edit workflows.",
      "Deployment: Runs behind an Nginx reverse-proxy on secure Cloud Run infrastructure connected to secure Firebase servers."
    ]
  }
];

/**
 * Downloads the step-by-step project specification guide as a beautifully formatted Markdown (.md) file
 */
export function generateProjectGuideMd() {
  let content = `# VICKY KUMAR'S PORTFOLIO & ACADEMIC HUB\n`;
  content += `## Complete Step-by-Step Project Specification & Blueprint Guide\n`;
  content += `*Generated dynamically on: ${new Date().toLocaleDateString()}*\n\n`;
  content += `---------------------------------------------------------\n\n`;

  PROJECT_GUIDE_SECTIONS.forEach((section) => {
    content += `### ${section.title}\n`;
    section.bullets.forEach((bullet) => {
      content += `- ${bullet}\n`;
    });
    content += `\n`;
  });

  content += `---------------------------------------------------------\n`;
  content += `### 5. Architectural Map & Code Directories\n`;
  content += `- \`/src/App.tsx\` — Core routing, global layout container, splash screen, and feedback systems.\n`;
  content += `- \`/src/components/\` — High-performance interactive widgets (MediaVault, PlacementOffice, CSNotes, Navigation, Academics).\n`;
  content += `- \`/src/utils/\` — Modular microservices (audio synth, PDF CV exporter, project blueprint compiler).\n`;
  content += `- \`/src/data/\` — Static JSON structures for quiz matrices, academic history, and lecture modules.\n\n`;
  content += `*Designed and built with elite visual quality. Open settings menu to export this codebase or share with recruiters.*`;

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Vicky_Portfolio_Project_Guide.md");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads the step-by-step project specification guide as an elegant Multi-Page PDF file
 */
export function generateProjectGuidePdf() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const marginX = 15;
  const contentWidth = pageWidth - (marginX * 2); // 180 mm
  let y = 15;
  let pageNum = 1;

  const colors = {
    primary: [30, 27, 75],      // Deep Indigo
    secondary: [79, 70, 229],   // Electric Violet
    neutralDark: [30, 41, 59],  // Dark Slate
    neutralLight: [241, 245, 249], // Slate-100
    border: [226, 232, 240]     // Slate-200
  };

  const drawFooter = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
    doc.text("Project Implementation Guide  |  Vicky's Portfolio Engine", marginX, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - marginX - 12, pageHeight - 8);
  };

  const checkOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = 18;
      
      // Page running header
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(115, 115, 115);
      doc.text("Step-by-Step Architecture & Deployment Manual", marginX, 10);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.2);
      doc.line(marginX, 12, pageWidth - marginX, 12);
    }
  };

  // Header Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("VICKY KUMAR — SYSTEM BLUEPRINT", marginX, y);
  y += 6;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text("COMPLETE STEP-BY-STEP PROJECT IMPLEMENTATION MANUAL", marginX, y);
  y += 7;

  doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  // Process sections
  PROJECT_GUIDE_SECTIONS.forEach((section) => {
    checkOverflow(15);
    
    // Section Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(section.title, marginX, y);
    y += 5;

    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 5;

    section.bullets.forEach((bullet) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
      
      const lines = doc.splitTextToSize(bullet, contentWidth - 6);
      lines.forEach((line: string, idx: number) => {
        checkOverflow(4.5);
        if (idx === 0) {
          doc.text("•", marginX + 2, y);
          doc.text(line, marginX + 6, y);
        } else {
          doc.text(line, marginX + 6, y);
        }
        y += 4.5;
      });
    });
    y += 3; // spacing between sections
  });

  // Section 5: Directory Structure
  checkOverflow(20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("5. Architectural Map & Code Directories", marginX, y);
  y += 5;

  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 5;

  const directories = [
    "/src/App.tsx - Primary routing controller and splash-screen renderer.",
    "/src/components/ - Dynamic views (MediaVault, PlacementOffice, CSNotes).",
    "/src/utils/ - Key background engines (PDF Exporter, Audio Synthesizer, guide generators).",
    "/src/data/ - Preloaded databases containing quiz systems and lesson syllabi."
  ];

  directories.forEach((dir) => {
    const lines = doc.splitTextToSize(dir, contentWidth - 6);
    lines.forEach((line: string, idx: number) => {
      checkOverflow(4.5);
      if (idx === 0) {
        doc.text("•", marginX + 2, y);
        doc.text(line, marginX + 6, y);
      } else {
        doc.text(line, marginX + 6, y);
      }
      y += 4.5;
    });
  });

  drawFooter();
  doc.save("Vicky_Portfolio_Project_Guide.pdf");
}
