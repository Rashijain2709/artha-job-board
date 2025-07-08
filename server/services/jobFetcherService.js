const axios = require('axios');
const xml2js = require('xml2js');

const fetchJobs = async (url) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  const { data } = await axios.get(url);
  const result = await parser.parseStringPromise(data);
  return result.rss?.channel?.item || [];
};
module.exports = fetchJobs;
