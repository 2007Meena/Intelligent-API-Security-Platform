import React, { useEffect, useState } from 'react';

export default function RecordsManager() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStatus, setEditStatus] = useState('VALID');
  const [editReason, setEditReason] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [filter]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/records?status=${filter}` : '/api/records';
      const res = await fetch(url);
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mongoose DELETE Operation (FSWD CO5)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Mongoose UPDATE Operation (FSWD CO5)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      const res = await fetch(`/api/records/${editingRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validationStatus: editStatus,
          failureReason: editReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) =>
          prev.map((r) => (r._id === editingRecord._id ? data.record : r))
        );
        setEditingRecord(null);
      }
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const startEdit = (record) => {
    setEditingRecord(record);
    setEditStatus(record.validationStatus);
    setEditReason(record.failureReason || '');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>MongoDB Application Records & CRUD Operations</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            (FSWD CO5) Manage persistent MongoDB collection records via Node.js/Mongoose (Insert, Retrieve, Update, Delete).
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={filter === '' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('')}
          >
            All ({records.length})
          </button>
          <button
            className={filter === 'VALID' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('VALID')}
          >
            Valid
          </button>
          <button
            className={filter === 'INVALID' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilter('INVALID')}
          >
            Invalid
          </button>
          <button className="btn btn-secondary" onClick={fetchRecords}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Edit Modal / Form */}
      {editingRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
              Update Record: {editingRecord.endpoint}
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Validation Status</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="VALID">VALID</option>
                  <option value="INVALID">INVALID</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Security Notes / Failure Reason</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Mongoose Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading records from database...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No records found for current filter.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Time</th>
                <th>Method & Route</th>
                <th>IP Address</th>
                <th>Regex / DFA State</th>
                <th>Status</th>
                <th>Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {String(r._id).slice(-8)}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#93c5fd', marginRight: '6px' }}>{r.method}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{r.endpoint}</span>
                  </td>
                  <td style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    {r.clientIp || '127.0.0.1'}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    Regex: {r.regexCheck?.passed ? '✅' : '❌'} | State: <code>{r.dfaCheck?.finalState || 'q_TRAP'}</code>
                  </td>
                  <td>
                    <span className={r.validationStatus === 'VALID' ? 'badge badge-valid' : 'badge badge-invalid'}>
                      {r.validationStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleDelete(r._id)}
                      >
                        Delete
                      </button>
                    </div>
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
