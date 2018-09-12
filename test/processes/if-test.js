const processor = require('../../src/processes/if');
require('should');

const evn = {
  name: 'jcode',
  age: 35,
  man: true,
  describe: ''
};

describe('条件预处理', () => {
  it('空值测试', () => {
    processor(evn, '').should.equals('');
  });

  it('普通条件处理', () => {
    let source =
`
Header
// #IF man
if man
// #ENDIF
// #IF woman
if woman
// #ENDIF
Footer
`;
    processor(evn, source).should.equals(
`
Header
// #IF man
if man
// #ENDIF

Footer
`
    );
  });

  it('嵌套条件处理', () => {
      let source =
          `
Header
// #IF name
name
// #IF describe
// #IF man
if man
// #ENDIF
// #IF woman
if woman
// #ENDIF
// #ENDIF
// #ENDIF
Footer
`;
      processor(evn, source).should.equals(
          `
Header
// #IF name
name

// #ENDIF
Footer
`
      );
  });
});
