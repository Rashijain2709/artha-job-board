const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const startCron = require('./cron/jobCron');
const logsRoute = require('./routes/logs.js');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/logs', logsRoute);

const ImportLog = require('./models/ImportLog');

app.get('/api/import-logs', async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 });
  res.json(logs);
});

app.get('/', (req, res) => res.send('API running'));

// MongoDB + Server Init
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB Connected');

  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server started on port ${process.env.PORT || 5000}`);
    startCron();
  });
});

// Start Redis Worker (BullMQ)
require('./jobs/worker.js');
