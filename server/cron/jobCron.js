const cron = require('node-cron');
const fetchJobs = require('../services/jobFetcherService');
const { importQueue } = require('../jobs/queue'); // ✅ Destructure properly

const urls = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

const startCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    for (const url of urls) {
      try {
        const jobs = await fetchJobs(url);

        // Add job to the importQueue
        await importQueue.add('import-jobs', {
          jobs,
          fileName: url
        });

        console.log(`✅ Queued ${jobs.length} jobs from ${url}`);
      } catch (e) {
        console.error(`❌ Error fetching jobs from ${url}:`, e.message);
      }
    }
  });
};

module.exports = startCron;

