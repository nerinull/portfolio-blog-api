require('dotenv').config();
const mongoose = require('mongoose');
const db = require('./config/db');
const app = require('./app');

const port = process.env.PORT || 3000;

async function start() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 ||
        !process.env.CLIENT_ORIGIN) {
      throw new Error('Check the JWT secret and client origin.');
    }
    await db.connectDB();
    const server = app.listen(port, '0.0.0.0', function () {
      console.log('API ready on port ' + port);
    });
    function shutdown() {
      server.close(async function () {
        await mongoose.disconnect();
      });
    }
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Startup failed. Check private settings and Atlas access.');
    process.exit(1);
  }
}

start();
