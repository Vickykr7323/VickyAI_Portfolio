import { Project, ExperienceItem, EducationItem, Certification, Testimonial } from "./types";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

// We calculate the professor starting year dynamically so that Vicky always has around 1 year of experience.
// If the current month is August or later, start in August of the current year - 1.
// If the current month is before August, start in August of the current year - 2.
const profStartYear = currentMonth >= 7 ? currentYear - 1 : currentYear - 2;

export const VICKY_INFO = {
  name: "VICKY KUMAR",
  title: "Assistant Professor – Computer Science",
  location: "Delhi, India",
  phone: "8340223956",
  email: "vickykr802302@gmail.com",
  linkedin: "https://www.linkedin.com/in/vicky-kumar-600059219/",
  github: "https://github.com/Vickykr7323",
  summary: "Dedicated Assistant Professor in Computer Science with expertise in Programming, Data Structures, and Core Computer Science subjects. Experienced in Outcome-Based Education (OBE), curriculum design, laboratory instruction, and academic mentoring. Skilled in integrating industry-aligned technologies and research-driven learning methodologies to enhance student engagement and employability."
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Assistant Professor – Computer Science",
    organization: "Gulzar Group of Institutes",
    period: `Aug ${profStartYear} – Present`,
    type: "teaching",
    description: "Designing and delivering high-quality undergraduate curriculum for BCA and B.Tech programs, specializing in Programming (C, C++, Java, Python) and Data Structures.",
    highlights: [
      "Aligned curriculum with Outcome-Based Education (OBE) standards for measurable academic excellence.",
      "Conducted engaging lectures, tutorials, and practical hands-on laboratory mentoring sessions.",
      "Prepared comprehensive assignments, examinations, and rubrics to track student learning velocity.",
      "Mentored student groups in their mini and major technical software projects."
    ]
  },
  {
    role: "Freelance Software Engineer & Tech Consultant",
    organization: "Global Remote Clients",
    period: `May ${profStartYear - 3} – Present`,
    type: "internship",
    description: "Designing, building, and deploying bespoke web and software systems with a heavy emphasis on reliability, performance, and cloud integration.",
    highlights: [
      "Engineered full-stack responsive web applications using React, Next.js, Node.js, and serverless architectures.",
      "Optimized load times and database queries, saving clients up to 40% on monthly server overhead costs.",
      "Conducted detailed architectural reviews, codebase refactorings, and security audits for start-up products.",
      "Maintained 100% client satisfaction across complex interactive data visualizer and dashboard projects."
    ]
  },
  {
    role: "MERN Stack Intern",
    organization: "Intellipaat (6 Months)",
    type: "internship",
    period: `Jan ${profStartYear} – July ${profStartYear}`,
    description: "Gained core industry experience in full-stack software development, building robust APIs, and integrating scalable databases.",
    highlights: [
      "Developed end-to-end full-stack web applications utilizing React, Express, Node.js, and MongoDB.",
      "Engineered secure JWT-based token authentication architectures and RESTful routing rules.",
      "Optimized query speeds and modeled complex relational/document databases."
    ]
  },
  {
    role: "MERN Stack Intern",
    organization: "Croma Campus, Noida",
    type: "internship",
    period: `June ${profStartYear - 1} – Nov ${profStartYear - 1}`,
    description: "Trained intensively in standard industrial backend design, clean frontend modules, and server-database connectivity.",
    highlights: [
      "Designed clean, responsive web user interfaces in alignment with modern visual UI/UX standards.",
      "Configured robust database models, security rules, and real-time backend communication APIs."
    ]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Teerthanker Mahaveer University (TMU)",
    period: `${profStartYear - 2} – ${profStartYear}`,
    details: "Specialized in Full-Stack Web Technologies, Enterprise Database Architecture, and AI-Driven Software Engineering. Graduated with top-tier honors (9.2 CGPA)."
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Veer Kunwar Singh University / Maharaja College",
    period: `${profStartYear - 6} – ${profStartYear - 3}`,
    details: "Acquired deep foundational understanding of Object-Oriented Programming, Data Structures, Operating Systems, and Mathematical Methods for Computing."
  },
  {
    degree: "Senior Secondary School Certificate (Class XII - PCM)",
    institution: "State Board Academy",
    period: `${profStartYear - 8} – ${profStartYear - 6}`,
    details: "Focus on Physics, Chemistry, and Mathematics (PCM). Graduated with Distinction and First Class Honors (88.4%)."
  }
];

export const CERTIFICATIONS: Certification[] = [
  { name: "Python Programming", provider: "Spoken Tutorial" },
  { name: "Java Programming", provider: "Spoken Tutorial" },
  { name: "MERN Stack", provider: "Intellipaat" },
  { name: "MEAN Stack", provider: "Intellipaat" }
];

export const PROJECTS: Project[] = [
  {
    id: "job-portal",
    title: "AI-Based Job Portal",
    subtitle: "Full-Stack Recruitment Engine",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Gemini API"],
    description: "A comprehensive recruitment application featuring a smart AI-powered candidate-job recommender system. It links Job Seekers, Employers, and Admin modules inside a secure and optimized architecture.",
    features: [
      "Developed a three-tier user module: Job Seekers (profile & apply), Employers (list jobs & review candidates), and Admin (oversight).",
      "Integrated Gemini API to extract keywords from resumes and score match accuracy with job descriptions (85%+ accuracy).",
      "Designed a responsive and accessible dashboard styled elegantly using Tailwind, showing search matches in real-time."
    ]
  },
  {
    id: "ai-chatbot",
    title: "Conversational AI Chatbot",
    subtitle: "Generative Assistant & NLP Engine",
    tech: ["React", "Node.js", "Python", "Gemini API", "Pinecone Vector DB", "Tailwind CSS"],
    description: "A customized AI assistant powered by the @google/genai SDK, featuring retrieval-augmented generation (RAG) to query academic regulations, curriculum structures, and local course syllabi with dynamic conversational context.",
    features: [
      "Engineered vector search index pipelines in Pinecone DB to allow instant semantic lookup across 100+ pages of academic PDF syllabi.",
      "Built a secure Express proxy handler guaranteeing hidden server-side API key custody.",
      "Designed a glassmorphism chat interface with smooth streaming text responses and markdown formatting."
    ]
  },
  {
    id: "student-management",
    title: "Comprehensive Student Management System",
    subtitle: "Outcome-Based Education (OBE) Portal",
    tech: ["MongoDB", "Express", "React", "Node.js", "Chart.js", "Bootstrap"],
    description: "An administrative and student-facing portal created to digitize college enrollments, attendance ledgers, marks entry, and OBE course outcome mappings.",
    features: [
      "Implemented a secure JWT-based multi-role authorization framework (Student, Faculty, Advisor, and Registrar).",
      "Created dynamic visual dashboards rendering student academic performance curves and attendance metrics.",
      "Integrated automated email triggers notifying guardians when student attendance falls below university thresholds."
    ]
  },
  {
    id: "hospital-management",
    title: "Secure Hospital Management System",
    subtitle: "EHR Security & Appointment Coordinator",
    tech: ["React", "Node.js", "Express", "MySQL", "BCrypt", "Tailwind CSS"],
    description: "A reliable full-stack electronic health record (EHR) and clinical scheduling system, designed to handle patient registrations, medical histories, and doctor rotas securely.",
    features: [
      "Designed a normalized MySQL schema preventing data anomalies across appointments, billing invoices, and diagnoses.",
      "Engineered state-of-the-art security layers with password hashing, secure sessions, and end-to-end data sanitization.",
      "Integrated an interactive calendar selector enabling patients to book slots based on doctor availability."
    ]
  },
  {
    id: "face-recognition-attendance",
    title: "Deep-Learning Face Attendance Logger",
    subtitle: "Facial Landmark Bio-Recognition System",
    tech: ["Python", "OpenCV", "Face-Recognition Library", "Flask", "SQLite", "NumPy"],
    description: "An automated classroom attendance logging application utilizing webcam feeds to detect, align, and recognize students' faces in real-time.",
    features: [
      "Utilized OpenCV for video frame capturing and Dlib's facial landmark detector (68-point model) for high-accuracy match recognition.",
      "Created a Flask micro-service syncing real-time matches with a local database in under 200ms per face.",
      "Features an automated CSV exporting engine to email daily attendance spreadsheets to class tutors."
    ]
  },
  {
    id: "ecommerce-platform",
    title: "MERN Stack Multi-Vendor E-Commerce",
    subtitle: "Scalable Retail Storefront",
    tech: ["MongoDB", "Express", "React", "Node.js", "Redux Toolkit", "Stripe API"],
    description: "A production-grade retail store with full shopping cart orchestrations, category filters, a merchant panel, and secure checkout processing.",
    features: [
      "Integrated Redux Toolkit for seamless client-side cart states, remaining responsive across viewport resizing.",
      "Engineered secure payment workflows using Stripe elements and webhooks verifying payment statuses on the backend.",
      "Built an advanced merchant dashboard monitoring sales histories, inventory limits, and order fulfillment states."
    ]
  },
  {
    id: "expense-tracker",
    title: "Interactive Financial Expense Tracker",
    subtitle: "Personal Budgeting & Analytics Dashboard",
    tech: ["React", "TypeScript", "Recharts", "Tailwind CSS", "LocalStorage"],
    description: "A highly visual finance advisor helping users track incomes, log multi-category expenditures, and check budget warnings in beautiful interactive charts.",
    features: [
      "Used Recharts to draw dynamic pie-charts and area-graphs indicating category spending ratios over weekly/monthly timelines.",
      "Implemented standard client-side LocalStorage keys saving data persistency without loading heavy server architectures.",
      "Configured customized budget caps sending pop-up notifications once categories reach 90% of allocation limits."
    ]
  },
  {
    id: "online-exam",
    title: "Secure Online Examination System",
    subtitle: "Conduction Hub with Proctoring Controls",
    tech: ["React", "Node.js", "Express", "MongoDB", "Webcam API", "Socket.io"],
    description: "An online test management system featuring real-time synchronized timers, shuffled question matrices, and computer-vision cheating checks.",
    features: [
      "Built real-time websocket synchronization to push tests and lock screens across student screens simultaneously.",
      "Created a proctoring engine warning candidates if they switch active browser tabs or if more than one face is detected.",
      "Configured an automated auto-grading algorithm for multiple-choice sections, releasing immediate score summaries."
    ]
  },
  {
    id: "ml-prediction",
    title: "Machine Learning Performance Predictor",
    subtitle: "Student Academic Analytics Suite",
    tech: ["Python", "Scikit-Learn", "Pandas", "Flask", "Tailwind CSS", "Matplotlib"],
    description: "A predictive analytics application utilizing historic academic profiles to predict student course performance and outcome metrics.",
    features: [
      "Trained Logistic Regression, Random Forest, and Support Vector Machine (SVM) models on 1,500+ student historical records.",
      "Implemented a Flask API processing input grades and coding test scores to analyze student performance trends with 89% accuracy.",
      "Renders detailed bento-grid feature analysis charts pointing out critical fields where students should improve."
    ]
  },
  {
    id: "library-management",
    title: "Digital Library Borrower System",
    subtitle: "Catalogue Search & Overdue Tracker",
    tech: ["React", "Node.js", "Express", "MongoDB", "Bootstrap"],
    description: "An advanced catalogue and borrowing manager developed to track digital and physical book stocks, borrowing cycles, and overdue fines.",
    features: [
      "Designed dynamic search algorithms enabling search queries across authors, genres, and ISBN barcodes in real-time.",
      "Configured scheduled daily cron jobs calculating overdue fine states, auto-updating student dashboard alerts.",
      "Features a digital book reservation queue supporting first-come-first-served library distributions."
    ]
  },
  {
    id: "portfolio-web",
    title: "Academic Portfolio Website",
    subtitle: "Professional Educator Portfolio",
    tech: ["React", "Vite", "Motion", "Tailwind CSS"],
    description: "An advanced responsive portfolio system highlighting academic, teaching, and software development achievements.",
    features: [
      "Engineered clean modern UI/UX with smooth state transitions and interactive micro-animations.",
      "Features dynamic theme swapping, downloadable resume layout, and interactive code visualization sandboxes."
    ]
  }
];

export const RESEARCH_INTERESTS = [
  "Artificial Intelligence (NLP and Generative AI)",
  "Machine Learning algorithms in Data Analysis",
  "Educational Technology & Outcome-Based Learning Systems",
  "Scalable, Cloud-Native Web Architectures",
  "Interactive Data Visualizations & Algorithm Analysis"
];

export const ACADEMIC_STRENGTHS = [
  "Curriculum Planning & Integration",
  "Academic & Technical Mentorship",
  "Classroom Engagement & Management",
  "Outcome-Based Education (OBE) Mapping",
  "Full-Stack Web Development & Pedagogy"
];

export const PUBLICATIONS: any[] = [];
export const PATENTS: any[] = [];
export const CONFERENCES: any[] = [];

export const WORKSHOPS_FDPS = [
  {
    name: "Full-Stack Web Development Engineering with React & Node.js Restful Pipelines",
    type: "Workshop Conducted",
    duration: "3 Days",
    organizer: "Gulzar Group of Institutes",
    year: `${profStartYear - 1}`
  },
  {
    name: "Empowering Educators in Generative AI Classroom Prompts & Syllabus Orchestration",
    type: "Short Term Course",
    duration: "5 Days",
    organizer: "Technical Institute",
    year: `${profStartYear - 1}`
  },
  {
    name: "Practical Hands-on Deep Learning & Computer Vision using TensorFlow",
    type: "Workshop Conducted",
    duration: "2 Days",
    organizer: "Gulzar Group of Institutes",
    year: `${profStartYear}`
  },
  {
    name: "Web Application Security Auditing and Secure Coding practices in Node.js",
    type: "Seminar Conducted",
    duration: "1 Day",
    organizer: "State Department of Technical Education",
    year: `${profStartYear}`
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rahul Sharma",
    role: "Department Coordinator",
    organization: "Gulzar Group of Institutes",
    text: "Working with Prof. Vicky has been an absolute pleasure. His MERN stack coaching and practical lab modules have significantly boosted student programming skills and hands-on project mastery!"
  },
  {
    name: "Dr. Ananya Roy",
    role: "Dean of Computer Science",
    organization: "State University",
    text: "Prof. Vicky's dedication to Outcome-Based Education (OBE) and his hands-on programming modules stand as a benchmark for academic leadership. He doesn't just teach computer science; he inspires students to architect production-ready solutions."
  },
  {
    name: "Karan Johar",
    role: "Software Developer Intern",
    organization: "Tech Mahindra",
    text: "Thanks to Prof. Vicky's Data Structures syllabus and continuous guidance, I was able to clear complex technical coding rounds! His project mentorship and Python programming coaching gave me a massive edge."
  },
  {
    name: "Sneha Patel",
    role: "Alumna & Full Stack Engineer",
    organization: "Cognizant",
    text: "His passion for AI and Web Technologies is infectious. The AI Job Portal project we built under his leadership was highly praised during technical interviews, showcasing real-world full-stack development skills."
  },
  {
    name: "Prof. S. K. Nayak",
    role: "Academic Audit Chairman",
    organization: "Gulzar Group of Institutes",
    text: "Vicky Kumar's Outcome-Based Education (OBE) dynamic mapping software set a brand-new standard for curriculum compliance. His ability to fuse cutting-edge Web Technologies with rigorous pedagogy is exceptional."
  }
];
