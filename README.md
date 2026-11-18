# Intelligent API Security and Request Validation Platform

A full-stack cybersecurity web application built for:
- **22ITT51 - Full Stack Web Development (FSWD)**
- **22ITT52 - Computer Networks (CN)**
- **22ITT53 - Formal Languages and Automata Theory (FLAT)**

This platform validates HTTP API requests using **Regular Expressions**, **Deterministic Finite Automata (DFA)**, and **Pushdown Automata (PDA)**, monitors client-server communication using **Node.js EventEmitters**, detects repeated failed connection attempts, and manages persistent logs and alerts using **MongoDB & Mongoose**.

---

## 📁 Project Structure (Separate Frontend & Backend)

```
project1/
├── backend/                             # Node.js & Express REST Backend
│   ├── models/
│   │   ├── ApiLog.js                    # Mongoose Schema for API Request Logs (CO5)
│   │   └── SecurityAlert.js             # Mongoose Schema for Security Alerts (CO4/CO5)
│   ├── routes/
│   │   └── apiRoutes.js                 # Express routes: /validate, /records, /alerts
│   ├── services/
│   │   ├── dfaValidator.js              # DFA State Machine Engine (FLAT CO1)
│   │   ├── pdaValidator.js              # Pushdown Automata Stack Engine (FLAT CO4)
│   │   ├── regexValidator.js            # Regex Pattern Engine (FLAT CO2)
│   │   └── networkMonitor.js            # Node.js EventEmitter & Sliding Window (CN CO4)
│   ├── server.js                        # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                            # React 18 + Vite SPA Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar & DB Status
│   │   │   ├── Dashboard.jsx            # System overview & stats metrics
│   │   │   ├── RequestValidator.jsx     # Web page input form & validation (FSWD CO1)
│   │   │   ├── AutomataVisualizer.jsx   # DFA, Regex, CFG, PDA, TM Visualizer (FLAT)
│   │   │   ├── RecordsManager.jsx       # MongoDB CRUD UI (FSWD CO5)
│   │   │   ├── NetworkAlerts.jsx        # Network event simulator & alerts (CN CO4)
│   │   │   └── DocumentationView.jsx    # Complete CO Assessment Answers in UI
│   │   ├── App.jsx                      # React Router configuration
│   │   ├── App.css
│   │   ├── index.css                    # Dark glassmorphic styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── ACADEMIC_REPORT_CO_ANSWERS.md        # Complete theoretical answers & derivations
└── README.md                            # Quickstart and execution guide
```

---

## 🚀 How to Open and Run in VS Code

### Step 1: Open `project1` in VS Code
Open VS Code, click **File > Open Folder...**, and select the `project1` folder.

You can also open it via terminal:
```bash
code "C:\Users\meena\Desktop\project1"
```

---

### Step 2: Start the Backend Server

1. Open a new terminal in VS Code:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The backend runs at `http://localhost:5000`.*  
   *Note: If MongoDB is not running locally, the server automatically uses the built-in in-memory fallback datastore so everything works with zero setup!*

---

### Step 3: Start the Frontend Application

1. Open a **second terminal** in VS Code:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🎯 How Each Assessment Question Is Demonstrated

| Course | CO | Requirement | Where to Test in Project |
| :--- | :--- | :--- | :--- |
| **FSWD** | **CO1** | Web Page Design & Validation | Click **"API Validator (CO1)"** in navbar. Fill form or click presets. Observe client validation and entered echo. |
| **FSWD** | **CO2** | Full-Stack Architecture & Communication | Check `DocumentationView.jsx` and network trace in DevTools between React and Express on port 5000. |
| **FSWD** | **CO3** | React Components, State, & Routing | Explore tabs powered by `react-router-dom` (`/validate`, `/records`, `/alerts`, `/automata`). |
| **CN/FSWD**| **CO4** | Node.js Events, Callbacks & Listeners | Click **"Network Alerts (CO4)"** tab. Use the Simulator button to fire 3 rapid failed requests and watch the alert trigger! |
| **FSWD** | **CO5** | MongoDB / Mongoose CRUD | Click **"Mongoose Logs (CO5)"**. View (Retrieve), Filter by VALID/INVALID, Edit (Update), and Delete records. |
| **FLAT** | **CO1** | Finite Automata & Transitions | Click **"FLAT Automata & Grammars"** -> Tab 1 for DFA state transition diagram, table, $q_0$, $F$, and $q_{\text{trap}}$. |
| **FLAT** | **CO2** | Regular Expressions & Regular Languages | Tab 2: REST Endpoint regex, Token regex, and SQL Injection pattern detector. |
| **FLAT** | **CO3** | Context-Free Grammars | Tab 3: Formal CFG $G = (V, \Sigma, R, S)$ and derivation of `{"id": 101, "role": "admin"}`. |
| **FLAT** | **CO4** | Pushdown Automata | Tab 4: 7-tuple PDA definition, stack operations (Push/Pop), and balanced brace validation. |
| **FLAT** | **CO5** | Turing Machines & Decidability | Tab 5: Role of Turing Machine and proof that API validation is strictly decidable in polynomial time $O(n)$. |
