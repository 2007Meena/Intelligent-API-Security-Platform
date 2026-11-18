const mongoose = require('mongoose');

const ApiLogSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      default: 'POST',
    },
    headers: {
      type: Object,
      default: {},
    },
    payload: {
      type: Object,
      default: {},
    },
    clientIp: {
      type: String,
      default: '127.0.0.1',
    },
    regexCheck: {
      passed: Boolean,
      details: String,
    },
    dfaCheck: {
      passed: Boolean,
      finalState: String,
      transitionPath: [String],
      details: String,
    },
    pdaCheck: {
      passed: Boolean,
      bracketMatched: Boolean,
      details: String,
    },
    validationStatus: {
      type: String,
      enum: ['VALID', 'INVALID', 'BLOCKED'],
      required: true,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.ApiLog || mongoose.model('ApiLog', ApiLogSchema);
