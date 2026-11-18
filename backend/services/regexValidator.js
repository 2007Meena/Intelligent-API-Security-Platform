/**
 * Regular Expression Validator Module (FLAT CO2 & FSWD CO1)
 * Formal Regular Languages: L(R) over alphabet Sigma
 */

const REGEX_PATTERNS = {
  // Matches valid API URI: /api/v1/resource or /api/v2/users/profile
  ENDPOINT_REGEX: /^\/api\/v[1-9][0-9]*\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)*$/,

  // Matches Bearer API tokens: 20-128 chars base64url characters
  BEARER_TOKEN_REGEX: /^Bearer\s+[a-zA-Z0-9\-_]{20,128}$/,

  // Detects SQL injection keywords and common comment sequences
  SQL_INJECTION_REGEX: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|FROM|WHERE)\b)|(--)|(\/\*)|(\b1\s*=\s*1\b)|(\b'OR'\b)/i,

  // Detects XSS script injection vectors
  XSS_REGEX: /(<script\b[^>]*>([\s\S]*?)<\/script>)|(javascript:)|(onerror\s*=)|(onload\s*=)|(<iframe\b)/i,

  // Strict email format
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

function validateRegex(requestData) {
  const { endpoint, headers, payload } = requestData;
  const issues = [];

  // 1. Endpoint format check
  if (!endpoint || typeof endpoint !== 'string') {
    issues.push('Missing or invalid endpoint URI string');
  } else if (!REGEX_PATTERNS.ENDPOINT_REGEX.test(endpoint)) {
    issues.push(`Endpoint URI '${endpoint}' does not match standard REST API pattern (e.g. /api/v1/resource)`);
  }

  // 2. Authorization Header Token check
  const authHeader = headers?.['authorization'] || headers?.['Authorization'];
  if (authHeader && !REGEX_PATTERNS.BEARER_TOKEN_REGEX.test(authHeader)) {
    issues.push('Authorization header malformed. Expected: Bearer <alphanumeric-token-min-20-chars>');
  }

  // 3. Payload inspection for SQLi / XSS
  const payloadStr = typeof payload === 'object' ? JSON.stringify(payload) : String(payload || '');

  if (REGEX_PATTERNS.SQL_INJECTION_REGEX.test(payloadStr)) {
    issues.push('CRITICAL: Malicious SQL Injection signature detected in payload body');
  }

  if (REGEX_PATTERNS.XSS_REGEX.test(payloadStr)) {
    issues.push('CRITICAL: Cross-Site Scripting (XSS) script tag pattern detected in payload');
  }

  return {
    passed: issues.length === 0,
    details: issues.length === 0 ? 'All regular expression syntax & security rules passed.' : issues.join(' | '),
    issues,
  };
}

module.exports = {
  REGEX_PATTERNS,
  validateRegex,
};
