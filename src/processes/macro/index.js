const MACRO_REG = /\$\$(\w+)\$\$/mg;
const evnToString = require('./to-string');

module.exports = function (evn, source) {
  return source.replace(MACRO_REG, (matches, name) => {
      return evnToString(evn[name]);
  });
};

