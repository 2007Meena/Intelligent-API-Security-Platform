const mongoose = require('mongoose');

const SecurityAlertSchema = new mongoose.Schema(
  {
    alertType: {
      type: String,
      enum: [
        'REPEATED_FAILED_CONNECTIONS',
        'MALFORMED_REQUEST_SYNTAX',
        'DFA_SEQUENCE_VIOLATION',
        'SQL_INJECTION_PATTERN',
        'UNAUTHORIZED_PAYLOAD',
        'PDA_STACK_UNDERFLOW'
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    message: {
      type: String,
      required: true,
    },
    clientIp: {
      type: String,
      default: '127.0.0.1',
    },
    requestData: {
      type: Object,
      default: {},
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.SecurityAlert || mongoose.model('SecurityAlert', SecurityAlertSchema);
