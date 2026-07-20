import { QuizQuestion } from "../types";

export const PLACEMENT_QUIZZES: Record<string, QuizQuestion[]> = {
  "pre-py-1": [
    {
      id: "py-1-q1",
      question: "What is the primary effect of the Global Interpreter Lock (GIL) in CPython?",
      options: [
        "It prevents multiple Python processes from sharing the same hardware memory block.",
        "It enforces a mutex that allows only one thread to execute Python bytecode at a time.",
        "It compiled dynamic lines into optimized bare-metal C bindings automatically.",
        "It blocks recursive function definitions to prevent stack overflow errors."
      ],
      correctIdx: 1,
      explanation: "The CPython GIL is a mutex that prevents multiple threads from executing Python bytecodes at once. This ensures memory management is thread-safe, but limits multi-core CPU efficiency in purely CPU-bound multi-threaded applications."
    },
    {
      id: "py-1-q2",
      question: "Which of the following is a mutable data type in Python?",
      options: [
        "Tuple",
        "String",
        "List",
        "Frozenset"
      ],
      correctIdx: 2,
      explanation: "Lists are mutable, meaning their contents can be altered in-place. Tuples, Strings, and Frozensets are immutable objects."
    },
    {
      id: "py-1-q3",
      question: "What does the '__init__' method represent in a Python class?",
      options: [
        "A destructive garbage collector that frees heap allocations.",
        "An initializer constructor method called automatically when creating an object instance.",
        "A private method restricted to parent classes only.",
        "A static decorator used to register global functions."
      ],
      correctIdx: 1,
      explanation: "'__init__' is the standard constructor method in Python classes, utilized to initialize an object's state when instantiated."
    }
  ],
  "pre-ds-2": [
    {
      id: "ds-2-q1",
      question: "What is the worst-case lookup time complexity in a standard Hash Table?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctIdx: 2,
      explanation: "In the worst case (e.g. all elements hash to the exact same bucket, causing extreme collisions resolved via chaining), searching a hash table degenerates to searching a linked list, which is O(N)."
    },
    {
      id: "ds-2-q2",
      question: "Which data structure follows the Last-In, First-Out (LIFO) protocol?",
      options: [
        "Queue",
        "Stack",
        "Binary Tree",
        "Priority Queue"
      ],
      correctIdx: 1,
      explanation: "A Stack utilizes LIFO logic for insertions (push) and deletions (pop). A Queue uses First-In, First-Out (FIFO) logic."
    },
    {
      id: "ds-2-q3",
      question: "In a doubly linked list, how many pointer references does each node contain?",
      options: [
        "One (pointer to the next node)",
        "Two (pointers to both the previous and next nodes)",
        "Three (previous, next, and root pointers)",
        "None (it utilizes indexed offset logic)"
      ],
      correctIdx: 1,
      explanation: "Each node in a doubly linked list holds two pointers: 'next' (referencing the following node) and 'prev' (referencing the preceding node)."
    }
  ],
  "pre-alg-3": [
    {
      id: "alg-3-q1",
      question: "What is the average-case time complexity of the QuickSort algorithm?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(N^2)",
        "O(log N)"
      ],
      correctIdx: 1,
      explanation: "QuickSort splits arrays recursively. On average, pivot selection yields balanced halves, resulting in a tree height of O(log N) with O(N) work per level, giving O(N log N)."
    },
    {
      id: "alg-3-q2",
      question: "Which algorithmic paradigm does Binary Search belong to?",
      options: [
        "Greedy Choice",
        "Dynamic Programming",
        "Divide and Conquer",
        "Brute Force Backtracking"
      ],
      correctIdx: 2,
      explanation: "Binary Search uses Divide and Conquer: it repeatedly divides the sorted search space in half to locate the target."
    },
    {
      id: "alg-3-q3",
      question: "Which of the following algorithms is used to find the shortest path in a weighted graph with non-negative edge weights?",
      options: [
        "Kruskal's Algorithm",
        "Dijkstra's Algorithm",
        "Depth-First Search (DFS)",
        "Tarjan's Algorithm"
      ],
      correctIdx: 1,
      explanation: "Dijkstra's algorithm is the classic greedy shortest-path algorithm for weighted graphs with non-negative edge weights, running in O(E + V log V) with a binary heap."
    }
  ],
  "pre-dbms-4": [
    {
      id: "dbms-4-q1",
      question: "What does the 'I' represent in the ACID transactional properties?",
      options: [
        "Integration (joining distributed databases)",
        "Isolation (ensuring concurrent transactions do not interfere with each other)",
        "Inheritance (sharing schemas across tables)",
        "Indexed (storing records using clustered trees)"
      ],
      correctIdx: 1,
      explanation: "Isolation ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially."
    },
    {
      id: "dbms-4-q2",
      question: "Which normal form requires the removal of transitive dependencies?",
      options: [
        "First Normal Form (1NF)",
        "Second Normal Form (2NF)",
        "Third Normal Form (3NF)",
        "Boyce-Codd Normal Form (BCNF)"
      ],
      correctIdx: 2,
      explanation: "Third Normal Form (3NF) requires a table to be in 2NF, and all non-key columns must depend exclusively on the primary key, eliminating transitive functional dependencies."
    },
    {
      id: "dbms-4-q3",
      question: "What is the difference between a Primary Key and a Unique Key constraint?",
      options: [
        "Primary keys allow NULL values; Unique keys do not.",
        "A table can have multiple Primary Keys but only one Unique Key.",
        "A table can have only one Primary Key (which cannot be NULL) but multiple Unique Keys (which can allow NULLs).",
        "There is no difference; they are synonymous."
      ],
      correctIdx: 2,
      explanation: "A table is limited to exactly one Primary Key, which forbids NULL values. It can have multiple Unique Keys, which guarantee uniqueness but can permit NULL values."
    }
  ],
  "pre-os-5": [
    {
      id: "os-5-q1",
      question: "Which CPU scheduling algorithm is non-preemptive and selects the process with the shortest burst time?",
      options: [
        "Round Robin (RR)",
        "Shortest Job First (SJF)",
        "First-Come, First-Served (FCFS)",
        "Shortest Remaining Time First (SRTF)"
      ],
      correctIdx: 1,
      explanation: "Shortest Job First (SJF) is non-preemptive and selects the process with the shortest CPU burst. Its preemptive counterpart is SRTF."
    },
    {
      id: "os-5-q2",
      question: "What is a 'deadlock' in an operating system?",
      options: [
        "A condition where a process terminates abnormally due to memory corruption.",
        "A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.",
        "A security mechanism that locks the root user account after too many failed attempts.",
        "A hardware failure in the CPU cache controller."
      ],
      correctIdx: 1,
      explanation: "Deadlock occurs when two or more processes are unable to proceed because each is waiting for a resource held by another, creating a circular waiting dependency."
    },
    {
      id: "os-5-q3",
      question: "What is 'Thrashing' in Virtual Memory management?",
      options: [
        "The process of clearing the CPU cache register on context switch.",
        "An extremely high rate of page faults where the system spends more time swapping pages in and out of disk than executing instructions.",
        "A file fragmentation repair operation running in the background.",
        "A security exploit that overflows the system stack frame."
      ],
      correctIdx: 1,
      explanation: "Thrashing happens when the active working set of pages exceeds available physical RAM, causing continuous page faults and disk swapping, stalling system performance."
    }
  ],
  "pre-net-6": [
    {
      id: "net-6-q1",
      question: "Which layer of the OSI model handles routing, packet forwarding, and logical addressing?",
      options: [
        "Data Link Layer",
        "Network Layer",
        "Transport Layer",
        "Physical Layer"
      ],
      correctIdx: 1,
      explanation: "The Network Layer (Layer 3) is responsible for routing packets across networks using logical IP addressing and routing protocols."
    },
    {
      id: "net-6-q2",
      question: "What does the 3-Way Handshake of TCP establish?",
      options: [
        "An encrypted SSL tunnel.",
        "A reliable connection state with synchronized sequence numbers (SYN, SYN-ACK, ACK).",
        "A routing path through local gateway subnets.",
        "A DNS lookup mapping a host to an IP."
      ],
      correctIdx: 1,
      explanation: "TCP establishes a connection using SYN, SYN-ACK, and ACK flags to synchronize sequence numbers and allocate communication buffers."
    },
    {
      id: "net-6-q3",
      question: "What is the function of the Domain Name System (DNS)?",
      options: [
        "Translating human-readable domain names (e.g. google.com) into numerical IP addresses.",
        "Encrypting application-layer payload data.",
        "Allocating dynamic IP addresses to client devices in a subnet.",
        "Directing hardware packets based on MAC addresses."
      ],
      correctIdx: 0,
      explanation: "DNS acts as the phonebook of the internet, resolving memorable domains to machine-readable IP addresses."
    }
  ],
  "pre-oop-7": [
    {
      id: "oop-7-q1",
      question: "What does 'Polymorphism' enable in OOP?",
      options: [
        "Hiding class attributes inside private scopes.",
        "Creating multiple variables of differing primitive types in a single class.",
        "Allowing different subclasses to be treated uniformly through a shared interface, behaving differently based on their actual type.",
        "Enforcing a class to have only one active instance in memory."
      ],
      correctIdx: 2,
      explanation: "Polymorphism ('many forms') allows subclasses to override methods of a superclass, enabling a uniform interface to trigger specialized subclass behaviors."
    },
    {
      id: "oop-7-q2",
      question: "What is the main difference between an Abstract Class and an Interface?",
      options: [
        "Interfaces can be instantiated directly; abstract classes cannot.",
        "Interfaces can contain private attributes, whereas abstract classes are limited to public methods.",
        "A class can inherit from only one abstract class but can implement multiple interfaces (in most languages like Java/C#). Abstract classes can also hold state variables.",
        "There is no difference; they are syntactic synonyms."
      ],
      correctIdx: 2,
      explanation: "Abstract classes support single inheritance and can store state (instance fields) and default logic, whereas Interfaces represent pure structural behaviors and support multiple implementation inheritance."
    },
    {
      id: "oop-7-q3",
      question: "Which design pattern restricts instantiation of a class to exactly one single instance?",
      options: [
        "Factory Pattern",
        "Singleton Pattern",
        "Observer Pattern",
        "Strategy Pattern"
      ],
      correctIdx: 1,
      explanation: "The Singleton Pattern ensures a class has only one instance and provides a global access point to it."
    }
  ],
  "pre-se-8": [
    {
      id: "se-8-q1",
      question: "What is the primary characteristic of 'Agile' software development?",
      options: [
        "Strictly executing phases sequentially without backward loops.",
        "Iterative development with short sprints, promoting adaptivity and rapid user feedback.",
        "Eliminating the need for architectural design and code documentation completely.",
        "Restricting development to a single, cross-compiled compiler."
      ],
      correctIdx: 1,
      explanation: "Agile values adaptation, collaborative team feedback, and delivering functional software incrementally in short, iterative sprints."
    },
    {
      id: "se-8-q2",
      question: "In the SOLID principles, what does the 'L' (Liskov Substitution Principle) state?",
      options: [
        "Lines of code must be minimized to avoid performance degradation.",
        "Subtypes must be completely substitutable for their base types without altering the correctness of the program.",
        "Libraries must be loaded lazily at runtime to prevent cold start latency.",
        "Logical loops must be decoupled into independent helper functions."
      ],
      correctIdx: 1,
      explanation: "Liskov Substitution states that objects of a superclass should be replaceable with objects of its subclasses without breaking application correctness."
    },
    {
      id: "se-8-q3",
      question: "What is the purpose of Refactoring code?",
      options: [
        "Adding new features to meet expanded client requirements.",
        "Improving internal code structure and readability without changing its external behavior.",
        "Compiling scripts into bare-metal machine code to boost runtime speeds.",
        "Rewriting frontend interfaces in a different framework."
      ],
      correctIdx: 1,
      explanation: "Refactoring improves internal attributes (readability, complexity, modularity) while preserving exactly the same external system behavior."
    }
  ],
  "pre-web-9": [
    {
      id: "web-9-q1",
      question: "Which of the following describes the 'DOM' in web browser environments?",
      options: [
        "A distributed cache network hosting assets.",
        "An object-oriented representation of the web page structure (Document Object Model) that can be modified with scripting languages.",
        "A security protocol preventing cross-site scripting.",
        "A metadata standard specifying search engine indexing parameters."
      ],
      correctIdx: 1,
      explanation: "The DOM represents the hierarchical element tree of an HTML document in memory, exposing it to languages like JavaScript for dynamic manipulation."
    },
    {
      id: "web-9-q2",
      question: "In CSS Flexbox, which property controls alignment along the main axis?",
      options: [
        "align-items",
        "align-content",
        "justify-content",
        "flex-direction"
      ],
      correctIdx: 2,
      explanation: "'justify-content' aligns items along the main axis of a flex container, while 'align-items' controls alignment along the cross axis."
    },
    {
      id: "web-9-q3",
      question: "What does the event bubbling phase represent in JavaScript?",
      options: [
        "The browser loading stylesheets asynchronously.",
        "The phase where an event triggers on the innermost target element and propagates upwards to its parent elements in the DOM tree.",
        "A memory leak warning triggered by infinite loops.",
        "An automatic compiler optimization pooling identical string literals."
      ],
      correctIdx: 1,
      explanation: "Event bubbling propagates an event from the deepest, innermost target element upwards through its ancestor hierarchy in the DOM."
    }
  ],
  "pre-sql-10": [
    {
      id: "sql-10-q1",
      question: "What is the purpose of SQL Window Functions like ROW_NUMBER() or RANK()?",
      options: [
        "Opening secondary GUI windows to view data logs.",
        "Performing calculations across a set of table rows that are conceptually related to the current row, without collapsing them into a single summary row.",
        "Creating dynamic index indices over clustered columns.",
        "Splitting table schemas across distributed cloud partitions."
      ],
      correctIdx: 1,
      explanation: "Window functions calculate metrics across partitions of rows while retaining individual row identities, unlike GROUP BY which collapses rows into summary records."
    },
    {
      id: "sql-10-q2",
      question: "What is a major advantage of utilizing database Indexes?",
      options: [
        "They minimize physical disk storage requirements.",
        "They speed up SELECT queries significantly by providing fast O(log N) indexed lookups.",
        "They accelerate INSERT and UPDATE transactions.",
        "They automatically normalize tables up to BCNF."
      ],
      correctIdx: 1,
      explanation: "Indexes speed up read operations (lookups, filters, joins) but actually slow down writes (INSERT, UPDATE) because the index trees must be modified as well."
    },
    {
      id: "sql-10-q3",
      question: "Which JOIN returns all records from the left table, and matching records from the right table, filling with NULLs where there is no match?",
      options: [
        "INNER JOIN",
        "LEFT JOIN",
        "RIGHT JOIN",
        "FULL JOIN"
      ],
      correctIdx: 1,
      explanation: "A LEFT JOIN (or LEFT OUTER JOIN) preserves all rows of the left table, joining matching right rows and injecting NULL values where the right table has no match."
    }
  ],
  // Fallbacks or high-quality custom questions for the remaining 40 subjects
  // To be robust and clean, we will populate the rest with dynamic or custom questions.
  // Let's program high-quality questions for other key subjects!
  "pre-java-11": [
    {
      id: "java-11-q1",
      question: "What compiles Java source code (.java) into platform-independent bytecode (.class)?",
      options: ["JVM", "JRE", "javac", "JDK-Linker"],
      correctIdx: 2,
      explanation: "The 'javac' compiler parses Java source files and produces target bytecode that runs on any JVM."
    },
    {
      id: "java-11-q2",
      question: "Which memory region in Java stores objects created via the 'new' keyword?",
      options: ["Stack Memory", "Heap Memory", "Method Area", "Registers"],
      correctIdx: 1,
      explanation: "All object allocations in Java reside on the garbage-collected Heap. Stack memory holds primitive variables and thread execution frames."
    },
    {
      id: "java-11-q3",
      question: "What is the main advantage of Java's Garbage Collection?",
      options: [
        "It speeds up execution times to surpass raw C pointers.",
        "It automatically reclaims unused heap memory, eliminating manual deallocation memory leak bugs.",
        "It prevents database access collisions.",
        "It compiles classes into web assemblies."
      ],
      correctIdx: 1,
      explanation: "Java's garbage collector automatically frees memory allocated to objects that are no longer referenced, safeguarding against manual memory leaks."
    }
  ],
  "pre-c-12": [
    {
      id: "c-12-q1",
      question: "What occurs if you write to a pointer that has already been freed in C?",
      options: [
        "The compiler throws a syntax error immediately.",
        "The garbage collector automatically reallocates memory.",
        "Undefined behavior occurs, which could corrupt memory or crash the application.",
        "The value is redirected to a null stream."
      ],
      correctIdx: 2,
      explanation: "Writing to or reading from a freed pointer represents a 'Use After Free' bug, leading to undefined behavior, potential memory corruption, or segmentation faults."
    },
    {
      id: "c-12-q2",
      question: "Which function allocates memory on the Heap in C without initializing it?",
      options: ["malloc()", "calloc()", "realloc()", "alloc()"],
      correctIdx: 0,
      explanation: "malloc() allocates raw uninitialized heap memory. calloc() allocates and initializes memory blocks to zero."
    },
    {
      id: "c-12-q3",
      question: "What does the dereference operator '*' do to a pointer in C?",
      options: [
        "Gets the raw memory address of the pointer variable.",
        "Accesses the actual value stored at the memory address the pointer is pointing to.",
        "Multiplies two pointer address blocks.",
        "Clears the pointer from the heap scope."
      ],
      correctIdx: 1,
      explanation: "Dereferencing a pointer accesses the data value residing at the address stored in the pointer."
    }
  ],
  "pre-cpp-13": [
    {
      id: "cpp-13-q1",
      question: "What does the RAII (Resource Acquisition Is Initialization) design pattern guarantee in C++?",
      options: [
        "Compiler loops are vectorized for CPU performance.",
        "Resources are bound to the lifetime of stack objects, ensuring automatic cleanup upon scope exit.",
        "All classes must implement virtual methods.",
        "Pointers are cast to reference handles at compile-time."
      ],
      correctIdx: 1,
      explanation: "RAII ties resource management (locks, sockets, heap memory) to stack-allocated object scopes: when the object is destroyed on exit, its destructor releases the resources."
    },
    {
      id: "cpp-13-q2",
      question: "Which C++ smart pointer maintains a reference count of owners, deleting the resource when the count hits zero?",
      options: ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"],
      correctIdx: 1,
      explanation: "std::shared_ptr uses reference counting. When the last shared_ptr pointing to a resource is destroyed, the resource is automatically deleted."
    },
    {
      id: "cpp-13-q3",
      question: "What is an advantage of C++ STL containers like std::vector over standard C arrays?",
      options: [
        "Vector has O(1) insertion anywhere.",
        "Vector handles dynamic resizing automatically and offers safer boundary checking with .at().",
        "Vector occupies less cache space.",
        "Vector is compiled to machine threads automatically."
      ],
      correctIdx: 1,
      explanation: "std::vector manages its own backing array, dynamically expanding its capacity when elements are added and offering bound-checked access."
    }
  ],
  "pre-fs-14": [
    {
      id: "fs-14-q1",
      question: "What is the primary role of a 'Reverse Proxy' (like Nginx) in full-stack architectures?",
      options: [
        "Compiling static React builds into Node classes.",
        "Routing client requests to correct backend API servers, balancing loads, and terminating SSL.",
        "Hosting database collections in-memory.",
        "Running continuous integration unit tests."
      ],
      correctIdx: 1,
      explanation: "A reverse proxy acts as an intermediary, receiving client requests and forwarding them to various server backends to optimize security, load, and performance."
    },
    {
      id: "fs-14-q2",
      question: "What does CORS stand for, and why is it enforced by browsers?",
      options: [
        "Cross-Origin Resource Sharing; it restricts web pages from making API requests to a different domain unless permitted.",
        "Compiled Object Runtime Security; it checks local file formats.",
        "Client Optimization Rendering System; it minifies style bundles.",
        "Centralized Operational Registry Service; it manages routes."
      ],
      correctIdx: 0,
      explanation: "CORS is a browser security mechanism that blocks scripts on one origin from accessing assets on another origin unless the target server explicitly approves the request headers."
    },
    {
      id: "fs-14-q3",
      question: "Which of the following represents a stateless authentication mechanism commonly used in APIs?",
      options: ["Server-side SQL Session", "JSON Web Tokens (JWT)", "Redis Cache Session Cookie", "Local Node memory variable"],
      correctIdx: 1,
      explanation: "JWTs are self-contained, cryptographically signed tokens containing authorization claims, allowing stateless authentication without server-side database lookups on every request."
    }
  ],
  "pre-mern-15": [
    {
      id: "mern-15-q1",
      question: "In MongoDB, what format is utilized to represent and store database documents?",
      options: ["Relational Tuples", "XML Schemas", "BSON (Binary JSON)", "CSV Tables"],
      correctIdx: 2,
      explanation: "MongoDB represents documents as BSON (Binary JSON) records, supporting rich embedded objects and array types."
    },
    {
      id: "mern-15-q2",
      question: "How does Mongoose interface with MongoDB in a Node.js server?",
      options: [
        "It acts as an Object Data Modeling (ODM) library, providing schema validation and a fluent query API.",
        "It compiles JavaScript into raw database indexes.",
        "It replaces the database cache memory entirely.",
        "It routes HTTP packets directly to database tables."
      ],
      correctIdx: 0,
      explanation: "Mongoose is a Node.js ODM library for MongoDB, enabling structured schema declarations, type casting, validation, and database operations."
    },
    {
      id: "mern-15-q3",
      question: "Which tool or library manages dynamic client-side routes in a MERN application?",
      options: ["Express.js router", "Mongoose schema", "React Router", "PM2 Process Manager"],
      correctIdx: 2,
      explanation: "React Router is the standard library utilized in React frontends to manage browser URL paths and render corresponding views without full page reloads."
    }
  ],
  "pre-react-16": [
    {
      id: "react-16-q1",
      question: "How does the React Virtual DOM optimize page rendering?",
      options: [
        "By bypassing browser styles and painting components directly onto a canvas.",
        "By batching component state changes, diffing a virtual tree with the real DOM, and applying only the necessary modifications.",
        "By compiling Javascript components into native C scripts.",
        "By storing image assets inside a service worker cache."
      ],
      correctIdx: 1,
      explanation: "React's Virtual DOM reconciliation minimizes expensive real-browser DOM updates by computing structural differences (diffing) and executing surgical repaints."
    },
    {
      id: "react-16-q2",
      question: "What must you avoid in a useEffect dependency array to prevent infinite loops?",
      options: [
        "Primitive numbers and booleans.",
        "Unstabilized object or array literals declared inside the component body without memoization.",
        "Callback pointers bound to outside global constants.",
        "Standard state setter functions (e.g. setCount)."
      ],
      correctIdx: 1,
      explanation: "Declaring object or array literals inside a component creates a fresh memory address on every single render. Placing them in a dependency array causes useEffect to fire continuously, triggering infinite re-renders."
    },
    {
      id: "react-16-q3",
      question: "What does React's 'useMemo' hook achieve?",
      options: [
        "Forces a component to render synchronously.",
        "Memoizes the computed result of an expensive calculation, re-running it only when specified dependencies change.",
        "Loads code chunks asynchronously at runtime.",
        "Creates a persistent local database in the browser."
      ],
      correctIdx: 1,
      explanation: "useMemo caches the output of expensive calculations, preventing wasteful redundant processing on every single component render unless dependants shift."
    }
  ],
  "pre-node-17": [
    {
      id: "node-17-q1",
      question: "How does Node.js handle thousands of concurrent client connections with a single execution thread?",
      options: [
        "By spawning virtual threads at the CPU cache level.",
        "By utilizing a non-blocking event loop backed by the libuv library to handle asynchronous I/O calls.",
        "By forcing clients to wait in a serialized FIFO network queue.",
        "By compiling JavaScript directly into assembly routines."
      ],
      correctIdx: 1,
      explanation: "Node.js uses an event-driven, non-blocking I/O model. It delegates heavy system actions (file access, network sockets) to underlying OS threads, continuing loop execution and processing callbacks on completion."
    },
    {
      id: "node-17-q2",
      question: "What is an Express.js 'middleware' function?",
      options: [
        "A script that communicates with backend databases exclusively.",
        "A function that has access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.",
        "A caching mechanism located on CDN routers.",
        "A compiler script minifying frontend CSS assets."
      ],
      correctIdx: 1,
      explanation: "Express middleware functions intercept, inspect, or modify incoming requests and outgoing responses, or end the lifecycle, and can call next() to pass control."
    },
    {
      id: "node-17-q3",
      question: "Why should you prefer Node Streams when handling massive video files?",
      options: [
        "Streams compress file sizes automatically.",
        "Streams read and write files chunk-by-chunk without loading the entire file into server RAM, preventing memory exhaustion.",
        "Streams convert binary code to text strings.",
        "Streams execute on multiple processor cores parallelly."
      ],
      correctIdx: 1,
      explanation: "Streams process files buffer-by-buffer, establishing high performance with low, predictable memory footprints regardless of file size."
    }
  ],
  "pre-git-18": [
    {
      id: "git-18-q1",
      question: "What is the difference between 'git fetch' and 'git pull'?",
      options: [
        "Fetch updates local branch files; pull does not.",
        "Fetch downloads changes from a remote repository without merging them. Pull downloads and immediately merges them into the active branch.",
        "Fetch requires root permissions; pull does not.",
        "Fetch deletes stashed modifications; pull commits them."
      ],
      correctIdx: 1,
      explanation: "git fetch retrieves metadata and files from the remote server but leaves your local work untouched. git pull is shorthand for git fetch followed immediately by git merge."
    },
    {
      id: "git-18-q2",
      question: "What does 'git rebase' achieve compared to 'git merge'?",
      options: [
        "Rebase creates a separate merge commit preserving chronological history.",
        "Rebase reapplies commits on top of another base tip, creating a clean linear project history without merge commits.",
        "Rebase compiles scripts to local stashes.",
        "Rebase deletes the commit logs from remote servers."
      ],
      correctIdx: 1,
      explanation: "git rebase rewrites project history by moving your branch commits onto the current tip of the target branch, keeping commits sequential and flat."
    },
    {
      id: "git-18-q3",
      question: "What is the function of the .gitignore file?",
      options: [
        "It blocks team members from pulling code.",
        "It specifies file patterns and directories that Git should completely ignore and refuse to track (e.g. node_modules, build targets, secrets).",
        "It encrypts private variables.",
        "It deletes duplicate files on commit."
      ],
      correctIdx: 1,
      explanation: ".gitignore stops local credentials, large libraries (like node_modules), or build artifacts from being committed and pushed to repositories."
    }
  ],
  "pre-linux-19": [
    {
      id: "linux-19-q1",
      question: "In Linux, which command sets file permissions to read, write, and execute for the owner, and read-only for others?",
      options: ["chmod 777 file", "chmod 755 file", "chmod 644 file", "chmod 700 file"],
      correctIdx: 1,
      explanation: "chmod 755 translates to: Owner = 7 (4+2+1: Read+Write+Execute), Group = 5 (4+1: Read+Execute), Others = 5 (4+1: Read+Execute)."
    },
    {
      id: "linux-19-q2",
      question: "What does the pipe operator '|' achieve in a Bash terminal?",
      options: [
        "Redirects console errors to a text file.",
        "Passes the standard output of the preceding command as the standard input to the following command.",
        "Executes two terminal commands concurrently in background threads.",
        "Deletes temporary directory registers."
      ],
      correctIdx: 1,
      explanation: "The pipe character connects command flows, feeding the stdout of one program directly into the stdin of another."
    },
    {
      id: "linux-19-q3",
      question: "Which of the following commands searches files for matching text patterns using regular expressions?",
      options: ["find", "grep", "sed", "awk"],
      correctIdx: 1,
      explanation: "grep (Global Regular Expression Print) searches plain-text files for lines matching a specified regular expression pattern."
    }
  ],
  "pre-coa-20": [
    {
      id: "coa-20-q1",
      question: "What is the primary objective of CPU Pipelining?",
      options: [
        "Merging physical cores into a single thread.",
        "Increasing instruction throughput by overlapping the execution phases (Fetch, Decode, Execute) of multiple instructions.",
        "Securing registers against memory leakage.",
        "Compiling routines directly onto cache chips."
      ],
      correctIdx: 1,
      explanation: "Pipelining keeps different sub-units of the CPU active concurrently, completing an instruction on every clock cycle in ideal situations."
    },
    {
      id: "coa-20-q2",
      question: "Why is Cache Memory categorized into different levels (L1, L2, L3)?",
      options: [
        "To split data based on privacy constraints.",
        "To balance access speeds and physical storage capacities (L1 is smallest but fastest, L3 is largest but slower).",
        "To manage virtual addresses in discrete clusters.",
        "To support multiple operating systems on the same drive."
      ],
      correctIdx: 1,
      explanation: "Memory hierarchy balances costs and speeds: L1 resides closest to the execution units matching CPU speeds, while L2 and L3 provide larger capacities with slight latencies."
    },
    {
      id: "coa-20-q3",
      question: "What does the Program Counter (PC) register store?",
      options: [
        "The accumulated sum of mathematical arithmetic operations.",
        "The memory address of the next instruction waiting to be fetched and executed.",
        "The count of currently running threads.",
        "The cache hit-rate percentage."
      ],
      correctIdx: 1,
      explanation: "The PC register tracks the execution path, holding the address of the next sequential instruction in memory."
    }
  ],
  "pre-ai-21": [
    {
      id: "ai-21-q1",
      question: "In Minimax search trees, what is the role of Alpha-Beta Pruning?",
      options: [
        "Generating random heuristics dynamically.",
        "Pruning (discarding) branches in the search tree that are mathematically proven to not influence the final minimax decision, reducing search times.",
        "Converting continuous variables to separate boolean states.",
        "Resolving syntax errors in prolog scripts."
      ],
      correctIdx: 1,
      explanation: "Alpha-beta pruning eliminates redundant branches from evaluation once a path is found that is guaranteed to be worse than previously explored options, doubling search depth in optimal cases."
    },
    {
      id: "ai-21-q2",
      question: "Which of the following describes the A* Search algorithm?",
      options: [
        "A greedy search that evaluates only node depths.",
        "An informed path-finding search that uses both path costs and heuristic estimates to find the shortest path efficiently.",
        "An un-informed search that traverses nodes in random batches.",
        "A sorting routine mapping elements on a coordinate plane."
      ],
      correctIdx: 1,
      explanation: "A* evaluates nodes using f(n) = g(n) + h(n), where g(n) is the cost from start, and h(n) is the heuristic estimate to the goal, ensuring optimal paths if h(n) is admissible."
    },
    {
      id: "ai-21-q3",
      question: "What does 'Admissibility' of a heuristic mean in pathfinding?",
      options: [
        "The heuristic never underestimates the actual cost to reach the goal.",
        "The heuristic never overestimates the actual cost to reach the goal, guaranteeing A* finds the absolute shortest path.",
        "The heuristic can be executed in O(1) time.",
        "The heuristic is compatible with relational databases."
      ],
      correctIdx: 1,
      explanation: "An admissible heuristic is optimistic, never overestimating the remaining cost, which mathematically guarantees that A* will find the shortest path."
    }
  ],
  "pre-ml-22": [
    {
      id: "ml-22-q1",
      question: "What represents 'Overfitting' in Machine Learning?",
      options: [
        "A model that performs poorly on both training and test datasets.",
        "A model that learns training data noise too well, achieving high training accuracy but failing to generalize to unseen test data.",
        "A model that runs too slowly on graphic processors.",
        "A classification threshold that defaults to zero."
      ],
      correctIdx: 1,
      explanation: "Overfitting occurs when a complex model captures training set noise instead of underlying signals, causing poor test-set generalization."
    },
    {
      id: "ml-22-q2",
      question: "Which machine learning algorithm partitions data into K separate clusters based on distance centroids?",
      options: ["K-Means Clustering", "Support Vector Machines", "Random Forest", "Logistic Regression"],
      correctIdx: 0,
      explanation: "K-Means is an unsupervised clustering algorithm grouping records into K clusters, iteratively shifting centroids to minimize within-cluster variances."
    },
    {
      id: "ml-22-q3",
      question: "What is the purpose of a Confusion Matrix?",
      options: [
        "Analyzing compiler grammar errors.",
        "Evaluating the performance of a classification model by showing true positives, false positives, true negatives, and false negatives.",
        "Resolving merge conflicts in source repositories.",
        "Sharding relational tables across servers."
      ],
      correctIdx: 1,
      explanation: "A confusion matrix organizes predicted vs actual classes, facilitating calculation of accuracy, precision, recall, and F1 scores."
    }
  ],
  "pre-dl-23": [
    {
      id: "dl-23-q1",
      question: "In deep neural networks, what does the backpropagation algorithm compute?",
      options: [
        "The ultimate prediction error scores.",
        "The gradients of the loss function with respect to the network weights, propagating errors backward using the calculus chain rule.",
        "The optimal count of neuron layers.",
        "The initialization vector of the input datasets."
      ],
      correctIdx: 1,
      explanation: "Backpropagation calculates partial derivatives of the loss function layer-by-layer backwards, providing the gradients needed by optimization loops (like SGD or Adam) to update weights."
    },
    {
      id: "dl-23-q2",
      question: "Which architecture is specifically optimized for spatial, grid-like datasets (like digital images)?",
      options: ["Recurrent Neural Networks (RNN)", "Convolutional Neural Networks (CNN)", "Generative Adversarial Networks (GAN)", "Autoencoders"],
      correctIdx: 1,
      explanation: "CNNs use shared weights and convolutional filters to extract local features (edges, textures) from images, establishing translation invariance."
    },
    {
      id: "dl-23-q3",
      question: "What is the role of an Activation Function (like ReLU or Sigmoid) in deep networks?",
      options: [
        "Normalizing input datasets to zero-means.",
        "Introducing non-linearities into the network, enabling it to learn complex non-linear relationships.",
        "Restricting weight updates to integer values.",
        "Controlling the learning rate speed."
      ],
      correctIdx: 1,
      explanation: "Without non-linear activation functions, nesting multiple linear neural layers collapses mathematically into a single linear transformation, limiting representational capacity."
    }
  ],
  "pre-ds-24": [
    {
      id: "ds-24-q1",
      question: "What is the primary utility of 'Exploratory Data Analysis' (EDA)?",
      options: [
        "Deploying ML pipelines to production servers.",
        "Summarizing and analyzing core features of a dataset visually and statistically to understand relationships before modeling.",
        "Normalizing database tables to BCNF.",
        "Securing API endpoints against malicious requests."
      ],
      correctIdx: 1,
      explanation: "EDA uses statistical summaries, scatter plots, and histograms to identify data types, structures, outliers, anomalies, and correlations."
    },
    {
      id: "ds-24-q2",
      question: "In Pandas, which method filters rows of a DataFrame based on boolean criteria?",
      options: ["df.groupby()", "df.query() or df[boolean_mask]", "df.pivot()", "df.describe()"],
      correctIdx: 1,
      explanation: "Rows can be filtered in Pandas using boolean indexing (e.g. `df[df['age'] > 30]`) or the fluent `df.query()` interface."
    },
    {
      id: "ds-24-q3",
      question: "What does the R-squared value represent in linear regression?",
      options: [
        "The computation time complexity of the model.",
        "The proportion of variance in the dependent variable that is predictable from the independent variables.",
        "The sum of squared validation errors.",
        "The learning rate slope."
      ],
      correctIdx: 1,
      explanation: "R-squared (coefficient of determination) measures model fit, indicating how much of the target variable's variance is explained by the features."
    }
  ],
  "pre-nlp-25": [
    {
      id: "nlp-25-q1",
      question: "In text processing, what is the difference between Stemming and Lemmatization?",
      options: [
        "Stemming encrypts words; lemmatization translates them.",
        "Stemming chops off word ends crudely using simple rules. Lemmatization uses grammatical rules and dictionaries to return a valid dictionary base word (lemma).",
        "Stemming is fast; lemmatization does not require execution loops.",
        "Stemming operates on numbers; lemmatization on characters."
      ],
      correctIdx: 1,
      explanation: "Stemming crude chopping (e.g., 'studies' becomes 'studi'), whereas lemmatization contextualizes parts of speech to yield proper base words (e.g., 'studies' becomes 'study')."
    },
    {
      id: "nlp-25-q2",
      question: "Which mechanism in Transformer networks allows the model to weight the importance of different words in a sentence relative to each other?",
      options: ["Backpropagation", "Self-Attention Mechanism", "Recurrent Gates", "Max Pooling"],
      correctIdx: 1,
      explanation: "The Self-Attention mechanism computes dynamic attention weights between all word tokens in a sequence, allowing the model to capture long-range contextual relationships."
    },
    {
      id: "nlp-25-q3",
      question: "What does TF-IDF measure in text mining?",
      options: [
        "The execution time of tokenizers.",
        "The frequency of a term in a specific document relative to its commonality across the entire document collection, identifying unique keyword relevance.",
        "The deep semantic alignment of sentence blocks.",
        "The count of grammatical grammar errors."
      ],
      correctIdx: 1,
      explanation: "Term Frequency-Inverse Document Frequency highlights terms that are highly frequent in a specific file but rare elsewhere, identifying distinct keywords."
    }
  ],
  "pre-cv-26": [
    {
      id: "cv-26-q1",
      question: "Which of the following is commonly used as an edge-detection filter in Computer Vision?",
      options: ["Sobel Filter", "Gaussian Blur", "Median Blur", "Bilateral Filter"],
      correctIdx: 0,
      explanation: "The Sobel filter computes spatial gradients of image intensities, highlighting sudden luminance changes which represent edges."
    },
    {
      id: "cv-26-q2",
      question: "What does image 'Segmentation' refer to?",
      options: [
        "Compressing images into smaller file formats.",
        "Partitioning a digital image into multiple segments (sets of pixels, objects) to simplify analysis.",
        "Translating color spaces from RGB to HSV.",
        "Adding watermarks to files."
      ],
      correctIdx: 1,
      explanation: "Segmentation isolates boundaries and individual objects in an image by categorizing every single pixel into distinct logical masks."
    },
    {
      id: "cv-26-q3",
      question: "In object detection, what does the 'IoU' (Intersection over Union) metric evaluate?",
      options: [
        "The resolution quality of input images.",
        "The overlap between a predicted bounding box and the ground truth bounding box.",
        "The latency speed of feature extractions.",
        "The color histogram differences."
      ],
      correctIdx: 1,
      explanation: "IoU is the ratio of intersection area over union area of predicted vs ground-truth bounding boxes, evaluating spatial localization accuracy."
    }
  ],
  "pre-da-27": [
    {
      id: "da-27-q1",
      question: "What is the difference between Descriptive and Predictive analytics?",
      options: [
        "Descriptive analytics is manual; predictive is fully automatic.",
        "Descriptive analytics summarizes historical data trends (what happened). Predictive analytics uses statistical models to forecast future trends (what might happen).",
        "Descriptive operates on SQL databases; predictive on NoSQL.",
        "Descriptive requires python; predictive uses only spreadsheets."
      ],
      correctIdx: 1,
      explanation: "Descriptive analytics explores past records (using BI dashboards, charts), whereas predictive models analyze patterns to forecast likelihoods of future behaviors."
    },
    {
      id: "da-27-q2",
      question: "Which chart is best suited for illustrating the correlation or distribution between two continuous numerical variables?",
      options: ["Pie Chart", "Bar Chart", "Scatter Plot", "Stacked Area Chart"],
      correctIdx: 2,
      explanation: "Scatter plots map individual data coordinates along X and Y axes, making visual clustering, correlation slopes, and outliers instantly visible."
    },
    {
      id: "da-27-q3",
      question: "What is an 'Outlier' in a dataset?",
      options: [
        "A column that has no values.",
        "A data point that deviates significantly from the rest of the observations, suggesting anomalies or special cases.",
        "A data variable stored outside the physical database.",
        "A syntax error in data formulas."
      ],
      correctIdx: 1,
      explanation: "Outliers are highly divergent values that lie far outside the average distribution of a variable, which can skew statistical models if unaddressed."
    }
  ],
  "pre-bd-28": [
    {
      id: "bd-28-q1",
      question: "How does Hadoop HDFS ensure data reliability in distributed clusters?",
      options: [
        "By restricting files to single servers.",
        "By dividing files into blocks and replicating them across multiple physical data nodes.",
        "By encrypting folders with RSA keys.",
        "By enforcing ACID transactions on local directories."
      ],
      correctIdx: 1,
      explanation: "HDFS divides files into blocks (typically 128MB) and replicates each block across multiple servers (default 3x) to handle hardware node failures without data loss."
    },
    {
      id: "bd-28-q2",
      question: "Why is Apache Spark generally faster than classic Hadoop MapReduce?",
      options: [
        "Spark uses a single execution thread.",
        "Spark processes data in-memory (RAM) instead of continuously writing intermediate results back to physical disk.",
        "Spark is compiled directly to native assemblies.",
        "Spark disables garbage collection."
      ],
      correctIdx: 1,
      explanation: "MapReduce writes results to physical disks between map and reduce stages. Spark maintains intermediate states in-memory, accelerating multi-stage processing pipelines significantly."
    },
    {
      id: "bd-28-q3",
      question: "In distributed computing, what does 'Sharding' refer to?",
      options: [
        "Compacting small log files.",
        "Horizontal partitioning of database records across multiple database nodes or cluster servers.",
        "Replicating configuration profiles across nodes.",
        "Compiling classes parallelly."
      ],
      correctIdx: 1,
      explanation: "Sharding breaks a database into horizontal slices (shards), spreading the load and data capacity across multiple physical servers."
    }
  ],
  "pre-cloud-29": [
    {
      id: "cloud-29-q1",
      question: "What is 'Serverless Computing' (e.g. AWS Lambda, Cloud Run)?",
      options: [
        "Computing executed without physical processor chips.",
        "A model where cloud providers automatically manage server provisioning, patching, and scaling, charging users only for actual resource consumption during code executions.",
        "Hosting websites exclusively inside static caches.",
        "Securing local networks with virtual firewalls."
      ],
      correctIdx: 1,
      explanation: "Serverless abstracts server management entirely. The infrastructure scales up dynamically on demand (even to zero) and users pay strictly for execution time."
    },
    {
      id: "cloud-29-q2",
      question: "Which service category does Amazon EC2 fall under?",
      options: [
        "SaaS (Software as a Service)",
        "PaaS (Platform as a Service)",
        "IaaS (Infrastructure as a Service)",
        "Serverless Database"
      ],
      correctIdx: 2,
      explanation: "EC2 provides raw virtualized compute servers (instances), giving users full control over OS and configurations, representing classic Infrastructure as a Service."
    },
    {
      id: "cloud-29-q3",
      question: "What is the purpose of Identity and Access Management (IAM) in cloud security?",
      options: [
        "Generating database table backups.",
        "Enforcing secure access controls by defining which users, services, or roles have specific permissions on cloud resources.",
        "Configuring domain name routings.",
        "Allocating public IP subnets."
      ],
      correctIdx: 1,
      explanation: "IAM controls access rights in cloud networks, ensuring only authenticated and authorized identities can interact with target cloud APIs."
    }
  ],
  "pre-devops-30": [
    {
      id: "devops-30-q1",
      question: "What is the primary benefit of a CI/CD pipeline?",
      options: [
        "Eliminating the need for compiler installations.",
        "Automating the build, testing, and deployment phases to deliver software updates safely, rapidly, and consistently.",
        "Encrypting database transaction streams.",
        "Allowing multiple developers to use the same user login."
      ],
      correctIdx: 1,
      explanation: "Continuous Integration & Continuous Deployment pipelines automate manual integration steps, catching bugs early via tests and shipping verified updates to production."
    },
    {
      id: "devops-30-q2",
      question: "What does 'Infrastructure as Code' (IaC) enable?",
      options: [
        "Writing operating system kernels in Javascript.",
        "Defining, provisioning, and managing cloud server resources declaratively using version-controlled configuration scripts (e.g. Terraform).",
        "Compiling backend code directly onto microcontrollers.",
        "Storing file assets inside code comments."
      ],
      correctIdx: 1,
      explanation: "IaC treats infrastructure provisioning exactly like software, allowing system setups to be repeatable, consistent, and documented via declarative configuration files."
    },
    {
      id: "devops-30-q3",
      question: "Which of the following is a classic CI/CD automation tool?",
      options: ["Docker Desktop", "Jenkins", "Terraform Cloud", "Kubernetes Dashboard"],
      correctIdx: 1,
      explanation: "Jenkins is a classic, open-source automation server utilized to build, test, and deploy applications continuously."
    }
  ],
  "pre-docker-31": [
    {
      id: "docker-31-q1",
      question: "How does a Docker Container differ from a Virtual Machine (VM)?",
      options: [
        "Containers include full guest operating systems; VMs do not.",
        "Containers share the host operating system kernel, making them lightweight and fast. VMs run entire guest operating systems on top of hypervisors.",
        "Containers require physical CPU chips; VMs are purely software simulations.",
        "Containers are restricted to web browsers."
      ],
      correctIdx: 1,
      explanation: "Containers isolate user spaces but share the host OS kernel, booting in milliseconds with tiny footprints. VMs emulate hardware, requiring full OS copies and virtual disk space."
    },
    {
      id: "docker-31-q2",
      question: "In Kubernetes, what is a 'Pod'?",
      options: [
        "A physical rack hosting server computers.",
        "The smallest deployable unit, representing a single instance of a running process and hosting one or more closely coupled containers.",
        "A storage system backing up database tables.",
        "A security credential granting administrator access."
      ],
      correctIdx: 1,
      explanation: "Pods wrap containers, sharing network namespaces, storage volumes, and IP addresses within the Kubernetes cluster."
    },
    {
      id: "docker-31-q3",
      question: "What does a Dockerfile represent?",
      options: [
        "A system dashboard monitoring memory limits.",
        "A text file containing sequential instructions to build a self-contained container image automatically.",
        "An index file routing domain traffic.",
        "A database schema file."
      ],
      correctIdx: 1,
      explanation: "A Dockerfile contains all instructions (base image, dependencies, files, execution commands) to construct a reproducible container image."
    }
  ],
  "pre-security-32": [
    {
      id: "security-32-q1",
      question: "What does the CIA Triad of computer security represent?",
      options: [
        "Centralized, Integrated, Authenticated system boundaries.",
        "Confidentiality, Integrity, and Availability of data and services.",
        "Cyber Intrusion Alert parameters.",
        "Cryptographic Information Algorithms."
      ],
      correctIdx: 1,
      explanation: "The CIA triad defines the core goals of information security: Confidentiality (data privacy), Integrity (preventing unauthorized edits), and Availability (reliable system access)."
    },
    {
      id: "security-32-q2",
      question: "What is a 'Zero-Day Vulnerability'?",
      options: [
        "An exploit that occurs exactly at midnight.",
        "A security flaw that is known to the software vendor but has zero days remaining to patch before deployment.",
        "A security vulnerability that is actively exploited in the wild before the software developer is aware of it or has released a patch.",
        "A database table with zero columns."
      ],
      correctIdx: 2,
      explanation: "A zero-day exploit targets a flaw unknown to developers, giving them zero days to prepare defenses or deploy fixes before systems are breached."
    },
    {
      id: "security-32-q3",
      question: "Which of the following describes a 'Trojan Horse' attack?",
      options: [
        "An algorithm that decrypts files using brute-force loops.",
        "Malicious software disguised as a benign, useful program, tricking users into executing it.",
        "Overloading a port with high network traffic packets.",
        "Intercepting wireless signals."
      ],
      correctIdx: 1,
      explanation: "A Trojan hides malicious payload inside seemingly legitimate utilities, bypassing defenses via user deception."
    }
  ],
  "pre-eh-33": [
    {
      id: "eh-33-q1",
      question: "What represents OWASP Top 10?",
      options: [
        "The ten fastest compiler tools in software development.",
        "A regularly updated report outlining the ten most critical security vulnerabilities found in web applications.",
        "Ten hardware certifications required for cloud administrators.",
        "Ten programming languages supported by standard browsers."
      ],
      correctIdx: 1,
      explanation: "OWASP (Open Web Application Security Project) publishes the Top 10 list to raise awareness of critical web flaws (like SQL Injection, Broken Auth) and guide defenses."
    },
    {
      id: "eh-33-q2",
      question: "What is SQL Injection (SQLi)?",
      options: [
        "An optimization technique compiling queries into memory.",
        "An attack where malicious SQL statements are inserted into entry fields, executing commands on the backend database.",
        "A tool that generates relational schemas automatically.",
        "An encrypted database backup protocol."
      ],
      correctIdx: 1,
      explanation: "SQLi occurs when unvalidated user inputs are concatenated directly into database queries, allowing attackers to manipulate queries, access restricted tables, or modify data."
    },
    {
      id: "eh-33-q3",
      question: "Which security defense best protects against SQL Injection attacks?",
      options: [
        "Hashing passwords with MD5.",
        "Using Parameterized Queries (Prepared Statements) to separate input data from SQL instructions.",
        "Disabling physical server ports.",
        "Minifying Javascript client scripts."
      ],
      correctIdx: 1,
      explanation: "Prepared statements parameterize queries, treating user input strictly as literal values rather than executable code instructions, entirely blocking injection payloads."
    }
  ],
  "pre-ns-34": [
    {
      id: "ns-34-q1",
      question: "What is the primary function of a Stateful Firewall?",
      options: [
        "Managing dynamic state variables inside client-side apps.",
        "Inspecting network packets based on connection states, tracking active sessions, and blocking unexpected traffic.",
        "Routing public domain traffic to gateway partitions.",
        "Encrypting hard drives."
      ],
      correctIdx: 1,
      explanation: "Stateful firewalls track the status of network connections (e.g. TCP handshake states), allowing inbound packets only if they belong to a verified, pre-established outbound connection."
    },
    {
      id: "ns-34-q2",
      question: "What is an Intrusion Detection System (IDS)?",
      options: [
        "A lock protecting access to physical server racks.",
        "A system that monitors network traffic for suspicious signatures, generating alerts when potential breaches or attacks are identified.",
        "An authentication screen checking employee credentials.",
        "A firewall blocking ports automatically."
      ],
      correctIdx: 1,
      explanation: "An IDS acts as a security camera for network traffic, scanning packets for known exploit signatures or anomaly patterns and triggering administrator alerts."
    },
    {
      id: "ns-34-q3",
      question: "How does a Virtual Private Network (VPN) secure network traffic?",
      options: [
        "By hosting sites in virtual cloud servers.",
        "By encrypting data packets during transmission, routing them through a secure tunnel to protect communications over public channels.",
        "By deleting duplicate browser cookies.",
        "By blocking javascript execution."
      ],
      correctIdx: 1,
      explanation: "VPNs encapsulate and encrypt data transit, hiding IP addresses and securing packets from packet-sniffing eavesdroppers on public networks."
    }
  ],
  "pre-crypto-35": [
    {
      id: "crypto-35-q1",
      question: "What is the fundamental difference between Symmetric and Asymmetric Cryptography?",
      options: [
        "Symmetric encryption is slow; asymmetric is fast.",
        "Symmetric uses a single secret key for both encryption and decryption. Asymmetric uses a mathematically linked public-private key pair.",
        "Symmetric requires databases; asymmetric operates offline.",
        "Symmetric is insecure; asymmetric cannot be decrypted."
      ],
      correctIdx: 1,
      explanation: "Symmetric (e.g. AES) relies on shared secrets. Asymmetric (e.g. RSA) separates key roles: public keys encrypt, whereas only corresponding private keys decrypt."
    },
    {
      id: "crypto-35-q2",
      question: "What describes a Cryptographic Hash function (like SHA-256)?",
      options: [
        "A reversible formula that compresses files.",
        "A one-way mathematical function that maps input data of any size to a unique fixed-size output string, which cannot be reversed to discover inputs.",
        "An encryption algorithm utilizing dynamic key shifts.",
        "A database index speeding up queries."
      ],
      correctIdx: 1,
      explanation: "Hash functions are irreversible, deterministic, and collision-resistant. Altering even a single bit of input changes the output hash entirely (avalanche effect)."
    },
    {
      id: "crypto-35-q3",
      question: "What does a Digital Signature guarantee?",
      options: [
        "The browser layout is secure.",
        "Authenticity, non-repudiation, and message integrity, verifying that the file was signed by a specific owner and was not altered in transit.",
        "A server is hosted inside a certified cloud center.",
        "A file is compressed correctly."
      ],
      correctIdx: 1,
      explanation: "Digital signatures are created with private keys and verified with public keys, mathematically proving origin authenticity and file integrity."
    }
  ],
  "pre-android-36": [
    {
      id: "android-36-q1",
      question: "In Android development, what is Jetpack Compose?",
      options: [
        "A package builder tool packaging APKs.",
        "A modern, declarative UI toolkit utilizing Kotlin to construct responsive layouts with less code.",
        "A database abstraction layer wrapping SQLite.",
        "A background task scheduler managing CPU priorities."
      ],
      correctIdx: 1,
      explanation: "Jetpack Compose is Google's declarative UI framework for Android, replacing old XML layouts with reactive Kotlin composables."
    },
    {
      id: "android-36-q2",
      question: "Which component represents the primary user interface screen in Android applications?",
      options: ["Service", "Broadcast Receiver", "Activity", "Content Provider"],
      correctIdx: 2,
      explanation: "An Activity is the core entry-point component representing a single physical window with an interactive user interface."
    },
    {
      id: "android-36-q3",
      question: "What is the function of Android's 'Room' library?",
      options: [
        "Managing multiplayer network sockets.",
        "Providing an abstraction layer over local SQLite databases, ensuring compile-time query validations and structured object mappings.",
        "Allocating memory spaces to dynamic threads.",
        "Rendering 3D room scenes."
      ],
      correctIdx: 1,
      explanation: "Room is an Jetpack ORM wrapping SQLite, mapping table records to Kotlin data classes with reactive updates."
    }
  ],
  "pre-flutter-37": [
    {
      id: "flutter-37-q1",
      question: "Which programming language is used to write Flutter applications?",
      options: ["TypeScript", "Kotlin", "Dart", "Swift"],
      correctIdx: 2,
      explanation: "Flutter uses Dart, a client-optimized programming language compiled natively to high-performance platform code."
    },
    {
      id: "flutter-37-q2",
      question: "What does the statement 'Everything is a Widget' represent in Flutter?",
      options: [
        "All variables are saved as dynamic objects.",
        "The entire user interface, including layouts, text, buttons, and padding, is built using modular nested widget classes.",
        "All scripts must run in web-view widgets.",
        "All database records are mapped to visual elements."
      ],
      correctIdx: 1,
      explanation: "Flutter's declarative UI composition nests widgets (layouts, styles, components) to build the structural frame of views."
    },
    {
      id: "flutter-37-q3",
      question: "How does Flutter achieve identical pixel rendering across both iOS and Android?",
      options: [
        "By translating code into native HTML webviews.",
        "By compiling code to native Android and iOS platform layout widgets.",
        "By utilizing its own high-performance rendering engine (Skia/Impeller) to paint every pixel directly onto a canvas.",
        "By forcing both platforms to run in emulator frames."
      ],
      correctIdx: 2,
      explanation: "Unlike React Native (which bridges to native widgets), Flutter bypasses OEM widgets and paints its own layouts directly onto the screen canvas, guaranteeing cross-platform layout identity."
    }
  ],
  "pre-rn-38": [
    {
      id: "rn-38-q1",
      question: "How does React Native render native interface components?",
      options: [
        "By hosting applications inside standard browser iFrames.",
        "By executing a JavaScript bridge that communicates layout commands to native platform UI widgets.",
        "By compiling Javascript files to raw C++ assemblies.",
        "By painting layouts on a canvas using a webGL engine."
      ],
      correctIdx: 1,
      explanation: "React Native uses a bridge architecture to translate React components (e.g. <View>) into real native widgets (e.g. UIView on iOS, ViewGroup on Android) at runtime."
    },
    {
      id: "rn-38-q2",
      question: "Which compiler/builder runs JavaScript code inside deployed React Native apps?",
      options: ["V8 Engine", "Hermes Engine", "Chakra Core", "SpiderMonkey"],
      correctIdx: 1,
      explanation: "Hermes is a lightweight JavaScript engine optimized for running React Native on mobile devices, boosting startup times and reducing memory size."
    },
    {
      id: "rn-38-q3",
      question: "What is the function of React Native's StyleSheet.create() utility?",
      options: [
        "Importing global CSS file hierarchies.",
        "Defining localized style objects that are verified for layout errors and sent efficiently across the bridge.",
        "Generating responsive media queries automatically.",
        "Compressing file asset sizes."
      ],
      correctIdx: 1,
      explanation: "StyleSheet.create sends styles across the native bridge once, caching them by ID and checking for valid properties to improve performance."
    }
  ],
  "pre-iot-39": [
    {
      id: "iot-39-q1",
      question: "Why is the MQTT protocol preferred for Internet of Things (IoT) devices?",
      options: [
        "It supports massive video streaming files.",
        "It is extremely lightweight and uses a pub-sub model, making it ideal for low-bandwidth, high-latency, resource-constrained network nodes.",
        "It encrypts files with double-strength AES.",
        "It runs directly inside web browsers without network drivers."
      ],
      correctIdx: 1,
      explanation: "MQTT operates with tiny header packet sizes and low overhead, enabling remote battery-powered sensors to exchange telemetry reliably."
    },
    {
      id: "iot-39-q2",
      question: "In microcontrollers (like Arduino), what is the purpose of the loop() function?",
      options: [
        "It compiles source code into machine files.",
        "It runs continuously after setup(), executing sensor scans, logic, and state checks in an infinite cycle.",
        "It processes hardware errors recursively.",
        "It manages multi-threaded threadpools."
      ],
      correctIdx: 1,
      explanation: "loop() is the main execution thread in microcontroller firmware, running repeatedly to process inputs and control outputs."
    },
    {
      id: "iot-39-q3",
      question: "What is the function of a 'Sensor' compared to an 'Actuator' in IoT?",
      options: [
        "Sensors execute calculations; actuators store values.",
        "Sensors capture physical environments data (inputs). Actuators perform physical movements or triggers based on electrical signals (outputs).",
        "Sensors are digital; actuators are strictly analog.",
        "Sensors connect to wifi; actuators are offline."
      ],
      correctIdx: 1,
      explanation: "Sensors measure quantities (temperature, light) and produce electrical inputs. Actuators receive commands to drive mechanical outputs (motors, relays)."
    }
  ],
  "pre-blockchain-40": [
    {
      id: "blockchain-40-q1",
      question: "What is a 'Consensus Mechanism' in blockchain networks?",
      options: [
        "A database compression algorithm.",
        "A protocol that ensures all distributed network nodes agree on the validity of transactions and the ledger state, preventing double-spending.",
        "A security scanner detecting code vulnerabilities.",
        "A router routing network traffic."
      ],
      correctIdx: 1,
      explanation: "Consensus algorithms (e.g. PoW, PoS) coordinate decentralized nodes to validate and synchronize ledger modifications without trusted central third parties."
    },
    {
      id: "blockchain-40-q2",
      question: "In Ethereum, what is a Smart Contract?",
      options: [
        "A physical document signed digitally.",
        "A self-executing program stored on-chain that automatically processes transactions and logical rules when predefined criteria are met.",
        "A data table matching public addresses.",
        "A secure VPN connection."
      ],
      correctIdx: 1,
      explanation: "Smart contracts are programs running on the decentralized Ethereum Virtual Machine (EVM), guaranteeing transaction rules execute exactly as written."
    },
    {
      id: "blockchain-40-q3",
      question: "How does a blockchain protect blocks against modifications after creation?",
      options: [
        "By restricting write access to verified users.",
        "By cryptographically linking each block to the preceding block's hash, making modifications visible as hash mismatches down the chain.",
        "By compression routines.",
        "By hosting blocks on offline servers."
      ],
      correctIdx: 1,
      explanation: "Each block references the parent block's cryptographic hash. Altering transaction details inside a past block changes its hash, breaking all subsequent block references."
    }
  ],
  // 10 more subjects: 41 to 50
  "pre-compiler-41": [
    {
      id: "compiler-41-q1",
      question: "Which compilation phase groups raw source characters into logical tokens?",
      options: ["Syntax Analysis (Parsing)", "Lexical Analysis (Scanning)", "Semantic Analysis", "Code Optimization"],
      correctIdx: 1,
      explanation: "Lexical Analyzers read character streams, stripping whitespace and comments, and grouping them into tokens (keywords, identifiers)."
    },
    {
      id: "compiler-41-q2",
      question: "What is an Abstract Syntax Tree (AST)?",
      options: [
        "A directory structure of compiler folders.",
        "A hierarchical tree representation of the abstract syntactic structure of source code, reflecting grammar rules.",
        "A database index mapping variable names.",
        "An execution thread stack frame."
      ],
      correctIdx: 1,
      explanation: "ASTs are built by parsers, representing operator and operand structures of code statements to facilitate translation phases."
    },
    {
      id: "compiler-41-q3",
      question: "What does Semantic Analysis verify in compilers?",
      options: [
        "Correctness of bracket matches.",
        "Type compatibility, variable declarations, and scoping rules, checking if statements make logical sense.",
        "Optimizations of assembly loops.",
        "Execution speeds of binary blocks."
      ],
      correctIdx: 1,
      explanation: "Semantic analysis checks context conditions (e.g. multiplying strings, duplicate variable names) that cannot be validated by grammar syntax alone."
    }
  ],
  "pre-toc-42": [
    {
      id: "toc-42-q1",
      question: "What does the Halting Problem state about computation limits?",
      options: [
        "No program can run for more than 24 hours.",
        "It is undecidable: no algorithm can determine if any arbitrary computer program will finish running or run forever on a given input.",
        "All infinite loops can be optimized out by compilers.",
        "Turing machines require physical tape inputs."
      ],
      correctIdx: 1,
      explanation: "Alan Turing proved that a general algorithm to solve the Halting Problem for all possible program-input pairs is mathematically impossible."
    },
    {
      id: "toc-42-q2",
      question: "Which grammar class resides at the core of the Chomsky Hierarchy, recognized by Finite Automata?",
      options: ["Regular Grammars", "Context-Free Grammars", "Context-Sensitive Grammars", "Unrestricted Grammars"],
      correctIdx: 0,
      explanation: "Regular grammars represent the least complex Chomsky class, recognizable by DFAs and NFAs. Context-free grammars require Pushdown Automata."
    },
    {
      id: "toc-42-q3",
      question: "What defines a Turing Machine?",
      options: [
        "A physical computer built with copper switches.",
        "An abstract mathematical model of computation consisting of an infinitely long memory tape and a head that reads, writes, and shifts states.",
        "A database engine running queries parallelly.",
        "A compiler optimization routine."
      ],
      correctIdx: 1,
      explanation: "A Turing Machine is a simple abstract device that can simulate any computer algorithm, establishing the definition of computability."
    }
  ],
  "pre-math-43": [
    {
      id: "math-43-q1",
      question: "In discrete math, what is a truth table contradiction?",
      options: [
        "A statement that is true under certain conditions.",
        "A compound statement that is false for all possible truth values of its simple component statements.",
        "A proof that has syntax errors.",
        "A set containing infinite integers."
      ],
      correctIdx: 1,
      explanation: "Contradictions (or self-contradictory statements) yield 'False' values across all truth configurations of their variables (e.g. P AND NOT P)."
    },
    {
      id: "math-43-q2",
      question: "What does the Handshaking Lemma in Graph Theory prove?",
      options: [
        "Every path has an even number of vertices.",
        "The sum of degrees of all vertices in any graph is exactly twice the number of edges, meaning the count of vertices with odd degrees is always even.",
        "All connected graphs can be colored with 4 colors.",
        "Loops are forbidden in tree networks."
      ],
      correctIdx: 1,
      explanation: "Since every edge connects two vertices, each edge contributes exactly 2 to the sum of vertex degrees, establishing the Handshaking Lemma equation."
    },
    {
      id: "math-43-q3",
      question: "Which of the following describes the Pigeonhole Principle?",
      options: [
        "If you divide integer values, you get remainder bounds.",
        "If N items are put into M containers, and N > M, then at least one container must contain more than one item.",
        "All sets have countable subsets.",
        "Binary calculations run in logarithmic boundaries."
      ],
      correctIdx: 1,
      explanation: "The Pigeonhole Principle is a simple but powerful combinatorial rule proving existence results (e.g. at least two people in a room have matching birthdays)."
    }
  ],
  "pre-daa-44": [
    {
      id: "daa-44-q1",
      question: "Using the Master Theorem, what is the time complexity of T(n) = 2T(n/2) + O(n)?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
      correctIdx: 2,
      explanation: "Here, a=2, b=2, d=1. log_b(a) = log_2(2) = 1. Since log_b(a) equals d, the complexity represents Case 2 of the Master Theorem: O(n^d log n) = O(n log n)."
    },
    {
      id: "daa-44-q2",
      question: "What is the key difference between Dynamic Programming (DP) and standard recursion?",
      options: [
        "DP uses less memory cache.",
        "DP solves overlapping subproblems once, storing results in lookup tables (memoization/tabulation) to avoid redundant calculations.",
        "DP is compiled to assembly instructions.",
        "Recursion is faster for search problems."
      ],
      correctIdx: 1,
      explanation: "Recursion can repeat subproblem calculations infinitely (e.g. naive Fibonacci). DP caches (memoizes) these outputs, reducing exponential O(2^N) runtimes to linear O(N)."
    },
    {
      id: "daa-44-q3",
      question: "What is the time complexity of searching a value in a balanced Binary Search Tree (like an AVL tree) of size N?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctIdx: 1,
      explanation: "Balanced trees maintain heights strictly proportional to log N, ensuring search, insertion, and deletion paths are capped at O(log N) operations."
    }
  ],
  "pre-testing-45": [
    {
      id: "testing-45-q1",
      question: "What is the difference between Black-Box and White-Box testing?",
      options: [
        "Black-box is manual; white-box is automated.",
        "Black-box tests functionality without knowledge of internal code. White-box tests internal structure, logic paths, and statements with full code visibility.",
        "Black-box is done by clients; white-box by servers.",
        "Black-box is static; white-box is dynamic."
      ],
      correctIdx: 1,
      explanation: "Black-box checks if correct inputs yield correct outputs. White-box focuses on test coverage, analyzing branches, loops, and statement conditions directly."
    },
    {
      id: "testing-45-q2",
      question: "What does the term 'Test Coverage' measure?",
      options: [
        "The file sizes of test folders.",
        "The percentage of source code lines, branches, or paths executed during test suite runs.",
        "The performance speed of test suites.",
        "The security permissions of API routes."
      ],
      correctIdx: 1,
      explanation: "Coverage metrics help identify untested paths in codebase logic, encouraging comprehensive testing before deployment."
    },
    {
      id: "testing-45-q3",
      question: "In Test-Driven Development (TDD), what is the core cycle?",
      options: [
        "Write Code -> Run App -> Write Test",
        "Write Test (Red) -> Write Code to Pass (Green) -> Refactor Code",
        "Refactor -> Compile -> Deploy",
        "Verify -> Lint -> Run"
      ],
      correctIdx: 1,
      explanation: "TDD follows Red-Green-Refactor: write a failing test first, write minimal functional code to make it pass, then clean and refactor the code structure."
    }
  ],
  "pre-api-46": [
    {
      id: "api-46-q1",
      question: "What is a main advantage of GraphQL compared to REST APIs?",
      options: [
        "GraphQL uses faster HTTP connection sockets.",
        "GraphQL eliminates over-fetching and under-fetching by allowing clients to request exactly the data fields they need in a single roundtrip query.",
        "GraphQL does not require backend servers.",
        "GraphQL encrypts files automatically."
      ],
      correctIdx: 1,
      explanation: "REST routes return static JSON structures, which can be bulky. GraphQL endpoints accept custom queries and resolve only requested fields, saving network bandwith."
    },
    {
      id: "api-46-q2",
      question: "Which HTTP status code signifies that a request lacks valid authentication credentials?",
      options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
      correctIdx: 1,
      explanation: "401 Unauthorized indicates that the client request has not been authenticated, whereas 403 Forbidden means the identity is known but lacks permissions."
    },
    {
      id: "api-46-q3",
      question: "What is the purpose of API 'Rate Limiting'?",
      options: [
        "Compensating for poor server speed.",
        "Preventing abuse, resource exhaustion, or DDoS attacks by restricting the number of requests a client can make in a specified time window.",
        "Minifying JSON outputs.",
        "Caching database indexes."
      ],
      correctIdx: 1,
      explanation: "Rate limiting restricts excessive requests using algorithms like Token Bucket, safeguarding server stability and API availability."
    }
  ],
  "pre-micro-47": [
    {
      id: "micro-47-q1",
      question: "What is the role of an 'API Gateway' in Microservices?",
      options: [
        "Compiling microservices into a single bundle.",
        "Acting as a single entry point for clients, routing requests, handling authentication, and balancing loads across internal microservices.",
        "Replacing the centralized SQL database.",
        "Managing local container memory scopes."
      ],
      correctIdx: 1,
      explanation: "An API gateway intercepts external client traffic and routes it to various internal microservice addresses, simplifying client logic and decoupling services."
    },
    {
      id: "micro-47-q2",
      question: "What does the 'Circuit Breaker' pattern solve in microservices?",
      options: [
        "Electrical fire hazards in server centers.",
        "Preventing a failing downstream service from causing cascading system-wide outages by failing fast and offering fallbacks when thresholds are exceeded.",
        "Encrypting communication tunnels.",
        "Sharding relational tables across servers."
      ],
      correctIdx: 1,
      explanation: "The Circuit Breaker blocks requests to a struggling dependency once it registers failure rates above a threshold, protecting callers and allowing the dependency to recover."
    },
    {
      id: "micro-47-q3",
      question: "What is the 'Database-per-Service' design pattern?",
      options: [
        "Sharing a massive SQL cluster across all services.",
        "Enforcing that each microservice owns and controls its own private database, preventing direct database dependencies or joins between services.",
        "Installing databases on clients.",
        "Creating new databases for every user session."
      ],
      correctIdx: 1,
      explanation: "This pattern ensures microservices are loosely coupled and can be modified, scaled, and deployed independently without database locking and schema conflicts."
    }
  ],
  "pre-embedded-48": [
    {
      id: "embedded-48-q1",
      question: "What is a main characteristic of a Real-Time Operating System (RTOS)?",
      options: [
        "RTOS features high-fidelity visual desktop interfaces.",
        "RTOS guarantees that tasks are executed and completed within strict, predictable timing deadlines (determinism).",
        "RTOS is written exclusively in Javascript.",
        "RTOS operates without physical processor chips."
      ],
      correctIdx: 1,
      explanation: "An RTOS prioritizes deterministic schedule algorithms, guaranteeing critical tasks complete within rigid deadline parameters."
    },
    {
      id: "embedded-48-q2",
      question: "In embedded systems, what is a GPIO pin?",
      options: [
        "A private register holding variables.",
        "General Purpose Input/Output: physical pins on microcontrollers that can be configured dynamically to read sensors (input) or toggle devices (output).",
        "A connection port mapping cloud databases.",
        "An assembly compiler flag."
      ],
      correctIdx: 1,
      explanation: "GPIO pins interface directly with external components, translating high/low logic states into physical currents."
    },
    {
      id: "embedded-48-q3",
      question: "What does 'Interrupt' mean in microcontroller firmware?",
      options: [
        "An unrecoverable compiler syntax error.",
        "An asynchronous hardware signal that halts current code execution immediately to run a specialized Interrupt Service Routine (ISR) first.",
        "A network timeout warning.",
        "A power-saving shutdown mode."
      ],
      correctIdx: 1,
      explanation: "Interrupts trigger immediate CPU context shifts, enabling microcontrollers to react to critical events (sensor triggers, timer fires) with minimal latency."
    }
  ],
  "pre-robot-49": [
    {
      id: "robot-49-q1",
      question: "In robotics, what is the purpose of a PID controller?",
      options: [
        "Managing compiler optimization pipelines.",
        "A control loop feedback mechanism that calculates error values and applies Proportional, Integral, and Derivative adjustments to minimize trajectory deviations.",
        "Securing robot communication ports.",
        "Sharding database tables."
      ],
      correctIdx: 1,
      explanation: "PID controllers correct steering and speed errors by scaling immediate offsets (P), cumulative past errors (I), and future changes (D) dynamically."
    },
    {
      id: "robot-49-q2",
      question: "What does 'Inverse Kinematics' calculate in robotics?",
      options: [
        "The physical weight of robotic arms.",
        "The joint angles required to position a robot's end-effector (hand/tool) at a desired spatial coordinate point.",
        "The battery consumption rate of motors.",
        "The compiler optimization values."
      ],
      correctIdx: 1,
      explanation: "Forward kinematics calculates hand location from joint angles. Inverse kinematics does the complex backward calculation, resolving required joint angles from target coordinate inputs."
    },
    {
      id: "robot-49-q3",
      question: "What is the primary role of the Robot Operating System (ROS)?",
      options: [
        "A physical hardware operating system replacing Linux.",
        "A flexible middleware framework offering message-passing, hardware abstractions, and software package communication nodes for robot developers.",
        "A web visualizer rendering 3D robots.",
        "An artificial intelligence neural network."
      ],
      correctIdx: 1,
      explanation: "ROS operates on top of operating systems, providing pub-sub message buses and standardized packages to connect robot sensors, logic, and motor controllers."
    }
  ],
  "pre-quantum-50": [
    {
      id: "quantum-50-q1",
      question: "What is 'Superposition' in Quantum Computing?",
      options: [
        "Arranging physical computer processor chips on top of each other.",
        "The capability of a Qubit to exist in a linear combination of both 0 and 1 states simultaneously, until it is measured.",
        "An algorithm resolving database transaction locks.",
        "An encryption key containing duplicate variables."
      ],
      correctIdx: 1,
      explanation: "Classical bits are strictly 0 or 1. Qubits leverage superposition to manipulate probabilities of both states concurrently, enabling parallel computations."
    },
    {
      id: "quantum-50-q2",
      question: "What is Quantum 'Entanglement'?",
      options: [
        "A hardware cooling defect in quantum processors.",
        "A phenomenon where the quantum states of two or more qubits become linked, meaning the state of one qubit instantly determines the state of the other, regardless of distance.",
        "An infinite loop crash in quantum programs.",
        "A database index overlap error."
      ],
      correctIdx: 1,
      explanation: "Entangled qubits behave as a single unified system. Measuring the state of one qubit collapses its partner's state instantly, even across vast spatial intervals."
    },
    {
      id: "quantum-50-q3",
      question: "Which of the following describes Grover's Algorithm?",
      options: [
        "A dynamic compiler optimization routine.",
        "A quantum search algorithm that searches an unsorted database of size N in O(sqrt(N)) time, establishing a quadratic speedup over classical searches.",
        "An encryption algorithm encrypting files.",
        "A microservices gateway router."
      ],
      correctIdx: 1,
      explanation: "Classical unsorted searches require O(N) evaluations. Grover's algorithm leverages quantum superposition to scan states concurrently, locating targets in O(sqrt(N)) steps."
    }
  ]
};
