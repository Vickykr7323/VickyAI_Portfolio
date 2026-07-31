import { jsPDF } from "jspdf";
import { CERTIFICATIONS } from "../data";

export function generatePortfolioPdf() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const marginX = 18;
  const contentWidth = pageWidth - (marginX * 2); // 174 mm
  let y = 18;
  let pageNum = 1;

  // Colors
  const colors = {
    primary: [0, 0, 0],
    secondary: [30, 30, 30],
    accent: [0, 80, 180],
    darkText: [20, 20, 20],
  };

  const drawFooter = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Vicky Kumar — Resume", marginX, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - marginX - 10, pageHeight - 8);
  };

  const checkPageOverflow = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 14) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = 18;
    }
  };

  const drawSectionHeader = (title: string) => {
    checkPageOverflow(12);
    y += 2;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(title.toUpperCase(), marginX, y);
    y += 3;
  };

  const printBullet = (text: string) => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);

    const bulletTextWidth = contentWidth - 6;
    const lines = doc.splitTextToSize(text, bulletTextWidth);

    lines.forEach((line: string, index: number) => {
      checkPageOverflow(4.5);
      if (index === 0) {
        doc.text("•", marginX + 2, y);
        doc.text(line, marginX + 6, y);
      } else {
        doc.text(line, marginX + 6, y);
      }
      y += 4.5;
    });
  };

  // Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("VICKY KUMAR", marginX, y);
  y += 6;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text("Assistant Professor – Computer Science", marginX, y);
  y += 5;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
  doc.text("Delhi, India  |   8340223956", marginX, y);
  y += 4.5;

  doc.setTextColor(0, 80, 180);
  doc.text("LinkedIn: https://www.linkedin.com/in/vicky-kumar-600059219/", marginX, y);
  y += 4.5;

  doc.text("GitHub: https://github.com/Vickykr7323", marginX, y);
  y += 6;

  // PROFESSIONAL SUMMARY
  drawSectionHeader("PROFESSIONAL SUMMARY");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
  const summaryText = "Dedicated Assistant Professor in Computer Science with expertise in Programming, Data Structures, and Core Computer Science subjects. Experienced in Outcome-Based Education (OBE), curriculum design, laboratory instruction, and academic mentoring. Skilled in integrating industry-aligned technologies and research-driven learning methodologies to enhance student engagement and employability.";
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  summaryLines.forEach((line: string) => {
    checkPageOverflow(4.5);
    doc.text(line, marginX, y);
    y += 4.5;
  });
  y += 2;

  // TEACHING EXPERIENCE
  drawSectionHeader("TEACHING EXPERIENCE");
  checkPageOverflow(12);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Assistant Professor – Computer Science", marginX, y);
  y += 4.5;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Aug 2025 – Present", marginX, y);
  y += 5;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Subjects: C, C++, Java, Python, Data Structures", marginX, y);
  y += 5;

  const teachingBullets = [
    "Designed and delivered undergraduate curriculum aligned with OBE standards",
    "Conducted lectures, tutorials, and hands-on laboratory sessions",
    "Prepared question papers, assignments, and structured evaluation rubrics",
    "Mentored mini and major academic projects",
    "Guided students for internships and technical project development",
    "Promoted experiential, project-based, and outcome-focused learning"
  ];
  teachingBullets.forEach(bullet => printBullet(bullet));
  y += 2;

  // EDUCATION
  drawSectionHeader("EDUCATION");
  
  // MCA
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Master of Computer Applications (MCA)", marginX, y);
  y += 4.5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Teerthanker Mahaveer University | 2023 – 2025", marginX, y);
  y += 5.5;

  // BCA
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Bachelor of Computer Applications (BCA)", marginX, y);
  y += 4.5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Maharaja College | 2019 – 2022", marginX, y);
  y += 5;

  // TECHNICAL COMPETENCIES
  drawSectionHeader("TECHNICAL COMPETENCIES");
  const competencies = [
    { label: "Programming Languages", val: "C, C++, Java, Python" },
    { label: "Core Subjects", val: "Data Structures, OOP, DBMS, Operating Systems" },
    { label: "Web Technologies", val: "MERN Stack, MEAN Stack, REST APIs, HTML, CSS, JavaScript" },
    { label: "Databases", val: "MySQL, MongoDB" },
    { label: "Tools", val: "Git, GitHub, VS Code" }
  ];

  competencies.forEach(comp => {
    checkPageOverflow(5);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    const labelStr = `${comp.label}: `;
    doc.text(labelStr, marginX, y);
    const labelWidth = doc.getTextWidth(labelStr);

    doc.setFont("Helvetica", "normal");
    const valLines = doc.splitTextToSize(comp.val, contentWidth - labelWidth);
    valLines.forEach((line: string, i: number) => {
      if (i === 0) {
        doc.text(line, marginX + labelWidth, y);
      } else {
        y += 4.5;
        checkPageOverflow(4.5);
        doc.text(line, marginX + 10, y);
      }
    });
    y += 4.5;
  });
  y += 1;

  // ACADEMIC PROJECTS
  drawSectionHeader("ACADEMIC PROJECTS");

  // Project 1
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("AI-Based Job Portal (MERN Stack)", marginX, y);
  y += 4.5;

  const proj1Bullets = [
    "Developed full-stack job portal with Job Seeker, Employer, and Admin modules",
    "Implemented AI-based job recommendation system",
    "Designed scalable architecture with secure authentication"
  ];
  proj1Bullets.forEach(b => printBullet(b));
  y += 2;

  // Project 2
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Academic Portfolio Website", marginX, y);
  y += 4.5;

  const proj2Bullets = [
    "Built responsive academic portfolio website",
    "Implemented modern UI/UX principles for professional presentation"
  ];
  proj2Bullets.forEach(b => printBullet(b));
  y += 2;

  // INTERNSHIPS
  drawSectionHeader("INTERNSHIPS");

  // Internship 1
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("MERN Stack Intern – Intellipaat (6 Months)", marginX, y);
  y += 4.5;

  const intern1Bullets = [
    "Developed web applications and RESTful APIs",
    "Implemented authentication and database integration"
  ];
  intern1Bullets.forEach(b => printBullet(b));
  y += 2;

  // Internship 2
  checkPageOverflow(10);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("MERN Stack Intern – Cromacampus, Noida", marginX, y);
  y += 4.5;

  const intern2Bullets = [
    "Trained in full-stack development and backend connectivity"
  ];
  intern2Bullets.forEach(b => printBullet(b));
  y += 2;

  // CERTIFICATIONS
  drawSectionHeader("CERTIFICATIONS");
  checkPageOverflow(10);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);

  const certItems = CERTIFICATIONS.map(c => `${c.name} – ${c.provider}`);
  for (let i = 0; i < certItems.length; i += 2) {
    checkPageOverflow(4.5);
    const item1 = certItems[i];
    const item2 = certItems[i + 1];
    if (item2) {
      doc.text(`${item1.padEnd(28, ' ')}   ${item2}`, marginX, y);
    } else {
      doc.text(item1, marginX, y);
    }
    y += 4.5;
  }
  y += 1;

  // RESEARCH INTERESTS
  drawSectionHeader("RESEARCH INTERESTS");
  checkPageOverflow(6);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
  const researchText = "Artificial Intelligence | Machine Learning | Data Science | Educational Technology | Scalable Web Systems";
  const researchLines = doc.splitTextToSize(researchText, contentWidth);
  researchLines.forEach((line: string) => {
    checkPageOverflow(4.5);
    doc.text(line, marginX, y);
    y += 4.5;
  });
  y += 2;

  // ACADEMIC STRENGTHS
  drawSectionHeader("ACADEMIC STRENGTHS");
  checkPageOverflow(6);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
  const strengthsText = "Curriculum Planning | Academic Mentorship | Classroom Management | Research Orientation | Technical Communication";
  const strengthsLines = doc.splitTextToSize(strengthsText, contentWidth);
  strengthsLines.forEach((line: string) => {
    checkPageOverflow(4.5);
    doc.text(line, marginX, y);
    y += 4.5;
  });

  drawFooter();
  doc.save("Vicky_Kumar_Resume.pdf");
}

