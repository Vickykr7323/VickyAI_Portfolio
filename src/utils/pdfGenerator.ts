import { jsPDF } from "jspdf";
import { 
  VICKY_INFO, 
  EXPERIENCES, 
  EDUCATION, 
  CERTIFICATIONS, 
  PROJECTS, 
  ACADEMIC_STRENGTHS, 
  RESEARCH_INTERESTS, 
  PUBLICATIONS, 
  PATENTS, 
  CONFERENCES, 
  WORKSHOPS_FDPS 
} from "../data";

export function generatePortfolioPdf() {
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

  // Professional Color Palette (Deep Navy slate style)
  const colors = {
    primary: [15, 23, 42],       // Slate-900 (Deepest dark)
    secondary: [71, 85, 105],    // Slate-600 (Subtitles/secondary)
    accent: [26, 54, 93],        // Professional Navy Blue
    neutralDark: [51, 65, 85],   // Slate-700 (Body text)
    neutralLight: [226, 232, 240], // Slate-200 (Lines/Dividers)
    accentLight: [239, 246, 255]  // Blue-50 (Optional highlight backgrounds)
  };

  // Helper to draw a clean footer on every page
  const drawFooter = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);
    doc.text("Academic Curriculum Vitae  |  Prof. Vicky Kumar", marginX, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - marginX - 12, pageHeight - 8);
  };

  // Helper to draw the persistent header on later pages
  const drawPageHeader = () => {
    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(8);
    doc.setTextColor(115, 115, 115);
    doc.text(`${VICKY_INFO.name} — Computer Science Educator & Placement Advisor`, marginX, 10);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, 12, pageWidth - marginX, 12);
  };

  // Helper to check for page overflow and insert a page break
  const checkPageOverflow = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 16) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = 18;
      drawPageHeader();
    }
  };

  // Helper to render section headers nicely
  const drawSectionHeader = (title: string) => {
    checkPageOverflow(16);
    y += 4;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(title.toUpperCase(), marginX, y);
    y += 2;
    
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, y, pageWidth - marginX, y); // Solid clean underline across content width
    y += 5.5;
  };

  // Helper to wrap and print bullet points safely with proper indent alignment
  const printBullet = (text: string) => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
    
    const bulletTextWidth = contentWidth - 6; // slightly narrower to fit bullet indent
    const lines = doc.splitTextToSize(text, bulletTextWidth);
    
    lines.forEach((line: string, index: number) => {
      checkPageOverflow(4.5);
      if (index === 0) {
        doc.text("•", marginX + 2, y);
        doc.text(line, marginX + 6, y);
      } else {
        doc.text(line, marginX + 6, y);
      }
      y += 4;
    });
  };

  // ================= HEADLINE HEADER =================

  // Name
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(VICKY_INFO.name, marginX, y);
  y += 7.5;

  // Title / Sub-header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(VICKY_INFO.title.toUpperCase(), marginX, y);
  y += 6;

  // Contact Info Grid
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
  
  const contactRow1 = [
    `Email: ${VICKY_INFO.email}`,
    `Phone: +91 ${VICKY_INFO.phone}`,
    `Location: ${VICKY_INFO.location}`
  ];
  doc.text(contactRow1.join("  |  "), marginX, y);
  y += 4.5;

  const cleanLinkedIn = VICKY_INFO.linkedin.replace("https://www.", "").replace("https://", "").replace(/\/$/, "");
  const cleanGitHub = VICKY_INFO.github.replace("https://www.", "").replace("https://", "").replace("https://github.com/", "github.com/").replace(/\/$/, "");

  const contactRow2 = [
    `LinkedIn: ${cleanLinkedIn}`,
    `GitHub: ${cleanGitHub}`
  ];
  doc.text(contactRow2.join("  |  "), marginX, y);
  y += 6.5;

  // ================= SUMMARY =================
  drawSectionHeader("Professional Summary");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
  
  const summaryLines = doc.splitTextToSize(VICKY_INFO.summary, contentWidth);
  summaryLines.forEach((line: string) => {
    checkPageOverflow(4.5);
    doc.text(line, marginX, y);
    y += 4.5;
  });
  y += 2;

  // ================= EDUCATION =================
  drawSectionHeader("Academic Qualifications");
  EDUCATION.forEach((edu) => {
    checkPageOverflow(15);
    
    // Degree Name
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(edu.degree, marginX, y);

    // Period (Right-aligned)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const periodWidth = doc.getTextWidth(edu.period);
    doc.text(edu.period, pageWidth - marginX - periodWidth, y);
    y += 4.5;

    // Institution
    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(9);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(edu.institution, marginX, y);
    y += 4.5;

    // Specialization Details
    if (edu.details) {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
      const detailLines = doc.splitTextToSize(edu.details, contentWidth);
      detailLines.forEach((line: string) => {
        checkPageOverflow(4.2);
        doc.text(line, marginX, y);
        y += 4;
      });
    }
    y += 3;
  });

  // ================= EXPERIENCE =================
  drawSectionHeader("Professional & Teaching Experience");
  
  EXPERIENCES.forEach((exp) => {
    checkPageOverflow(18);
    
    // Role Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(exp.role, marginX, y);

    // Period (Right-aligned)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const periodWidth = doc.getTextWidth(exp.period);
    doc.text(exp.period, pageWidth - marginX - periodWidth, y);
    y += 4.5;

    // Organization
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(exp.organization, marginX, y);
    y += 4.5;

    // Role Description
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
    const descLines = doc.splitTextToSize(exp.description, contentWidth);
    descLines.forEach((line: string) => {
      checkPageOverflow(4);
      doc.text(line, marginX, y);
      y += 4;
    });
    y += 1.5;

    // Key Highlights Bullet list
    exp.highlights.forEach((highlight) => {
      printBullet(highlight);
    });
    y += 2;
  });

  // ================= PROJECTS =================
  drawSectionHeader("Key Technical Projects & Implementations");

  // Loop over all main projects to keep it completely professional
  PROJECTS.forEach((proj) => {
    checkPageOverflow(20);
    
    // Project Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(proj.title, marginX, y);

    // Subtitle / Sub-specialty (Right-aligned)
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const subWidth = doc.getTextWidth(proj.subtitle);
    doc.text(proj.subtitle, pageWidth - marginX - subWidth, y);
    y += 4.5;

    // Technologies Used
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(`Tech Stack: ${proj.tech.join(", ")}`, marginX, y);
    y += 4.5;

    // Project Description text
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
    const descLines = doc.splitTextToSize(proj.description, contentWidth);
    descLines.forEach((line: string) => {
      checkPageOverflow(4);
      doc.text(line, marginX, y);
      y += 4;
    });
    y += 1.5;

    // Core Features Bullets
    proj.features.forEach((feature) => {
      printBullet(feature);
    });
    y += 2;
  });

  // ================= SKILLS & RESEARCH =================
  drawSectionHeader("Syllabus Competencies & Research Focus");

  checkPageOverflow(20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Pedagogical Core & Academic Strengths:", marginX, y);
  y += 4.5;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
  const strengthsLines = doc.splitTextToSize(ACADEMIC_STRENGTHS.join("  •  "), contentWidth);
  strengthsLines.forEach((line: string) => {
    checkPageOverflow(4);
    doc.text(line, marginX, y);
    y += 4;
  });
  y += 2.5;

  checkPageOverflow(20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Active Research & Specializations:", marginX, y);
  y += 4.5;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(colors.neutralDark[0], colors.neutralDark[1], colors.neutralDark[2]);
  const researchLines = doc.splitTextToSize(RESEARCH_INTERESTS.join("  •  "), contentWidth);
  researchLines.forEach((line: string) => {
    checkPageOverflow(4);
    doc.text(line, marginX, y);
    y += 4;
  });
  y += 2;

  // ================= CERTIFICATIONS =================
  drawSectionHeader("IIT & Industry Certifications");
  
  checkPageOverflow(15);
  const formattedCerts = CERTIFICATIONS.map((c) => `${c.name} (${c.provider})`);
  formattedCerts.forEach((cert) => {
    printBullet(cert);
  });
  y += 2;

  // ================= SCHOLARLY WORKS & PATENTS =================
  drawSectionHeader("Scholarly Publications & Patents");

  // Journal Paper
  checkPageOverflow(12);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text("Peer-Reviewed Journal Papers:", marginX, y);
  y += 4.5;

  PUBLICATIONS.forEach((pub) => {
    const pubText = `"${pub.title}" — Published in ${pub.journal} (Year: ${pub.year}). Author: ${pub.author}`;
    printBullet(pubText);
  });
  y += 2;

  // Patent
  checkPageOverflow(12);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text("Intellectual Property Patents:", marginX, y);
  y += 4.5;

  PATENTS.forEach((pat) => {
    const patText = `"${pat.title}" — Reg No: ${pat.regNo} (Status: ${pat.status}, Published: ${pat.year})`;
    printBullet(patText);
  });
  y += 2;

  // Conferences (Brand new properly added section)
  checkPageOverflow(12);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text("International IEEE & ACM Conferences:", marginX, y);
  y += 4.5;

  CONFERENCES.forEach((conf) => {
    const confText = `"${conf.title}" — Presented at ${conf.venue} (${conf.year})`;
    printBullet(confText);
  });
  y += 2;

  // ================= WORKSHOPS & FDPS =================
  drawSectionHeader("Workshops & Faculty Development Programmes");

  WORKSHOPS_FDPS.forEach((wf) => {
    const wfText = `"${wf.name}" [${wf.type}] — Organized by ${wf.organizer} (Duration: ${wf.duration}, Year: ${wf.year})`;
    printBullet(wfText);
  });

  // Render final footer on the last page
  drawFooter();

  // Trigger PDF file saving inside the client browser
  doc.save("Vicky_Kumar_Academic_CV.pdf");
}
