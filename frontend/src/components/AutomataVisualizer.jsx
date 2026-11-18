
import React, { useState } from 'react';

export default function AutomataVisualizer() {
  const [activeTab, setActiveTab] = useState('dfa');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
          Formal Languages &amp; Automata Theory (FLAT Models)
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Theoretical foundations of API request validation: Finite Automata,
          Regular Expressions, Context-Free Grammars, Pushdown Automata, and
          Turing Machine Decidability.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}>
        <button
          className={activeTab === 'dfa' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('dfa')}
        >
          CO1: DFA State Transitions
        </button>

        <button
          className={activeTab === 'regex' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('regex')}
        >
          CO2: Regular Expressions
        </button>

        <button
          className={activeTab === 'cfg' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('cfg')}
        >
          CO3: Context-Free Grammar (CFG)
        </button>

        <button
          className={activeTab === 'pda' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('pda')}
        >
          CO4: Pushdown Automaton (PDA)
        </button>

        <button
          className={activeTab === 'tm' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('tm')}
        >
          CO5: Turing Machine &amp; Decidability
        </button>
      </div>

      {/* TAB 1: DFA */}
      {activeTab === 'dfa' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            CO1: Finite Automata and State Transitions
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            The API request pipeline is modeled as a 5-tuple Deterministic
            Finite Automaton (DFA):
            <br />
            <code>M = (Q, Σ, δ, q0, F)</code>
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '24px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}>
              State Transition Diagram:
            </h3>

            <div className="state-flow">
              <div className="state-node">
                <span>q0</span>
                <span style={{ fontSize: '10px', color: '#93c5fd' }}>
                  INITIAL (Idle)
                </span>
              </div>

              <span className="arrow-divider">&rarr; [AUTH_PASS] &rarr;</span>

              <div className="state-node">
                <span>q1</span>
                <span style={{ fontSize: '10px', color: '#93c5fd' }}>
                  AUTH VALID
                </span>
              </div>

              <span className="arrow-divider">&rarr; [ROUTE_PASS] &rarr;</span>

              <div className="state-node">
                <span>q2</span>
                <span style={{ fontSize: '10px', color: '#93c5fd' }}>
                  ROUTE VALID
                </span>
              </div>

              <span className="arrow-divider">&rarr; [BODY_PASS] &rarr;</span>

              <div className="state-node">
                <span>q3</span>
                <span style={{ fontSize: '10px', color: '#93c5fd' }}>
                  PAYLOAD CHECK
                </span>
              </div>

              <span className="arrow-divider">&rarr; [SAFE_PASS] &rarr;</span>

              <div className="state-node final-state active-state">
                <span>q4</span>
                <span style={{ fontSize: '10px', color: '#a7f3d0' }}>
                  FINAL (Accepted)
                </span>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div className="state-node trap-state">
                <span>q_TRAP</span>
                <span style={{ fontSize: '10px' }}>DEAD / REJECT</span>
              </div>

              <div style={{ fontSize: '13px', color: '#f87171' }}>
                Any failure at q0, q1, q2, or q3 (e.g. missing auth,
                malformed endpoint, malicious SQL injection) transitions
                immediately to <code>q_TRAP</code> (absorbing state with
                self-loops).
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
            DFA Transition Table δ(q, a):
          </h3>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Current State (q)</th>
                <th>Valid Input Symbol (σ ∈ Σ)</th>
                <th>Invalid / Malformed Symbol</th>
                <th>State Description</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td><strong>q0 (Initial)</strong></td>
                <td><code>q1 (on Bearer Auth Header)</code></td>
                <td><code>q_TRAP (Missing/Bad Token)</code></td>
                <td>Awaiting incoming HTTP request</td>
              </tr>

              <tr>
                <td><strong>q1</strong></td>
                <td><code>q2 (on Valid /api/vX/ route)</code></td>
                <td><code>q_TRAP (Non-standard route)</code></td>
                <td>Client identity authenticated</td>
              </tr>

              <tr>
                <td><strong>q2</strong></td>
                <td><code>q3 (on Parsable JSON Object)</code></td>
                <td><code>q_TRAP (Malformed syntax)</code></td>
                <td>Endpoint routing approved</td>
              </tr>

              <tr>
                <td><strong>q3</strong></td>
                <td><code>q4 (on Clean Security Scan)</code></td>
                <td><code>q_TRAP (SQLi/XSS Attack Detected)</code></td>
                <td>Deep payload inspection</td>
              </tr>

              <tr>
                <td><strong>q4 (Final / Accepting)</strong></td>
                <td><code>q0 (on Request Complete / Reset)</code></td>
                <td>—</td>
                <td>Request Authorized &amp; Forwarded to Core API</td>
              </tr>

              <tr>
                <td><strong>q_TRAP (Trap State)</strong></td>
                <td><code>q_TRAP (Self-loop)</code></td>
                <td><code>q_TRAP (Self-loop)</code></td>
                <td>Dead state: Request terminated with 400/403</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: REGEX */}
      {activeTab === 'regex' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            CO2: Regular Expressions and Regular Languages
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Regular expressions define regular languages over an alphabet Σ.
            The platform applies regex pattern matchers at the boundary layer:
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontWeight: 700,
                color: '#60a5fa',
                marginBottom: '6px'
              }}>
                1. REST API Endpoint Format Validation:
              </div>

              <pre style={{
                color: '#fef08a',
                fontSize: '13px',
                marginBottom: '8px'
              }}>
                {String.raw`^\/api\/v[1-9][0-9]*\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)*$`}
              </pre>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>Explanation:</strong> Enforces standard API versioning
                (e.g. <code>/api/v1/users</code>,
                <code>/api/v2/products/123</code>).
                Rejects directory traversal sequences like
                <code>/../../etc/passwd</code> or unauthorized non-API paths.
              </div>
            </div>

            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontWeight: 700,
                color: '#60a5fa',
                marginBottom: '6px'
              }}>
                2. API Bearer Token Syntax Validation:
              </div>

              <pre style={{
                color: '#fef08a',
                fontSize: '13px',
                marginBottom: '8px'
              }}>
                {String.raw`^Bearer\s+[a-zA-Z0-9\-_]{20,128}$`}
              </pre>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>Explanation:</strong> Requires the literal string
                "Bearer" followed by one or more spaces and a token string
                of length 20 to 128 characters from the base64url alphabet.
                Rejects missing tokens or corrupted payloads.
              </div>
            </div>

            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontWeight: 700,
                color: '#f87171',
                marginBottom: '6px'
              }}>
                3. Malicious SQL Injection Attack Signature Detection:
              </div>

              <pre style={{
                color: '#fca5a5',
                fontSize: '13px',
                marginBottom: '8px'
              }}>
                {String.raw`(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)|(--)|(\/\*)|(\b1\s*=\s*1\b)`}
              </pre>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>Explanation:</strong> Matches SQL keywords surrounded
                by word boundaries (<code>\b</code>) or SQL comment characters
                (<code>--</code>, <code>/*</code>) and tautology bypass
                patterns (<code>1=1</code>).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CFG */}
      {activeTab === 'cfg' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            CO3: Context-Free Grammars (CFG) for API Payloads
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            A Context-Free Grammar <code>G = (V, Σ, R, S)</code> specifies
            the syntax of structured nested payloads (JSON key-value pairs).
          </p>

          <div className="grid-cols-2" style={{ gap: '20px' }}>
            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#60a5fa',
                marginBottom: '10px'
              }}>
                Formal Grammar Definition:
              </h3>

              <ul style={{
                fontSize: '13px',
                listStyle: 'none',
                lineHeight: 1.8
              }}>
                <li>
                  <strong>Variables (V):</strong> {'{ S, Object, Members, Pair, Key, Value, String, Number }'}
                </li>
                <li>
                  <strong>Terminals (Σ):</strong> {'{ {, }, :, ,, ", a-z, 0-9 }'}
                </li>
                <li><strong>Start Symbol:</strong> S</li>
              </ul>

              <h4 style={{
                fontSize: '13px',
                color: '#a7f3d0',
                marginTop: '14px',
                marginBottom: '6px'
              }}>
                Production Rules (R):
              </h4>

              <pre style={{ fontSize: '12px', color: '#fef08a' }}>
{`S       → Object
Object  → '{' '}' | '{' Members '}'
Members → Pair | Pair ',' Members
Pair    → String ':' Value
Value   → String | Number | Object
String  → '"' Characters '"'
Number  → Digits`}
              </pre>
            </div>

            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#60a5fa',
                marginBottom: '10px'
              }}>
                Sample Derivation for {'{ "id": 101, "role": "admin" }'}:
              </h3>

              <pre style={{
                fontSize: '12px',
                color: '#93c5fd',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8
              }}>
{`S ⇒ Object
  ⇒ { Members }
  ⇒ { Pair , Members }
  ⇒ { String : Value , Members }
  ⇒ { "id" : Number , Members }
  ⇒ { "id" : 101 , Pair }
  ⇒ { "id" : 101 , String : Value }
  ⇒ { "id" : 101 , "role" : String }
  ⇒ { "id" : 101 , "role" : "admin" } [Accepted String]`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PDA */}
      {activeTab === 'pda' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            CO4: Pushdown Automaton (PDA) for Structured Recognition
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Pushdown Automaton
            <code> M = (Q, Σ, Γ, δ, q0, Z0, F)</code> uses an unbounded
            LIFO stack to verify balanced nested brackets and delimiters
            in JSON payloads.
          </p>

          <div style={{
            background: '#0a0f1d',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '14px',
              color: '#60a5fa',
              marginBottom: '8px'
            }}>
              Stack Transition Operations:
            </h3>

            <ul style={{
              fontSize: '13px',
              color: 'var(--text-main)',
              lineHeight: 1.8,
              paddingLeft: '20px'
            }}>
              <li>
                <strong>Initial Stack:</strong>
                <code>[Z0]</code> where Z0 is the bottom-of-stack marker.
              </li>

              <li>
                <strong>Push Operation:</strong> On reading an opening brace
                {' {'} or bracket {' ['}, push symbol onto stack:
                <code>{' δ(q, {, X) → (q, { X)'}</code>.
              </li>

              <li>
                <strong>Pop Operation:</strong> On reading a closing brace
                {' }'} or bracket {' ]'}, verify matching top symbol and pop:
                <code>{' δ(q, }, {) → (q, ε)'}</code>.
              </li>

              <li>
                <strong>Acceptance by Empty Stack:</strong> When EOF is reached
                and top is <code>Z0</code>, pop <code>Z0</code> to accept:
                <code>{' δ(q, ε, Z0) → (q_accept, ε)'}</code>.
              </li>

              <li>
                <strong>Rejection / Underflow:</strong> If closing delimiter
                has no matching open delimiter or stack underflows, transition
                to <code>q_reject</code>.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 5: TURING MACHINE */}
      {activeTab === 'tm' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            CO5: Turing Machines &amp; Computability / Decidability
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Role of a Turing Machine (TM) as a universal computational model
            and analysis of whether the API validation task is decidable.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{
                fontSize: '15px',
                color: '#a7f3d0',
                marginBottom: '6px'
              }}>
                1. Role of a Turing Machine as a Computational Model
              </h3>

              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)'
              }}>
                A Turing Machine is a 7-tuple
                <code> M = (Q, Σ, Γ, δ, q0, q_accept, q_reject)</code>
                with an infinite tape and bidirectional read/write tape head.
                It defines the standard of mechanical computability via the
                Church-Turing Thesis. Any algorithm implementable on a modern
                computer or Node.js server can be simulated by a Turing Machine.
              </p>
            </div>

            <div style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{
                fontSize: '15px',
                color: '#60a5fa',
                marginBottom: '6px'
              }}>
                2. Decidability of the API Security Validation Task
              </h3>

              <p style={{
                fontSize: '13px',
                color: 'var(--text-main)',
                lineHeight: 1.7
              }}>
                <strong>Theorem:</strong> The main request validation task in
                this platform is <strong>STRICTLY DECIDABLE</strong>.
                <br /><br />

                <strong>Proof &amp; Justification:</strong>
                <br />

                • <em>Regular Expression Validation:</em> Deciding membership
                in a regular language <code>w ∈ L(R)</code> using a DFA is
                solvable in deterministic linear time <code>O(n)</code>.
                DFAs always halt in exactly <code>n</code> steps without
                infinite loops.
                <br />

                • <em>JSON / Structure Validation:</em> Deterministic
                Context-Free Languages (DCFL) recognized by a deterministic
                PDA are decidable in <code>O(n)</code> time using stack parsing.
                <br />

                • Since incoming HTTP requests have finite length
                <code>n ≤ MAX_PAYLOAD_SIZE</code> and the validation logic
                executes a finite composition of regular and context-free
                deciders, the Turing machine simulating this platform is
                guaranteed to halt in either <code>q_accept</code> or
                <code>q_reject</code>. Hence, it is decidable (belongs to
                complexity class P).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
