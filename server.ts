import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent for telemetry as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Resilient wrapper for generateContent to handle transient 503 Unavailable / High Demand errors
async function safeGenerateContent(params: any, retries = 3, delay = 1000): Promise<any> {
  let attempt = 0;
  let currentModel = params.model || "gemini-3.5-flash";

  while (true) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model: currentModel,
      });
      return response;
    } catch (error: any) {
      attempt++;
      console.warn(`Gemini generation failed (attempt ${attempt}/${retries}) for model ${currentModel}:`, error);

      const errorMsg = error.message || "";
      const is503 = error.status === "UNAVAILABLE" ||
                    error.code === 503 ||
                    errorMsg.includes("503") ||
                    errorMsg.toLowerCase().includes("high demand") ||
                    errorMsg.includes("UNAVAILABLE") ||
                    errorMsg.toLowerCase().includes("temporary");

      if (is503) {
        if (attempt < retries) {
          const backoff = delay * Math.pow(2, attempt - 1);
          console.log(`Model is experiencing high demand. Retrying in ${backoff}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        } else if (currentModel === "gemini-3.5-flash") {
          // If gemini-3.5-flash runs out of retries, fallback to gemini-3.1-flash-lite
          console.log("Switching to fallback model gemini-3.1-flash-lite due to high demand on gemini-3.5-flash");
          currentModel = "gemini-3.1-flash-lite";
          attempt = 0; // reset attempts for the fallback model
          continue;
        }
      }

      // Re-throw original or final error if not a 503/UNAVAILABLE, or we ran out of retries on fallback
      throw error;
    }
  }
}

// Vicky Kumar's context for the AI Assistant
const VICKY_CONTEXT = `
You are Vicky Kumar, an Assistant Professor of Computer Science and a member of the Placement Department at Gulzar Group of Institutes (since Aug 2025).
Your professional details:
- Current Location: Ludhiana, India (previously Delhi)
- Contact: 8340223956, vickykr802302@gmail.com
- Education: Master of Computer Applications (MCA) from Teerthanker Mahaveer University (2023-2025), Bachelor of Computer Applications (BCA) from Veer Kunwar Singh University / Maharaja College (2019-2022).
- Subjects Taught: C, C++, Java, Python, and Data Structures.
- Technical Competencies:
  * Languages: C, C++, Java, Python, JavaScript.
  * Core CS: Data Structures, OOP, DBMS, Operating Systems.
  * Web Technologies: MERN Stack (MongoDB, Express, React, Node.js), MEAN Stack, REST APIs, HTML, CSS.
  * Databases: MySQL, MongoDB.
  * Tools: Git, GitHub, VS Code.
- Internships & Experience:
  * Assistant Professor & Placement Department Member at Gulzar Group of Institutes (Aug 2025 - Present). Deliver OBE-aligned curriculum, mentor projects, coordinate placement drives, organize mock interviews, and conduct resume workshops.
  * MERN Stack Intern at Intellipaat (6 Months) - developed web apps, RESTful APIs, auth, and DB integration.
  * MERN Stack Intern at Croma Campus, Noida - trained in full-stack dev and database connectivity.
- Certifications: Python (IIT Bombay), Java (IIT Bombay), MERN Stack (Intellipaat), MEAN Stack (Intellipaat).
- Research Interests: Artificial Intelligence, Machine Learning, Data Science, Educational Technology, Scalable Web Systems.
- Personality: You are a friendly, highly professional, encouraging academic and career mentor. You speak with clear structure, technical precision, and academic warmth. You love helping students prepare for tech placements, master data structures, and build responsive full-stack applications.

Instructions for responses:
1. Always stay in character as Vicky Kumar. Speak as "I" or "me".
2. Keep answers concise, highly structured, and supportive. Use bullet points for readability.
3. If asked about subjects, syllabus, or coding topics (C, C++, Java, Python, Data Structures), give structured, educational explanations.
4. If asked about career preparation or placements, leverage your Placement Department experience to offer actionable resume tips, mock interview practice, or career pathways.
5. If the prompt does not relate to your professional profile or computer science, gracefully steer the conversation back to your academic courses or placement tips.
`;

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, attachment } = req.body;
    if (!message && !attachment) {
      return res.status(400).json({ error: "Message or attachment is required" });
    }

    const cleanedMessage = (message || "").trim();

    if (!process.env.GEMINI_API_KEY) {
      // Smart, high-fidelity offline fallback response matching Vicky's actual portfolio content
      const queryLower = cleanedMessage.toLowerCase();
      let fallbackText = "";

      if (queryLower.includes("career advice") || queryLower.includes("question prep") || queryLower.includes("study card") || queryLower.includes("interview blueprint")) {
        if (queryLower.includes("array") || queryLower.includes("linked list")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Data Structures & Algorithms
**Question:** How do you select between an Array and a Linked List?

---

#### 💡 Core Answer Blueprint:
*   **Memory Structure:** Arrays use contiguous memory blocks. Linked Lists use non-contiguous memory where elements (nodes) are linked via pointers.
*   **Select an Array when:**
    *   You need constant-time **O(1) random access** to elements via indexes.
    *   The size of the dataset is fixed or known in advance.
    *   You want minimal memory overhead (no extra pointers).
    *   You want to leverage **cache locality** for extremely fast iterations.
*   **Select a Linked List when:**
    *   You require frequent, constant-time **O(1) insertions or deletions** at arbitrary locations (without shifting elements).
    *   The dataset is dynamic and grows/shrinks unpredictably.
    *   You do not need direct index-based random access (sequential traversal is fine, which is O(N)).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Linear Search:** Never forget that searching for a specific value is **O(N)** in both arrays (unsorted) and linked lists.
*   **Memory Overhead:** Mention that Linked Lists consume extra memory for pointers (especially in 64-bit systems where pointer sizes are 8 bytes).

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"In campus interviews for companies like TCS, Wipro, or Capgemini, always back up your answer with a practical memory diagram. Mentioning how CPU cache-lines benefit from the contiguous memory of Arrays is a major differentiator that instantly flags you as a top 5% candidate."*`;
        } else if (queryLower.includes("bfs") || queryLower.includes("dfs")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Data Structures & Algorithms
**Question:** Explain the difference between BFS and DFS traversal.

---

#### 💡 Core Answer Blueprint:
*   **BFS (Breadth-First Search):**
    *   **Mechanism:** Traverses the graph level-by-level, visiting all neighbors of a node before moving to the next level.
    *   **Data Structure:** Uses a **Queue** (First-In, First-Out).
    *   **Best For:** Finding the **shortest path** in unweighted graphs or trees.
*   **DFS (Depth-First Search):**
    *   **Mechanism:** Traverses as deep as possible along each branch before backtracking.
    *   **Data Structure:** Uses a **Stack** (explicit stack or implicit function call stack via **Recursion**).
    *   **Best For:** Solving puzzles, detecting cycles, topological sorting, and pathfinding in dense mazes.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Infinite Loops:** In graphs, always mention the necessity of a \`visited\` set/array to prevent infinite loops from cycles.
*   **Complexity:** Clearly state that both have a time complexity of **O(V + E)** and space complexity depends on the structure (BFS is O(W) where W is max width; DFS is O(H) where H is max height).

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"When recruiters ask this, don't just list definitions. Explain a real-world scenario: 'BFS is like searching for nearby restaurants on Google Maps layer-by-layer, whereas DFS is like exploring a single cave path to its absolute end before backtracking to the entrance.' That shows deep conceptual intuition."*`;
        } else if (queryLower.includes("collision") || queryLower.includes("hash")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Data Structures & Algorithms
**Question:** How does a hash map resolve collisions under the hood?

---

#### 💡 Core Answer Blueprint:
*   **Collision:** Occurs when two distinct keys hash to the same index in the underlying array.
*   **Resolution 1: Separate Chaining (Open Chaining):**
    *   Each bucket holds a pointer to a linked list (or balanced binary tree in modern Java/C++).
    *   If keys collide, they are appended to the chain at that index.
*   **Resolution 2: Open Addressing (Closed Hashing):**
    *   All elements are stored directly in the hash table array.
    *   If an index is occupied, we search for another empty slot using:
        *   **Linear Probing:** Checking next consecutive indices (\`index + 1\`, \`index + 2\`, ...).
        *   **Quadratic Probing:** Checking indices quadratically (\`index + 1^2\`, \`index + 2^2\`, ...).
        *   **Double Hashing:** Using a secondary hash function to calculate the step size.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Worst-Case Degradation:** Mention that in the absolute worst-case (e.g., poor hash function), lookup complexity degrades from average **O(1)** to **O(N)**.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"A favorite follow-up of technical managers is 'How does Java 8 handle long chains?'. Explain that Java 8 converts a linked list to a Red-Black Tree (TreeMap) once the threshold exceeds 8 nodes, improving worst-case search from O(N) to O(log N). Mentioning 'rehashing' and 'load factors' will guarantee excellent marks."*`;
        } else if (queryLower.includes("pillars") || queryLower.includes("pillar")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Object-Oriented Programming (OOP)
**Question:** What are the four pillars of OOP and how are they used?

---

#### 💡 Core Answer Blueprint:
1.  **Encapsulation:** Wrapping variables and methods together in a single unit (Class). It protects data by keeping variables \`private\` and exposing access via public \`getters/setters\`.
2.  **Abstraction:** Hiding complex implementation details and showing only the essential features to the outside world. Implemented using \`abstract classes\` or \`interfaces\`.
3.  **Inheritance:** The mechanism by which one class acquires the properties and behaviors of another class (\`extends\` or \`implements\`). It promotes **code reusability** (\`is-a\` relationship).
4.  **Polymorphism:** The ability of a single action or method to behave differently based on context.
    *   **Compile-time (Static):** Method Overloading (same name, different arguments).
    *   **Run-time (Dynamic):** Method Overriding (child class overrides parent's method).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Over-complicating:** Don't just spit out dry textbook definitions. Provide a simple, clear class model example (e.g., a \`Vehicle\` base class and a \`Car\` sub-class).

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"Always use my standard vehicle analogy during interviews. 'A Car encapsulates its engine variables. It abstractly exposes simple controls like drive() and brake() without showing mechanics. It inherits from Vehicle, and implements polymorphism because drive() acts differently for an ElectricCar vs a DieselCar.' Interviewers love this modular explanation."*`;
        } else if (queryLower.includes("overloading") || queryLower.includes("overriding")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Object-Oriented Programming (OOP)
**Question:** Explain the difference between method overloading and method overriding.

---

#### 💡 Core Answer Blueprint:
*   **Method Overloading (Compile-Time Polymorphism):**
    *   **Concept:** Multiple methods in the *same class* share the same name but have *different signatures* (different parameters types, number, or order).
    *   **Binding:** Resolved at compile-time by the compiler.
    *   **Inheritance:** Does not require an inheritance hierarchy.
*   **Method Overriding (Run-Time Polymorphism):**
    *   **Concept:** A subclass provides a *specific implementation* for a method that is already defined in its parent class, keeping the *exact same signature*.
    *   **Binding:** Resolved at runtime by the JVM / runtime environment based on the actual object type.
    *   **Inheritance:** Strictly requires an inheritance (\`is-a\`) relationship.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Return Type:** Overloading *cannot* be achieved by changing only the return type of a method. If method names and arguments are identical but return types are different, it causes a compile-time error.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"In exams and interviews, show clear code snippets. In Java or C++, overloading is like having print(int x) and print(String s) in the same logger class. Overriding is when a parent Animal class has sound() and the Dog class overrides it to bark. Mention the \`@Override\` annotation in Java to show clean coding standards."*`;
        } else if (queryLower.includes("abstract class") || queryLower.includes("interface")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Object-Oriented Programming (OOP)
**Question:** What is an abstract class vs. an interface?

---

#### 💡 Core Answer Blueprint:
*   **Abstract Class:**
    *   Represents a **base identity** ("is-a" relationship).
    *   Can have both abstract methods (no body) and concrete methods (with body).
    *   Can maintain state (instance variables can be private, protected, or public).
    *   A class can extend only **one** abstract class (single inheritance).
*   **Interface:**
    *   Represents a **contractual capability** ("can-do" or "implements" relationship).
    *   Traditionally contains only abstract methods (since Java 8, default and static methods are allowed).
    *   Variables are implicitly \`public static final\` (stateless contract).
    *   A class can implement **multiple** interfaces (multiple inheritance).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Stale Java 7 Definitions:** Do not say Interfaces *cannot* have method bodies anymore. In modern Java, default and static methods are common in interfaces.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"Recruiters love design-driven answers. Tell them: 'I use an Abstract Class when building closely related components sharing code, like a BasePage in web scrapers. I use an Interface to define decoupled behavioral protocols across unrelated classes, like making both a BankTransfer and a CryptoWallet implement a Payable interface.' This is senior-level design thinking."*`;
        } else if (queryLower.includes("acid")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Database Management Systems (DBMS)
**Question:** Explain ACID properties in DBMS with real-world analogies.

---

#### 💡 Core Answer Blueprint:
*   **A - Atomicity ("All or Nothing"):** Ensures that a transaction is either fully completed or completely rolled back.
    *   *Analogy:* Sending $100 from Account A to B. If money is deducted from A but server crashes before adding to B, the database rolls back so money is returned to A.
*   **C - Consistency ("State Validity"):** Ensures the database goes from one valid state to another, enforcing all schemas, constraints, and triggers.
    *   *Analogy:* Total money in the bank (A + B) must remain constant before and after the transfer.
*   **I - Isolation ("Concurrency Control"):** Prevents simultaneous transactions from interfering with each other, ensuring they execute as if running sequentially.
    *   *Analogy:* If C and D also transfer money at the same time, their balances don't overwrite each other.
*   **D - Durability ("Permanent Save"):** Once a transaction is committed, its effects are permanent and survive system crashes.
    *   *Analogy:* Balance is written to disk/non-volatile memory; even a power blackout won't erase the transaction records.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Dry Academic Definitions:** Avoid reciting abstract definitions without explaining the actual banking transaction flow. Practical scenarios are mandatory.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"In DBMS rounds, mention how Isolation is implemented (e.g., using locks, Two-Phase Locking (2PL), or Multiversion Concurrency Control (MVCC)). Stating that Isolation levels like 'Read Committed' or 'Serializable' can be tuned in PostgreSQL/MySQL will get you an instant hiring vote."*`;
        } else if (queryLower.includes("sql") || queryLower.includes("nosql")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** Database Management Systems (DBMS)
**Question:** What is the difference between SQL and NoSQL databases?

---

#### 💡 Core Answer Blueprint:
*   **SQL (Relational):**
    *   **Data Model:** Table/Relation-based with rows and columns.
    *   **Schema:** Strict, pre-defined, rigid schema.
    *   **Relations:** Supports heavy JOIN operations.
    *   **Scaling:** Vertically scalable (increase CPU/RAM on a single server).
    *   **Consistency:** ACID compliant.
    *   *Examples:* MySQL, PostgreSQL, Oracle.
*   **NoSQL (Non-Relational):**
    *   **Data Model:** Document-based (JSON), Key-Value pairs, Column-family, or Graphs.
    *   **Schema:** Dynamic, flexible, schema-less.
    *   **Relations:** Denormalization (embedded documents) instead of JOINs.
    *   **Scaling:** Horizontally scalable (distribute data across multiple servers/shards).
    *   **Consistency:** BASE model (Basically Available, Soft-state, Eventual consistency).
    *   *Examples:* MongoDB, Redis, Cassandra.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Saying NoSQL doesn't support transactions:** Modern NoSQL DBs (like MongoDB) do support multi-document ACID transactions, though they are less efficient than relational joins.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"When designing portfolio projects like our MERN Stack E-learning portal, justify your database choice: 'I used MongoDB because course modules have dynamic, nested structures (flexible JSON), whereas I would use PostgreSQL for an accounting system where transactions and strict schemas are mandatory.' This demonstrates practical engineering judgment."*`;
        } else if (queryLower.includes("virtual dom") || queryLower.includes("vdom")) {
          fallbackText = `### 🎓 Prof. Vicky Kumar's Interview Study Card (Offline Fallback)
**Topic:** MERN Stack Web Development
**Question:** Explain how the Virtual DOM works in React.

---

#### 💡 Core Answer Blueprint:
1.  **Virtual DOM (VDOM):** A lightweight, JavaScript-object copy of the real DOM.
2.  **State Change:** When a component's state or props change, React generates a brand new Virtual DOM tree representing the new UI state.
3.  **Diffing Algorithm:** React compares (diffs) the new VDOM tree with the previous VDOM tree to find the exact elements that changed.
4.  **Reconciliation:**
    *   React calculates the most efficient way to update the real browser DOM.
    *   It batches these changes and updates **only** the modified nodes in the real DOM, avoiding expensive layout reflows and repaints of the entire webpage.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **VDOM is faster than browser DOM:** Do not say VDOM is physically faster. VDOM is just an abstraction that helps minimize the *number of updates* to the real DOM, which is the actual slow operation.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"Recruiters in React interviews often ask: 'Why do we need unique keys in lists?'. Explain that React's diffing algorithm uses keys to track which list items have been added, removed, or reordered. Without unique keys, React has to re-render the entire list instead of just updating the single modified item."*`;
        } else {
          fallbackText = `### 🎓 Prof. Vicky Kumar's AI Career Guidance (Offline Fallback)
I serve as a member of GGI Ludhiana's **Placement Department**. Here are active tips for your recruitment prep:

*   **1. Resume Format:** Standardize on a single-page, metric-driven layout. Mention quantitative impact.
*   **2. Core CS Subjects:** Master core concepts in Data Structures, OOP, DBMS, and Web Development.
*   **3. Practice Routine:** Use the "Read Study Card" feature or trigger dynamic mock sessions in the Placement Office!

*For in-depth explanations on a specific topic, select that question from our Career Advice Mode tabs above!*`;
        }
      } else if (queryLower.includes("hello") || queryLower.includes("hi") || queryLower.includes("hey") || queryLower.includes("greetings")) {
        fallbackText = `**Hello there!** I am Vicky Kumar's AI Academic & Career assistant (operating in fallback mode). 

I can guide you through:
* 🎓 **Academics & Degrees** (MCA from Teerthanker Mahaveer, BCA from VKSU/Maharaja College)
* 💻 **Subjects & Coding** (C, C++, Java, Python, Data Structures, MERN Stack)
* 💼 **Career & Placements** (I serve on GGI's Placement Department!)
* 📧 **Contact & Location** (Based at Gulzar Group of Institutes, Ludhiana)

What would you like to discuss today?`;
      } else if (queryLower.includes("project") || queryLower.includes("mern") || queryLower.includes("mongodb") || queryLower.includes("react") || queryLower.includes("node") || queryLower.includes("github")) {
        fallbackText = `As a MERN Stack developer and Assistant Professor, I have guided and built several high-impact software systems:

1. 🚀 **MERN E-Learning Platform** - Complete outcome-based learning hub with custom grading matrix.
2. 📊 **Placement Intelligence Tracker** - Real-time metrics analyzer for mock interview scores and student resumes.
3. 🔬 **AI Resume Analyst** - Client-side vector parsing script matching syllabus gaps.

*You can check out the interactive "Projects" tab on my portfolio to view complete tech stacks and live repository links!*`;
      } else if (queryLower.includes("placement") || queryLower.includes("interview") || queryLower.includes("resume") || queryLower.includes("career") || queryLower.includes("job") || queryLower.includes("recruitment")) {
        fallbackText = `As a member of GGI Ludhiana's **Placement Department**, I have a structured roadmap to prepare students for core technical recruitments:

* 📄 **Resume Strategy:** Standardize on single-page, metrics-focused professional formats.
* 🧩 **Data Structures:** Master Linked Lists, Stacks, Queues, Binary Trees, and sorting algorithms in Java/C++.
* 🗣️ **Mock Rounds:** Participate in regular verbal mock assessments and programming bootcamps.

*Click on the "Placement Office" tab to run career mock interview simulations and study placement notes!*`;
      } else if (queryLower.includes("subject") || queryLower.includes("teach") || queryLower.includes("course") || queryLower.includes("syllabus") || queryLower.includes("coding") || queryLower.includes("java") || queryLower.includes("python") || queryLower.includes("c++") || queryLower.includes("dsa")) {
        fallbackText = `I teach a selection of fundamental Computer Science and Web Development courses:

* 📘 **Data Structures & Algorithms (DSA):** Focus on memory mapping, space-time complexities, and stack/heap.
* 🟢 **Object-Oriented Programming:** Advanced classes, inheritance, and run-time polymorphism in C++ and Java.
* 🐍 **Modern Python Scripting:** Data structures, IIT Bombay training modules, and scripting utilities.

*You can browse and compose tailored notes on these exact topics directly inside the "CS Notes" tab!*`;
      } else if (queryLower.includes("contact") || queryLower.includes("email") || queryLower.includes("phone") || queryLower.includes("number") || queryLower.includes("location") || queryLower.includes("address") || queryLower.includes("call")) {
        fallbackText = `Here is my direct contact and office information:

* 📧 **Email:** [vickykr802302@gmail.com](mailto:vickykr802302@gmail.com)
* 📞 **Phone:** [+91 8340223956](tel:8340223956)
* 📍 **Office Location:** Department of Computer Applications, Gulzar Group of Institutes, Ludhiana, Punjab, India.

*Feel free to reach out to me for academic questions or placement collaborations!*`;
      } else if (queryLower.includes("education") || queryLower.includes("degree") || queryLower.includes("college") || queryLower.includes("university") || queryLower.includes("mca") || queryLower.includes("bca")) {
        fallbackText = `My educational credentials represent a dedicated focus on Computer Science:

* 🎓 **Master of Computer Applications (MCA):** Teerthanker Mahaveer University (2023 - 2025). Graduated with a deep specialization in web systems and ML.
* 🎓 **Bachelor of Computer Applications (BCA):** Maharaja College / Veer Kunwar Singh University (2019 - 2022). Focus on procedural coding and DBMS.

*To review my full credentials and certified documents, click on the "Academics" tab!*`;
      } else if (queryLower.includes("research") || queryLower.includes("paper") || queryLower.includes("patent") || queryLower.includes("publication")) {
        fallbackText = `My scholarly research is aimed at leveraging modern technology for enhanced pedagogy and intelligent systems:

* 📖 **Interests:** Machine Learning algorithms, Natural Language Processing, and Outcome-Based Education mapping.
* 📄 **Publications:** Detailed in my portfolio's Academics tab, covering peer-reviewed conference insights.

*Click on the "Academics" tab to view specific journals and registered patent numbers!*`;
      } else {
        fallbackText = `I am Vicky Kumar's AI Academic & Placement assistant. I can answer anything about my qualifications, teaching courses, MCA/BCA degrees, GGI placement drives, and coding projects.

*(Note: The Gemini API key is currently not configured in Secrets, so I am answering you using my high-fidelity pre-compiled academic knowledge base. If you set the GEMINI_API_KEY secret, I can dynamically solve any custom coding challenges or career roadmaps!)*`;
      }

      return res.json({
        text: fallbackText,
        offline: true,
      });
    }

    // Prepare contents array for multimodal / text Gemini generation
    const systemPrompt = VICKY_CONTEXT;
    let promptWithHistory = `${systemPrompt}\n\n`;
    
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        promptWithHistory += `${msg.role === "user" ? "Student" : "Vicky Kumar"}: ${msg.content}\n`;
      });
    }
    
    promptWithHistory += `Student: ${cleanedMessage || "Please analyze the attached media file."}\nVicky Kumar:`;

    let parts: any[] = [];

    // If an image attachment exists, pass it as a real multimodal block to Gemini
    if (attachment && attachment.dataUrl && attachment.dataUrl.startsWith("data:")) {
      const commaIndex = attachment.dataUrl.indexOf(",");
      if (commaIndex !== -1) {
        const mimeType = attachment.type || "image/png";
        const base64Data = attachment.dataUrl.substring(commaIndex + 1);
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    }

    // Append the text prompt part
    parts.push({
      text: promptWithHistory
    });

    const response = await safeGenerateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: parts
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

app.post("/api/transcribe", async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "This is a simulated transcription from Vicky's Assistant. (Please set your Gemini API key in Secrets to transcribe your actual voice!)",
        offline: true,
      });
    }

    const response = await safeGenerateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audio,
          },
        },
        "Please transcribe this audio exactly as spoken, with no additional commentary, notes, or headers."
      ],
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Transcription API Error:", error);
    res.status(500).json({ error: error.message || "Failed to transcribe audio" });
  }
});

app.post("/api/mock-interview", async (req, res) => {
  try {
    const { topic, userResponse, stage, chatHistory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "Excellent! Since the API key is not yet configured, let's do a quick offline mock question:\n\n**Question**: What is the difference between a Stack and a Queue, and what are their primary operations?\n\n*Type your answer below, and once the API key is configured I will evaluate your answers with deep AI feedback!*",
        question: "What is the difference between a Stack and a Queue, and what are their primary operations?",
        offline: true,
      });
    }

    const systemPrompt = `
You are Vicky Kumar, serving in your capacity as a Placement Department Member and Computer Science Professor.
You are conducting a professional mock interview for a student.
The topic selected by the student is: ${topic}.
Current interview stage: ${stage || "START"}.

Task:
- If stage is "START": Generate a welcoming, professional greeting, set expectations, and ask the first highly relevant, technical interview question based on the topic.
- If stage is "CONTINUE": Evaluate the student's previous answer (which is provided in userResponse). Give constructive, encouraging feedback, highlight any areas of improvement, award a mini-rating out of 10, and then ask the next sequential interview question (increasing in difficulty).
- If stage is "END": Summarize their performance, highlight their strengths, provide an overall placement-readiness score (e.g., 82%), list 3-4 specific topics they should revise based on their answers, and end with a warm academic closing.

Keep your response structured in clear JSON format with:
{
  "feedback": "Your evaluation of their last answer (empty if stage is START)",
  "score": "A number rating for the last answer out of 10 (null if stage is START or END)",
  "nextQuestion": "The next question to ask (empty if stage is END)",
  "summary": "Overall summary of performance (empty unless stage is END)",
  "text": "The full spoken narrative response to show the user"
}
`;

    let userContext = `\n\nStudent Answer: "${userResponse || ""}"`;

    const response = await safeGenerateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt + userContext,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Mock Interview API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process interview" });
  }
});

app.post("/api/resume-critique", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        analysis: "Here is a standard critique:\n\n1. **Format**: Use a clean, single-column layout.\n2. **Keywords**: Add standard technical keywords like 'MERN', 'Data Structures', 'REST APIs'.\n3. **Projects**: Include clear bullet points detailing your stack and achievements.\n\n*Configure the Gemini API key to receive a personalized, deep critique powered by Vicky's Placement Office!*",
        offline: true,
      });
    }

    const systemPrompt = `
You are Vicky Kumar, Computer Science Assistant Professor and Placement Department Member.
Analyze the following student resume text. Provide a professional, deep, structured critique and optimization plan.
Format your response in Markdown. Use headings, bold text, and lists.
Address the student directly as an encouraging mentor.
Structure your analysis into:
1. **Resume Score & Core Impression** (A letter grade or % score)
2. **Key Strengths identified**
3. **Critical Areas for Improvement** (Layout, spacing, terminology)
4. **Keyword Enrichment for Tech Placements** (Suggest standard ATS-friendly keywords they missed based on their field)
5. **Vicky's Placement Action Plan** (3 clear, prioritized steps they should take today to make this resume interview-ready)
`;

    const response = await safeGenerateContent({
      model: "gemini-3.5-flash",
      contents: `${systemPrompt}\n\nSTUDENT RESUME TEXT:\n${resumeText}`,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Resume Critique API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume" });
  }
});

app.post("/api/summarize", async (req, res) => {
  try {
    const { target } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      let fallbackText = "";
      if (target === "projects") {
        fallbackText = "Vicky Kumar has created several prominent software engineering systems, including: 1. AI-Based Job Portal, a MERN system with resume keyword matching; 2. Conversational RAG Chatbot using Gemini SDK and Pinecone; 3. Student OBE Management Portal for curriculum mappings; and 4. Facial Attendance logger. These projects highlight his full-stack capabilities, database optimization, and AI model orchestration.";
      } else if (target === "experience") {
        fallbackText = "Vicky Kumar is an Assistant Professor of Computer Science at Gulzar Group of Institutes. He delivers highly engaging BCA and B.Tech lectures on C, C++, Java, Python, and Data Structures. Over his professional tenure, he has mentored hundreds of students, guided dozens of technical projects, and integrated Outcome-Based Education (OBE) metrics to align student learning with global standards.";
      } else if (target === "placement") {
        fallbackText = "As a key member of the Placement Department at Gulzar Group of Institutes, Vicky Kumar actively bridges the gap between academic learning and industry readiness. He conducts technical bootcamp sessions, designs resume feedback pipelines, hosts simulated mock interviews, and guides students through high-pressure placement recruitment rounds.";
      } else {
        fallbackText = "Professor Vicky Kumar is a dedicated academician, computer science specialist, and placement department coordinator at Gulzar Group of Institutes. With a Master of Computer Applications (MCA), he specializes in full-stack engineering, core algorithms, and AI/ML paradigms. He is highly passionate about student career mentoring, mock interview design, and deploying smart, interactive educational sandboxes to maximize career readiness.";
      }
      return res.json({ text: fallbackText, offline: true });
    }

    let prompt = "";
    if (target === "projects") {
      prompt = `
You are an expert technical portfolio analyzer.
Analyze and deeply summarize Vicky Kumar's engineering projects based on the following information:
Projects:
1. AI-Based Job Portal (MERN Stack): Candidate-job recommendation matching algorithm, recruiter dashboard, job search, resume keyword scoring.
2. Conversational AI Chatbot: Retrieval-augmented generation (RAG) using Google Gen AI and Pinecone to query local syllabus and academic guidelines.
3. Student Management & OBE Portal: Outcome-Based Education tracking, course outcomes mapping, student assessments.
4. Deep-Learning Face Attendance: Facial recognition using OpenCV, Python, and SQLite for automated classroom logging.

Task:
Generate a highly professional, cohesive, and deeply insightful summary of Vicky's engineering project portfolio (approx 120-150 words).
Structure the summary to emphasize his full-stack expertise, architectural choices, and modern AI/ML integration.
Keep the style academic, clean, and impressive.
Do not output any introductory or conversational text, output only the final summary directly.
`;
    } else if (target === "experience") {
      prompt = `
You are an expert academic recruiter.
Analyze and deeply summarize Vicky Kumar's academic and teaching achievements:
Details:
- Role: Assistant Professor in Computer Science at Gulzar Group of Institutes.
- Courses: C, C++, Java, Python, and Data Structures.
- Mentorship: Guided 50+ technical engineering projects, 700+ student careers.
- Educational philosophy: Outcome-Based Education (OBE), curriculum alignment, and hands-on laboratory instruction.

Task:
Generate a highly professional, cohesive, and deeply insightful academic experience summary (approx 120-150 words).
Focus on his teaching methodologies, course design, and the impact of his mentorship on BCA and B.Tech undergraduate students.
Keep the style academic, clean, and impressive.
Do not output any introductory or conversational text, output only the final summary directly.
`;
    } else if (target === "placement") {
      prompt = `
You are an industry placement consultant.
Analyze and deeply summarize Vicky Kumar's career coaching and placement operations:
Details:
- Role: Placement Department Member at Gulzar Group of Institutes.
- Activities: Coordinates recruitment drives, technical bootcamps, and mock interviews.
- Specialties: Resume mentoring, aptitude guidance, technical mock interviews, and industry-academia synergy.

Task:
Generate a highly professional, cohesive, and deeply insightful career placement summary (approx 120-150 words).
Emphasize his unique contribution in organizing mock interviews, preparing candidates for rigorous corporate tech drives, and elevating student employability.
Keep the style crisp, professional, and career-oriented.
Do not output any introductory or conversational text, output only the final summary directly.
`;
    } else {
      prompt = `
You are a senior professional synthesizer.
Synthesize and deeply summarize Vicky Kumar's entire professional profile as a Computer Science Professor and Placement Department Member:
Details:
- Assistant Professor of CS & Placement Department Coordinator at Gulzar Group of Institutes.
- Expertise: MERN Full-stack development, C/C++, Java, Python, Data Structures, and Generative AI SDKs.
- MCA graduate from Teerthanker Mahaveer University.
- Developed AI Job Portal, RAG Syllabus Chatbot, OBE assessment models.
- Mentored 700+ students, 50+ projects, and published 4 research papers.

Task:
Generate an outstanding, deeply synthesized, professional summary of Vicky Kumar's entire multi-faceted career (approx 150-180 words).
Highlight his unique dual role as an academic mentor and placement cell member, showcasing how his technical MERN-stack and AI skills directly benefit student career advancement.
Keep the style highly authoritative, professional, and sophisticated.
Do not output any introductory or conversational text, output only the final summary directly.
`;
    }

    const response = await safeGenerateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Summarizer API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI summary" });
  }
});

// Simple in-memory rate limiter tracker (stores IP/email -> last timestamp)
const submissionRateLimits = new Map<string, number>();

// GET /api/contact/messages - retrieves submissions (masked for privacy unless matching email)
app.get("/api/contact/messages", (req, res) => {
  try {
    const { email } = req.query;
    const submissionPath = path.join(process.cwd(), "contact_submissions.json");
    let submissions: any[] = [];
    if (fs.existsSync(submissionPath)) {
      try {
        submissions = JSON.parse(fs.readFileSync(submissionPath, "utf-8"));
      } catch (err) {
        submissions = [];
      }
    }

    // Sort submissions by timestamp descending (newest first)
    submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const result = submissions.map((sub: any) => {
      const isOwner = email && sub.email && sub.email.toLowerCase() === (email as string).trim().toLowerCase();
      
      // Mask name and email if it doesn't match the query email for privacy
      if (isOwner) {
        return {
          id: sub.id,
          name: sub.name,
          email: sub.email,
          subject: sub.subject,
          message: sub.message,
          timestamp: sub.timestamp,
          autoReply: sub.autoReply || "Message queued. Generating custom reply shortly...",
          isYourMessage: true
        };
      } else {
        // Mask helper
        const maskString = (str: string) => {
          if (!str) return "***";
          if (str.length <= 2) return str + "***";
          return str.substring(0, 2) + "***" + str.substring(str.length - 1);
        };
        const maskEmail = (em: string) => {
          if (!em || !em.includes("@")) return "***@***.***";
          const [local, domain] = em.split("@");
          return maskString(local) + "@" + maskString(domain);
        };

        return {
          id: sub.id,
          name: maskString(sub.name),
          email: maskEmail(sub.email),
          subject: sub.subject,
          message: sub.message.length > 80 ? sub.message.substring(0, 80) + "..." : sub.message,
          timestamp: sub.timestamp,
          autoReply: sub.autoReply ? "Delivered & AI Reply Sent" : "Delivered",
          isYourMessage: false
        };
      }
    });

    res.json(result);
  } catch (error: any) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ error: "Failed to load live messages board." });
  }
});

// Helper function to send real emails to Vicky Kumar and the inquirer via nodemailer SMTP
async function sendRealEmails(newInquiry: any) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.SMTP_TO_EMAIL || "vickykr802302@gmail.com";
  const fromName = process.env.SMTP_FROM_NAME || "Vicky Kumar Portfolio";

  if (!user || !pass) {
    console.warn("⚠️ SMTP credentials not fully configured (SMTP_USER/SMTP_PASS are blank). Real email dispatch skipped. Please set them in Settings.");
    return {
      sentToVicky: false,
      sentToUser: false,
      reason: "SMTP_USER or SMTP_PASS environment variables are not set."
    };
  }

  try {
    const secure = port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false // avoids SSL certificate issues with some local networks
      }
    });

    // 1. Send Notification Email to Vicky Kumar
    const mailToVicky = {
      from: `"${fromName}" <${user}>`,
      to: toEmail,
      replyTo: newInquiry.email,
      subject: `[Portfolio Inquiry] ${newInquiry.subject}`,
      text: `Hi Vicky Kumar,

You have received a new contact submission from your portfolio:

Name: ${newInquiry.name}
Email: ${newInquiry.email}
Phone: ${newInquiry.phone || "Not provided"}
Subject: ${newInquiry.subject}
Date: ${newInquiry.timestamp}

Message:
--------------------------------------------------
${newInquiry.message}
--------------------------------------------------

AI Auto-reply sent to user:
--------------------------------------------------
${newInquiry.autoReply}
--------------------------------------------------`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Portfolio Inquiry</h2>
          <p>You have received a new contact submission from your academic/research portfolio.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f9fafb;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Sender Name</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${newInquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Sender Email</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="mailto:${newInquiry.email}">${newInquiry.email}</a></td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${newInquiry.phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Subject</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: 500;">${newInquiry.subject}</td>
            </tr>
          </table>

          <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Message Content</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #374151; line-height: 1.5; margin-bottom: 20px;">${newInquiry.message}</div>

          <h3 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">AI Assistant Auto-Reply</h3>
          <p style="font-size: 13px; color: #6b7280; font-style: italic;">The following response was generated by your AI system & sent to ${newInquiry.name} automatically:</p>
          <div style="background-color: #eef2ff; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 0 6px 6px 0; white-space: pre-wrap; font-size: 14px; color: #1e1b4b; line-height: 1.5;">${newInquiry.autoReply}</div>

          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 10px; text-align: center;">
            Sent from Vicky Kumar Portfolio Platform • Date: ${new Date().toLocaleString("en-IN")}
          </p>
        </div>
      `
    };

    const infoVicky = await transporter.sendMail(mailToVicky);
    console.log(`✅ Success: Message forwarded to Vicky Kumar's email at ${toEmail}. MessageID: ${infoVicky.messageId}`);

    // 2. Send Auto-Reply copy directly to the User's Email Address as well
    let sentToUser = false;
    if (newInquiry.email) {
      try {
        const mailToUser = {
          from: `"${fromName}" <${user}>`,
          to: newInquiry.email,
          subject: `Re: ${newInquiry.subject} - Prof. Vicky Kumar`,
          text: `${newInquiry.autoReply}

---
Vicky Kumar
Assistant Professor & Coordinator, GGI Placement Cell
Portfolio: ${process.env.APP_URL || "https://vicky-kumar-portfolio.run.app"}
Note: This is an automated reply from Vicky Kumar's AI assistant. He will follow up shortly if needed.`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; line-height: 1.6;">
              <div style="white-space: pre-wrap; font-size: 14.5px; color: #1f2937;">${newInquiry.autoReply}</div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
              
              <div style="font-size: 12.5px; color: #4b5563;">
                <strong style="color: #111827;">Prof. Vicky Kumar</strong><br />
                Assistant Professor, Computer Science & Engineering<br />
                Placement Coordinator, Gulzar Group of Institutes (GGI)<br />
                <a href="${process.env.APP_URL || "https://vicky-kumar-portfolio.run.app"}" style="color: #4f46e5; text-decoration: none;">View Portfolio Website</a>
              </div>
              
              <p style="font-size: 10px; color: #9ca3af; margin-top: 30px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
                Disclaimer: This message was generated automatically by Prof. Vicky Kumar's Portfolio AI Agent based on your contact form submission. Vicky Kumar reviews all logs daily and will reply manually as soon as possible.
              </p>
            </div>
          `
        };

        const infoUser = await transporter.sendMail(mailToUser);
        console.log(`✅ Success: Auto-reply copy delivered directly to inquirer's email: ${newInquiry.email}. MessageID: ${infoUser.messageId}`);
        sentToUser = true;
      } catch (err) {
        console.error(`❌ Failed to send auto-reply to inquirer (${newInquiry.email}):`, err);
      }
    }

    return {
      sentToVicky: true,
      sentToUser,
      messageId: infoVicky.messageId
    };
  } catch (error: any) {
    console.error("❌ Nodemailer failed to send email:", error);
    return {
      sentToVicky: false,
      sentToUser: false,
      error: error.message || "Connection failed during sendMail transmission"
    };
  }
}

// POST /api/contact - handles validated contact me inquiries and stores them
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message, honeypot } = req.body;

    // 1. Spam protection via Honeypot
    if (honeypot && honeypot.trim() !== "") {
      console.warn(`Spam bot detected via honeypot field. Suppressing request.`);
      return res.status(400).json({ error: "Spam submission rejected." });
    }

    // 2. Server-side validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Full Name must be at least 2 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ error: "Message must be at least 10 characters long." });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: "Message must not exceed 2000 characters." });
    }

    // 3. Rate Limiting (per IP or email, 15s window)
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    const rateLimitKey = `${clientIp}_${email}`;
    const lastSubmission = submissionRateLimits.get(rateLimitKey);
    const now = Date.now();

    if (lastSubmission && now - lastSubmission < 15000) {
      return res.status(429).json({ error: "Too many submissions. Please wait 15 seconds before trying again." });
    }
    submissionRateLimits.set(rateLimitKey, now);

    // 4. Generate AI Auto-Reply from Professor Vicky Kumar
    let autoReply = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const replyPrompt = `
${VICKY_CONTEXT}

You received a message from a student or career professional on your portfolio contact form.
Sender Name: ${name}
Sender Email: ${email}
Subject: ${subject}
Message: ${message}

Task:
Write a warm, concise, professional reply (3-5 sentences) as Professor Vicky Kumar. Reference their specific inquiry subject and details to guide them. If it is about coding or placements, offer deep encouragement. Speak directly to them.
`;
        const aiResponse = await safeGenerateContent({
          model: "gemini-3.5-flash",
          contents: replyPrompt,
        });
        autoReply = aiResponse.text || "";
      } catch (err) {
        console.error("AI Auto-reply generation failed:", err);
      }
    }

    if (!autoReply) {
      const subjectLower = (subject || "").toLowerCase();
      if (subjectLower.includes("placement") || subjectLower.includes("resume") || subjectLower.includes("career") || subjectLower.includes("job")) {
        autoReply = `Hello ${name},\n\nThank you for reaching out regarding career preparation and placements. As an Assistant Professor and member of GGI's Placement Cell, I am deeply committed to guiding students. I have received your message and will review your career goals. Let's schedule a session to review your resume format or run a mock interview. Feel free to use the interactive Placement Office simulator in the meantime!\n\nBest regards,\nProf. Vicky Kumar`;
      } else if (subjectLower.includes("project") || subjectLower.includes("mern") || subjectLower.includes("research") || subjectLower.includes("paper")) {
        autoReply = `Hello ${name},\n\nThank you for reaching out about collaboration and engineering projects. I am highly interested in full-stack technologies (MERN stack), Machine Learning applications, and Outcome-Based Education mapping. I have logged your message and will review your proposal details. I look forward to exploring how we can build or publish this research together.\n\nWarm regards,\nProf. Vicky Kumar`;
      } else {
        autoReply = `Hello ${name},\n\nThank you for your message. I have received your inquiry regarding "${subject}" and appreciate you getting in touch. I review my portfolio submission log daily and will reply to your email (${email}) with a detailed response within 24 hours. Let's connect soon!\n\nBest wishes,\nProf. Vicky Kumar`;
      }
    }

    // 5. Persistence - Store message in contact_submissions.json file
    const submissionPath = path.join(process.cwd(), "contact_submissions.json");
    let currentSubmissions: any[] = [];
    if (fs.existsSync(submissionPath)) {
      try {
        currentSubmissions = JSON.parse(fs.readFileSync(submissionPath, "utf-8"));
      } catch (err) {
        currentSubmissions = [];
      }
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      subject: subject ? subject.trim() : "Direct Contact Portfolio Inquiry",
      message: message.trim(),
      autoReply: autoReply.trim(),
      timestamp: new Date().toISOString(),
      clientIp
    };

    currentSubmissions.push(newInquiry);
    fs.writeFileSync(submissionPath, JSON.stringify(currentSubmissions, null, 2), "utf-8");

    // 6. Real Email Dispatch via SMTP helper
    const emailDispatch = await sendRealEmails(newInquiry);

    return res.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. Vicky Kumar's AI assistant has generated an auto-reply.",
      autoReply: newInquiry.autoReply,
      inquiryId: newInquiry.id,
      emailDispatch: {
        sentToVicky: emailDispatch.sentToVicky,
        sentToUser: emailDispatch.sentToUser,
        error: emailDispatch.error,
        reason: emailDispatch.reason
      }
    });
  } catch (error: any) {
    console.error("Contact Form Submission API Error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred while processing your message." });
  }
});

// POST /api/newsletter - handles validated newsletter submissions
app.get("/api/alumni/feedback", (req, res) => {
  try {
    const feedbackPath = path.join(process.cwd(), "alumni_feedback.json");
    let feedbackList: any[] = [];
    
    const defaultSeed = [
      {
        id: "feed_1",
        name: "Rahul Sharma",
        batch: "Class of 2025",
        degree: "MCA",
        company: "TCS (Tata Consultancy Services)",
        position: "Systems Engineer",
        rating: 5,
        comment: "Professor Vicky's MERN stack curriculum and intensive mock interview drills were pivotal in my preparation. His deep focus on hands-on coding and database schema design gave me the confidence to ace the technical interview rounds on campus. He is an outstanding academic and career mentor!",
        timestamp: "2026-06-15T10:30:00.000Z",
        verified: true
      },
      {
        id: "feed_2",
        name: "Priya Patel",
        batch: "Class of 2024",
        degree: "BCA",
        company: "Wipro Technologies",
        position: "Scholar Trainee (Wipro WILP)",
        rating: 5,
        comment: "As a member of GGI Ludhiana's Placement Department, Vicky sir spent personal hours reviewing my resume structure and refining my knowledge of core Data Structures (especially stacks, queues, and linked lists). His teaching methodology is very practical and highly outcome-oriented.",
        timestamp: "2026-05-20T14:45:00.000Z",
        verified: true
      },
      {
        id: "feed_3",
        name: "Amit Verma",
        batch: "Class of 2025",
        degree: "B.Tech CSE",
        company: "Capgemini",
        position: "Software Engineer",
        rating: 4,
        comment: "Under Professor Vicky Kumar's guidance, I learned Python and advanced OOP. His encouragement to complete certifications from IIT Bombay and Intellipaat helped my profile stand out to recruiters. Highly recommend his placement workshops to any aspiring developer!",
        timestamp: "2026-07-02T09:15:00.000Z",
        verified: true
      },
      {
        id: "feed_4",
        name: "Gurpreet Singh",
        batch: "Class of 2025",
        degree: "MCA",
        company: "Infosys",
        position: "Systems Associate",
        rating: 5,
        comment: "Professor Vicky helped me optimize my portfolio projects and polished my Java OOP fundamentals. He organized series of mock interview bootcamps that perfectly mirrored the actual recruitment process. He is extremely supportive and always ready to clarify doubts.",
        timestamp: "2026-07-10T16:20:00.000Z",
        verified: true
      }
    ];

    if (fs.existsSync(feedbackPath)) {
      try {
        feedbackList = JSON.parse(fs.readFileSync(feedbackPath, "utf-8"));
        if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
          feedbackList = defaultSeed;
          fs.writeFileSync(feedbackPath, JSON.stringify(feedbackList, null, 2), "utf-8");
        }
      } catch (err) {
        feedbackList = defaultSeed;
      }
    } else {
      feedbackList = defaultSeed;
      fs.writeFileSync(feedbackPath, JSON.stringify(feedbackList, null, 2), "utf-8");
    }

    // Sort by timestamp descending (newest first)
    feedbackList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(feedbackList);
  } catch (error: any) {
    console.error("Fetch alumni feedback error:", error);
    res.status(500).json({ error: "Failed to load alumni feedback." });
  }
});

app.post("/api/alumni/feedback", (req, res) => {
  try {
    const { name, batch, degree, company, position, rating, comment } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ error: "Testimonial content must be at least 10 characters." });
    }
    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
    }

    const feedbackPath = path.join(process.cwd(), "alumni_feedback.json");
    let feedbackList: any[] = [];
    if (fs.existsSync(feedbackPath)) {
      try {
        feedbackList = JSON.parse(fs.readFileSync(feedbackPath, "utf-8"));
      } catch (err) {
        feedbackList = [];
      }
    }

    const newFeedback = {
      id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      batch: batch ? batch.trim() : "Class of 2026",
      degree: degree ? degree.trim() : "BCA/MCA",
      company: company ? company.trim() : "Tech Company",
      position: position ? position.trim() : "Software Engineer",
      rating: r,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      verified: false // User submissions default to false or ready-for-review
    };

    feedbackList.push(newFeedback);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackList, null, 2), "utf-8");

    res.json({
      success: true,
      message: "Alumni feedback submitted successfully! Thank you for sharing your experience.",
      feedback: newFeedback
    });
  } catch (error: any) {
    console.error("Add alumni feedback error:", error);
    res.status(500).json({ error: "Failed to save alumni feedback." });
  }
});

// POST /api/newsletter - handles validated newsletter submissions
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email, honeypot } = req.body;

    if (honeypot && honeypot.trim() !== "") {
      return res.status(400).json({ error: "Spam submission rejected." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    const rateLimitKey = `newsletter_${clientIp}_${email}`;
    const lastSubmission = submissionRateLimits.get(rateLimitKey);
    const now = Date.now();

    if (lastSubmission && now - lastSubmission < 15000) {
      return res.status(429).json({ error: "Please wait 15 seconds before subscribing again." });
    }
    submissionRateLimits.set(rateLimitKey, now);

    const subscriptionPath = path.join(process.cwd(), "newsletter_subscriptions.json");
    let subscriptions: any[] = [];
    if (fs.existsSync(subscriptionPath)) {
      try {
        subscriptions = JSON.parse(fs.readFileSync(subscriptionPath, "utf-8"));
      } catch (err) {
        subscriptions = [];
      }
    }

    // Prevent duplicate entries
    if (subscriptions.some((sub: any) => sub.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.json({
        success: true,
        message: "You are already subscribed to Vicky Kumar's newsletter updates! Thank you.",
        duplicate: true
      });
    }

    const newSub = {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      clientIp
    };

    subscriptions.push(newSub);
    fs.writeFileSync(subscriptionPath, JSON.stringify(subscriptions, null, 2), "utf-8");

    console.log(`📰 NEWSLETTER SUBSCRIPTION COMPLETED: ${newSub.email}`);

    return res.json({
      success: true,
      message: "Subscribed! You will receive portfolio updates, publication releases, and lecture notices directly.",
    });
  } catch (error: any) {
    console.error("Newsletter API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to process subscription." });
  }
});

// Endpoint to permanently save uploaded images to the server's filesystem
app.post("/api/upload-image", (req, res) => {
  try {
    const { imageType, dataUrl } = req.body;
    if (!imageType || !dataUrl) {
      return res.status(400).json({ error: "imageType and dataUrl are required" });
    }

    if (!["hero", "campus", "casual"].includes(imageType)) {
      return res.status(400).json({ error: "Invalid imageType. Must be one of: hero, campus, casual" });
    }

    // Extract base64 content
    const base64Marker = ";base64,";
    const markerIndex = dataUrl.indexOf(base64Marker);
    if (markerIndex === -1) {
      return res.status(400).json({ error: "Invalid base64 dataUrl" });
    }
    const base64Data = dataUrl.substring(markerIndex + base64Marker.length);
    const buffer = Buffer.from(base64Data, "base64");

    // Map imageType to filename
    const filenameMap: Record<string, string> = {
      hero: "hero.png",
      campus: "campus.jfif",
      casual: "casual.jfif"
    };
    const filename = filenameMap[imageType];

    // Write to /public/images/
    const publicPath = path.join(process.cwd(), "public", "images", filename);
    // Ensure directory exists
    const publicDir = path.dirname(publicPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(publicPath, buffer);
    console.log(`Saved ${imageType} image to ${publicPath}`);

    // Also write to /dist/images/ if it exists (for live updates in production)
    const distPath = path.join(process.cwd(), "dist", "images", filename);
    const distDir = path.dirname(distPath);
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(distPath, buffer);
      console.log(`Saved ${imageType} image to ${distPath}`);
    }

    return res.json({ success: true, message: `Successfully saved ${imageType} permanently.` });
  } catch (error: any) {
    console.error("Upload Image API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to save image permanently." });
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", async (clientWs) => {
    console.log("WebSocket client connected to Live API bridge");
    
    if (!process.env.GEMINI_API_KEY) {
      clientWs.send(JSON.stringify({ 
        error: "Gemini API key is not configured. Please set your GEMINI_API_KEY in Secrets to use real-time Live voice features." 
      }));
      clientWs.close();
      return;
    }

    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: VICKY_CONTEXT + "\n\nCRITICAL: You are speaking on a real-time low-latency voice call as Vicky Kumar. Keep your verbal replies short, structured, and very conversational. Never read massive blocks of text. Limit answers to 1-3 sentences maximum.",
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            
            // Forward text transcription if Vicky is speaking
            const textPart = message.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
            if (textPart) {
              clientWs.send(JSON.stringify({ text: textPart }));
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            console.log("Gemini Live session closed");
            clientWs.close();
          },
          onerror: (err) => {
            console.error("Gemini Live session error:", err);
            clientWs.send(JSON.stringify({ error: "Gemini Live API encountered an error" }));
          }
        },
      });

      clientWs.on("message", (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (err) {
          console.error("Failed to process incoming WebSocket client message:", err);
        }
      });

      clientWs.on("close", () => {
        console.log("WebSocket client closed connection");
        try {
          session.close();
        } catch (err) {
          // session might already be closed
        }
      });

    } catch (err: any) {
      console.error("Failed to connect to Gemini Live session:", err);
      clientWs.send(JSON.stringify({ error: err.message || "Failed to initiate Gemini Live voice session" }));
      clientWs.close();
    }
  });

  server.on("upgrade", (request, socket, head) => {
    try {
      const urlString = request.url || "";
      const pathname = urlString.split("?")[0];
      if (pathname === "/api/live") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    } catch (e) {
      console.error("Upgrade handling failed:", e);
    }
  });
}

startServer();
