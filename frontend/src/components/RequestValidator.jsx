import React, { useState } from 'react';

export default function RequestValidator() {
  const [formData, setFormData] = useState({
    method: 'POST',
    endpoint: '/api/v1/users/profile',
    authToken: 'Bearer secret_api_token_sample_key_9988112233',
    payload: JSON.stringify({ userId: 101, username: 'cyber_admin', action: 'query_logs' }, null, 2),
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverResult, setServerResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Client-Side Validation (FSWD CO1)
  const validateInputs = () => {
    const errors = {};
    if (!formData.endpoint.trim()) {
      errors.endpoint = 'Endpoint URI is required.';
    } else if (!formData.endpoint.startsWith('/api/')) {
      errors.endpoint = "Client validation: Endpoint must start with '/api/' prefix.";
    }

    if (!formData.authToken.trim()) {
      errors.authToken = 'Authorization Token is required for secure endpoints.';
    } else if (!formData.authToken.startsWith('Bearer ')) {
      errors.authToken = "Client validation: Token must follow 'Bearer <token>' format.";
    }

    if (!formData.payload.trim()) {
      errors.payload = 'Payload body is required.';
    } else {
      try {
        JSON.parse(formData.payload);
      } catch (e) {
        errors.payload = `Client validation: Malformed JSON syntax (${e.message})`;
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setServerResult(null);

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(formData.payload);
    } catch {
      parsedPayload = formData.payload;
    }

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: formData.endpoint,
          method: formData.method,
          headers: {
            authorization: formData.authToken,
          },
          payload: parsedPayload,
        }),
      });

      const data = await response.json();
      setServerResult(data);
    } catch (err) {
      setServerResult({
        status: 'ERROR',
        summary: 'Network communication failure: ' + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Preset loaders for quick testing
  const loadPreset = (type) => {
    if (type === 'valid') {
      setFormData({
        method: 'POST',
        endpoint: '/api/v1/auth/login',
        authToken: 'Bearer security_token_valid_key_abcd_1234567890',
        payload: JSON.stringify({ username: 'antigravity_user', role: 'engineer' }, null, 2),
      });
    } else if (type === 'sqli') {
      setFormData({
        method: 'POST',
        endpoint: '/api/v1/accounts/search',
        authToken: 'Bearer security_token_valid_key_abcd_1234567890',
        payload: JSON.stringify({ query: "' OR 1=1; DROP TABLE users; --" }, null, 2),
      });
    } else if (type === 'malformed_pda') {
      setFormData({
        method: 'POST',
        endpoint: '/api/v1/data/sync',
        authToken: 'Bearer security_token_valid_key_abcd_1234567890',
        payload: '{"items": [{"id": 1, "status": "pending"}', // Missing closing ] and }
      });
    } else if (type === 'unauth_dfa') {
      setFormData({
        method: 'POST',
        endpoint: '/api/v1/sensitive/admin',
        authToken: 'InvalidTokenNoBearerPrefix',
        payload: JSON.stringify({ action: 'format_disk' }, null, 2),
      });
    }
    setClientErrors({});
    setServerResult(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Web Page Design & API Request Validation</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          (FSWD CO1 & CO2) Design a basic web page to enter request details, validate fields, and display validation results.
        </p>
      </div>

      {/* Preset buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center' }}>
          Test Scenarios:
        </span>
        <button type="button" onClick={() => loadPreset('valid')} className="btn btn-secondary" style={{ fontSize: '12px' }}>
          ✅ Valid Request (Accepted)
        </button>
        <button type="button" onClick={() => loadPreset('sqli')} className="btn btn-secondary" style={{ fontSize: '12px' }}>
          🚨 SQL Injection Attack (Regex Detect)
        </button>
        <button type="button" onClick={() => loadPreset('malformed_pda')} className="btn btn-secondary" style={{ fontSize: '12px' }}>
          ❌ Unbalanced Braces (PDA Reject)
        </button>
        <button type="button" onClick={() => loadPreset('unauth_dfa')} className="btn btn-secondary" style={{ fontSize: '12px' }}>
          ⚠️ Missing Auth (DFA Trap State)
        </button>
      </div>

      <div className="grid-cols-2">
        {/* Form Container (CO1 Requirement) */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>API Request Input Form</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">HTTP Method</label>
              <select
                className="form-select"
                value={formData.method}
                onChange={(e) => handleInputChange('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Endpoint URI</label>
              <input
                type="text"
                className="form-input"
                placeholder="/api/v1/resource"
                value={formData.endpoint}
                onChange={(e) => handleInputChange('endpoint', e.target.value)}
              />
              {clientErrors.endpoint && (
                <div style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                  {clientErrors.endpoint}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Authorization Header (Bearer Token)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bearer <token>"
                value={formData.authToken}
                onChange={(e) => handleInputChange('authToken', e.target.value)}
              />
              {clientErrors.authToken && (
                <div style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                  {clientErrors.authToken}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">JSON Payload Body</label>
              <textarea
                className="form-textarea"
                rows="6"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                value={formData.payload}
                onChange={(e) => handleInputChange('payload', e.target.value)}
              ></textarea>
              {clientErrors.payload && (
                <div style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                  {clientErrors.payload}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Validating via Automata Engine...' : 'Run Security & Automata Validation'}
            </button>
          </form>

          {/* Display entered details as required by CO1 */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Entered Details (Client Echo):
            </h3>
            <pre style={{ fontSize: '12px', background: '#0a0f1d', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
              {JSON.stringify(
                {
                  method: formData.method,
                  endpoint: formData.endpoint,
                  authHeader: formData.authToken.slice(0, 25) + '...',
                  payloadPreview: formData.payload.slice(0, 60) + '...',
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        {/* Validation Results & Automata Status */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Validation Engine Feedback</h2>

          {!serverResult && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Submit an API request using the form on the left or select a preset scenario to view real-time validation results.
            </div>
          )}

          {serverResult && (
            <div>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: serverResult.status === 'VALID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${serverResult.status === 'VALID' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className={serverResult.status === 'VALID' ? 'badge badge-valid' : 'badge badge-invalid'}
                    style={{ fontSize: '14px' }}
                  >
                    STATUS: {serverResult.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Record Saved: {serverResult.savedRecord?._id || 'In-Memory'}
                  </span>
                </div>
                <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: 500 }}>
                  {serverResult.summary}
                </p>
              </div>

              {/* Individual Engine Checks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. Regex Validation Details */}
                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>1. Regular Expression (Regex) Validation:</span>
                    <span className={serverResult.results?.regex?.passed ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {serverResult.results?.regex?.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {serverResult.results?.regex?.details}
                  </div>
                </div>

                {/* 2. DFA Validation Details */}
                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>2. Deterministic Finite Automaton (DFA):</span>
                    <span className={serverResult.results?.dfa?.passed ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {serverResult.results?.dfa?.passed ? 'ACCEPTED' : 'TRAP / REJECT'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    State Path: {serverResult.results?.dfa?.transitionPath?.join(' -> ')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Final State: <strong>{serverResult.results?.dfa?.finalState}</strong>
                  </div>
                </div>

                {/* 3. Pushdown Automaton Details */}
                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>3. Pushdown Automaton (PDA Stack Parsing):</span>
                    <span className={serverResult.results?.pda?.passed ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {serverResult.results?.pda?.passed ? 'BALANCED' : 'UNDERFLOW / MISMATCH'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {serverResult.results?.pda?.details}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
