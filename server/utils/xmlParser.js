const xml2js = require('xml2js');

module.exports.parseXML = async (xml) => {
  return await xml2js.parseStringPromise(xml, { mergeAttrs: true });
};
