import React, { useEffect, useState } from 'react';

export default function NetworkAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simIp, setSimIp] = useState('192.168.1.155');
  const [simCount, setSimCount] = useState(3);
  const [simMessage, setSimMessage] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data.alerts || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFailures = async () => {
    setSimMessage('Simulating network events...');
    try {
      const res = await fetch('/api/network-events/simulate-failed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIp: simIp, count: Number(simCount) }),
      });
      const data = await res.json();
      setSimMessage(data.message);
      fetchAlerts();
    } catch (err) {
      setSimMessage('Failed to trigger simulation: ' + err.message);
    }
  };

  const handleResolveAlert = async (id) => {
    try {
      await fetch(`/api/alerts/${id}/resolve`, { method: 'PUT' });
      fetchAlerts();
    } catch (err) {
      alert('Error resolving alert: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Network Event Monitoring & Security Alerts</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          (FSWD & CN CO4) Node.js EventEmitter, callbacks, and event listeners detecting repeated failed connections and triggering alerts.
        </p>
      </div>

      {/* Simulator Section */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '4px solid #3b82f6' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          Simulate Network Attack / Failed Connections (Event Generator)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Test the Node.js <code>EventEmitter</code> threshold detection. If an IP triggers &ge; 3 failed connection attempts within 60 seconds, an alert event is emitted and registered.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Client IP Address</label>
            <input
              type="text"
              className="form-input"
              style={{ width: '180px' }}
              value={simIp}
              onChange={(e) => setSimIp(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Attempts to Simulate</label>
            <select
              className="form-select"
              style={{ width: '160px' }}
              value={simCount}
              onChange={(e) => setSimCount(e.target.value)}
            >
              <option value="1">1 Attempt (Below threshold)</option>
              <option value="3">3 Attempts (Triggers Alert)</option>
              <option value="5">5 Attempts (Brute Force)</option>
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSimulateFailures}>
              Trigger Network Events
            </button>
          </div>
        </div>

        {simMessage && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#60a5fa' }}>
            {simMessage}
          </div>
        )}
      </div>

      {/* Node.js Event Architecture Explanation */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#a7f3d0', marginBottom: '8px' }}>
          How Node.js Events, Callbacks & Listeners Work in this System:
        </h3>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          1. <strong>Event Emission:</strong> When client connections fail or API validation fails, Express calls <code>networkMonitor.recordEvent()</code> which triggers <code>this.emit('failedConnection', eventData)</code>.
          <br />
          2. <strong>Sliding Window Callback:</strong> The registered listener <code>this.on('failedConnection', (event) =&gt; ... )</code> tracks timestamps per IP in a 60-second window.
          <br />
          3. <strong>Alert Threshold:</strong> If failures reach &ge; 3 within 60 seconds, it emits <code>this.emit('alertTriggered', alert)</code>, invoking the database persistence listener and updating this dashboard.
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Active Security Alerts ({alerts.length})</h2>
          <button className="btn btn-secondary" onClick={fetchAlerts} style={{ fontSize: '12px' }}>
            🔄 Refresh Alerts
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            No security alerts detected. The network traffic is normal.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert, i) => (
              <div
                key={alert._id || i}
                style={{
                  background: '#0f172a',
                  border: `1px solid ${alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span className={alert.severity === 'CRITICAL' ? 'badge badge-invalid' : 'badge badge-warning'}>
                      {alert.severity}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{alert.alertType}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      IP: {alert.clientIp}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Time: {new Date(alert.createdAt || alert.timestamp).toLocaleString()}
                  </div>
                </div>

                <div>
                  {alert.isResolved ? (
                    <span className="badge badge-valid">Resolved</span>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => handleResolveAlert(alert._id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
