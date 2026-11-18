import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    alerts: 0,
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, alertsRes] = await Promise.all([
        fetch('/api/records?limit=10').then((r) => r.json()).catch(() => ({ records: [] })),
        fetch('/api/alerts').then((r) => r.json()).catch(() => ({ alerts: [] })),
      ]);

      const records = recordsRes.records || [];
      const alerts = alertsRes.alerts || [];

      setRecentRecords(records.slice(0, 5));
      setStats({
        total: records.length,
        valid: records.filter((r) => r.validationStatus === 'VALID').length,
        invalid: records.filter((r) => r.validationStatus === 'INVALID').length,
        alerts: alerts.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Security Dashboard & Automata Validation Engine</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Real-time API request monitoring, Regular Expression validation, DFA state transitions, and Network event detection.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Validations</div>
          <div className="stat-val" style={{ color: '#60a5fa' }}>{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valid Requests (Accepted)</div>
          <div className="stat-val" style={{ color: '#34d399' }}>{stats.valid}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected / Malformed</div>
          <div className="stat-val" style={{ color: '#f87171' }}>{stats.invalid}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Security Alerts (Node Events)</div>
          <div className="stat-val" style={{ color: '#fbbf24' }}>{stats.alerts}</div>
        </div>
      </div>

      {/* Quick Action / Feature Overview */}
      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Interactive API Request Testing
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
            Enter HTTP request details (endpoint, headers, JSON payload). Client-side and server-side validators evaluate regex patterns, DFA states, and PDA stacks.
          </p>
          <Link to="/validate" className="btn btn-primary">
            Launch API Validator &rarr;
          </Link>
        </div>

        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚙️</span> Formal Language & Automata Models
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
            Explore the DFA state transition diagram, Context-Free Grammar (CFG) JSON derivation, Pushdown Automaton (PDA) stack trace, and Turing Machine decidability analysis.
          </p>
          <Link to="/automata" className="btn btn-secondary">
            View Automata & Grammars &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Records Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px' }}>Recent Validated API Requests</h2>
          <Link to="/records" style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 600 }}>
            View All Records &rarr;
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No API requests processed yet. Try validating a request in the API Validator!
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Method & Endpoint</th>
                <th>Regex Check</th>
                <th>DFA Final State</th>
                <th>PDA Check</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((r, i) => (
                <tr key={r._id || i}>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#93c5fd', marginRight: '6px' }}>{r.method}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{r.endpoint}</span>
                  </td>
                  <td>
                    <span className={r.regexCheck?.passed ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {r.regexCheck?.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: '12px', color: '#c084fc' }}>
                      {r.dfaCheck?.finalState || 'q_TRAP'}
                    </code>
                  </td>
                  <td>
                    <span className={r.pdaCheck?.passed ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {r.pdaCheck?.passed ? 'Balanced' : 'Malformed'}
                    </span>
                  </td>
                  <td>
                    <span className={r.validationStatus === 'VALID' ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {r.validationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
