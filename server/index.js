const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const startCron = require('./cron/jobCron');
const logsRoute = require('./routes/logs.js');
const ImportLog = require('./models/ImportLog');

// Load environment variables
dotenv.config();

const allowedOrigins = [
  'http://localhost:3000',
  'https://artha-job-board.vercel.app',
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use('/api/logs', logsRoute);


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
