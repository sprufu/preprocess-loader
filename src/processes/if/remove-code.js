/**
 * 删除不要的代码片断
 * @param {String} source 待处理代码
 * @param {{test:Boolean, start:Number, end:Number}[]} blocks 区块
 */
module.exports = function (source, blocks) {
    // 判断嵌套规则，只保留待丢弃的
    blocks.sort((a, b) => a.start > b.start ? 1 : -1);
    let waitRemovedBlocks = []; // 去除了嵌套的
    let lastBlock = [];
    for (let block of blocks) {
        if (block.test) {
            continue;
        }

        let preBlock = lastBlock.pop();

        // 没有前一个区块时，压入椎栈
        if (undefined === preBlock) {
            lastBlock.push(block);
            waitRemovedBlocks.push(block);
            continue;
        }

        // 当有前一区块时，判断是否嵌套在前一区块中
        // 区块是按起始位置排好序的
        if (preBlock.end > block.end) {
            lastBlock.push(preBlock);
        } else {
            lastBlock.push(block);
            waitRemovedBlocks.push(block);
        }
    }

    // 从代码中移除不要的代码片断
    if (0 === waitRemovedBlocks.length) {
        return source;
    }

    return removeCode(source, waitRemovedBlocks);
};

/**
 * 删除区块中的代码，这些区块是不重叠的
 * @param {String} source
 * @param {{test:Boolean, start:Number, end:Number}[]} blocks
 */
function removeCode (source, blocks) {
    let index = blocks.length - 1;
    while (index >= 0) {
        let block = blocks[index];
        source = source.substr(0, block.start) + source.substr(block.end);
        index--;
    }
    return source;
}