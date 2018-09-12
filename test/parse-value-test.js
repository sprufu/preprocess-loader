const parse = require('../src/parse-value');
require('should');

describe('环境变量值解析', () => {
  it('布尔值解析', () => {
    parse('On').should.true();
    parse('true').should.true();
    parse('YES').should.true();
    parse('NO').should.false();
    parse('FALSE').should.false();
    parse('Off').should.false();
  });

  it('数值解析', () => {
    parse('-12.45').should.equals(-12.45);
    parse('-45').should.equals(-45);
    parse('45').should.equals(45);
    parse('45.09').should.equals(45.09);
  });

  it('字符串解析', () => {
    parse("").should.equals("");
    parse("12a").should.equals("12a");
  });
});
