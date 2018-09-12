require('should');
const evnToString = require('../../src/processes/macro/to-string');
const macroProcess = require('../../src/processes/macro/index');

describe('宏替换测试', () => {
    it('返回值测试', () => {
        evnToString(false).should.equals('');
        evnToString(true).should.equals('true');
        evnToString(null).should.equals('');
        evnToString(undefined).should.equals('');
        evnToString(NaN).should.equals('');
        evnToString('').should.equals('');
        evnToString(0).should.equals('0');
        evnToString(35).should.equals('35');
        evnToString('jcode').should.equals('jcode');
        evnToString({}).should.equals('[object Object]');
        evnToString([]).should.equals('');
        evnToString([2,3]).should.equals('2,3');
    });

    it('替换测试', () => {
        let evn = {
            name: 'jcode',
            age: 35,
            man: true,
            describe: ''
        };

        let source = `
one
a $$name$$
age: $$age$$, man: $$man$$
two
`;
        macroProcess(evn, source).should.equals(`
one
a jcode
age: 35, man: true
two
`);
    });
});