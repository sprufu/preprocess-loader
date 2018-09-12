const loaderUtils = require('loader-utils');
const parseEvn = require('./parse-evn');
const processMacro = require('./processes/macro');
const processIf = require('./processes/if');

module.exports = loader;

function loader (source) {
  const options = loaderUtils.getOptions(this);
  const evn = parseEvn(options);
  let processedSource;
  processedSource = processMacro(evn, source);
  processedSource = processIf(evn, processedSource);
  return processedSource;
}






