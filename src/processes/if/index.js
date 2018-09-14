const removeCodeWithBlocks = require('./remove-code');

const STARTS_WITH = /^.*#IF\s+(\w+).*$/gm;
const ENDS_WITH = /^.*#ENDIF.*$/gm;

const ENV_REG = /#IF\s+(\w+)/;

/**
 * @param evn
 * @param {String} source
 * @return {*}
 */
module.exports = function (evn, source) {
  if (!source) {
    return source;
  }

  if (source instanceof Buffer) {
    source = source.toString();
  }

  let starts = source.match(STARTS_WITH);
  if (null === starts) {
    return source;
  }

  let ends = source.match(ENDS_WITH);
  if (starts.length !== ends.length) {
    throw new Error('预处理开始位置和结束位置不匹配');
  }

  // 每一处位置
  let pos = [
    // {
    //   content: '',   // 配置的字符串
    //   type: 'start', // start或end，是开始还是结束
    //   index: 12 // 位置
    // }
  ];
  let offset;
  let offsetStart = 0;
  for (let it of starts) {
    offset = source.indexOf(it, offsetStart);
    offsetStart = offset + it.length;
    pos.push({
      content: it,
      type: 'start',
      index: offset
    });
  }

  offset = 0;
  for (let it of ends) {
    offset = source.indexOf(it, offset) + it.length;
    pos.push({
      content: it,
      type: 'end',
      index: offset
    });
  }

  pos.sort((a, b) => a.index > b.index ? 1 : -1);

  // 处理开始位置和结束位置匹配
  // 区块
  let blocks = [
    // {
    //   test: false, // 条件测试结果
    //   start: 12, // 开始位置
    //   end: 24   // 结束位置(包括匹配的字符串)
    // }
  ];

  let stack = [];
  for (let end of pos) {
    if (end.type === 'start') {
      stack.push(end);
    } else {
      let start = stack.pop();
      let evnName = start.content.match(ENV_REG)[1];
      blocks.push({
        test: !!evn[evnName],
        start: start.index,
        end: end.index
      });
    }
  }

  return removeCodeWithBlocks(source, blocks);
};
