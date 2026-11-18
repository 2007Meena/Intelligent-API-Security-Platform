/**
 * Pushdown Automaton (PDA) Validator Module (FLAT CO4)
 * Recognizes Context-Free Grammar (CFG) structured payloads (balanced braces/brackets)
 * 
 * Formal Definition: M = (Q, Sigma, Gamma, delta, q0, Z0, F)
 * Q     = { q0_START, q1_READING, q2_ACCEPT, q_REJECT }
 * Sigma = { '{', '}', '[', ']', '"', ':', ',', alphanum }
 * Gamma = { Z0 (bottom marker), '{', '[' }
 * q0    = q0_START
 * Z0    = Bottom of stack marker
 * F     = { q2_ACCEPT }
 */

function runPdaValidation(inputString) {
  if (typeof inputString !== 'string') {
    inputString = JSON.stringify(inputString || {});
  }

  const stack = ['Z0']; // Initial bottom marker
  let currentState = 'q0_START';
  const steps = [];
  let inStringLiteral = false;
  let escapeNext = false;

  // Move to reading state
  currentState = 'q1_READING';
  steps.push({
    char: 'EPSILON',
    action: 'INITIALIZE',
    stackSnapshot: [...stack],
    state: currentState,
  });

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i];

    // Handle escape characters inside strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    // Toggle string literal ignoring brackets inside quotes
    if (char === '"') {
      inStringLiteral = !inStringLiteral;
      continue;
    }

    if (inStringLiteral) {
      continue; // Skip characters inside quotes
    }

    // PDA Stack Operations
    if (char === '{' || char === '[') {
      // PUSH Operation
      stack.push(char);
      steps.push({
        char,
        action: `PUSH '${char}' onto stack`,
        stackSnapshot: [...stack],
        state: currentState,
      });
    } else if (char === '}') {
      // POP Operation for curly brace
      const top = stack[stack.length - 1];
      if (top === '{') {
        stack.pop();
        steps.push({
          char,
          action: "POP matching '{' from stack",
          stackSnapshot: [...stack],
          state: currentState,
        });
      } else {
        // Mismatch or underflow
        currentState = 'q_REJECT';
        steps.push({
          char,
          action: `ERROR: Expected top '{' but found '${top}' (Mismatch)`,
          stackSnapshot: [...stack],
          state: currentState,
        });
        return {
          passed: false,
          currentState,
          bracketMatched: false,
          details: `PDA Syntax Error: Unbalanced closing brace '}' at position ${i}. Top of stack was '${top}'.`,
          steps,
        };
      }
    } else if (char === ']') {
      // POP Operation for square bracket
      const top = stack[stack.length - 1];
      if (top === '[') {
        stack.pop();
        steps.push({
          char,
          action: "POP matching '[' from stack",
          stackSnapshot: [...stack],
          state: currentState,
        });
      } else {
        currentState = 'q_REJECT';
        steps.push({
          char,
          action: `ERROR: Expected top '[' but found '${top}' (Mismatch)`,
          stackSnapshot: [...stack],
          state: currentState,
        });
        return {
          passed: false,
          currentState,
          bracketMatched: false,
          details: `PDA Syntax Error: Unbalanced closing bracket ']' at position ${i}. Top of stack was '${top}'.`,
          steps,
        };
      }
    }
  }

  // Final check: Stack must only contain initial bottom marker Z0
  if (stack.length === 1 && stack[0] === 'Z0' && !inStringLiteral) {
    stack.pop(); // Pop bottom marker to accept by empty stack
    currentState = 'q2_ACCEPT';
    steps.push({
      char: 'EOF',
      action: 'POP bottom marker Z0 -> Empty Stack Acceptance',
      stackSnapshot: [],
      state: currentState,
    });

    return {
      passed: true,
      currentState,
      bracketMatched: true,
      details: 'PDA Validation Successful: Structured payload parsed and accepted by empty stack.',
      steps: steps.slice(-15), // keep last 15 steps for display
    };
  } else {
    currentState = 'q_REJECT';
    return {
      passed: false,
      currentState,
      bracketMatched: false,
      details: `PDA Syntax Error: Unclosed opening delimiters remaining on stack: [${stack.slice(1).join(', ')}].`,
      steps: steps.slice(-15),
    };
  }
}

module.exports = {
  runPdaValidation,
};
