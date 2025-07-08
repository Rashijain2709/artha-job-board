const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job.js');
const ImportLog = require('../models/ImportLog.js');
const { redisConnection } = require('./queue.js');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🚀 Worker connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Robust extractText function
const extractText = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return extractText(val[0]);
  if (typeof val === 'object') {
    if (val._) return val._;
    const firstKey = Object.keys(val)[0];
    return extractText(val[firstKey]);
  }
  return String(val);
};

// BullMQ Worker
const worker = new Worker(
  'job-import',
  async (job) => {
    const { fileName, jobs } = job.data;
    let newJobs = 0;
    let updatedJobs = 0;
    const failed = [];

    for (const j of jobs) {
      try {
        j.jobId = extractText(j.jobId || j.guid || j.link);
        j.title = extractText(j.title);
        j.description = extractText(j.description);
        j.company = extractText(j.company || 'Unknown');
        j.location = extractText(j.location || 'Unknown');
        j.updatedAt = j.updatedAt || new Date();
        j.type = j.type || 'job';

        if (!j.jobId || !j.title) {
          throw new Error('Missing jobId or title');
        }

        const existing = await Job.findOne({ jobId: j.jobId });

        if (existing) {
          await Job.updateOne({ jobId: j.jobId }, { $set: j });
          updatedJobs++;
        } else {
          await new Job(j).save();
          newJobs++;
        }
      } catch (err) {
        failed.push({
          jobId: extractText(j.jobId || j.guid || j.link) || 'N/A',
          reason: err.message
        });
      }
    }

    await new ImportLog({
      fileName,
      timestamp: new Date(),
      totalFetched: jobs.length,
      totalImported: newJobs + updatedJobs,
      newJobs,
      updatedJobs,
      failedJobs: failed
    }).save();

    console.log(`✔️ Import complete from ${fileName}`);
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.BATCH_SIZE || '5')
  }
);

// Worker events
worker.on('failed', (job, err) => {
  console.error(`❌ Job failed [${job.id}]:`, err.message);
});

worker.on('completed', (job) => {
  console.log(`✅ Job completed [${job.id}]`);
});
