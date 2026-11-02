const mongoose = require('mongoose');
const db = require('../config/db');

// On a serverless host the platform imports app.js directly, so server.js
// never runs and nothing would connect the database. Connect once on the
// first request and reuse that connection for later requests.
let connecting = null;

module.exports = function (req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  if (!connecting) {
    connecting = db.connectDB().catch(function () {
      // /health reports the failure with 503; other routes surface it too.
    });
  }
  connecting.then(function () {
    connecting = null;
    next();
  });
};
