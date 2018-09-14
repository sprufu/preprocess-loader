const processor = require('../../src/processes/if');
const fs = require('fs');
require('should');

describe('条件预处理', () => {
    it('bug001', () => {
        let source = fs.readFileSync(__dirname + '/001.js').toString();
        let expactFalse = fs.readFileSync(__dirname + '/001-false.js').toString();
        let evn = {
            MULTI_THEMES_FEATURE: false
        }

        processor(evn, source).should.equal(expactFalse)
    });
});