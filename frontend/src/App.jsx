import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RequestValidator from './components/RequestValidator';
import AutomataVisualizer from './components/AutomataVisualizer';
import RecordsManager from './components/RecordsManager';
import NetworkAlerts from './components/NetworkAlerts';
import DocumentationView from './components/DocumentationView';
import './App.css';

export default function App() {
  const [mongoStatus, setMongoStatus] = useState(false);

  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => {
        setMongoStatus(Boolean(data.mongoConnected));
      })
      .catch(() => {
        setMongoStatus(false);
      });
  }, []);

  return (
    <div className="app-container">
      <Navbar mongoStatus={mongoStatus} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/validate" element={<RequestValidator />} />
          <Route path="/automata" element={<AutomataVisualizer />} />
          <Route path="/records" element={<RecordsManager />} />
          <Route path="/alerts" element={<NetworkAlerts />} />
          <Route path="/docs" element={<DocumentationView />} />
        </Routes>
      </main>
    </div>
  );
}
