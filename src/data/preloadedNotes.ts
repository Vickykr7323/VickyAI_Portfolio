import { Note } from "../types";

export const PRELOADED_NOTES: Note[] = [
  {
    id: "pre-py-1",
    title: "Programming in Python",
    category: "Programming",
    tags: ["python", "scripting", "basics"],
    difficulty: "Beginner",
    summary: "Python is an interpreted, high-level, dynamically typed language emphasizing code readability with simple indentation-based syntax.",
    keyTakeaways: [
      "Supports OOP, functional, and procedural paradigms natively.",
      "Relies on automatic garbage collection and handles concurrency through the Global Interpreter Lock (GIL).",
      "Enables fast data manipulation via advanced structures like list comprehensions, generators, and decorators."
    ],
    codeSnippet: {
      language: "python",
      code: "def process_numbers(nums):\n    # List comprehension with filtering\n    return [n * n for n in nums if n % 2 == 0]"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-ds-2",
    title: "Data Structures",
    category: "Core CS",
    tags: ["dsa", "memory", "structures"],
    difficulty: "Beginner",
    summary: "Data structures are specialized formats for organizing, processing, storing, and retrieving data efficiently within computer memory.",
    keyTakeaways: [
      "Linear structures like Arrays, Linked Lists, Stacks, and Queues define direct sequence access.",
      "Non-linear structures like Trees and Graphs model hierarchical and network-based relationships.",
      "Choosing the right data structure directly optimizes search, insertion, and deletion complexity."
    ],
    codeSnippet: {
      language: "typescript",
      code: "class Node<T> {\n  value: T;\n  next: Node<T> | null = null;\n  constructor(val: T) { this.value = val; }\n}"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-alg-3",
    title: "Algorithms",
    category: "Core CS",
    tags: ["dsa", "logic", "efficiency"],
    difficulty: "Intermediate",
    summary: "Algorithms are precise step-by-step procedures or sets of rules for solving computational problems and analyzing performance.",
    keyTakeaways: [
      "Analyzed using Big-O notation to evaluate time and space complexity in asymptotic limits.",
      "Key paradigms include Divide and Conquer, Greedy Choices, and Dynamic Programming.",
      "Classic search and sorting algorithms include Binary Search, Quicksort, and Merge Sort."
    ],
    codeSnippet: {
      language: "javascript",
      code: "function binarySearch(arr, val) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l + r) / 2);\n    if (arr[m] === val) return m;\n    arr[m] < val ? l = m + 1 : r = m - 1;\n  }\n  return -1;\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-dbms-4",
    title: "Database Management Systems (DBMS)",
    category: "Database",
    tags: ["database", "dbms", "sql"],
    difficulty: "Beginner",
    summary: "DBMS is software system utilized to define, create, maintain, and control user access to structured database files.",
    keyTakeaways: [
      "Enforces the relational model, organizing data into tables with primary and foreign keys.",
      "Guarantees transactional reliability through Atomicity, Consistency, Isolation, and Durability (ACID).",
      "Addresses database design anomalies using formal normalization rules up to BCNF."
    ],
    codeSnippet: {
      language: "sql",
      code: "CREATE TABLE courses (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-os-5",
    title: "Operating Systems",
    category: "Core CS",
    tags: ["os", "kernel", "systems"],
    difficulty: "Intermediate",
    summary: "Operating Systems manage physical hardware resources and act as software intermediary hosts for running programs.",
    keyTakeaways: [
      "Orchestrates CPU resource allocation using scheduling policies (FIFO, Round Robin, SRTF).",
      "Implements Virtual Memory architectures, utilizing paging and translation lookaside buffers (TLB).",
      "Handles process synchronization to avoid race conditions, deadlocks, and starvation."
    ],
    codeSnippet: {
      language: "javascript",
      code: "// Simulating Process Queue Scheduling\nconst processes = [\n  { id: 1, burst: 5, priority: 2 },\n  { id: 2, burst: 8, priority: 1 }\n];\nprocesses.sort((a, b) => a.priority - b.priority);"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-net-6",
    title: "Computer Networks",
    category: "Networking",
    tags: ["networks", "tcp-ip", "protocols"],
    difficulty: "Beginner",
    summary: "Computer Networks link computing nodes to exchange resources, guided by modular protocol suites.",
    keyTakeaways: [
      "Modeled via the 7-layer OSI system or the streamlined 4-layer TCP/IP protocol suite.",
      "TCP provides reliable, ordered, byte-stream delivery, while UDP offers fast, connectionless datagrams.",
      "Directs internet routing using IP addresses, DNS domain translation, and standard subnets."
    ],
    codeSnippet: {
      language: "bash",
      code: "# Network Diagnostic Commands\nping -c 4 google.com\nnslookup github.com"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-oop-7",
    title: "Object-Oriented Programming (OOP)",
    category: "Programming",
    tags: ["oop", "design", "classes"],
    difficulty: "Beginner",
    summary: "OOP is a programming philosophy centered around modeling code structures as discrete objects containing data and behaviors.",
    keyTakeaways: [
      "Encapsulation: Hides internal state data, exposing operations only through public interfaces.",
      "Inheritance: Allows a new class to reuse, extend, or override properties of an existing class.",
      "Polymorphism: Enables uniform treatment of differing subclasses through shared base interfaces."
    ],
    codeSnippet: {
      language: "typescript",
      code: "abstract class Shape {\n  abstract getArea(): number;\n}\nclass Circle extends Shape {\n  constructor(private radius: number) { super(); }\n  getArea() { return Math.PI * this.radius ** 2; }\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-se-8",
    title: "Software Engineering",
    category: "Software Development",
    tags: ["engineering", "lifecycle", "agile"],
    difficulty: "Beginner",
    summary: "Software Engineering applies systematic, disciplined engineering practices to software development life cycles (SDLC).",
    keyTakeaways: [
      "Utilizes structured development models like Waterfall (sequential) or Agile (iterative).",
      "Emphasizes requirements analysis, architectural blueprint design, and clear documentation.",
      "Integrates regular refactoring, peer code reviews, and robust system deployment plans."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// SOLID Principle: Single Responsibility Principle (SRP)\nclass UserMailer {\n  sendWelcomeEmail(email: string) { /* ... */ }\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-web-9",
    title: "Web Development (HTML, CSS, JavaScript)",
    category: "Web Development",
    tags: ["web", "frontend", "html-css"],
    difficulty: "Beginner",
    summary: "Web development builds interactive browser applications, combining structure, styles, and client-side logic scripts.",
    keyTakeaways: [
      "HTML5 defines the semantic content skeleton and structural tree of web documents.",
      "CSS3 manages responsive style presentation, grids, and layouts via media queries.",
      "JavaScript adds dynamic behavior, handles DOM events, and communicates with remote APIs."
    ],
    codeSnippet: {
      language: "html",
      code: "<div class=\"flex flex-col items-center p-4\">\n  <h1 class=\"text-lg font-bold\">Web Core</h1>\n  <button onclick=\"console.log('clicked')\">Action</button>\n</div>"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-sql-10",
    title: "SQL & Advanced SQL",
    category: "Database",
    tags: ["sql", "queries", "advanced"],
    difficulty: "Intermediate",
    summary: "SQL is the standard query language for defining, searching, and updating relational database engines.",
    keyTakeaways: [
      "Queries data across multiple collections using INNER, LEFT, RIGHT, and FULL outer JOINs.",
      "Performs complex row calculations using advanced Window Functions (e.g., ROW_NUMBER, RANK, LEAD).",
      "Optimizes database index design to achieve fast O(log N) lookup speeds on critical filters."
    ],
    codeSnippet: {
      language: "sql",
      code: "SELECT name, score, \n  RANK() OVER (PARTITION BY dept_id ORDER BY score DESC) as rank\nFROM students;"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-java-11",
    title: "Java Programming",
    category: "Programming",
    tags: ["java", "jvm", "backend"],
    difficulty: "Beginner",
    summary: "Java is a class-based, concurrent, object-oriented language compiled to intermediate bytecode running on virtual machines (JVM).",
    keyTakeaways: [
      "Follows the 'Write Once, Run Anywhere' (WORA) philosophy using platform-specific JVM runtimes.",
      "Features automatic heap memory reclamation through garbage collection daemon loops.",
      "Enforces strict static typing, robust compiler checks, and standard thread safety."
    ],
    codeSnippet: {
      language: "java",
      code: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Java JVM Environment\");\n  }\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-c-12",
    title: "C Programming",
    category: "Programming",
    tags: ["c", "systems", "low-level"],
    difficulty: "Beginner",
    summary: "C is a procedural, compiled, low-level language providing direct, fine-grained control over physical computer memory.",
    keyTakeaways: [
      "Provides manual control over heap memory lifetimes using standard malloc() and free().",
      "Features powerful pointer variables holding raw hardware addresses.",
      "Lacks high-level garbage collection or class abstractions, enabling extreme bare-metal speeds."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n  int *ptr = (int*)malloc(sizeof(int));\n  *ptr = 100;\n  free(ptr);\n  return 0;\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-cpp-13",
    title: "C++ Programming",
    category: "Programming",
    tags: ["cpp", "oop", "systems"],
    difficulty: "Intermediate",
    summary: "C++ is a high-performance compiled language expanding C with OOP, template meta-programming, and smart resource bindings (RAII).",
    keyTakeaways: [
      "Enforces Resource Acquisition Is Initialization (RAII), releasing resources automatically on stack scope exit.",
      "Supports smart pointers (std::unique_ptr, std::shared_ptr) to eliminate memory leak bugs.",
      "Offers generic programming capabilities using high-efficiency Standard Template Library (STL) containers."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <vector>\n#include <memory>\nstd::unique_ptr<int> smart_ptr = std::make_unique<int>(100);\nstd::vector<int> list = {1, 2, 3};"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-fs-14",
    title: "Full Stack Development",
    category: "Web Development",
    tags: ["fullstack", "web", "architecture"],
    difficulty: "Intermediate",
    summary: "Full Stack Development refers to engineering both user-facing client interfaces and underlying backend server architectures.",
    keyTakeaways: [
      "Frontend coordinates layout compositions, client routing, and reactive state stores.",
      "Backend manages API routing, authentication logic, server security, and data transformations.",
      "Integrates client, server, and database layers to construct seamless full-stack user journeys."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// API Contract interface\ninterface APIResponse<T> {\n  success: boolean;\n  data: T;\n  error?: string;\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-mern-15",
    title: "MERN Stack Development",
    category: "Web Development",
    tags: ["mern", "mongodb", "react"],
    difficulty: "Intermediate",
    summary: "MERN Stack is a popular JavaScript-only web framework combination using MongoDB, Express, React, and Node.js.",
    keyTakeaways: [
      "MongoDB represents database collections as flexible, schema-free BSON documents.",
      "Express and Node.js construct lightweight, non-blocking asynchronous backend API pipelines.",
      "React handles single-page component states, syncing changes through Virtual DOM diffs."
    ],
    codeSnippet: {
      language: "javascript",
      code: "// MERN architecture stack flow\n// Client (React) <== JSON via REST ==> Server (Node & Express) <== Mongoose ==> DB (MongoDB)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-react-16",
    title: "React.js",
    category: "Frontend",
    tags: ["react", "frontend", "components"],
    difficulty: "Intermediate",
    summary: "React is a declarative, component-driven library for building reactive client user interfaces.",
    keyTakeaways: [
      "Isolates component updates using an in-memory Virtual DOM reconciliation algorithm.",
      "Coordinates states and lifecycles in functional components using hooks like useState and useEffect.",
      "Emphasizes a unidirectional data flow, passing props down from parent models to children."
    ],
    codeSnippet: {
      language: "typescript",
      code: "import React, { useState } from 'react';\nexport const SimpleCounter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n};"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-node-17",
    title: "Node.js & Express.js",
    category: "Backend",
    tags: ["node", "backend", "express"],
    difficulty: "Intermediate",
    summary: "Node.js runs server-side JavaScript utilizing an asynchronous event loop, with Express acting as the routing layer.",
    keyTakeaways: [
      "Achieves non-blocking I/O efficiency using a single execution thread backed by libuv threadpools.",
      "Processes HTTP web requests through modular chains of Express middleware.",
      "Pipes massive files efficiently chunk-by-chunk using node streams to prevent RAM bloat."
    ],
    codeSnippet: {
      language: "typescript",
      code: "import express from 'express';\nconst app = express();\napp.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-git-18",
    title: "Git & GitHub",
    category: "Development Tools",
    tags: ["git", "github", "vcs"],
    difficulty: "Beginner",
    summary: "Git is a distributed version control system tracking source code histories, with GitHub serving as the cloud collaboration platform.",
    keyTakeaways: [
      "Saves discrete code snapshots locally using cryptographic commits and branches.",
      "Integrates team code additions through push, pull, and collaborative Merge/Pull Requests.",
      "Helps resolve project code collisions using git merge conflict resolution rules."
    ],
    codeSnippet: {
      language: "bash",
      code: "git checkout -b feature/auth\ngit add .\ngit commit -m \"add oauth flow\"\ngit push origin feature/auth"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-linux-19",
    title: "Linux & Shell Scripting",
    category: "System Administration",
    tags: ["linux", "bash", "cli"],
    difficulty: "Intermediate",
    summary: "Linux is an open-source operating system core, with Shell scripting automating command pipelines.",
    keyTakeaways: [
      "Interacts with systems using powerful command-line terminal pipelines (e.g., grep, awk, sed).",
      "Automates complex system operations using bash/sh shell scripting procedures.",
      "Secures directories and file access using explicit user, group, and other permission sets (chmod/chown)."
    ],
    codeSnippet: {
      language: "bash",
      code: "#!/bin/bash\n# Find log warnings\ngrep -rn \"WARNING\" /var/log/nginx/"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-coa-20",
    title: "Computer Organization & Architecture",
    category: "Core CS",
    tags: ["architecture", "hardware", "cpu"],
    difficulty: "Intermediate",
    summary: "This subject explores the physical hardware blocks, CPU instructions, and memory pathways of computer systems.",
    keyTakeaways: [
      "Understands computing pathways through instruction set architectures (RISC vs CISC).",
      "Accelerates execution speeds using CPU Pipelining phases (Fetch, Decode, Execute).",
      "Implements Hierarchical Memory structures, utilizing high-speed Cache levels (L1, L2) and main RAM."
    ],
    codeSnippet: {
      language: "cpp",
      code: "// High-performance cache-friendly nested loops\nfor(int i=0; i<N; ++i)\n  for(int j=0; j<N; ++j)\n    matrix[i][j] = 0; // row-major traversal"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-ai-21",
    title: "Artificial Intelligence",
    category: "AI",
    tags: ["ai", "search", "heuristics"],
    difficulty: "Beginner",
    summary: "AI explores computational techniques enabling systems to solve problems, make decisions, and simulate intelligence.",
    keyTakeaways: [
      "Applies path search heuristics like A* Search, Minimax game trees, and alpha-beta pruning.",
      "Models structured decision environments using Markov Decision Processes (MDP) and constraint logic.",
      "Lays the logic foundation for modern automated reasoning and machine learning engines."
    ],
    codeSnippet: {
      language: "python",
      code: "# Simple heuristic search state score calculator\ndef calc_score(g_cost, h_cost):\n    return g_cost + h_cost"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-ml-22",
    title: "Machine Learning",
    category: "AI",
    tags: ["ml", "regression", "scikit-learn"],
    difficulty: "Intermediate",
    summary: "Machine Learning develops statistical algorithms that learn patterns from training datasets to make future predictions.",
    keyTakeaways: [
      "Supervised Learning: Trains models on labeled data to perform classification or regression.",
      "Unsupervised Learning: Extracts hidden data patterns from unlabeled datasets via clustering (e.g. K-Means).",
      "Evaluates model accuracy using cross-validation, confusion matrices, and ROC curves."
    ],
    codeSnippet: {
      language: "python",
      code: "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-dl-23",
    title: "Deep Learning",
    category: "AI",
    tags: ["dl", "neural-networks", "pytorch"],
    difficulty: "Advanced",
    summary: "Deep Learning utilizes multi-layered artificial neural networks to model abstract patterns in massive data collections.",
    keyTakeaways: [
      "Calculates model gradients with backpropagation, updating weights via optimization loops.",
      "Applies specialized architectures like CNNs for computer vision and RNNs/Transformers for sequences.",
      "Leverages high-performance GPU tensor clusters to train massive deep neural nets."
    ],
    codeSnippet: {
      language: "python",
      code: "import torch.nn as nn\nclass SimpleMLP(nn.Module):\n  def __init__(self):\n    super().__init__()\n    self.layer = nn.Linear(128, 10)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-ds-24",
    title: "Data Science",
    category: "Data Science",
    tags: ["data-science", "pandas", "numpy"],
    difficulty: "Intermediate",
    summary: "Data Science combines domain expertise, programming, and mathematics to extract actionable knowledge from raw data.",
    keyTakeaways: [
      "Performs comprehensive exploratory data analysis (EDA) and data cleansing procedures.",
      "Manipulates data structures in Python using popular libraries like Pandas and NumPy.",
      "Applies rigorous statistical tests to validate conclusions drawn from sample data."
    ],
    codeSnippet: {
      language: "python",
      code: "import pandas as pd\ndf = pd.read_csv('dataset.csv')\nclean_df = df.dropna().query('score > 80')"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-nlp-25",
    title: "Natural Language Processing (NLP)",
    category: "AI",
    tags: ["nlp", "transformers", "text"],
    difficulty: "Advanced",
    summary: "NLP enables computers to process, understand, generate, and analyze human language datasets.",
    keyTakeaways: [
      "Preprocesses text tokens via lemmatization, stop-word removal, and TF-IDF embedding.",
      "Uses deep neural networks (LSTMs, Transformers) to capture grammatical sequence context.",
      "Powers smart translation, sentiment analysis, and large generative chatbots."
    ],
    codeSnippet: {
      language: "python",
      code: "# Simple token splitter\ndef preprocess_text(text):\n    return text.lower().strip().split()"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-cv-26",
    title: "Computer Vision",
    category: "AI",
    tags: ["cv", "opencv", "images"],
    difficulty: "Advanced",
    summary: "Computer Vision trains computational models to identify, segment, and extract structural information from digital image streams.",
    keyTakeaways: [
      "Applies mathematical filters (Sobel, Gaussian) to extract edges, contours, and landmarks.",
      "Utilizes Convolutional Neural Networks (CNNs) for high-accuracy image classification and object detection.",
      "Powers modern biometric scanners, automated surveillance, and autonomous navigation."
    ],
    codeSnippet: {
      language: "python",
      code: "import cv2\nimage = cv2.imread('face.jpg')\nedges = cv2.Canny(image, 100, 200)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-da-27",
    title: "Data Analytics",
    category: "Data Science",
    tags: ["analytics", "bi", "visualizations"],
    difficulty: "Beginner",
    summary: "Data Analytics processes and evaluates historical records to discover trends and answer business performance questions.",
    keyTakeaways: [
      "Aggregates and formats business intelligence dashboards to drive corporate decisions.",
      "Generates interactive data visualizers showing trend correlations over time.",
      "Distinguishes between descriptive analytics (what happened) and predictive solutions."
    ],
    codeSnippet: {
      language: "python",
      code: "import numpy as np\ndata = [12, 15, 14, 18, 22]\nmedian = np.median(data)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-bd-28",
    title: "Big Data (Hadoop & Spark)",
    category: "Big Data",
    tags: ["big-data", "hadoop", "spark"],
    difficulty: "Advanced",
    summary: "Big Data engineering utilizes distributed frameworks to process datasets too massive for single physical systems.",
    keyTakeaways: [
      "Hadoop HDFS splits massive files into blocks, replicating them across cluster nodes.",
      "Spark provides extremely fast in-memory cluster computing using Resilient Distributed Datasets (RDDs).",
      "Integrates MapReduce jobs to process data parallelly across thousands of machines."
    ],
    codeSnippet: {
      language: "java",
      code: "// Concept Spark Word Count\n// textFile.flatMap(line => line.split(\" \")).map(word => (word, 1)).reduceByKey(_ + _)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-cloud-29",
    title: "Cloud Computing (AWS, Azure, GCP)",
    category: "Cloud",
    tags: ["cloud", "aws", "gcp"],
    difficulty: "Intermediate",
    summary: "Cloud Computing offers on-demand virtual compute, storage, and networking resources over the internet.",
    keyTakeaways: [
      "Replaces upfront hardware costs with flexible, utility-based operational billing.",
      "Core structures include virtual servers, scalable cloud databases, and serverless runtimes.",
      "Secures cloud infrastructures using strict Identity and Access Management (IAM) controls."
    ],
    codeSnippet: {
      language: "bash",
      code: "# S3 Upload command via AWS CLI\naws s3 cp bundle.js s3://my-cloud-deploy-bucket/"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-devops-30",
    title: "DevOps",
    category: "Cloud & DevOps",
    tags: ["devops", "ci-cd", "automation"],
    difficulty: "Intermediate",
    summary: "DevOps unites software development and operations teams using automated pipelines to ship features continuously.",
    keyTakeaways: [
      "Integrates Continuous Integration / Continuous Deployment (CI/CD) to build, test, and release code automatically.",
      "Implements Infrastructure as Code (IaC) to define server resources via declarative scripts.",
      "Optimizes operational visibility through real-time application monitoring and alerts."
    ],
    codeSnippet: {
      language: "yaml",
      code: "# Sample CI Stage Configuration\nstages:\n  - build\n  - test\nscript: npm run test"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-docker-31",
    title: "Docker & Kubernetes",
    category: "Cloud",
    tags: ["docker", "kubernetes", "containers"],
    difficulty: "Intermediate",
    summary: "Docker builds lightweight software containers, with Kubernetes orchestrating and scaling them across clusters.",
    keyTakeaways: [
      "Docker bundles application runtimes, code, and configurations into identical container layers.",
      "Kubernetes automates container deployment, horizontal autoscaling, and self-healing.",
      "Maximizes computing density by sharing host OS kernels instead of running bulky hypervisors."
    ],
    codeSnippet: {
      language: "html",
      code: "# Dockerfile Definition Example\nFROM node:18-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"npm\", \"start\"]"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-security-32",
    title: "Cyber Security",
    category: "Security",
    tags: ["security", "cyber", "malware"],
    difficulty: "Intermediate",
    summary: "Cyber Security protects networked systems, programs, and digital assets from unauthorized access or damage.",
    keyTakeaways: [
      "Defends information privacy, integrity, and operational availability (CIA Triad).",
      "Implements strict Access Control lists, multi-factor logins, and regular system audits.",
      "Identifies, analyzes, and patches zero-day vulnerabilities, Trojan scripts, and malware vectors."
    ],
    codeSnippet: {
      language: "bash",
      code: "# Security network scanning mapping\nnmap -sS -O -p 22,80,443 local_subnet"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-eh-33",
    title: "Ethical Hacking",
    category: "Security",
    tags: ["pentest", "hacking", "vulnerabilities"],
    difficulty: "Intermediate",
    summary: "Ethical Hacking simulates authorized penetration attacks to identify, evaluate, and patch network security weaknesses.",
    keyTakeaways: [
      "Follows phases: Reconnaissance, Scanning, Gaining Access, Maintaining Access, and Clearing Tracks.",
      "Tests web security protocols against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF).",
      "Generates comprehensive pentest reports containing critical remediation guidelines."
    ],
    codeSnippet: {
      language: "bash",
      code: "# Testing SQL Injection using CLI scanner tool\nsqlmap -u \"http://vulnerable-site.test/view.php?id=10\""
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-ns-34",
    title: "Network Security",
    category: "Security",
    tags: ["firewall", "vpn", "ids"],
    difficulty: "Intermediate",
    summary: "Network Security defends data assets during transmission by implementing firewalls, tunnels, and active monitoring.",
    keyTakeaways: [
      "Filters network packet traffic utilizing stateful firewalls and access lists.",
      "Detects malicious access signatures using Intrusion Detection/Prevention Systems (IDS/IPS).",
      "Secures remote communication tunnels using encrypted Virtual Private Networks (VPNs)."
    ],
    codeSnippet: {
      language: "bash",
      code: "# Block inbound traffic on port 23 (Telnet)\niptables -A INPUT -p tcp --dport 23 -j DROP"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-crypto-35",
    title: "Cryptography",
    category: "Security",
    tags: ["crypto", "encryption", "hashing"],
    difficulty: "Advanced",
    summary: "Cryptography applies advanced mathematical formulas to encode information, preventing unauthorized inspection.",
    keyTakeaways: [
      "Symmetric Cryptography (AES) uses a single secret key for fast data encryption.",
      "Asymmetric Cryptography (RSA/ECC) coordinates a public key for encryption and a private key for decryption.",
      "Verifies file integrity and authenticity using secure hashing algorithms (SHA-256) and digital signatures."
    ],
    codeSnippet: {
      language: "javascript",
      code: "import crypto from 'crypto';\nconst hash = crypto.createHash('sha256').update('password').digest('hex');"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-android-36",
    title: "Mobile App Development (Android)",
    category: "Mobile",
    tags: ["android", "kotlin", "mobile"],
    difficulty: "Intermediate",
    summary: "Android Development constructs mobile applications utilizing Google's Android SDK, Kotlin, or Java.",
    keyTakeaways: [
      "Composes responsive user interfaces using modern Jetpack Compose layouts.",
      "Coordinates mobile lifecycles across Activities, Fragments, background Services, and Receivers.",
      "Optimizes client apps using local SQLite databases (Room) to enable offline operations."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Jetpack Compose structure concept\n// @Composable\n// fun Welcome() { Column { Text(\"Welcome to Android SDK\") } }"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-flutter-37",
    title: "Flutter Development",
    category: "Mobile",
    tags: ["flutter", "dart", "cross-platform"],
    difficulty: "Intermediate",
    summary: "Flutter is Google's open-source UI toolkit for building natively compiled multi-platform applications from a single Dart codebase.",
    keyTakeaways: [
      "Renders pixel-perfect layouts across iOS and Android utilizing custom high-performance graphics engines.",
      "Adheres to a declarative UI layout methodology where everything on screen is structured as a Widget.",
      "Accelerates layout prototyping and debugging using stateful Hot Reload features."
    ],
    codeSnippet: {
      language: "javascript",
      code: "// Flutter Widget tree concept\n// Widget build(BuildContext ctx) { return Center(child: Text('Flutter')); }"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-rn-38",
    title: "React Native",
    category: "Mobile",
    tags: ["react-native", "js", "mobile"],
    difficulty: "Intermediate",
    summary: "React Native compiles React-driven JavaScript code into native platform interface widgets.",
    keyTakeaways: [
      "Combines cross-platform speed with native execution performance.",
      "Controls platform APIs like camera or GPS using JavaScript bridge interfaces.",
      "Reuses standard web styling paradigms, applying Flexbox layouts in React Native widgets."
    ],
    codeSnippet: {
      language: "typescript",
      code: "import React from 'react';\nimport { Text, View } from 'react-native';\nexport const App = () => <View><Text>RN Native Frame</Text></View>;"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-iot-39",
    title: "Internet of Things (IoT)",
    category: "Emerging Technology",
    tags: ["iot", "sensors", "arduino"],
    difficulty: "Intermediate",
    summary: "IoT networks link physical hardware sensors, controllers, and appliances to exchange data over standard channels.",
    keyTakeaways: [
      "Collects physical environments data using sensor nodes (temperature, motion, light).",
      "Processes local trigger events using microcontrollers like Arduino or Raspberry Pi.",
      "Exchanges telemetry data using lightweight, pub-sub messaging protocols (MQTT)."
    ],
    codeSnippet: {
      language: "cpp",
      code: "void setup() {\n  pinMode(13, OUTPUT); // Configure digital board pin\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-blockchain-40",
    title: "Blockchain Technology",
    category: "Emerging Technology",
    tags: ["blockchain", "web3", "solidity"],
    difficulty: "Advanced",
    summary: "Blockchain represents decentralized, cryptographically-linked ledger tables maintaining irreversible transaction logs.",
    keyTakeaways: [
      "Enforces absolute trust using consensus algorithms (Proof of Work vs Proof of Stake).",
      "Automates programmatic transactions on-chain using Solidity Smart Contracts.",
      "Ensures record permanence; ledger modifications require consensus across distributed network nodes."
    ],
    codeSnippet: {
      language: "javascript",
      code: "// Solidity Smart Contract Concept\n// contract Ledger { uint balance; function get() public view returns (uint) { return balance; } }"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-compiler-41",
    title: "Compiler Design",
    category: "Core CS",
    tags: ["compiler", "lexing", "parsing"],
    difficulty: "Advanced",
    summary: "Compiler Design explores the translation of human-readable source languages into executable hardware instructions.",
    keyTakeaways: [
      "Tokenizes code characters into syntactic symbols using Lexical Analyzers.",
      "Validates structural grammar and builds Abstract Syntax Trees (AST) using Parsers.",
      "Generates and optimizes machine-level assembly instructions for specific target chips."
    ],
    codeSnippet: {
      language: "javascript",
      code: "const lex = (code) => code.split(/\\s+/); // very primitive lexer"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-toc-42",
    title: "Theory of Computation",
    category: "Core CS",
    tags: ["toc", "automata", "turing"],
    difficulty: "Advanced",
    summary: "TOC investigates the mathematical limits, capabilities, and behaviors of computational models.",
    keyTakeaways: [
      "Models computing states using Finite Automata (DFA, NFA) and Context-Free Grammars.",
      "Defines universal computation models utilizing abstract Turing Machines.",
      "Classifies computational difficulty bounds into P, NP, and undecidable (Halting) classes."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Turing Machine transition mapping set\n// delta(state_q, tape_char) => (state_p, write_char, Move_Left/Right)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-math-43",
    title: "Discrete Mathematics",
    category: "Mathematics",
    tags: ["math", "discrete", "logic"],
    difficulty: "Beginner",
    summary: "Discrete Mathematics explores countable, separate mathematical structures, establishing the math bedrock of Computer Science.",
    keyTakeaways: [
      "Formulates logical algorithms using propositional logic, set theory, and truth tables.",
      "Solves structural optimization challenges using Graph Theory (Eulerian paths, coloring trees).",
      "Calculates probabilities and secure cryptographic keys using Combinatorics and Number Theory."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Logic Set Union\nconst union = <T>(setA: Set<T>, setB: Set<T>) => \n  new Set([...setA, ...setB]);"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-daa-44",
    title: "Design and Analysis of Algorithms",
    category: "Core CS",
    tags: ["daa", "complexity", "algorithms"],
    difficulty: "Advanced",
    summary: "DAA explores systematic methods to design algorithms and mathematically prove their complexity bounds.",
    keyTakeaways: [
      "Proves algorithmic bounds using recurrence relation equations (e.g. Master Theorem).",
      "Creates highly efficient lookup networks using hash maps and balanced trees (AVL, Red-Black).",
      "Applies optimization algorithms (e.g. Bellman-Ford, Prim's) to complex network graph configurations."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Master Theorem equation evaluation format\n// T(n) = a * T(n / b) + O(n^d)"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-testing-45",
    title: "Software Testing & QA",
    category: "Software Engineering",
    tags: ["testing", "qa", "jest"],
    difficulty: "Beginner",
    summary: "QA establishes rigorous, automated testing methodologies to verify that code meets reliability standards.",
    keyTakeaways: [
      "Applies Unit Testing to isolate and test individual functions, and Integration Testing to verify module interactions.",
      "Distinguishes between Black-Box (functional) and White-Box (structural path) testing.",
      "Maintains pipeline health using CI test runners and automated test coverage thresholds."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Sample unit test structure\ntest('adds 1 + 2 to equal 3', () => {\n  expect(1 + 2).toBe(3);\n});"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-api-46",
    title: "API Development (REST & GraphQL)",
    category: "Backend",
    tags: ["api", "graphql", "rest"],
    difficulty: "Intermediate",
    summary: "API Development creates communication channels between distinct software packages, using REST or GraphQL schemas.",
    keyTakeaways: [
      "REST: Exposes resource models using static URLs and standard HTTP methods.",
      "GraphQL: Enables flexible client requests, returning exactly the fields requested in a single call.",
      "Protects communication ports against overload using rate limiters and payload validators."
    ],
    codeSnippet: {
      language: "javascript",
      code: "// GraphQL Schema Definition snippet\nconst typeDefs = `\n  type Note { id: ID!, title: String!, summary: String! }\n  type Query { allNotes: [Note] }\n`;"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-micro-47",
    title: "Microservices Architecture",
    category: "Software Architecture",
    tags: ["architecture", "microservices", "gateway"],
    difficulty: "Advanced",
    summary: "Microservices split applications into multiple independent, loosely-coupled services communicating via APIs.",
    keyTakeaways: [
      "Develops, deploys, and scales individual service blocks independently without database locking.",
      "Directs external requests to correct service routes using central API Gateways.",
      "Handles transient service outages gracefully using Circuit Breakers and event busses."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Service route mapping pattern\nconst SERVICES = {\n  users: 'http://localhost:3001/users',\n  notes: 'http://localhost:3002/notes'\n};"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-embedded-48",
    title: "Embedded Systems",
    category: "Hardware & Embedded",
    tags: ["embedded", "c", "firmware"],
    difficulty: "Advanced",
    summary: "Embedded Systems compile software directly onto dedicated hardware units to run real-time control operations.",
    keyTakeaways: [
      "Writes hardware-level firmware programs under extremely tight memory and power limits.",
      "Manages hardware task timings using Real-Time Operating System (RTOS) engines.",
      "Interacts directly with physical pins using GPIO registers, SPI, and I2C protocols."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <avr/io.h>\nvoid toggleLED() {\n  PORTB ^= (1 << PB5); // hardware port toggle register bit\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-robot-49",
    title: "Robotics",
    category: "Emerging Technology",
    tags: ["robotics", "ros", "control"],
    difficulty: "Advanced",
    summary: "Robotics combines mechanical structures, physical sensors, and computer algorithms to build automated physical assistants.",
    keyTakeaways: [
      "Integrates robot communication nodes using the Robot Operating System (ROS) framework.",
      "Translates spatial coordinates into physical motion equations using Kinematics calculations.",
      "Corrects robot steering offsets in real-time using proportional-integral-derivative (PID) controllers."
    ],
    codeSnippet: {
      language: "python",
      code: "# ROS simple publisher node concept\n# import rospy; from std_msgs.msg import String\n# pub = rospy.Publisher('chatter', String, queue_size=10)"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-quantum-50",
    title: "Quantum Computing",
    category: "Advanced Computing",
    tags: ["quantum", "qiskit", "physics"],
    difficulty: "Advanced",
    summary: "Quantum Computing leverages quantum mechanical behaviors like superposition and entanglement to solve extremely complex mathematical problems.",
    keyTakeaways: [
      "Calculates computational states using Qubits, which exist in superpositions of 0 and 1 until measured.",
      "Links qubit states across long physical gaps using quantum Entanglement.",
      "Solves specialized problems incredibly fast using quantum algorithms like Shor's or Grover's."
    ],
    codeSnippet: {
      language: "python",
      code: "# Quantum circuit with 1 qubit in superposition (Hadamard)\n# from qiskit import QuantumCircuit\n# qc = QuantumCircuit(1); qc.h(0)"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-java-51",
    title: "Java Programming Language",
    category: "Programming",
    tags: ["java", "oop", "jvm"],
    difficulty: "Intermediate",
    summary: "Java is a class-based, object-oriented, concurrent programming language designed to have as few implementation dependencies as possible (Write Once, Run Anywhere).",
    keyTakeaways: [
      "Compiled into bytecode that runs on any platform equipped with a Java Virtual Machine (JVM).",
      "Features rich memory management including automated Garbage Collection (GC) and generational garbage collectors.",
      "Enforces strict compile-time type safety, structured exception handling, and robust multithreading via virtual threads or platform threads."
    ],
    codeSnippet: {
      language: "java",
      code: "public class Main {\n    public static void main(String[] args) {\n        java.util.List<String> items = java.util.List.of(\"Java\", \"JVM\", \"GC\");\n        items.forEach(System.out::println);\n    }\n}"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-jdbc-52",
    title: "JDBC (Java Database Connectivity)",
    category: "Database",
    tags: ["java", "jdbc", "sql", "database"],
    difficulty: "Intermediate",
    summary: "JDBC is a Java-based API that defines how a client may access a database, offering standard interfaces to query and update data in relational databases.",
    keyTakeaways: [
      "Translates generic SQL calls into driver-specific native calls using vendor-supplied JDBC drivers.",
      "Uses Connection, Statement, and PreparedStatement interfaces to securely query and manipulate databases while preventing SQL Injection.",
      "Provides ResultSet objects to retrieve, iterate over, and read database query rows sequentially."
    ],
    codeSnippet: {
      language: "java",
      code: "import java.sql.*;\npublic class DBExample {\n    public static void query(String url) throws SQLException {\n        try (Connection conn = DriverManager.getConnection(url);\n             PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\")) {\n            stmt.setInt(1, 42);\n            ResultSet rs = stmt.executeQuery();\n            while (rs.next()) { System.out.println(rs.getString(\"name\")); }\n        }\n    }\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-servlet-53",
    title: "Java Servlets",
    category: "Backend",
    tags: ["java", "servlet", "web", "http"],
    difficulty: "Intermediate",
    summary: "Java Servlets are server-side components that extend the capabilities of servers hosting applications accessed by means of a request-response programming model.",
    keyTakeaways: [
      "Managed by a Servlet Container (such as Apache Tomcat) which handles lifecycle methods (init, service, destroy).",
      "Processes HTTP requests (HttpServletRequest) and constructs HTTP responses (HttpServletResponse) dynamically.",
      "Acts as the foundation for modern enterprise Java frameworks like Spring MVC and JSF."
    ],
    codeSnippet: {
      language: "java",
      code: "import java.io.*;\nimport jakarta.servlet.*;\nimport jakarta.servlet.http.*;\npublic class HelloServlet extends HttpServlet {\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n        resp.setContentType(\"text/html\");\n        resp.getWriter().println(\"<h1>Hello from Servlet!</h1>\");\n    }\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-springboot-54",
    title: "Spring Boot Framework",
    category: "Backend",
    tags: ["spring", "springboot", "java", "microservices"],
    difficulty: "Advanced",
    summary: "Spring Boot is an open-source, microservice-focused Java framework designed to simplify the bootstrapping and development of production-grade, Spring-based applications.",
    keyTakeaways: [
      "Enforces Opinionated Auto-Configuration, automatically configuring libraries based on classpath dependencies.",
      "Embeds a web server directly (such as Tomcat or Jetty), eliminating the need to deploy external WAR files.",
      "Utilizes Dependency Injection (DI) and Aspect-Oriented Programming (AOP) to build modular, loosely-coupled web services."
    ],
    codeSnippet: {
      language: "java",
      code: "import org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.web.bind.annotation.*;\n\n@SpringBootApplication\n@RestController\npublic class App {\n    public static void main(String[] args) {\n        SpringApplication.run(App.class, args);\n    }\n    @GetMapping(\"/api\")\n    public String hello() { return \"Hello, Spring Boot!\"; }\n}"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-c-55",
    title: "C Programming Language",
    category: "Programming",
    tags: ["c", "systems", "pointers", "memory"],
    difficulty: "Intermediate",
    summary: "C is a procedural, general-purpose computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.",
    keyTakeaways: [
      "Provides low-level access to memory via Pointers, allowing direct manipulation of hardware and system memory.",
      "Requires explicit Manual Memory Management using functions like malloc(), calloc(), realloc(), and free().",
      "Compiles directly to machine code, making it exceptionally fast and the foundation of operating system kernels."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int *ptr = (int*)malloc(sizeof(int));\n    if (ptr != NULL) {\n        *ptr = 101;\n        printf(\"Value: %d\\n\", *ptr);\n        free(ptr);\n    }\n    return 0;\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-cpp-56",
    title: "C++ Programming Language",
    category: "Programming",
    tags: ["cpp", "oop", "stl", "templates"],
    difficulty: "Advanced",
    summary: "C++ is a high-performance, general-purpose programming language that extends C with object-oriented features, generic templates, and RAII resource management.",
    keyTakeaways: [
      "Emphasizes Resource Acquisition Is Initialization (RAII) and Smart Pointers (unique_ptr, shared_ptr) for automatic memory control without garbage collection.",
      "Includes the Standard Template Library (STL), providing powerful collection classes (vector, map, set) and algorithms.",
      "Supports compile-time polymorphism through templates and runtime polymorphism through virtual functions and vtables."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <iostream>\n#include <vector>\n#include <memory>\nint main() {\n    auto vec = std::make_unique<std::vector<int>>();\n    vec->push_back(42);\n    std::cout << \"First value: \" << vec->at(0) << std::endl;\n    return 0;\n}"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-se-adv-57",
    title: "Advanced Software Engineering Principles",
    category: "Software Engineering",
    tags: ["software-engineering", "design-patterns", "solid", "testing"],
    difficulty: "Advanced",
    summary: "Advanced Software Engineering encapsulates formal methodologies, design principles, testing patterns, and CI/CD pipelines to construct robust and maintainable software systems.",
    keyTakeaways: [
      "Strictly follows SOLID design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).",
      "Employs Gang of Four (GoF) design patterns like Factory, Singleton, Observer, Strategy, and Decorator.",
      "Emphasizes automated Unit Testing (TDD), Integration Testing, Static Code Analysis, and automated deployment pipelines."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Dependency Inversion Principle Example\ninterface Logger { log(msg: string): void; }\nclass ConsoleLogger implements Logger { log(msg: string) { console.log(msg); } }\nclass UserService {\n  constructor(private logger: Logger) {} // inject interface\n}"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-os-adv-58",
    title: "Operating Systems Internals & Concurrency",
    category: "Core CS",
    tags: ["os", "concurrency", "multithreading", "kernel"],
    difficulty: "Advanced",
    summary: "Operating System internals deal with kernel development, low-level process synchronization, page tables, and file system mechanics.",
    keyTakeaways: [
      "Solves critical section problems and race conditions using synchronization primitives like Semaphores, Mutexes, and Monitors.",
      "Manages high-throughput concurrency and CPU scheduling using advanced algorithms like Multi-Level Feedback Queues.",
      "Addresses virtual memory mapping through Multi-Level Page Tables, page replacement algorithms (LRU, Optimal), and TLB caching."
    ],
    codeSnippet: {
      language: "cpp",
      code: "#include <mutex>\n#include <thread>\nstd::mutex mtx;\nint shared_counter = 0;\nvoid safe_increment() {\n    std::lock_guard<std::mutex> lock(mtx); // RAII Mutex locking\n    shared_counter++;\n}"
    },
    isStarred: false,
    isRead: false
  },
  {
    id: "pre-python-adv-59",
    title: "Advanced Python: Concurrency & Metaprogramming",
    category: "Programming",
    tags: ["python", "asyncio", "metaclasses", "advanced"],
    difficulty: "Advanced",
    summary: "Advanced Python expands on asynchronous single-threaded coroutines, metaclasses, decorators, and internal memory optimization models.",
    keyTakeaways: [
      "Bypasses performance bottlenecks on network I/O through single-threaded asynchronous loops with asyncio and await/async keywords.",
      "Customizes class creation behaviors dynamically using Metaclasses and descriptor protocols.",
      "Optimizes memory foot-prints of class instances utilizing the __slots__ declaration to prevent arbitrary dictionary creation."
    ],
    codeSnippet: {
      language: "python",
      code: "import asyncio\nasync def fetch_data(id):\n    await asyncio.sleep(1) # non-blocking sleep\n    return {\"id\": id, \"data\": \"val\"}\nasync def main():\n    results = await asyncio.gather(*(fetch_data(i) for i in range(3)))\n    print(results)"
    },
    isStarred: true,
    isRead: false
  },
  {
    id: "pre-compiler-60",
    title: "Compiler Design & Language Translation",
    category: "Core CS",
    tags: ["compiler", "parsing", "automata", "lexer"],
    difficulty: "Advanced",
    summary: "Compiler Design explains how source code written in a high-level language is validated, analyzed, optimized, and compiled down to target assembly or machine code.",
    keyTakeaways: [
      "Lexical Analysis: Scans source code characters and converts them into structured Tokens using Regular Expressions and Finite Automata.",
      "Syntax Analysis: Parses tokens into an Abstract Syntax Tree (AST) using Context-Free Grammars (LL, LR, LALR parsers).",
      "Semantic Analysis & Optimization: Validates type systems, resolves variable declarations, and performs machine-independent optimizations."
    ],
    codeSnippet: {
      language: "typescript",
      code: "// Basic Lexical Scanner Token structure\ninterface Token { type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'SYMBOL'; value: string; }\nfunction lex(code: string): Token[] {\n  return [{ type: 'KEYWORD', value: 'let' }, { type: 'IDENTIFIER', value: 'x' }];\n}"
    },
    isStarred: false,
    isRead: false
  }
];
