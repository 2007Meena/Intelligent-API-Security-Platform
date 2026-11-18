
import React from 'react';

export default function DocumentationView() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
          Course Assessment Questions &amp; Complete Answers
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Detailed academic solutions mapped to Course Outcomes for 22ITT51
          (FSWD), 22ITT52 (CN), and 22ITT53 (FLAT).
        </p>
      </div>

      {/* SECTION 1: FSWD & CN */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '12px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', color: '#60a5fa' }}>
            Part A: Full Stack Web Development (22ITT51) &amp; Computer Networks
            (22ITT52) [10 Marks]
          </h2>
          <span className="badge badge-valid">10 / 10 Marks</span>
        </div>

        {/* CO1 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO1 (2 Marks): Web Page Design and Validation
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            margin: '4px 0 8px 0'
          }}>
            "Design a basic web page to enter the required details for the
            proposed application. Validate the input fields and display the
            entered details."
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            <strong>Implementation:</strong> Built in
            <code> frontend/src/components/RequestValidator.jsx</code>.
            <br />

            • <strong>Input Fields:</strong> HTTP Method selector
            (GET/POST/PUT/DELETE), Endpoint URI input, Authorization Bearer
            Token header, and JSON Payload text area.
            <br />

            • <strong>Client-side Validation:</strong> Handled by
            <code> validateInputs()</code> function: checks for required
            fields, verifies that the endpoint begins with
            <code> /api/</code>, ensures the token contains
            <code> Bearer </code>, and parses the payload through
            <code> JSON.parse()</code> to catch syntax errors immediately
            before network dispatch.
            <br />

            • <strong>Display of Entered Details:</strong> Live echo display
            container renders the client input summary and updates
            dynamically as the user types.
          </div>
        </div>

        {/* CO2 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO2 (2 Marks): Full-Stack Architecture and Communication
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            margin: '4px 0 8px 0'
          }}>
            "Explain the architecture of the proposed system using a browser,
            React frontend, Node.js/Express backend, and MongoDB database.
            Describe how these components communicate to process user
            requests and manage application data."
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            <strong>Full-Stack Architecture:</strong>
            <br />

            1. <strong>Browser / Client Layer:</strong> Renders the React UI,
            gathers user interaction, executes client-side form validation,
            and displays interactive automata visualizers.
            <br />

            2. <strong>React Frontend:</strong> Single Page Application (SPA)
            using React Router and Hooks (<code>useState</code>,
            <code> useEffect</code>). Makes asynchronous HTTP REST calls
            using the Fetch API (sending JSON data with
            <code> Content-Type: application/json</code>).
            <br />

            3. <strong>Node.js / Express Backend:</strong> HTTP REST service
            listening on port 5000 with CORS and JSON body-parser
            middlewares. Processes requests through regex security matchers,
            DFA transition evaluators, and Pushdown Automata stack parsers.
            Manages network events using Node.js
            <code> EventEmitter</code>.
            <br />

            4. <strong>MongoDB Database &amp; Mongoose:</strong>
            Document-oriented datastore with Mongoose schemas
            (<code>ApiLog</code> and <code>SecurityAlert</code>) providing
            persistent storage and transactional CRUD operations.
            <br />

            <strong>Communication Flow:</strong> Browser → HTTP POST
            <code> /api/validate</code> → Express Routing →
            Automata/Regex Validation → Mongoose <code>create()</code> to
            MongoDB → JSON Response with Status Codes (200 OK / 400 Bad
            Request) → React state update and UI render.
          </div>
        </div>

        {/* CO3 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO3 (2 Marks): React Components, State Management and Routing
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            margin: '4px 0 8px 0'
          }}>
            "Develop a React dashboard using suitable components and state
            management to display application records, status information,
            and notifications. Explain how React Router can be used to
            navigate between the dashboard and other application pages."
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Component Breakdown:</strong>
            <code> Dashboard</code> (metrics, system health),
            <code> RequestValidator</code> (form input, interactive
            validation), <code>AutomataVisualizer</code> (DFA/PDA/CFG
            diagrams), <code>RecordsManager</code> (Mongoose records table),
            and <code>NetworkAlerts</code> (alert feed).
            <br />

            • <strong>State Management:</strong> Built using React's
            <code> useState</code> for local component reactivity
            (e.g. form inputs, active tabs, modal states) and
            <code> useEffect</code> for lifecycle data fetching from backend
            endpoints.
            <br />

            • <strong>React Router Navigation:</strong> Configured with
            <code> BrowserRouter</code>, <code>Routes</code>, and
            <code> Route</code> in <code>App.jsx</code> with paths
            <code> /</code>, <code>/validate</code>,
            <code> /automata</code>, <code>/records</code>,
            <code> /alerts</code>, and <code>/docs</code>.
            Navigation is enabled via <code>NavLink</code> in
            <code> Navbar.jsx</code> for zero-reload client-side routing.
          </div>
        </div>

        {/* CO4 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO4 (2 Marks): Express HTTP Service, Node.js Events &amp; Repeated
            Failure Detection
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            margin: '4px 0 8px 0'
          }}>
            "Design an Express HTTP service to receive network events and use
            Node.js to process them. Explain how callbacks, events, and
            listeners can be used to detect repeated failed connection
            attempts and trigger an alert."
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Service Design:</strong> Express receives requests on
            <code> /api/network-events</code> and
            <code> /api/validate</code>.
            <br />

            • <strong>Node.js EventEmitter:</strong>
            <code> NetworkSecurityMonitor</code> class extends
            <code> require('events')</code>.
            <br />

            • <strong>Callbacks &amp; Listeners:</strong> When an invalid
            or failed connection occurs,
            <code> networkMonitor.recordEvent()</code> emits
            <code> this.emit('failedConnection', eventData)</code>.
            <br />

            • <strong>Sliding Window Detection:</strong> An in-memory Map
            maintains an array of failure timestamps for each
            <code> clientIp</code>. On each failure callback, timestamps
            older than 60 seconds are filtered out. If the failure count
            within this sliding window reaches ≥ 3, the service emits
            <code> this.emit('alertTriggered', alertData)</code>, triggering
            listeners to persist a <code>SecurityAlert</code> document in
            MongoDB and log a high-severity alert.
          </div>
        </div>

        {/* CO5 */}
        <div>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO5 (2 Marks): MongoDB, Mongoose and Database Operations
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            margin: '4px 0 8px 0'
          }}>
            "Design a MongoDB collection to store application records and
            related status information. Write suitable Node.js/Mongoose
            operations to insert, retrieve, update, and delete records as
            required by the proposed application."
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Collection Schema:</strong> <code>ApiLog</code> schema
            storing <code>endpoint</code>, <code>method</code>,
            <code> headers</code>, <code>payload</code>,
            <code> clientIp</code>, <code>regexCheck</code>,
            <code> dfaCheck</code>, <code>pdaCheck</code>,
            <code> validationStatus</code> (VALID/INVALID), and timestamps.
            <br />

            • <strong>INSERT:</strong>
            <code> await ApiLog.create(logData);</code>
            <br />

            • <strong>RETRIEVE:</strong>
            <code> await ApiLog.find(query).sort(&#123; createdAt: -1 &#125;).limit(50);</code>
            <br />

            • <strong>UPDATE:</strong>
            <code> await ApiLog.findByIdAndUpdate(id, &#123; $set: &#123; validationStatus, failureReason &#125; &#125;, &#123; new: true &#125;);</code>
            <br />

            • <strong>DELETE:</strong>
            <code> await ApiLog.findByIdAndDelete(id);</code>
          </div>
        </div>
      </div>

      {/* SECTION 2: FLAT */}
      <div className="glass-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '12px',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '20px', color: '#c084fc' }}>
            Part B: Formal Languages and Automata Theory (22ITT53) [10 Marks]
          </h2>
          <span className="badge badge-valid">10 / 10 Marks</span>
        </div>

        {/* CO1 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO1 (2 Marks): Finite Automata and State Transitions
          </h3>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>DFA 5-Tuple:</strong>
            <code> M = (Q, &Sigma;, &delta;, q0, F)</code>
            <br />

            • <strong>States:</strong> Q = &#123; q0 (Idle), q1 (Auth Valid),
            q2 (Route Valid), q3 (Payload Checked), q4 (Accepted Final),
            q_TRAP (Dead/Reject) &#125;
            <br />

            • <strong>Initial State:</strong> <code>q0</code>;
            <strong> Final State:</strong> <code>F = &#123; q4 &#125;</code>;
            <strong> Trap State:</strong> <code>q_TRAP</code>.
            <br />

            • <strong>Transition Function &delta;:</strong>
            <br />

            &nbsp;&nbsp;&delta;(q0, AUTH_PASS) = q1;
            &delta;(q0, AUTH_FAIL) = q_TRAP
            <br />

            &nbsp;&nbsp;&delta;(q1, ROUTE_PASS) = q2;
            &delta;(q1, ROUTE_FAIL) = q_TRAP
            <br />

            &nbsp;&nbsp;&delta;(q2, BODY_PASS) = q3;
            &delta;(q2, BODY_FAIL) = q_TRAP
            <br />

            &nbsp;&nbsp;&delta;(q3, INTEGRITY_PASS) = q4;
            &delta;(q3, INTEGRITY_FAIL) = q_TRAP
            <br />

            &nbsp;&nbsp;&delta;(q_TRAP, &sigma;) = q_TRAP
            &forall; &sigma; &isin; &Sigma; (absorbing dead state).
          </div>
        </div>

        {/* CO2 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO2 (2 Marks): Regular Expressions and Regular Languages
          </h3>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Regex for REST Endpoint:</strong>
            <code>{String.raw`^\/api\/v[1-9][0-9]*\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)*$`}</code>
            <br />

            • <strong>Identification of Valid Inputs:</strong> Strings like
            <code> /api/v1/users</code>,
            <code> /api/v2/auth/token</code>.
            <br />

            • <strong>Identification of Invalid Inputs:</strong> Non-versioned
            URIs (<code>/login</code>), missing prefix
            (<code>/v1/user</code>), directory traversal
            (<code>/api/v1/../../etc/passwd</code>).
            <br />

            • <strong>Regex for SQLi Detection:</strong>
            <code>{String.raw`/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b)|(--)|(\/\*)|(\b1=1\b)/i`}</code>
            detects attack injection keywords.
          </div>
        </div>

        {/* CO3 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO3 (2 Marks): Context-Free Grammars (CFG)
          </h3>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Grammar Definition:</strong>
            <code> G = (V, &Sigma;, R, S)</code>
            <br />

            • <strong>Variables (V):</strong>
            &#123; S, Object, Members, Pair, Key, Value &#125;
            <br />

            • <strong>Terminals (&Sigma;):</strong>
            &#123; '{', '}', ':', ',', '"', a-z, 0-9 &#125;
            <br />

            • <strong>Productions:</strong> S → Object; Object → &#123; Members
            &#125;; Members → Pair | Pair , Members; Pair → Key : Value;
            Value → String | Number | Object.
            <br />

            • <strong>Sample Derivation:</strong>
            <br />

            S ⇒ Object ⇒ &#123; Members &#125; ⇒ &#123; Pair , Members &#125;
            ⇒ &#123; Key : Value , Pair &#125; ⇒
            &#123; "id" : 101 , "role" : "admin" &#125;.
          </div>
        </div>

        {/* CO4 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO4 (2 Marks): Pushdown Automata (PDA)
          </h3>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>PDA 7-Tuple:</strong>
            <code> M = (Q, &Sigma;, &Gamma;, &delta;, q0, Z0, F)</code>
            <br />

            • <strong>States:</strong> Q = &#123; q0 (Start), q1 (Read),
            q2 (Accept), q_reject &#125;
            <br />

            • <strong>Stack Symbols (&Gamma;):</strong>
            <code>{'{ Z0, {, [ }'}</code>
            <br />

            • <strong>Stack Operations:</strong>
            <br />

            1. Push: On reading open brace <code>{'{'}</code> or
            <code> {'['}</code>, push to stack.
            <br />

            2. Pop: On reading closing brace <code>{'}'}</code> or
            <code> {']'}</code>, verify that top matches and pop.
            <br />

            3. Acceptance: At end of string, if stack contains only
            <code> Z0</code>, pop <code>Z0</code> and accept by empty stack
            into <code>q2</code>. Mismatch or underflow transitions to
            <code> q_reject</code>.
          </div>
        </div>

        {/* CO5 */}
        <div>
          <h3 style={{ fontSize: '16px', color: '#a7f3d0' }}>
            CO5 (2 Marks): Turing Machines and Computability
          </h3>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: 1.7
          }}>
            • <strong>Role of Turing Machine:</strong> Serves as the ultimate
            mathematical formulation of an algorithm. With an infinite tape
            and bidirectional read-write head, any deterministic computation
            executed on a modern web server is mathematically equivalent to
            a Turing machine computation.
            <br />

            • <strong>Decidability of API Request Validation:</strong> The
            core validation task is <strong>DECIDABLE</strong>.
            <br />

            1. Membership in Regular Languages (Regex/DFA) is decidable in
            <code> O(n)</code> time.
            <br />

            2. Parsing Deterministic Context-Free Languages (JSON/PDA) is
            decidable in <code>O(n)</code> time.
            <br />

            3. Since every incoming API request has a bounded finite length
            and the validator consists of a finite composition of deciders
            that always halt, the machine halts in either
            <code> q_accept</code> or <code>q_reject</code> for all inputs
            without looping infinitely.
          </div>
        </div>
      </div>
    </div>
  );
}
