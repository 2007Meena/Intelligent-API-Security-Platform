import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ mongoStatus }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">🛡️</span>
        <span>SecureAPI • Automata Engine</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
          Dashboard
        </NavLink>
        <NavLink to="/validate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          API Validator (CO1)
        </NavLink>
        <NavLink to="/automata" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          FLAT Automata & Grammars
        </NavLink>
        <NavLink to="/records" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Mongoose Logs (CO5)
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Network Alerts (CO4)
        </NavLink>
        <NavLink to="/docs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          CO Assessment Answers
        </NavLink>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: mongoStatus ? '#10b981' : '#f59e0b',
            display: 'inline-block',
          }}
        ></span>
        <span style={{ color: 'var(--text-muted)' }}>
          {mongoStatus ? 'MongoDB: Connected' : 'Datastore: In-Memory / Ready'}
        </span>
      </div>
    </nav>
  );
}
