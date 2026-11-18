const express = require('express');
const router = express.Router();
const ApiLog = require('../models/ApiLog');
const SecurityAlert = require('../models/SecurityAlert');
const { validateRegex } = require('../services/regexValidator');
const { runDfaValidation } = require('../services/dfaValidator');
const { runPdaValidation } = require('../services/pdaValidator');
const networkMonitor = require('../services/networkMonitor');

// In-Memory store fallback if MongoDB is not connected
const memoryDb = {
  logs: [],
  alerts: [],
};

// Wire networkMonitor alerts to persist in Database or Memory Store
networkMonitor.on('alertTriggered', async (alertData) => {
  try {
    if (global.isMongoConnected) {
      await SecurityAlert.create(alertData);
    } else {
      memoryDb.alerts.unshift({ _id: `alert_${Date.now()}_${Math.random()}`, ...alertData });
    }
  } catch (err) {
    console.error('Failed to persist security alert:', err.message);
  }
});

// --------------------------------------------------------------------------
// 1. VALIDATION ENDPOINT (FSWD CO1 & FLAT CO1, CO2, CO4)
// --------------------------------------------------------------------------
router.post('/validate', async (req, res) => {
  const { endpoint, method = 'POST', headers = {}, payload = {} } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // 1. Regex Validation (FLAT CO2)
  const regexResult = validateRegex({ endpoint, headers, payload });

  // 2. PDA Validation for payload syntax (FLAT CO4)
  const pdaResult = runPdaValidation(payload);

  // 3. DFA Validation for request flow / state transitions (FLAT CO1)
  const dfaResult = runDfaValidation({
    headers,
    endpoint,
    payload,
    isSafe: regexResult.passed && pdaResult.passed,
  });

  const overallPassed = regexResult.passed && pdaResult.passed && dfaResult.passed;
  const validationStatus = overallPassed ? 'VALID' : 'INVALID';
  const failureReasons = [];

  if (!regexResult.passed) failureReasons.push(regexResult.details);
  if (!pdaResult.passed) failureReasons.push(pdaResult.details);
  if (!dfaResult.passed) failureReasons.push(dfaResult.details);

  const failureReason = failureReasons.length > 0 ? failureReasons.join(' | ') : null;

  // Record network monitoring event (FSWD CO4)
  networkMonitor.recordEvent({
    type: 'API_REQUEST',
    clientIp,
    success: overallPassed,
    reason: failureReason || 'OK',
    requestData: { endpoint, method },
  });

  // Prepare Record to save in MongoDB / Mongoose (FSWD CO5)
  const logData = {
    endpoint: endpoint || '/unknown',
    method,
    headers,
    payload,
    clientIp,
    regexCheck: {
      passed: regexResult.passed,
      details: regexResult.details,
    },
    dfaCheck: {
      passed: dfaResult.passed,
      finalState: dfaResult.finalState,
      transitionPath: dfaResult.transitionPath,
      details: dfaResult.details,
    },
    pdaCheck: {
      passed: pdaResult.passed,
      bracketMatched: pdaResult.bracketMatched,
      details: pdaResult.details,
    },
    validationStatus,
    failureReason,
    createdAt: new Date(),
  };

  let savedRecord = null;
  try {
    if (global.isMongoConnected) {
      savedRecord = await ApiLog.create(logData);
    } else {
      savedRecord = { _id: `log_${Date.now()}_${Math.random()}`, ...logData };
      memoryDb.logs.unshift(savedRecord);
    }
  } catch (err) {
    console.warn('DB Log error (falling back to memory):', err.message);
    savedRecord = { _id: `log_${Date.now()}`, ...logData };
    memoryDb.logs.unshift(savedRecord);
  }

  // If critical SQLi / Malicious pattern detected, create immediate Security Alert
  if (regexResult.issues && regexResult.issues.some((issue) => issue.includes('CRITICAL'))) {
    const alert = {
      alertType: 'SQL_INJECTION_PATTERN',
      severity: 'CRITICAL',
      clientIp,
      message: `Critical Security Violation detected: ${failureReason}`,
      requestData: { endpoint, method, payload },
      timestamp: new Date(),
      isResolved: false,
    };
    if (global.isMongoConnected) {
      await SecurityAlert.create(alert).catch(() => {});
    } else {
      memoryDb.alerts.unshift({ _id: `alert_${Date.now()}`, ...alert });
    }
  }

  return res.status(overallPassed ? 200 : 400).json({
    status: validationStatus,
    summary: overallPassed
      ? 'API Request Successfully Validated across Regular Expressions, DFA, and PDA.'
      : 'API Request Validation Failed. Security violations or syntax errors detected.',
    results: {
      regex: regexResult,
      dfa: dfaResult,
      pda: pdaResult,
    },
    savedRecord,
  });
});

// --------------------------------------------------------------------------
// 2. MONGOOSE CRUD OPERATIONS (FSWD CO5)
// --------------------------------------------------------------------------

// RETRIEVE: Get all API request logs with optional status filtering
router.get('/records', async (req, res) => {
  const { status, limit = 50 } = req.query;
  try {
    if (global.isMongoConnected) {
      const query = status ? { validationStatus: status } : {};
      const records = await ApiLog.find(query).sort({ createdAt: -1 }).limit(Number(limit));
      return res.json({ success: true, count: records.length, records, source: 'MongoDB' });
    } else {
      let records = [...memoryDb.logs];
      if (status) {
        records = records.filter((r) => r.validationStatus === status);
      }
      return res.json({ success: true, count: records.length, records: records.slice(0, Number(limit)), source: 'MemoryStore' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// RETRIEVE: Get single record by ID
router.get('/records/:id', async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const record = await ApiLog.findById(req.params.id);
      if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
      return res.json({ success: true, record });
    } else {
      const record = memoryDb.logs.find((r) => r._id === req.params.id);
      if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
      return res.json({ success: true, record });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE: Update validation status or review notes (FSWD CO5 Update)
router.put('/records/:id', async (req, res) => {
  const { validationStatus, failureReason } = req.body;
  try {
    if (global.isMongoConnected) {
      const updated = await ApiLog.findByIdAndUpdate(
        req.params.id,
        { $set: { validationStatus, failureReason } },
        { new: true }
      );
      return res.json({ success: true, record: updated });
    } else {
      const index = memoryDb.logs.findIndex((r) => r._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, error: 'Record not found' });
      memoryDb.logs[index] = { ...memoryDb.logs[index], validationStatus, failureReason };
      return res.json({ success: true, record: memoryDb.logs[index] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: Delete a record (FSWD CO5 Delete)
router.delete('/records/:id', async (req, res) => {
  try {
    if (global.isMongoConnected) {
      await ApiLog.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Record deleted successfully' });
    } else {
      memoryDb.logs = memoryDb.logs.filter((r) => r._id !== req.params.id);
      return res.json({ success: true, message: 'Record deleted from store' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --------------------------------------------------------------------------
// 3. SECURITY ALERTS & NETWORK MONITORING ENDPOINTS (FSWD CO4)
// --------------------------------------------------------------------------

// GET: All active security alerts
router.get('/alerts', async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const alerts = await SecurityAlert.find().sort({ createdAt: -1 });
      return res.json({ success: true, alerts, stats: networkMonitor.getNetworkStats() });
    } else {
      return res.json({ success: true, alerts: memoryDb.alerts, stats: networkMonitor.getNetworkStats() });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT: Resolve a security alert
router.put('/alerts/:id/resolve', async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const updated = await SecurityAlert.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true });
      return res.json({ success: true, alert: updated });
    } else {
      const alert = memoryDb.alerts.find((a) => a._id === req.params.id);
      if (alert) alert.isResolved = true;
      return res.json({ success: true, alert });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Simulate repeated network event (FSWD/CN CO4 Demonstration)
router.post('/network-events/simulate-failed', (req, res) => {
  const { clientIp = '192.168.1.105', count = 1, reason = 'Invalid API Signature' } = req.body;
  for (let i = 0; i < count; i++) {
    networkMonitor.recordEvent({
      type: 'NETWORK_CONNECTION',
      clientIp,
      success: false,
      reason,
      requestData: { simulatedAttempt: i + 1, timestamp: new Date() },
    });
  }
  return res.json({
    success: true,
    message: `Simulated ${count} failed network attempt(s) for IP ${clientIp}. Check /alerts to observe trigger.`,
    stats: networkMonitor.getNetworkStats(),
  });
});

module.exports = router;
