const parse = require('../src/parse-evn');
require('should');

describe('解析环境变量', () => {
  it('解析环境变量', () => {
    let options = {
      filename: __dirname + '/.evn-test'
    };

    let evn = parse(options);

    evn.should.eqls({
      name: 'jcode',
      age: 35,
      man: true,
      describe: ''
    });
  });
});
