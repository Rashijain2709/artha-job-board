// const { Queue } = require('bullmq');
// const connection = { connection: { host: 'localhost', port: 6379 } };
// const importQueue = new Queue('job-import', connection);
// module.exports = importQueue;
// module.exports.connection = connection;


const { Queue } = require('bullmq');
require('dotenv').config();

// Redis connection config using env
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
};

// Create the BullMQ queue
const importQueue = new Queue('job-import', { connection });

module.exports = {
  importQueue,
  redisConnection: connection,
};

