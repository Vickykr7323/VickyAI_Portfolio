import React, { useState, useRef, useEffect } from "react";
import { ThemeId, ChatMessage } from "@/types";
import { 
  MessageSquare, X, Send, Loader2, Sparkles, User, RefreshCw, Cpu, 
  Paperclip, Image as ImageIcon, Smile, Search, Copy, Check, Trash2, 
  ChevronDown, Minimize2, Maximize2, AlertCircle, FileText,
  Volume2, VolumeX, Mic, MicOff, BookOpen, Database, Terminal, Globe, Layers, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playAudioCue } from "@/utils/audio";
import TypewriterText from "./TypewriterText";

const CAREER_TOPICS = [
  {
    id: "dsa",
    name: "Data Structures & DSA",
    questions: [
      {
        id: "dsa_array_list",
        q: "How do you select between an Array and a Linked List?",
        tip: "Highlight memory locality (cache-friendly arrays) vs constant-time dynamic insertions (linked lists). Mention O(1) random access vs O(N) sequential lookup."
      },
      {
        id: "dsa_bfs_dfs",
        q: "Explain the difference between BFS and DFS traversal.",
        tip: "Contrast Queue-based Level-order (BFS) vs Recursion/Stack-based Depth-first (DFS). Mention applications: shortest path (BFS) vs cycle detection (DFS)."
      },
      {
        id: "dsa_hash_collision",
        q: "How does a hash map resolve collisions under the hood?",
        tip: "Detail Chaining (linked lists/trees at indexes) vs Open Addressing (Linear Probing, Double Hashing). Explain how average O(1) lookup can degrade to O(N)."
      }
    ]
  },
  {
    id: "oop",
    name: "Object-Oriented (OOP)",
    questions: [
      {
        id: "oop_pillars",
        q: "What are the four pillars of OOP and how are they used?",
        tip: "Define and give practical analogies of Encapsulation, Abstraction, Inheritance, and Polymorphism. Be ready to explain dynamic method dispatch."
      },
      {
        id: "oop_overloading",
        q: "Explain the difference between method overloading and method overriding.",
        tip: "Differentiates compile-time vs runtime binding. Overloading uses same name but different signatures. Overriding replaces parent class behavior."
      },
      {
        id: "oop_abstract_interface",
        q: "What is an abstract class vs. an interface?",
        tip: "Abstract classes represent a core identity ('is-a' template, can hold state) while Interfaces represent a contractual capability ('can-do' contract)."
      }
    ]
  },
  {
    id: "dbms",
    name: "DBMS & Databases",
    questions: [
      {
        id: "dbms_acid",
        q: "Explain ACID properties in DBMS with real-world analogies.",
        tip: "Explain Atomicity (all-or-nothing), Consistency (state rules), Isolation (no concurrent collision), and Durability (disk persist) with banking transfers."
      },
      {
        id: "dbms_sql_nosql",
        q: "What is the difference between SQL and NoSQL databases?",
        tip: "Contrast relational SQL schemas (joins, vertical scaling, MySQL) vs flexible document NoSQL structures (denormalization, horizontal scaling, MongoDB)."
      },
      {
        id: "dbms_indexing",
        q: "How do database indexes improve query performance, and what are their costs?",
        tip: "Describe B-Trees searching in O(log N) instead of O(N) scans. Highlight drawbacks: extra disk memory consumption and overhead during writes."
      }
    ]
  },
  {
    id: "web",
    name: "MERN Stack Web",
    questions: [
      {
        id: "web_vdom",
        q: "Explain how the Virtual DOM works in React.",
        tip: "Detail how a lightweight UI blueprint tree is diffed (Reconciliation) with the old tree, and how updates are batched to render to the real DOM efficiently."
      },
      {
        id: "web_middleware",
        q: "What is Middleware in Express, and how do you use it?",
        tip: "Middleware has access to req, res, and next(). Describe custom authorization guards, request logging, or input validators in the server execution flow."
      },
      {
        id: "web_jwt",
        q: "How does JWT-based authentication secure APIs?",
        tip: "Discuss stateless token exchange: Login -> Server signs token -> Client stores (HttpOnly Cookie) -> Client sends with header -> Server decodes signature."
      }
    ]
  },
  {
    id: "languages",
    name: "Core Languages",
    questions: [
      {
        id: "lang_java_memory",
        q: "Explain Memory Management / Garbage Collection in Java.",
        tip: "Differentiate Heap (objects, GC managed) vs Stack (primitive frames). Outline Mark-and-Sweep algorithms and Young/Old generation heap divisions."
      },
      {
        id: "lang_cpp_pointers",
        q: "What are pointers in C++ and how do they differ from references?",
        tip: "Pointers are variables storing addresses (can be null/reassigned), while references are continuous aliases (cannot be null, fixed binding)."
      },
      {
        id: "lang_python_list_tuple",
        q: "What is the difference between list and tuple in Python?",
        tip: "Lists are mutable and slower (dynamic over-allocation of size), whereas tuples are immutable, hashed, faster, and memory-optimized."
      }
    ]
  }
];

function getLocalAnswerForQuestion(questionId: string): string {
  switch (questionId) {
    case "dsa_array_list":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "dsa_bfs_dfs":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "dsa_hash_collision":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "oop_pillars":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "oop_overloading":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "oop_abstract_interface":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "dbms_acid":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "dbms_sql_nosql":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "dbms_indexing":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** Database Management Systems (DBMS)
**Question:** How do database indexes improve query performance, and what are their costs?

---

#### 💡 Core Answer Blueprint:
*   **How Indexes Work:**
    *   Without an index, the database must perform a **Full Table Scan (Sequential Search)** which is **O(N)**.
    *   An index creates a sorted, secondary pointer structure (usually using **B-Trees / B+ Trees** or Hash indexes).
    *   The database can binary-search the index in **O(log N)** time and immediately jump to the physical disk location of the row.
*   **Costs of Indexing:**
    *   **Write Overhead (Slows down writes):** Every time you perform an \`INSERT\`, \`UPDATE\`, or \`DELETE\`, the database must also modify and re-balance the index structure.
    *   **Storage Overhead:** Indexes take up extra disk space. Large tables can have index files that are gigabytes in size.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Index Everything:** Never say 'I index all columns'. Explain that indexing unused columns slows down system throughput for no benefit.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"A killer interview point is mentioning 'Composite Indexes' (indexing multiple columns) and the 'Leftmost Prefix Rule'. Explain that if you have an index on (lastName, firstName), a query filtering by firstName alone cannot use the index. This reveals deep query optimization skills."*`;

    case "web_vdom":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
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

    case "web_middleware":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** MERN Stack Web Development
**Question:** What is Middleware in Express, and how do you use it?

---

#### 💡 Core Answer Blueprint:
*   **Concept:** Middleware is a function that sits between the incoming HTTP request and the final API route handler. It has access to the Request object (\`req\`), the Response object (\`res\`), and the \`next\` function in the request-response cycle.
*   **Parameters:** \`function(req, res, next) { ... }\`
*   **Roles of Middleware:**
    1.  Execute code.
    2.  Modify the request and response objects (e.g., adding user info from a JWT token: \`req.user = decodedToken\`).
    3.  End the request-response cycle (e.g., sending an error response if authentication fails).
    4.  Call the \`next()\` middleware function to pass control forward.
*   **Common Use Cases:** Body parsing (\`express.json()\`), CORS setup, request logging, authentication guards, and error routing.

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Forgetting next():** If your middleware does not end the request-response cycle, you **must** call \`next()\`. If you forget, the request will hang indefinitely and time out.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"Explain the two types of middleware: Global level (\`app.use(myMiddleware)\`) and Route-specific level (\`app.get('/api/admin', verifyAdmin, handler)\`). Showcasing how you secure sensitive routes with an authentication middleware is a major point-getter in full-stack assessments."*`;

    case "web_jwt":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** MERN Stack Web Development
**Question:** How does JWT-based authentication secure APIs?

---

#### 💡 Core Answer Blueprint:
*   **JSON Web Token (JWT):** A stateless token format composed of three base64-encoded parts:
    1.  **Header:** Specifies the signing algorithm (e.g., HS256).
    2.  **Payload:** Contains claims (user ID, username, roles, expiration time).
    3.  **Signature:** Created by hashing the Header + Payload with a secret key held only by the server.
*   **Stateless Flow:**
    *   User logs in -> Server verifies credentials and signs a JWT -> Client stores token (best stored in an **HttpOnly, Secure Cookie** to prevent XSS attacks) -> Client sends token in the \`Authorization: Bearer <token>\` header for subsequent API calls -> Server verifies signature using its secret key. If valid, the request is authorized. No database lookup is needed for the session!

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Storing Sensitive Info in Payload:** Remember that base64 is easily decoded by anyone! Never store passwords, PINs, or confidential database credentials inside the JWT payload.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"A favorite advanced interview question is 'How do you revoke a JWT if it is stateless?'. Impress them by explaining: 'You can use a short token expiry (e.g., 15 minutes) paired with a Refresh Token stored in a database. If a user logs out, the Refresh Token is deleted, preventing them from obtaining a new Access Token.' This is high-quality enterprise authentication."*`;

    case "lang_java_memory":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** Core Programming Languages
**Question:** Explain Memory Management / Garbage Collection in Java.

---

#### 💡 Core Answer Blueprint:
*   **JVM Memory Areas:**
    *   **Stack Memory:** Stores local primitive variables and references to heap objects. Memory is allocated per thread and is cleared automatically when methods exit (LIFO).
    *   **Heap Memory:** Stores all objects and arrays. It is shared across all threads and has a longer lifespan.
*   **Garbage Collection (GC):**
    *   Java handles heap cleanup automatically via the Garbage Collector daemon.
    *   It periodically identifies objects that are **unreachable** (have no active references in Stack memory).
    *   **Mark-and-Sweep Algorithm:** The GC 'marks' reachable objects and 'sweeps' away unmarked, dead objects to reclaim heap space.
*   **Generational Heap Space:**
    *   **Young Generation (Eden + Survivor spaces):** Where new objects are created. Most objects die young (Minor GC runs here).
    *   **Old Generation (Tenured space):** Where long-lived objects are moved if they survive multiple Young Generation collection cycles (Major GC runs here).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **System.gc() guarantees collection:** Explicitly calling \`System.gc()\` is only a *request* to the JVM; there is absolutely no guarantee that the garbage collector will run immediately.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"In Java interview rounds, explain 'Memory Leaks'. Yes, Java has GC, but memory leaks still happen when objects that are no longer needed are still referenced in static fields, open streams, or unclosed database connections. Discussing 'Try-with-resources' or 'WeakReferences' will set you apart."*`;

    case "lang_cpp_pointers":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** Core Programming Languages
**Question:** What are pointers in C++ and how do they differ from references?

---

#### 💡 Core Answer Blueprint:
*   **Pointer (\`Type*\`):**
    *   A variable that stores the **physical memory address** of another variable.
    *   Can be uninitialized or initialized to \`nullptr\`.
    *   Can be reassigned to point to different variables during its lifecycle.
    *   Supports arithmetic (e.g., \`ptr + 1\` to traverse contiguous memory arrays).
    *   Requires dereferencing (\`*ptr\`) to access/modify the underlying value.
*   **Reference (\`Type&\`):**
    *   An **alias** (another name) for an existing variable.
    *   Must be initialized immediately upon declaration.
    *   Cannot be null (must refer to a valid object).
    *   Cannot be reassigned to reference a different variable after initialization.
    *   Accessed directly like a normal variable (no dereferencing syntax needed).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Dangling Pointers:** When a pointer points to memory that has been deallocated. It can cause critical segmentation faults.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"When writing C++ code, emphasize safety: 'Pointers are powerful for system-level programming and building custom data structures, but References are far safer for passing large objects as function parameters (\`const string& name\`) to avoid copy overhead without risking null-pointer dereferences.' This is clean, safe engineering practice."*`;

    case "lang_python_list_tuple":
      return `### 🎓 Prof. Vicky Kumar's Interview Study Card
**Topic:** Core Programming Languages
**Question:** What is the difference between list and tuple in Python?

---

#### 💡 Core Answer Blueprint:
*   **List (\`[]\`):**
    *   **Mutability:** Mutable (elements can be added, removed, or changed in-place).
    *   **Syntax:** Declared using square brackets, e.g., \`my_list = [1, 2, 3]\`.
    *   **Memory allocation:** Slower and consumes more memory because Python over-allocates extra memory slots to accommodate dynamic appending.
    *   **Hashability:** Cannot be used as keys in dictionaries because they are mutable and unhashable.
*   **Tuple (\`()\`):**
    *   **Mutability:** Immutable (once created, elements cannot be modified, added, or removed).
    *   **Syntax:** Declared using parentheses, e.g., \`my_tuple = (1, 2, 3)\`.
    *   **Memory allocation:** Faster, highly memory-efficient, and write-protected because size and items are fixed at creation time.
    *   **Hashability:** Can be used as dictionary keys (if all nested items inside are also immutable).

---

#### ⚠️ Key Pitfalls to Avoid:
*   **Tuple Modification:** Attempting to modify a tuple will raise a \`TypeError: 'tuple' object does not support item assignment\`. However, note that if a tuple contains a mutable object (like a list), that list's elements *can* be changed.

---

#### 🎓 Placement Coordinator's Pro-Tip:
*"A smart optimization answer: 'Use Lists for collections of homogenous data that changes during execution. Use Tuples for heterogenous, read-only record datasets (like database rows, coordinates, or configuration constants) to guarantee data integrity and maximize memory performance.' This highlights Python performance awareness."*`;

    default:
      return "Select an interview question above to display its corresponding technical study blueprint!";
  }
}

interface ChatbotWidgetProps {
  currentTheme: ThemeId;
}

export default function ChatbotWidget({ currentTheme }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [completedMessageIds, setCompletedMessageIds] = useState<Record<string, boolean>>({
    "welcome-msg": true
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Career Advice Mode States
  const [activeMode, setActiveMode] = useState<"general" | "career">("general");
  const [selectedCategory, setSelectedCategory] = useState<string>("dsa");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isCareerPanelExpanded, setIsCareerPanelExpanded] = useState(true);

  // Web Speech API states
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Clean and speak text helper
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop current speech
      
      // Basic markdown clean-up for natural speaking
      let cleanText = text
        .replace(/```[\s\S]*?```/g, " [code snippet] ") // Omit block code
        .replace(/`([^`]+)`/g, "$1") // Strip inline backticks
        .replace(/[*_#~]/g, "") // Strip symbols
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Links
        .replace(/[-*+]\s+/g, "") // Bullet lists
        .replace(/\n+/g, " "); // Line breaks
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      // Select an English voice if possible
      const enVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || 
                      voices.find(v => v.lang.startsWith("en-")) || 
                      voices[0];
      if (enVoice) {
        utterance.voice = enVoice;
      }
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis error:", e);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Safe voice recording toggle (Speech-to-Text)
  const toggleSpeechToText = () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Speech recognition is not fully supported in this browser environment. Please use Google Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      playAudioCue("nav-click");
      return;
    }

    stopSpeaking();

    try {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        playAudioCue("nav-hover");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error: ", event.error);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
          playAudioCue("nav-click");
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error("Failed to start speech recognition: ", e);
      setIsListening(false);
    }
  };

  // Cleanup voices & speech recognition on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Stop reading if Voice mode is disabled
  useEffect(() => {
    if (!isVoiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isVoiceEnabled]);

  // Stop speaking and recording on closing/minimizing panel
  useEffect(() => {
    if (!isOpen || isMinimized) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        setIsListening(false);
      }
    }
  }, [isOpen, isMinimized, isListening]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Copy feedback state (messageId -> boolean)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Emoji picker state
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  
  // Attachment state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    dataUrl?: string;
    content?: string;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suggested chips (12 distinct options)
  const suggestedChips = [
    { label: "👋 Tell me about yourself", query: "Can you introduce yourself and share your core achievements?" },
    { label: "💻 Show your projects", query: "Please tell me about your projects, especially the AI Job Portal and RAG Chatbot!" },
    { label: "🛠️ What technologies do you know?", query: "What programming languages and frameworks are you proficient in?" },
    { label: "📄 Download Resume", query: "How can I download Vicky Kumar's professional resume?" },
    { label: "📞 Contact Information", query: "What are your direct contact details, location, and social media handles?" },
    { label: "🏫 Teaching Experience", query: "What programming subjects do you teach at Gulzar Group of Institutes?" },
    { label: "🏆 Core Skills", query: "Can you summarize your key skills and IIT certifications?" },
    { label: "📚 Research Work", query: "Tell me about your research interests and publication papers." },
    { label: "🎓 Education", query: "Where did you complete your MCA and BCA degrees?" },
    { label: "🏅 Certifications", query: "What technical certifications have you earned?" },
    { label: "🐙 GitHub", query: "What is your GitHub profile link and open-source activities?" },
    { label: "💼 LinkedIn", query: "Can you provide your LinkedIn profile URL?" },
  ];

  const careerSuggestedChips = [
    { label: "📝 Resume Checklist", query: "What is your single-page resume optimization checklist for high-paying software jobs?" },
    { label: "🗣️ Tell Me About Yourself", query: "Can you provide an elite interview template for 'Tell me about yourself' as a CS graduate?" },
    { label: "💼 Behavioral Star Method", query: "How should I structure answers for behavioral questions using the STAR method?" },
    { label: "🚀 MERN Project Architecture", query: "How should I describe full-stack MERN projects to impress technical recruiters?" },
    { label: "🏆 Ace Coding Round", query: "What is your daily study roadmap for cracking core data structures coding rounds?" },
    { label: "💡 Salary Negotiation", query: "What are your best professional negotiation tips for fresh graduates entering tech?" }
  ];

  // Common emojis
  const emojiList = ["😊", "👍", "🎓", "💻", "📊", "🚀", "💡", "📬", "📝", "✨", "🔥", "🔥", "🤔", "👏", "⭐", "🎉"];

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-msg",
          role: "model",
          content: "Hello there! I am Vicky Kumar's AI Academic & Career assistant.\n\nAsk me anything about my MCA/BCA degrees, programming lectures (C, C++, Java, Python, DSA, MERN Stack), research papers, resume critiques, or GGI campus placements!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isMinimized && isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isMinimized, isOpen]);

  // Adjust textarea height automatically based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 110)}px`;
    }
  }, [inputValue]);

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "developer":
        return {
          triggerBtn: "bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-950/20 shadow-[0_0_15px_rgba(0,229,255,0.4)] rounded-none",
          chatPanel: "bg-black border-2 border-cyan-500 rounded-none shadow-[0_0_25px_rgba(0,229,255,0.25)] font-mono text-cyan-400 w-full sm:w-[410px] max-w-[calc(100vw-2rem)] sm:max-w-[410px] h-[70vh] sm:h-[32rem] max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col z-50",
          header: "bg-[#090C10] border-b-2 border-cyan-950 p-3 flex justify-between items-center text-xs tracking-widest uppercase font-bold",
          userBubble: "bg-cyan-950/40 border border-cyan-900 text-cyan-200 rounded-none max-w-[85%] p-3 text-[11px] self-end space-y-1.5",
          modelBubble: "bg-[#090C10] border border-cyan-950 text-cyan-400 rounded-none max-w-[85%] p-3 text-[11px] self-start space-y-1.5",
          inputBg: "bg-black border-t-2 border-cyan-950 p-2 flex flex-col gap-1.5",
          inputField: "flex-1 bg-black text-cyan-400 border border-cyan-900 px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400 rounded-none placeholder:text-cyan-950 resize-none min-h-[36px]",
          sendBtn: "bg-cyan-500 hover:bg-cyan-400 text-black p-1.5 rounded-none font-bold cursor-pointer transition-all disabled:opacity-50",
          badge: "border border-cyan-500 text-cyan-400 bg-cyan-500/5 px-1 py-0.2 rounded-none text-[8px] uppercase font-bold",
          chipClass: "bg-black border border-cyan-950 text-cyan-400 hover:border-cyan-400 text-[10px] py-1 px-3 transition-all rounded-none font-mono cursor-pointer flex-shrink-0 whitespace-nowrap text-center",
          emojiPanel: "bg-black border border-cyan-900 p-2 grid grid-cols-8 gap-1 rounded-none absolute bottom-16 right-2 z-50 shadow-xl",
          searchBar: "w-full bg-[#090C10] border border-cyan-950 text-cyan-400 px-3 py-1 text-xs focus:outline-none focus:border-cyan-500 rounded-none mb-1.5",
        };
      case "glass":
        return {
          triggerBtn: "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white hover:scale-105 shadow-lg shadow-violet-500/25 rounded-2xl",
          chatPanel: "bg-slate-950/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl text-slate-300 font-sans w-full sm:w-[410px] max-w-[calc(100vw-2rem)] sm:max-w-[410px] h-[70vh] sm:h-[33rem] max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col z-50",
          header: "bg-white/5 border-b border-white/10 p-3.5 flex justify-between items-center text-xs font-semibold text-white",
          userBubble: "bg-violet-600/25 border border-violet-500/20 text-violet-100 rounded-2xl rounded-tr-sm max-w-[85%] p-3.5 text-xs self-end shadow-md space-y-1.5",
          modelBubble: "bg-white/5 border border-white/10 text-slate-200 rounded-2xl rounded-tl-sm max-w-[85%] p-3.5 text-xs self-start shadow-md space-y-1.5",
          inputBg: "bg-white/5 border-t border-white/10 p-3 flex flex-col gap-2",
          inputField: "flex-1 bg-slate-950/80 text-white border border-white/10 px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-violet-500 placeholder:text-slate-500 resize-none min-h-[36px]",
          sendBtn: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white p-2 rounded-xl cursor-pointer shadow-md transition-all disabled:opacity-50",
          badge: "bg-violet-950/40 border border-violet-800/20 text-violet-300 px-1.5 py-0.2 rounded-full text-[8px] font-semibold",
          chipClass: "bg-white/5 border border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-white text-[10px] py-1 px-3 rounded-full transition-all cursor-pointer flex-shrink-0 whitespace-nowrap text-center",
          emojiPanel: "bg-slate-950 border border-white/10 p-2 grid grid-cols-8 gap-1 rounded-xl absolute bottom-18 right-2 z-50 shadow-2xl backdrop-blur-xl",
          searchBar: "w-full bg-white/5 border border-white/10 text-white px-3 py-1 text-xs rounded-lg focus:outline-none focus:border-violet-500 mb-1.5",
        };
      case "academic":
        return {
          triggerBtn: "bg-[#7F1D1D] hover:bg-[#5A1010] text-[#FAF6EE] shadow-md rounded-lg",
          chatPanel: "bg-[#FAF6EE] border border-[#D4C3A3] rounded-lg shadow-xl text-[#2A1E17] font-serif w-full sm:w-[410px] max-w-[calc(100vw-2rem)] sm:max-w-[410px] h-[70vh] sm:h-[32rem] max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col z-50",
          header: "bg-[#FAF0D9] border-b border-[#D4C3A3] p-3 flex justify-between items-center text-xs font-bold text-[#7F1D1D]",
          userBubble: "bg-[#F3EAD3] border border-[#D4C3A3]/60 text-[#2A1E17] rounded-lg rounded-tr-none max-w-[85%] p-3 text-xs self-end space-y-1.5",
          modelBubble: "bg-white border border-[#D4C3A3] text-[#2A1E17] rounded-lg rounded-tl-none max-w-[85%] p-3 text-xs self-start shadow-2xs space-y-1.5",
          inputBg: "bg-[#FAF0D9]/30 border-t border-[#D4C3A3]/60 p-2.5 flex flex-col gap-2",
          inputField: "flex-1 bg-white text-[#2A1E17] border border-[#D4C3A3] px-3 py-2 text-xs rounded-md focus:outline-none focus:border-[#7F1D1D] placeholder:text-[#2A1E17]/30 resize-none min-h-[36px]",
          sendBtn: "bg-[#7F1D1D] hover:bg-[#5A1010] text-white p-2 rounded-md cursor-pointer transition-all disabled:opacity-50",
          badge: "bg-[#FAF0D9] border border-[#D4C3A3]/50 text-[#5C4533] px-1.5 py-0.2 rounded-sm text-[8px] font-bold",
          chipClass: "bg-white border border-[#D4C3A3]/50 text-[#5C4533] hover:text-[#7F1D1D] hover:border-[#7F1D1D] text-[10px] py-1 px-3 rounded-md transition-all cursor-pointer flex-shrink-0 whitespace-nowrap text-center",
          emojiPanel: "bg-[#FAF6EE] border border-[#D4C3A3] p-2 grid grid-cols-8 gap-1 rounded-md absolute bottom-16 right-2 z-50 shadow-lg",
          searchBar: "w-full bg-white border border-[#D4C3A3] text-[#2A1E17] px-3 py-1 text-xs rounded-md focus:outline-none focus:border-[#7F1D1D] mb-1.5",
        };
      case "minimal":
      default:
        return {
          triggerBtn: "bg-neutral-950 text-white hover:bg-black shadow-md rounded-full",
          chatPanel: "bg-white border border-neutral-100 rounded-2xl shadow-xl text-neutral-800 font-sans w-full sm:w-[410px] max-w-[calc(100vw-2rem)] sm:max-w-[410px] h-[70vh] sm:h-[32rem] max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] flex flex-col z-50",
          header: "bg-neutral-50 border-b border-neutral-100 p-3.5 flex justify-between items-center text-xs font-bold text-neutral-900",
          userBubble: "bg-neutral-950 text-white rounded-2xl rounded-tr-none max-w-[85%] p-3 text-xs self-end shadow-sm space-y-1.5",
          modelBubble: "bg-neutral-50 text-neutral-800 rounded-2xl rounded-tl-none max-w-[85%] p-3 text-xs self-start border border-neutral-100 space-y-1.5",
          inputBg: "bg-white border-t border-neutral-100 p-3 flex flex-col gap-2",
          inputField: "flex-1 bg-neutral-50 text-neutral-900 border border-neutral-200 px-4 py-2 text-xs rounded-xl focus:outline-none focus:border-black focus:bg-white placeholder:text-neutral-400 resize-none min-h-[36px]",
          sendBtn: "bg-neutral-950 hover:bg-black text-white p-2 rounded-xl cursor-pointer transition-all disabled:opacity-50",
          badge: "bg-neutral-100 border border-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded-full text-[8px] font-bold",
          chipClass: "bg-neutral-50 border border-neutral-150 hover:border-neutral-300 text-neutral-600 hover:text-black text-[10px] py-1 px-3 rounded-full transition-all cursor-pointer flex-shrink-0 whitespace-nowrap text-center",
          emojiPanel: "bg-white border border-neutral-200 p-2 grid grid-cols-8 gap-1 rounded-xl absolute bottom-18 right-2 z-50 shadow-xl",
          searchBar: "w-full bg-neutral-50 border border-neutral-200 text-neutral-900 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-neutral-400 mb-1.5",
        };
    }
  };

  const s = getThemeStyles();

  // Handle send message
  const handleSend = async (messageText: string) => {
    if (!messageText.trim() && !attachedFile) return;

    playAudioCue("nav-click");
    setIsEmojiOpen(false);
    stopSpeaking(); // Halt active speech output when sending new message

    // Formulate a clean timestamp
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: messageText.trim() || `Uploaded file: ${attachedFile?.name}`,
      timestamp: timeString,
      attachment: attachedFile ? { ...attachedFile } : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setAttachedFile(null);
    setIsTyping(true);

    // Prepare content query
    let apiPrompt = messageText;

    // If there was an attachment, we append info to the query
    if (userMsg.attachment) {
      if (userMsg.attachment.type.startsWith("image/")) {
        apiPrompt = `[User attached image: "${userMsg.attachment.name}"]\n\n${apiPrompt || "Can you review or analyze this attached file?"}`;
      } else {
        apiPrompt = `[User attached text file: "${userMsg.attachment.name}" with contents:\n${userMsg.attachment.content?.slice(0, 500)}]\n\n${apiPrompt || "Can you review these file contents?"}`;
      }
    }

    try {
      // Gather last 8 messages for basic conversation history
      const filteredHistory = messages
        .slice(-8)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: apiPrompt,
          history: filteredHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Final fallback guard: if message query is unrelated to portfolio or CS, enforce Vicky's scope filter
        let contentResponse = data.text || "";
        const loweredPrompt = (messageText || "").toLowerCase();
        
        // A simple rule-based filter to match the requested instructions
        const portfolioKeywords = [
          "vicky", "portfolio", "projects", "skills", "teach", "resume", "contact", "email", "phone", 
          "social", "github", "linkedin", "education", "mca", "bca", "experience", "publication", 
          "research", "certification", "achievement", "paper", "about", "who are you", "courses",
          "cpp", "java", "python", "data structures", "dsa", "c++"
        ];
        
        const hasPortfolioTopic = portfolioKeywords.some(kw => loweredPrompt.includes(kw));
        if (loweredPrompt.trim().length > 3 && !hasPortfolioTopic && !loweredPrompt.includes("hello") && !loweredPrompt.includes("hi")) {
          // If totally irrelevant, inject polite reply as demanded by spec
          contentResponse = "I'm designed to answer questions about Vicky's portfolio, skills, projects, teaching, and professional experience.";
        }

        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          content: contentResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, modelMsg]);
        playAudioCue("nav-hover");

        if (isVoiceEnabled) {
          speakText(contentResponse);
        }
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("Chat error: ", err);
      // Fail gracefully
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: "I am designed to answer questions about Vicky's portfolio, skills, projects, teaching, and professional experience. If my academic server is under high load, feel free to drop me an email at vickykr802302@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      
      if (isVoiceEnabled) {
        speakText(errorMsg.content);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Keyboard actions: Enter sends, Shift+Enter newlines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  // File Upload processor (supports drag-and-drop or manual selection)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playAudioCue("nav-click");

    const reader = new FileReader();
    if (file.type.startsWith("image/")) {
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          dataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Support text file attachments too
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          content: reader.result as string,
        });
      };
      reader.readAsText(file);
    }
  };

  // Drag and drop attachment trigger
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    playAudioCue("nav-click");

    const reader = new FileReader();
    if (file.type.startsWith("image/")) {
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          dataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          content: reader.result as string,
        });
      };
      reader.readAsText(file);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = (msgId: string, text: string) => {
    playAudioCue("nav-click");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [msgId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [msgId]: false }));
      }, 2000);
    });
  };

  // Delete single message from list
  const handleDeleteMessage = (msgId: string) => {
    playAudioCue("nav-click");
    setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
  };

  // Reset entire convo with confirmation
  const handleClearConversation = () => {
    playAudioCue("nav-click");
    stopSpeaking(); // Halt any active speech output
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "model",
          content: "Chat history cleared! Ask me anything about Vicky Kumar's resume, academic lectures, or tech stack.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    return msg.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const panelClasses = isFullscreen
    ? `fixed inset-0 z-[1000] rounded-none flex flex-row overflow-hidden backdrop-blur-md ${
        currentTheme === "developer"
          ? "bg-black/90 text-cyan-400 font-mono"
          : currentTheme === "glass"
          ? "bg-[#0B0F19]/80 text-slate-200 font-sans"
          : currentTheme === "academic"
          ? "bg-[#FAF6EE]/95 text-[#2A1E17] font-serif"
          : "bg-white/95 text-neutral-800 font-sans"
      }`
    : `pointer-events-auto relative shadow-2xl ${s.chatPanel}`;

  const parentClass = (isFullscreen && isOpen && !isMinimized)
    ? "fixed inset-0 w-screen h-screen z-[1000] flex flex-col overflow-hidden"
    : isOpen
    ? `fixed inset-0 pointer-events-none z-[1000] flex items-end justify-center sm:justify-end p-4 sm:p-5 ${
        isMinimized ? "pb-20 sm:pb-24" : "pb-4 sm:pb-5"
      }`
    : "fixed bottom-5 right-5 z-45 flex flex-col items-end";

  return (
    <div 
      className={parentClass} 
      id="portfolio-chatbot-system"
    >
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={isFullscreen ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 35 }}
            animate={isFullscreen ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isFullscreen ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 35 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className={panelClasses}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Left Sidebar Pane (Only shown in Fullscreen mode on Desktop) */}
            {isFullscreen && (
              <div className={`hidden md:flex md:w-80 border-r flex-col p-5 space-y-6 flex-shrink-0 text-left ${
                currentTheme === "developer"
                  ? "border-cyan-950 bg-[#090C10]/85 text-cyan-400"
                  : currentTheme === "glass"
                  ? "border-white/10 bg-white/5 backdrop-blur-md text-slate-200"
                  : currentTheme === "academic"
                  ? "border-[#D4C3A3] bg-[#FAF0D9]/40 text-[#2A1E17]"
                  : "border-neutral-150 bg-neutral-50/50 text-neutral-800"
              }`}>
                {/* Profile Card */}
                <div className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 ${
                  currentTheme === "developer"
                    ? "border-cyan-900/50 bg-cyan-950/15"
                    : currentTheme === "glass"
                    ? "border-white/10 bg-white/5"
                    : currentTheme === "academic"
                    ? "border-[#D4C3A3] bg-white"
                    : "border-neutral-200 bg-white shadow-xs"
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                    currentTheme === "developer"
                      ? "bg-cyan-950 border-cyan-400 text-cyan-400"
                      : currentTheme === "glass"
                      ? "bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-white/20 text-white"
                      : currentTheme === "academic"
                      ? "bg-[#7F1D1D] border-[#D4C3A3] text-white"
                      : "bg-neutral-900 border-neutral-200 text-white"
                  }`}>
                    VK
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">Prof. Vicky Kumar</h3>
                    <p className="text-[10px] opacity-75 mt-0.5">Assistant Professor</p>
                    <p className="text-[9px] opacity-60">Computer Applications Department</p>
                  </div>
                </div>

                {/* Recommended shortcuts */}
                <div className="flex-1 flex flex-col min-h-0">
                  <span className="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-2.5 flex items-center gap-1.5 text-indigo-400 dark:text-indigo-300">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Interactive Explorer
                  </span>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 [scrollbar-width:thin] max-h-[300px]">
                    {(activeMode === "career" ? careerSuggestedChips : suggestedChips).map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip.query)}
                        className={`w-full text-left text-[11px] py-2 px-3 rounded-lg border transition-all truncate hover:translate-x-1 duration-150 cursor-pointer ${
                          currentTheme === "developer"
                            ? "bg-black border-cyan-950 text-cyan-400 hover:border-cyan-400"
                            : currentTheme === "glass"
                            ? "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                            : currentTheme === "academic"
                            ? "bg-white border-[#D4C3A3]/50 text-[#5C4533] hover:border-[#7F1D1D] hover:text-[#7F1D1D]"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 shadow-2xs"
                        }`}
                        title={chip.query}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diagnostics Panel */}
                <div className={`p-3.5 rounded-xl text-[10px] space-y-2 font-mono border ${
                  currentTheme === "developer"
                    ? "border-cyan-950 bg-[#090C10] text-cyan-500"
                    : currentTheme === "glass"
                    ? "border-white/5 bg-slate-900/50 text-slate-400"
                    : currentTheme === "academic"
                    ? "border-[#D4C3A3]/40 bg-[#FAF0D9]/20 text-[#5C4533]"
                    : "border-neutral-100 bg-neutral-50 text-neutral-500"
                }`}>
                  <div className="flex justify-between items-center">
                    <span>AI Core:</span>
                    <span className="font-bold">Gemini Flash</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Context Window:</span>
                    <span>1,048,576 tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Status:</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Right Main Chat Panel */}
            <div className="flex-1 h-full flex flex-col overflow-hidden relative">
              {/* Header */}
              <div className={s.header}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400 animate-pulse flex-shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="font-bold tracking-tight text-[10px] sm:text-xs">
                      {isFullscreen ? "Prof. Vicky's AI Academic & Placement Core" : "Prof. Vicky's AI Core"}
                    </span>
                    <span className="text-[8px] opacity-75 leading-none font-mono">Academic & Placement Mentor</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Search Icon */}
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setIsSearchActive(!isSearchActive);
                      if (isSearchActive) setSearchQuery("");
                    }}
                    title="Search messages"
                    className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer text-current"
                    aria-label="Search within chat history"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>

                  {/* Voice Mode Toggle (Speaker icon) */}
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setIsVoiceEnabled(!isVoiceEnabled);
                    }}
                    title={isVoiceEnabled ? "Disable Voice Responses" : "Enable Voice Responses (Voice Mode)"}
                    className={`p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer relative ${
                      isVoiceEnabled ? "text-indigo-400 font-bold" : "text-current opacity-70 hover:opacity-100"
                    }`}
                    aria-label={isVoiceEnabled ? "Disable voice mode" : "Enable voice mode"}
                  >
                    {isVoiceEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      </>
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Clear Convo */}
                  <button
                    onClick={handleClearConversation}
                    title="Clear conversation"
                    className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer text-current"
                    aria-label="Clear entire conversation"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setIsFullscreen(!isFullscreen);
                    }}
                    title={isFullscreen ? "Restore to Floating Panel" : "Expand to Fullscreen"}
                    className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer text-current hidden sm:inline-block"
                    aria-label={isFullscreen ? "Restore layout" : "Fullscreen layout"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Minimize widget to dock */}
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setIsMinimized(true);
                    }}
                    title="Minimize to bottom dock"
                    className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer text-current"
                    aria-label="Minimize Chatbot"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Highly polished, standard Close button with clear X icon */}
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setIsOpen(false);
                      setIsFullscreen(false);
                      setIsMinimized(false);
                    }}
                    title="Close Chat"
                    className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white border border-rose-700/55 hover:border-rose-500 transition-all cursor-pointer active:scale-95"
                    aria-label="Close Chat"
                  >
                    <X className="w-4 h-4 font-black" />
                    <span className="text-[10px] font-bold uppercase hidden sm:inline">Close</span>
                  </button>
                </div>
              </div>

              {/* Active Search Bar in header */}
              {isSearchActive && (
                <div className="px-3 pt-2 bg-gray-150/5 border-b border-gray-150/10">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter chat history..."
                    className={s.searchBar}
                    aria-label="Type here to search history"
                  />
                </div>
              )}

              {/* Mode Toggle Tabs */}
              <div className="flex border-b border-gray-150/10 bg-gray-150/5 p-1.5 gap-1 text-[11px] font-semibold flex-shrink-0 justify-around">
                <button
                  onClick={() => {
                    playAudioCue("nav-click");
                    setActiveMode("general");
                  }}
                  className={`flex-1 py-1 px-2.5 rounded text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeMode === "general"
                      ? currentTheme === "developer"
                        ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/50"
                        : currentTheme === "glass"
                        ? "bg-violet-600 text-white shadow"
                        : currentTheme === "academic"
                        ? "bg-[#7F1D1D] text-white"
                        : "bg-neutral-950 text-white shadow"
                      : "text-neutral-500 hover:text-current hover:bg-neutral-500/10"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>General Q&A</span>
                </button>
                <button
                  onClick={() => {
                    playAudioCue("nav-click");
                    setActiveMode("career");
                  }}
                  className={`flex-1 py-1 px-2.5 rounded text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeMode === "career"
                      ? currentTheme === "developer"
                        ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/50"
                        : currentTheme === "glass"
                        ? "bg-violet-600 text-white shadow"
                        : currentTheme === "academic"
                        ? "bg-[#7F1D1D] text-white"
                        : "bg-neutral-950 text-white shadow"
                      : "text-neutral-500 hover:text-current hover:bg-neutral-500/10"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Career Advice Mode</span>
                </button>
              </div>

              {/* Collapsible Placement Advisory Dashboard */}
              {activeMode === "career" && (
                <div className={`border-b flex flex-col transition-all duration-300 ${
                  currentTheme === "developer"
                    ? "bg-black border-cyan-950 text-cyan-400 font-mono"
                    : currentTheme === "glass"
                    ? "bg-slate-900/60 border-white/10 text-slate-200"
                    : currentTheme === "academic"
                    ? "bg-[#FAF0D9] border-[#D4C3A3] text-[#2A1E17]"
                    : "bg-neutral-50 border-neutral-150 text-neutral-800"
                }`}>
                  {/* Collapsed/Expanded Toggle Header */}
                  <div 
                    onClick={() => {
                      playAudioCue("nav-hover");
                      setIsCareerPanelExpanded(!isCareerPanelExpanded);
                    }}
                    className="flex items-center justify-between p-2 cursor-pointer hover:bg-neutral-500/5 transition-all select-none"
                  >
                    <div className="flex items-center gap-1.5 pl-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Placement Advisory Hub
                      </span>
                      <span className="text-[8px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-sm font-semibold animate-pulse">Mock Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5 pr-1">
                      <span className="text-[9px] opacity-60">
                        {isCareerPanelExpanded ? "Hide Prep Tools" : "Show Prep Tools"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCareerPanelExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded Panel Body */}
                  <AnimatePresence>
                    {isCareerPanelExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-3 pb-3 pt-1 border-t border-dashed border-gray-150/10 flex flex-col gap-2.5"
                      >
                        {/* Subheading */}
                        <p className="text-[10px] leading-relaxed opacity-80 text-left">
                          Select a computer science domain below to prepare with standard corporate hiring questions:
                        </p>

                        {/* Category Tabs Grid */}
                        <div className="grid grid-cols-5 gap-1">
                          {CAREER_TOPICS.map((topic) => {
                            const isSelected = selectedCategory === topic.id;
                            
                            // Select Category Icon
                            let IconComp = Layers;
                            if (topic.id === "oop") IconComp = Cpu;
                            else if (topic.id === "dbms") IconComp = Database;
                            else if (topic.id === "web") IconComp = Globe;
                            else if (topic.id === "languages") IconComp = Terminal;

                            return (
                              <button
                                key={topic.id}
                                onClick={() => {
                                  playAudioCue("nav-click");
                                  setSelectedCategory(topic.id);
                                }}
                                className={`py-1.5 px-0.5 rounded flex flex-col items-center gap-1 transition-all text-center cursor-pointer border ${
                                  isSelected
                                    ? currentTheme === "developer"
                                      ? "bg-cyan-950/40 border-cyan-400 text-cyan-400 font-bold"
                                      : currentTheme === "glass"
                                      ? "bg-violet-600 border-violet-500 text-white shadow font-semibold"
                                      : currentTheme === "academic"
                                      ? "bg-[#7F1D1D] border-[#7F1D1D] text-white font-bold"
                                      : "bg-neutral-950 border-neutral-950 text-white font-semibold"
                                    : currentTheme === "developer"
                                    ? "bg-black border-cyan-950 text-cyan-500 hover:border-cyan-800"
                                    : currentTheme === "glass"
                                    ? "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                                    : currentTheme === "academic"
                                    ? "bg-[#F3EAD3] border-[#D4C3A3] text-[#5C4533] hover:bg-[#FAF0D9]"
                                    : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200"
                                }`}
                              >
                                <IconComp className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-bold tracking-tight truncate max-w-full px-0.5">
                                  {topic.name.split(" ")[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Questions Stack */}
                        <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                          {CAREER_TOPICS.find((t) => t.id === selectedCategory)?.questions.map((q) => {
                            const isExpanded = expandedQuestionId === q.id;
                            return (
                              <div 
                                key={q.id}
                                className={`p-2 rounded border text-left flex flex-col gap-1.5 transition-all ${
                                  currentTheme === "developer"
                                    ? "bg-[#090C10]/40 border-cyan-950"
                                    : currentTheme === "glass"
                                    ? "bg-white/5 border-white/5 hover:border-white/10"
                                    : currentTheme === "academic"
                                    ? "bg-white border-[#D4C3A3]/40"
                                    : "bg-neutral-50 border-neutral-100 hover:border-neutral-200"
                                }`}
                              >
                                <div 
                                  onClick={() => {
                                    playAudioCue("nav-hover");
                                    setExpandedQuestionId(isExpanded ? null : q.id);
                                  }}
                                  className="flex justify-between items-start gap-2 cursor-pointer animate-none"
                                >
                                  <span className="text-[11px] font-semibold leading-snug flex-1">
                                    {q.q}
                                  </span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </div>

                                {isExpanded && (
                                  <div className="text-[10px] mt-1 pl-1.5 border-l-2 border-indigo-500/40 space-y-2 text-left">
                                    <p className="italic opacity-85 leading-relaxed">
                                      <strong className="text-indigo-400 mr-1">Guideline:</strong>
                                      {q.tip}
                                    </p>
                                    
                                    <div className="flex items-center gap-1.5 pt-1">
                                      {/* Ask Vicky AI */}
                                      <button
                                        onClick={() => {
                                          handleSend(`[Career Advice Mode - CS Question Prep]\n\nQuestion: "${q.q}"\n\nProvide an interview blueprint, follow-up queries, key pitfalls to avoid, and GGI placement coordinator advice.`);
                                        }}
                                        className={`py-1 px-2.5 rounded text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                          currentTheme === "developer"
                                            ? "bg-cyan-500 text-black hover:bg-cyan-400"
                                            : currentTheme === "glass"
                                            ? "bg-violet-600 text-white hover:bg-violet-500"
                                            : currentTheme === "academic"
                                            ? "bg-[#7F1D1D] text-white hover:bg-[#5A1010]"
                                            : "bg-neutral-950 text-white hover:bg-black"
                                        }`}
                                      >
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>Ask Vicky's AI</span>
                                      </button>

                                      {/* Local Quick Answer Injection (Failsafe & instantaneous) */}
                                      <button
                                        onClick={() => {
                                          playAudioCue("nav-click");
                                          // Locally simulate a modeled response
                                          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                          
                                          // Let's get the offline answer content
                                          const localAnswer = getLocalAnswerForQuestion(q.id);

                                          const userMsg: ChatMessage = {
                                            id: `user-local-${Date.now()}`,
                                            role: "user",
                                            content: `Local Study Card: ${q.q}`,
                                            timestamp: timeString
                                          };

                                          const modelMsg: ChatMessage = {
                                            id: `model-local-${Date.now()}`,
                                            role: "model",
                                            content: localAnswer,
                                            timestamp: timeString
                                          };

                                          setMessages((prev) => [...prev, userMsg, modelMsg]);
                                          setExpandedQuestionId(null);
                                        }}
                                        className={`py-1 px-2 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                                          currentTheme === "developer"
                                            ? "bg-black border-cyan-500 text-cyan-400 hover:bg-cyan-950/20"
                                            : currentTheme === "glass"
                                            ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                            : currentTheme === "academic"
                                            ? "bg-white border-[#D4C3A3] text-[#7F1D1D] hover:bg-[#FAF0D9]"
                                            : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                                        }`}
                                      >
                                        <FileText className="w-2.5 h-2.5" />
                                        <span>Read Study Card</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Message Pane */}
              <div 
                id="chatbot-message-pane"
                className={`flex-1 overflow-y-auto p-3.5 sm:p-4 ${isFullscreen ? "md:p-8" : ""} space-y-4 flex flex-col [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-500/20`}
              >
                <div className={`flex-1 flex flex-col space-y-4 ${isFullscreen ? "max-w-4xl mx-auto w-full" : ""}`}>
                  {filteredMessages.length === 0 && searchQuery && (
                    <div className="text-center py-10 space-y-2 opacity-60">
                      <AlertCircle className="w-8 h-8 mx-auto text-neutral-400" />
                      <p className="text-xs">No matching messages found for "{searchQuery}"</p>
                    </div>
                  )}

                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-start gap-1.5 max-w-full">
                        {msg.role === "model" && (
                          <div className="w-6 h-6 rounded-full bg-indigo-600/15 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1">
                            VK
                          </div>
                        )}

                        <div className="flex flex-col max-w-full text-left">
                          <div className={msg.role === "user" ? s.userBubble : s.modelBubble}>
                            {/* Display attachment if any */}
                            {msg.attachment && (
                              <div className="mb-2 p-1.5 rounded bg-black/40 border border-white/5 flex items-center gap-2 max-w-xs overflow-hidden">
                                {msg.attachment.type.startsWith("image/") ? (
                                  <img 
                                    src={msg.attachment.dataUrl} 
                                    alt="attachment preview" 
                                    className="w-12 h-12 object-cover rounded border border-white/10 flex-shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <FileText className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                                )}
                                <div className="text-[10px] truncate flex-1">
                                  <p className="font-semibold text-neutral-200 truncate">{msg.attachment.name}</p>
                                  <p className="opacity-60 font-mono text-[8px] uppercase">{msg.attachment.type.split("/")[1] || "File"}</p>
                                </div>
                              </div>
                            )}

                            {msg.role === "model" && !completedMessageIds[msg.id] ? (
                              <TypewriterText
                                text={msg.content}
                                onType={() => {
                                  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
                                }}
                                onComplete={() => {
                                  setCompletedMessageIds((prev) => ({ ...prev, [msg.id]: true }));
                                }}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
                            )}
                          </div>

                          {/* Bubble Action Bar: Copy, Delete, Timestamp */}
                          <div className="flex items-center gap-2 mt-1 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] opacity-70">
                            <span className="font-mono text-[8px] text-neutral-500 mr-1">{msg.timestamp}</span>
                            
                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="hover:text-white p-0.5"
                              title="Copy message"
                              aria-label="Copy message text"
                            >
                              {copiedStates[msg.id] ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3 text-neutral-400" />
                              )}
                            </button>

                            {/* Speak Aloud Button */}
                            <button
                              onClick={() => {
                                playAudioCue("nav-click");
                                speakText(msg.content);
                              }}
                              className="hover:text-indigo-400 p-0.5 text-neutral-400"
                              title="Speak message aloud"
                              aria-label="Read this message aloud"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="hover:text-rose-500 p-0.5 text-neutral-400"
                              title="Delete message"
                              aria-label="Delete this message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-start gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/15 text-indigo-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1">
                          VK
                        </div>
                        <div className={`${s.modelBubble} flex items-center gap-2 py-2 px-3`}>
                          <Loader2 className="w-3 h-3 animate-spin text-current" />
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] tracking-tight font-mono">Formulating guidance</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Suggested quick reply chips (Shown on bottom if not in desktop fullscreen layout) */}
              {messages.filter(m => m.role === 'user').length < 3 && (
                <div 
                  id="chatbot-suggested-inquiries"
                  className={`${isFullscreen ? "md:hidden" : ""} px-3 pb-2 pt-1.5 border-t border-gray-150/10 flex flex-col gap-1 bg-gray-150/5 flex-shrink-0`}
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[8px] opacity-60 uppercase tracking-wider font-bold text-left flex items-center gap-1 text-indigo-400">
                      <Sparkles className="w-2.5 h-2.5" />
                      Suggested Inquiries:
                    </span>
                    <span className="text-[7px] opacity-40 uppercase tracking-widest hidden sm:inline">Swipe &rarr;</span>
                  </div>
                  <div className="flex flex-row overflow-x-auto gap-1 pb-1.5 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                    {(activeMode === "career" ? careerSuggestedChips : suggestedChips).map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip.query)}
                        className={s.chipClass}
                        title={chip.query}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Emoji Picker Popover */}
              {isEmojiOpen && (
                <div className={s.emojiPanel}>
                  {emojiList.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        playAudioCue("nav-hover");
                        setInputValue((prev) => prev + emoji);
                        textareaRef.current?.focus();
                      }}
                      className="hover:scale-125 transition-transform text-sm p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Drag and Drop Attachment Visualizer Bar */}
              {attachedFile && (
                <div className={`px-3 py-2 bg-amber-500/10 border-t border-amber-500/20 text-xs flex justify-between items-center text-amber-300 ${isFullscreen ? "max-w-4xl mx-auto w-full rounded-t-lg" : ""}`}>
                  <div className="flex items-center gap-2 truncate">
                    {attachedFile.type.startsWith("image/") ? (
                      <ImageIcon className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    <span className="font-semibold truncate text-[11px]">{attachedFile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      playAudioCue("nav-click");
                      setAttachedFile(null);
                    }}
                    className="p-0.5 bg-amber-950/40 text-amber-400 hover:text-white rounded"
                    title="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Input form (centered elegantly in fullscreen mode) */}
              <div 
                id="chatbot-input-form"
                className={`${s.inputBg} ${isFullscreen ? "pb-6 pt-2 px-4 md:px-0 max-w-4xl mx-auto w-full" : ""}`}
              >
                <div className="flex items-end gap-1.5 w-full">
                  {/* File Upload Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.txt,.pdf,.doc,.docx"
                    aria-label="Upload file attachment"
                  />

                  {/* File Attachment Triggers */}
                  <div className="flex items-center gap-1 pb-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
                      title="Attach file (Text or Doc)"
                      aria-label="Attach a document file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = "image/*";
                          fileInputRef.current.click();
                        }
                      }}
                      className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
                      title="Upload image"
                      aria-label="Attach an image file"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Emoji Trigger */}
                    <button
                      onClick={() => {
                        playAudioCue("nav-click");
                        setIsEmojiOpen(!isEmojiOpen);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer hidden sm:inline-block"
                      title="Insert emoji"
                      aria-label="Open emoji list"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    {/* Voice Dictation (Microphone) Trigger */}
                    <button
                      onClick={toggleSpeechToText}
                      className={`p-1.5 hover:bg-white/10 rounded transition-all cursor-pointer relative ${
                        isListening 
                          ? "text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20" 
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                      title={isListening ? "Listening... Click to stop" : "Speak your question (Speech-to-Text)"}
                      aria-label={isListening ? "Stop listening" : "Start speech-to-text dictation"}
                    >
                      {isListening ? (
                        <>
                          <Mic className="w-4 h-4 animate-pulse text-rose-500" />
                          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                        </>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Textarea Input (handles Enter to send, Shift+Enter to newline) */}
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening... speak now." : "Ask about Vicky's education, projects, contact..."}
                    className={`${s.inputField} ${isListening ? "border-rose-500/40 ring-1 ring-rose-500/10" : ""}`}
                    aria-label="AI conversation query input"
                  />

                  <button
                    onClick={() => handleSend(inputValue)}
                    disabled={(!inputValue.trim() && !attachedFile) || isTyping}
                    className={`${s.sendBtn} self-end mb-1`}
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Minimized Dock Bar */}
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            onClick={() => {
              playAudioCue("nav-click");
              setIsMinimized(false);
            }}
            className={`cursor-pointer group flex items-center justify-between gap-3 shadow-2xl hover:scale-[1.02] transition-transform pointer-events-auto relative w-full sm:w-64 text-xs z-[1000] p-2 ${
              currentTheme === "developer" 
                ? "bg-black border-2 border-cyan-500 text-cyan-400 font-mono rounded-none" 
                : currentTheme === "glass"
                ? "bg-slate-900/95 backdrop-blur-md border border-white/15 text-white rounded-xl"
                : currentTheme === "academic"
                ? "bg-[#FAF0D9] border border-[#D4C3A3] text-[#7F1D1D] rounded-md font-serif"
                : "bg-neutral-950 text-white rounded-full px-4"
            }`}
          >
            <div className="flex items-center gap-2 truncate flex-1 text-left">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-semibold truncate">Prof. Vicky's AI Core</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Restore button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudioCue("nav-click");
                  setIsMinimized(false);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-all text-current cursor-pointer hover:scale-110 active:scale-95"
                title="Restore Chat"
                aria-label="Restore Chat Window"
              >
                <Maximize2 className="w-3.5 h-3.5 opacity-80 hover:opacity-100" />
              </button>

              {/* Close/Cut button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudioCue("nav-click");
                  setIsOpen(false);
                  setIsMinimized(false);
                  setIsFullscreen(false);
                }}
                className="p-1 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white rounded transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Cut (Close) Chat"
                aria-label="Close Chatbot completely"
              >
                <X className="w-3.5 h-3.5 font-bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Orb Button (shown when widget is closed) */}
      {!isOpen && (
        <motion.button
          id="chatbot-widget-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playAudioCue("nav-click");
            setIsOpen(true);
          }}
          className={`w-12 h-12 flex items-center justify-center cursor-pointer relative ${s.triggerBtn}`}
          aria-label="Open portfolio conversation chatbot helper"
        >
          <MessageSquare className="w-5 h-5 text-current" />
          <span className="absolute -top-1 -right-1 bg-rose-500 w-2.5 h-2.5 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 bg-rose-500 w-2.5 h-2.5 rounded-full" />
        </motion.button>
      )}
    </div>
  );
}
