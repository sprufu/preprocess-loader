const fs = require('fs');
const parseEvnValue = require('./parse-value');
let evn;

/**
 * @param {{chartSet: String, filename: String}} options
 * @return {*}
 */
function parseEvn (options) {
  if (evn) {
    return evn;
  }

  const chartSet = options.chartSet || 'utf-8';
  const evnFile = options.filename || '.preprocess-evn';
  const content = fs.readFileSync(evnFile, chartSet).toString();

  evn = {};
  content.split(/[\r\n]+/g).map(line => {
    line = line.trim();

    // 以#开头的为注释行
    if (!line || line.startsWith('#')) {
      return;
    }

    let items = line.split(/\s*=\s*/, 2);
    evn[items[0]] = parseEvnValue(items[1]);
  });

  return evn;
}

module.exports = parseEvn;
