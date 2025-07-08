const axios = require('axios');
const { parseXML } = require('../utils/xmlParser');

const fetchJobsFromAPI = async (apiUrl) => {
  try {
    const res = await axios.get(apiUrl);
    const json = await parseXML(res.data);

    console.log('✅ Parsed XML:', JSON.stringify(json, null, 2));

    return json.rss.channel.item.map(item => ({
      jobId: item.guid,
      title: item.title,
      description: item.description,
      company: item.author || 'N/A',
      location: null,
      updatedAt: new Date(item.pubDate)
    }));
  } catch (err) {
    console.error(`❌ Error fetching jobs from ${apiUrl}:`, err.message);
    return []; // fallback for worker
  }
};

module.exports = { fetchJobsFromAPI };
