const dns = require('node:dns');
const mongoose = require('mongoose');
const User = require('../models/User');

// Some networks time out on the DNS TXT lookup that mongodb+srv:// needs
// (queryTxt ETIMEOUT). DNS_SERVERS in .env points that lookup at resolvers
// which answer; leave the variable unset on the hosting service.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map(function (server) {
    return server.trim();
  }).filter(Boolean));
}

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  // Wait until the unique username and email indexes are ready.
  await User.init();
  console.log('Connected to portfolio_blog');
}

module.exports = { connectDB: connectDB };
