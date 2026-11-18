# Comprehensive Academic Course Assessment Report

**Project Title:** Intelligent API Security and Request Validation Platform  
**Courses Covered:**
1. **22ITT51 - Full Stack Web Development (FSWD)**
2. **22ITT52 - Computer Networks (CN)**
3. **22ITT53 - Formal Languages and Automata Theory (FLAT)**

---

## Part 1: Full Stack Web Development (22ITT51) & Computer Networks (22ITT52) [10 Marks]

### CO1: Web Page Design and Validation (2 Marks)
**Question:**  
*Design a basic web page to enter the required details for the proposed application. Validate the input fields and display the entered details.*

#### 1. Input Form Design & Fields:
The interactive web page is designed in React (`frontend/src/components/RequestValidator.jsx`). It allows security engineers and API consumers to input:
- **HTTP Method:** Dropdown selection (`GET`, `POST`, `PUT`, `DELETE`).
- **Endpoint URI:** Input text field (e.g., `/api/v1/users/profile`).
- **Authorization Header:** Input text field for Bearer API tokens (e.g., `Bearer eyJhbGci...`).
- **JSON Payload Body:** Multiline text area for structured JSON requests.

#### 2. Client-Side Validation Logic:
Handled synchronously prior to network dispatch via `validateInputs()`:
- **Endpoint Validation:** Ensures the field is non-empty and starts with `/api/`.
- **Token Validation:** Checks that the authorization header begins with `Bearer ` and meets minimum length criteria.
- **Payload Validation:** Evaluates syntax integrity using `JSON.parse(formData.payload)`. If invalid JSON is supplied (e.g., unclosed braces), the client flags an immediate error without sending unnecessary network traffic.

#### 3. Displaying Entered Details:
The page displays an instant client echo panel that formats and mirrors the active input values as a live preview, allowing verification before submitting to the backend.

---

### CO2: Full-Stack Architecture and Communication (2 Marks)
**Question:**  
*Explain the architecture of the proposed system using a browser, React frontend, Node.js/Express backend, and MongoDB database. Describe how these components communicate to process user requests and manage application data.*

#### Architectural Diagram:
```
+-------------------------------------------------------------+
|                     1. Client Tier (Browser)                 |
|  - User inputs API Request parameters                       |
|  - Client-side validation in React components               |
+------------------------------+------------------------------+
                               |
                   HTTP POST / JSON via Fetch API
                               |
                               v
+-------------------------------------------------------------+
|                 2. Frontend Tier (React SPA)                |
|  - React Router (Navigation between /validate, /records)     |
|  - State Management (useState, useEffect)                   |
|  - Real-time feedback & Automata visualizer                 |
+------------------------------+------------------------------+
                               |
                   REST API / CORS (Port 5000)
                               |
                               v
+-------------------------------------------------------------+
|             3. Backend Service (Node.js & Express)          |
|  - Express HTTP Routing & JSON Body Parser                  |
|  - Regular Expression Matcher (Endpoint, Token, SQLi)       |
|  - DFA State Transition Engine                              |
|  - PDA Stack Parsing Engine                                 |
|  - Network Event Monitor (EventEmitter for failed attempts) |
+------------------------------+------------------------------+
                               |
                      Mongoose ODM Driver
                               |
                               v
+-------------------------------------------------------------+
|                 4. Database Tier (MongoDB)                  |
|  - Collections: `apilogs` & `securityalerts`                |
|  - Persistent storage, status indexing & CRUD operations    |
+-------------------------------------------------------------+
```

#### Communication Flow:
1. **User Action:** The user fills the request form on the browser and clicks "Run Security & Automata Validation".
2. **HTTP Transmission:** The React frontend issues an asynchronous `fetch('/api/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ... })`.
3. **Backend Processing:** Express parses the request body and passes the parameters through:
   - Regex validation engine
   - PDA stack validation engine
   - DFA state machine execution
4. **Data Persistence:** The result (passed/failed, status, timestamps, client IP) is formatted into a Mongoose document and saved via `ApiLog.create(logData)`.
5. **Response & Rendering:** Express responds with HTTP 200 (Valid) or HTTP 400 (Invalid) alongside a structured JSON breakdown. React updates its state and renders validation badges and transition paths.

---

### CO3: React Components, State Management and Routing (2 Marks)
**Question:**  
*Develop a React dashboard using suitable components and state management to display application records, status information, and notifications. Explain how React Router can be used to navigate between the dashboard and other application pages.*

#### 1. Component Architecture:
- `Dashboard.jsx`: Displays top-level key performance metrics (Total Validations, Accepted, Rejected, Active Alerts) and recent logs.
- `RequestValidator.jsx`: Interactive validation playground with client feedback and preset attacks.
- `AutomataVisualizer.jsx`: Displays DFA state diagrams, CFG derivations, and PDA stack operations.
- `RecordsManager.jsx`: Data management interface showing MongoDB records with filtering and CRUD controls.
- `NetworkAlerts.jsx`: Network event notifications and alert trigger simulation.
- `Navbar.jsx`: Global header with live system health indicators.

#### 2. State Management:
- **`useState`**: Manages dynamic form data, active tab selections, modal states for editing records, and filter keywords.
- **`useEffect`**: Triggers asynchronous data fetching on component mount and responds to state dependencies (e.g. re-fetching logs when status filter changes).

#### 3. React Router Navigation:
Using `react-router-dom`:
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/validate" element={<RequestValidator />} />
    <Route path="/automata" element={<AutomataVisualizer />} />
    <Route path="/records" element={<RecordsManager />} />
    <Route path="/alerts" element={<NetworkAlerts />} />
    <Route path="/docs" element={<DocumentationView />} />
  </Routes>
</BrowserRouter>
```
`NavLink` components in `Navbar.jsx` conditionally apply the `.active` class to highlight the current route, enabling seamless single-page navigation without full page reloads.

---

### CO4: Express HTTP Service & Network Event Monitoring (2 Marks)
**Question:**  
*Design an Express HTTP service to receive network events and use Node.js to process them. Explain how callbacks, events, and listeners can be used to detect repeated failed connection attempts and trigger an alert.*

#### 1. Node.js Event-Driven Architecture:
Node.js core module `events` is leveraged via the `EventEmitter` class:
```javascript
const EventEmitter = require('events');

class NetworkSecurityMonitor extends EventEmitter {
  constructor() {
    super();
    this.failureHistory = new Map(); // IP -> [timestamps]
    this.FAILED_THRESHOLD = 3;
    this.TIME_WINDOW_MS = 60 * 1000; // 60 seconds
    this.setupListeners();
  }

  setupListeners() {
    // Registered Callback for failed connection event
    this.on('failedConnection', (eventData) => {
      this.handleFailedConnection(eventData);
    });
  }
}
```

#### 2. Sliding Window & Threshold Detection:
When an endpoint receives an invalid request or network probe, `recordEvent()` invokes:
```javascript
this.emit('failedConnection', { clientIp, reason, timestamp: Date.now() });
```
The listener callback:
1. Retrieves past failure timestamps for that `clientIp`.
2. Prunes timestamps older than 60 seconds:
   `const recent = timestamps.filter(t => now - t <= 60000);`
3. Checks condition: If `recent.length >= 3`, it fires:
   `this.emit('alertTriggered', alertData);`
4. The database handler receives `alertTriggered` and stores a high-severity `SecurityAlert` in MongoDB.

---

### CO5: MongoDB, Mongoose and Database Operations (2 Marks)
**Question:**  
*Design a MongoDB collection to store application records and related status information. Write suitable Node.js/Mongoose operations to insert, retrieve, update, and delete records as required by the proposed application.*

#### 1. Mongoose Schema (`models/ApiLog.js`):
```javascript
const ApiLogSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  headers: { type: Object, default: {} },
  payload: { type: Object, default: {} },
  clientIp: { type: String, default: '127.0.0.1' },
  regexCheck: { passed: Boolean, details: String },
  dfaCheck: { passed: Boolean, finalState: String, transitionPath: [String] },
  pdaCheck: { passed: Boolean, bracketMatched: Boolean },
  validationStatus: { type: String, enum: ['VALID', 'INVALID', 'BLOCKED'], required: true },
  failureReason: { type: String, default: null },
}, { timestamps: true });
```

#### 2. CRUD Operations in Node.js/Mongoose (`routes/apiRoutes.js`):
- **Insert (Create):**
  ```javascript
  const newLog = await ApiLog.create(logData);
  ```
- **Retrieve (Read):**
  ```javascript
  const records = await ApiLog.find(query).sort({ createdAt: -1 }).limit(50);
  ```
- **Update (Update):**
  ```javascript
  const updated = await ApiLog.findByIdAndUpdate(
    req.params.id,
    { $set: { validationStatus: req.body.validationStatus, failureReason: req.body.failureReason } },
    { new: true }
  );
  ```
- **Delete (Delete):**
  ```javascript
  await ApiLog.findByIdAndDelete(req.params.id);
  ```

---

## Part 2: Formal Languages and Automata Theory (22ITT53) [10 Marks]

### CO1: Finite Automata and State Transitions (2 Marks)
**Question:**  
*Model the main workflow of your proposed project using a finite automaton. Draw the state-transition diagram and identify the initial and final states.*

#### Formal 5-Tuple Definition:
$$M = (Q, \Sigma, \delta, q_0, F)$$
- **States ($Q$):**  
  $$Q = \{ q_0 (\text{Idle}), q_1 (\text{Auth Verified}), q_2 (\text{Route Valid}), q_3 (\text{Payload Checked}), q_4 (\text{Approved/Final}), q_{\text{trap}} (\text{Rejected/Dead State}) \}$$
- **Input Alphabet ($\Sigma$):**  
  $$\Sigma = \{ \text{AUTH\_PASS}, \text{AUTH\_FAIL}, \text{ROUTE\_PASS}, \text{ROUTE\_FAIL}, \text{BODY\_PASS}, \text{BODY\_FAIL}, \text{INTEGRITY\_PASS}, \text{INTEGRITY\_FAIL} \}$$
- **Initial State ($q_0$):**  
  $$q_0 = \text{Idle (Awaiting incoming request)}$$
- **Final / Accepting States ($F$):**  
  $$F = \{ q_4 \}$$
- **Trap State:**  
  $$q_{\text{trap}}$$

#### State Transition Table $\delta(q, a)$:
| Current State ($q$) | Input Symbol ($a$) | Next State ($\delta(q, a)$) | Meaning |
| :--- | :--- | :--- | :--- |
| **$q_0$** | AUTH_PASS | $q_1$ | Valid Bearer token received |
| **$q_0$** | AUTH_FAIL | $q_{\text{trap}}$ | Missing / invalid token |
| **$q_1$** | ROUTE_PASS | $q_2$ | Valid `/api/vX/...` endpoint |
| **$q_1$** | ROUTE_FAIL | $q_{\text{trap}}$ | Malformed or unrecognized URI |
| **$q_2$** | BODY_PASS | $q_3$ | Valid parsable payload body |
| **$q_2$** | BODY_FAIL | $q_{\text{trap}}$ | Malformed JSON / body |
| **$q_3$** | INTEGRITY_PASS | $q_4$ | Safe from SQLi / XSS attacks |
| **$q_3$** | INTEGRITY_FAIL | $q_{\text{trap}}$ | Malicious attack detected |
| **$q_4$** | RESET | $q_0$ | Request dispatched successfully |
| **$q_{\text{trap}}$** | Any symbol | $q_{\text{trap}}$ | Absorbing trap state (HTTP 400/403) |

#### State Transition Diagram:
```
             [AUTH_PASS]             [ROUTE_PASS]             [BODY_PASS]             [INTEGRITY_PASS]
    ( q0 ) ---------------> ( q1 ) ---------------> ( q2 ) ---------------> ( q3 ) ---------------------> (( q4 )) [FINAL]
      |                       |                       |                       |
 [AUTH_FAIL]             [ROUTE_FAIL]            [BODY_FAIL]            [INTEGRITY_FAIL]
      |                       |                       |                       |
      v                       v                       v                       v
      +-----------------------------------------------------------------------+
                                              |
                                              v
                                         ( q_trap ) <--- [Any Input]
```

---

### CO2: Regular Expressions and Regular Languages (2 Marks)
**Question:**  
*Write a suitable regular expression to validate an input or detect a pattern relevant to your project. Explain how the expression identifies valid and invalid inputs.*

#### 1. REST API Endpoint Regular Expression:
$$R_{\text{endpoint}} = \text{\textasciicircum}\backslash/\text{api}\backslash/\text{v}[1-9][0-9]*\backslash/[a-zA-Z0-9\_\-]+(\backslash/[a-zA-Z0-9\_\-]+)*\$$

- **Explanation:**
  - `^` asserts the start of the URI string.
  - `\/api\/v` matches the literal `/api/v` prefix.
  - `[1-9][0-9]*` enforces valid integer versioning (e.g., `v1`, `v2`, rejecting `v0`).
  - `\/[a-zA-Z0-9_\-]+` matches resource names (alphanumerics, dashes, underscores).
  - `(\/[a-zA-Z0-9_\-]+)*$` allows nested resource paths and terminates cleanly.

- **Valid vs Invalid Inputs:**
  - *Valid:* `/api/v1/users`, `/api/v2/products/electronics/catalog`
  - *Invalid:* `/login` (missing `/api/` prefix), `/api/v0/users` (invalid version), `/api/v1/../../etc/passwd` (directory traversal attack rejected).

#### 2. SQL Injection Attack Signature Regular Expression:
$$R_{\text{sqli}} = ((\backslash\text{b}(\text{SELECT}|\text{INSERT}|\text{UPDATE}|\text{DELETE}|\text{DROP}|\text{UNION})\backslash\text{b})|(--)|(\backslash/\backslash*)|(\backslash\text{b}1=1\backslash\text{b}))$$

- **Explanation:**
  Detects SQL injection attempts by matching reserved SQL DDL/DML keywords enclosed in word boundaries (`\b`), SQL comments (`--`, `/*`), or boolean tautology bypasses (`1=1`).

---

### CO3: Context-Free Grammars (2 Marks)
**Question:**  
*Define a context-free grammar for a structured input or sequence used in your project. Show a sample derivation using the grammar.*

#### 1. Formal CFG Definition:
$$G = (V, \Sigma, R, S)$$
- **Variables ($V$):** $\{ S, \text{Object}, \text{Members}, \text{Pair}, \text{Key}, \text{Value}, \text{String}, \text{Number} \}$
- **Terminals ($\Sigma$):** $\{ \{, \}, [, ], :, ,, ", a\dots z, 0\dots 9 \}$
- **Start Symbol:** $S$
- **Production Rules ($R$):**
  1. $S \rightarrow \text{Object}$
  2. $\text{Object} \rightarrow \{ \} \mid \{ \text{Members} \}$
  3. $\text{Members} \rightarrow \text{Pair} \mid \text{Pair} , \text{Members}$
  4. $\text{Pair} \rightarrow \text{String} : \text{Value}$
  5. $\text{Value} \rightarrow \text{String} \mid \text{Number} \mid \text{Object}$
  6. $\text{String} \rightarrow " \text{Chars} "$
  7. $\text{Number} \rightarrow \text{Digits}$

#### 2. Sample Leftmost Derivation for `{"id": 101, "role": "admin"}`:
$$
\begin{aligned}
S &\Rightarrow \text{Object} \\
  &\Rightarrow \{ \text{Members} \} \\
  &\Rightarrow \{ \text{Pair} , \text{Members} \} \\
  &\Rightarrow \{ \text{String} : \text{Value} , \text{Members} \} \\
  &\Rightarrow \{ \text{"id"} : \text{Number} , \text{Members} \} \\
  &\Rightarrow \{ \text{"id"} : 101 , \text{Pair} \} \\
  &\Rightarrow \{ \text{"id"} : 101 , \text{String} : \text{Value} \} \\
  &\Rightarrow \{ \text{"id"} : 101 , \text{"role"} : \text{String} \} \\
  &\Rightarrow \{ \text{"id"} : 101 , \text{"role"} : \text{"admin"} \} \quad \text{[Valid Sentence Accepted]}
\end{aligned}
$$

---

### CO4: Pushdown Automata (PDA) (2 Marks)
**Question:**  
*Explain how a pushdown automaton and its stack can be used to recognize a suitable structured pattern related to your project. Identify the states and stack operations.*

#### 1. Formal PDA 7-Tuple:
$$M = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$$
- **States ($Q$):** $\{ q_0 (\text{Start}), q_1 (\text{Reading}), q_2 (\text{Accept}), q_{\text{reject}} \}$
- **Input Alphabet ($\Sigma$):** $\{ \{, \}, [, ], ", :, ,, \text{alphanumerics} \}$
- **Stack Alphabet ($\Gamma$):** $\{ Z_0, \{, [ \}$ where $Z_0$ is the bottom-of-stack marker.
- **Initial State:** $q_0$
- **Initial Stack Symbol:** $Z_0$
- **Final States ($F$):** $\{ q_2 \}$

#### 2. Stack Operations & Transition Behavior:
1. **Push:** Upon reading an opening delimiter `'{'` or `'['`, the PDA pushes it onto the stack:
   $$\delta(q_1, '\{', X) = (q_1, \{ X)$$
2. **Pop:** Upon reading a closing delimiter `'}'` or `']'`, the PDA compares it with the top of the stack:
   - If top is `'\{'` and input is `'\}'`, pop:
     $$\delta(q_1, '\}', \{) = (q_1, \epsilon)$$
   - If top is `'['` and input is `']'`, pop:
     $$\delta(q_1, ']', [) = (q_1, \epsilon)$$
   - If mismatch or underflow occurs, transition to $q_{\text{reject}}$.
3. **Acceptance by Empty Stack / Final State:** Upon reaching End of File (EOF) with input $\epsilon$ and stack top $Z_0$, pop $Z_0$ and transition to $q_2$:
   $$\delta(q_1, \epsilon, Z_0) = (q_2, \epsilon)$$

---

### CO5: Turing Machines and Computability (2 Marks)
**Question:**  
*Explain the role of a Turing machine as a computational model and discuss whether the main validation or pattern-recognition task in your project is decidable.*

#### 1. Role of a Turing Machine as a Computational Model:
A Turing Machine is a 7-tuple $M = (Q, \Sigma, \Gamma, \delta, q_0, q_{\text{accept}}, q_{\text{reject}})$ equipped with an infinite memory tape and a bidirectional read/write head. According to the **Church-Turing Thesis**, any computational problem that can be computed by an algorithm or web server can be computed by a Turing Machine.

#### 2. Decidability of the API Security Validation Task:
**Conclusion:** The main validation and pattern-recognition task in this project is **STRICTLY DECIDABLE**.

**Proof & Mathematical Justification:**
1. A language $L$ is decidable (recursive) if there exists a Turing Machine that halts and accepts for all $w \in L$ and halts and rejects for all $w \notin L$.
2. **Regex Subtask:** Deciding regular language membership $w \in L(R)$ via DFA takes deterministic linear time $O(n)$ and always halts.
3. **Structure / JSON Subtask:** Parsing deterministic context-free languages (DCFL) with deterministic pushdown automata (DPDA) takes $O(n)$ time and always halts.
4. **Finite Input Length:** All incoming HTTP requests in real-world servers are restricted to a maximum size $n \le \text{MAX\_PAYLOAD}$ (e.g., 5MB).
5. Because every sub-validator (Regex, DFA, PDA) is a decider that terminates in finite steps without infinite loops, the composite validation algorithm implemented in Node.js simulates a Turing Machine that **always halts** in either $q_{\text{accept}}$ or $q_{\text{reject}}$. Thus, the task is completely decidable (belongs to complexity class **P**).
