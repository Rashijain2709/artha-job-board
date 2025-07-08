const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  company: String,
  location: String,
  updatedAt: Date,
  type: { type: String, default: 'job' } // 'job' or 'article'
});

module.exports = mongoose.model('Job', JobSchema);
