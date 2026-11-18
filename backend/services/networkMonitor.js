/**
 * Network Event Monitor Service (FSWD/CN CO4)
 * Uses Node.js Event-Driven Architecture (EventEmitter, Callbacks, Listeners)
 * to monitor client-server communication and detect repeated failed connection attempts.
 */

const EventEmitter = require('events');

class NetworkSecurityMonitor extends EventEmitter {
  constructor() {
    super();
    // In-memory sliding window map: clientIp -> array of timestamps of failed events
    this.failureHistory = new Map();
    this.FAILED_THRESHOLD = 3; // Trigger alert if >= 3 failures
    this.TIME_WINDOW_MS = 60 * 1000; // 60 seconds window

    // Register internal listeners (Callbacks & Event Handling)
    this.setupListeners();
  }

  setupListeners() {
    // Listener for failed connection / invalid request events
    this.on('failedConnection', (eventData) => {
      this.handleFailedConnection(eventData);
    });

    // Listener for alert trigger
    this.on('alertTriggered', (alert) => {
      console.log(`[NETWORK SECURITY ALERT] [${alert.severity}] IP: ${alert.clientIp} - ${alert.message}`);
    });
  }

  /**
   * Callback invoked whenever a failed connection attempt occurs
   */
  handleFailedConnection(eventData) {
    const { clientIp, reason, requestData } = eventData;
    const now = Date.now();

    if (!this.failureHistory.has(clientIp)) {
      this.failureHistory.set(clientIp, []);
    }

    const timestamps = this.failureHistory.get(clientIp);
    // Push current failure timestamp
    timestamps.push(now);

    // Filter out timestamps outside the sliding time window
    const recentFailures = timestamps.filter((t) => now - t <= this.TIME_WINDOW_MS);
    this.failureHistory.set(clientIp, recentFailures);

    // Check if threshold breached
    if (recentFailures.length >= this.FAILED_THRESHOLD) {
      const alert = {
        alertType: 'REPEATED_FAILED_CONNECTIONS',
        severity: 'HIGH',
        clientIp,
        message: `Security Warning: ${recentFailures.length} failed connection attempts detected within 60 seconds from IP ${clientIp}. Reason: ${reason}`,
        requestData: {
          recentCount: recentFailures.length,
          lastReason: reason,
          lastRequest: requestData,
        },
        timestamp: new Date(),
        isResolved: false,
      };

      // Emit alert event to notify subscribers/database handler
      this.emit('alertTriggered', alert);
    }
  }

  /**
   * Record an incoming network request event
   */
  recordEvent({ type, clientIp, success, reason, requestData }) {
    if (!success) {
      this.emit('failedConnection', { clientIp, reason, requestData, timestamp: new Date() });
    } else {
      this.emit('successfulConnection', { clientIp, timestamp: new Date() });
    }
  }

  /**
   * Get failure statistics for dashboard
   */
  getNetworkStats() {
    const activeIps = [];
    for (const [ip, list] of this.failureHistory.entries()) {
      activeIps.push({ ip, failureCount: list.length });
    }
    return {
      trackedIps: activeIps,
      threshold: this.FAILED_THRESHOLD,
      windowSeconds: this.TIME_WINDOW_MS / 1000,
    };
  }
}

// Singleton instance
const networkMonitor = new NetworkSecurityMonitor();

module.exports = networkMonitor;
