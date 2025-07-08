const { Queue } = require('bullmq');
const { createClient } = require('redis');
require('dotenv').config();

// Use Redis Cloud URL
const redisConnection = {
  connection: {
    url: process.env.REDIS_URL
  }
};

// Create BullMQ queue
const importQueue = new Queue('job-import', redisConnection);

module.exports = {
  importQueue,
  redisConnection: redisConnection.connection
};
