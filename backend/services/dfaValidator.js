/**
 * Deterministic Finite Automaton (DFA) Validator Module (FLAT CO1)
 * Formal Definition: M = (Q, Sigma, delta, q0, F)
 * 
 * Q = { q0_IDLE, q1_AUTH, q2_ROUTE, q3_PAYLOAD, q4_APPROVED, q_TRAP }
 * Sigma = { AUTH_PASS, AUTH_FAIL, ROUTE_PASS, ROUTE_FAIL, BODY_PASS, BODY_FAIL }
 * q0 = q0_IDLE (Initial State)
 * F  = { q4_APPROVED } (Final / Accepting State)
 * q_TRAP = Dead / Rejecting State
 */

const DFA_STATES = {
  Q0_IDLE: 'q0_IDLE',
  Q1_AUTH: 'q1_AUTH',
  Q2_ROUTE: 'q2_ROUTE',
  Q3_PAYLOAD: 'q3_PAYLOAD',
  Q4_APPROVED: 'q4_APPROVED',
  Q_TRAP: 'q_TRAP',
};

// State Transition Table: delta(CurrentState, InputSymbol) -> NextState
const TRANSITION_TABLE = {
  [DFA_STATES.Q0_IDLE]: {
    AUTH_PASS: DFA_STATES.Q1_AUTH,
    AUTH_FAIL: DFA_STATES.Q_TRAP,
  },
  [DFA_STATES.Q1_AUTH]: {
    ROUTE_PASS: DFA_STATES.Q2_ROUTE,
    ROUTE_FAIL: DFA_STATES.Q_TRAP,
  },
  [DFA_STATES.Q2_ROUTE]: {
    BODY_PASS: DFA_STATES.Q3_PAYLOAD,
    BODY_FAIL: DFA_STATES.Q_TRAP,
  },
  [DFA_STATES.Q3_PAYLOAD]: {
    INTEGRITY_PASS: DFA_STATES.Q4_APPROVED,
    INTEGRITY_FAIL: DFA_STATES.Q_TRAP,
  },
  [DFA_STATES.Q4_APPROVED]: {
    RESET: DFA_STATES.Q0_IDLE,
  },
  [DFA_STATES.Q_TRAP]: {
    // Trap state loops on all symbols
    AUTH_PASS: DFA_STATES.Q_TRAP,
    AUTH_FAIL: DFA_STATES.Q_TRAP,
    ROUTE_PASS: DFA_STATES.Q_TRAP,
    ROUTE_FAIL: DFA_STATES.Q_TRAP,
    BODY_PASS: DFA_STATES.Q_TRAP,
    BODY_FAIL: DFA_STATES.Q_TRAP,
  },
};

/**
 * Validates an incoming API request by running it through the DFA state machine
 */
function runDfaValidation(requestData) {
  const { headers, endpoint, payload, isSafe = true } = requestData;
  let currentState = DFA_STATES.Q0_IDLE;
  const path = [currentState];
  const logs = [];

  // Step 1: Check Authentication header
  const authHeader = headers?.['authorization'] || headers?.['Authorization'];
  const hasValidAuth = Boolean(authHeader && authHeader.startsWith('Bearer '));
  const authSymbol = hasValidAuth ? 'AUTH_PASS' : 'AUTH_FAIL';
  
  currentState = TRANSITION_TABLE[currentState][authSymbol] || DFA_STATES.Q_TRAP;
  path.push(currentState);
  logs.push(`Symbol '${authSymbol}' processed -> Reached State: ${currentState}`);

  if (currentState === DFA_STATES.Q_TRAP) {
    return {
      passed: false,
      finalState: currentState,
      transitionPath: path,
      details: 'DFA Transition Failed at Step 1: Missing or Invalid Authorization Header (Entered Trap State)',
      logs,
    };
  }

  // Step 2: Validate Route/Endpoint
  const isValidRoute = Boolean(endpoint && endpoint.startsWith('/api/'));
  const routeSymbol = isValidRoute ? 'ROUTE_PASS' : 'ROUTE_FAIL';

  currentState = TRANSITION_TABLE[currentState][routeSymbol] || DFA_STATES.Q_TRAP;
  path.push(currentState);
  logs.push(`Symbol '${routeSymbol}' processed -> Reached State: ${currentState}`);

  if (currentState === DFA_STATES.Q_TRAP) {
    return {
      passed: false,
      finalState: currentState,
      transitionPath: path,
      details: 'DFA Transition Failed at Step 2: Invalid API Endpoint Prefix (Entered Trap State)',
      logs,
    };
  }

  // Step 3: Validate Body/Payload presence & format
  const isBodyValid = typeof payload === 'object' && payload !== null;
  const bodySymbol = isBodyValid ? 'BODY_PASS' : 'BODY_FAIL';

  currentState = TRANSITION_TABLE[currentState][bodySymbol] || DFA_STATES.Q_TRAP;
  path.push(currentState);
  logs.push(`Symbol '${bodySymbol}' processed -> Reached State: ${currentState}`);

  if (currentState === DFA_STATES.Q_TRAP) {
    return {
      passed: false,
      finalState: currentState,
      transitionPath: path,
      details: 'DFA Transition Failed at Step 3: Malformed payload object (Entered Trap State)',
      logs,
    };
  }

  // Step 4: Integrity / Security Safe check
  const integritySymbol = isSafe ? 'INTEGRITY_PASS' : 'INTEGRITY_FAIL';

  currentState = TRANSITION_TABLE[currentState][integritySymbol] || DFA_STATES.Q_TRAP;
  path.push(currentState);
  logs.push(`Symbol '${integritySymbol}' processed -> Reached State: ${currentState}`);

  const passed = currentState === DFA_STATES.Q4_APPROVED;

  return {
    passed,
    finalState: currentState,
    isAccepted: passed,
    transitionPath: path,
    details: passed
      ? 'DFA Validation Successful: Input string fully accepted in Final State q4_APPROVED.'
      : 'DFA Validation Rejected: Transition terminated in non-accepting/trap state.',
    logs,
  };
}

module.exports = {
  DFA_STATES,
  TRANSITION_TABLE,
  runDfaValidation,
};
